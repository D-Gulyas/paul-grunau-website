"use client";

import * as React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";

/**
 * Scroll-gesteuertes Aufleuchten von Fließtext.
 *
 * Jedes Wort liegt doppelt übereinander: eine ruhende Geister-Kopie mit
 * geringer Deckkraft und darüber eine, deren Opacity am Scrollfortschritt
 * hängt. Beim Scrollen läuft eine weiche Welle durch den Absatz.
 *
 * Die Absätze einer Seite leuchten **nacheinander** auf, nicht gleichzeitig:
 * `MagicTextSequenz` (liegt in `app/template.tsx`) sammelt alle Absätze ein,
 * sortiert sie nach ihrer Position und reiht ihre Scrollfenster aneinander.
 *
 * Typografie (Schriftart, Größe, Gewicht, Farbe, Zeilenhöhe) wird bewusst vom
 * umgebenden Element geerbt – die Komponente bringt nur den Effekt mit, nicht
 * das Design. Deshalb bekommt sie die Klassen des ursprünglichen Absatzes
 * unverändert übergeben (gleiches Vorgehen wie bei `TextReveal`).
 *
 * Bewegung nur über Deckkraft – kein `filter`, damit das `backdrop-filter` der
 * Glasflächen nicht bricht (siehe DESIGN.md).
 */

/**
 * Wie viele Wörter gleichzeitig übergehen.
 *
 * Bei 1 schaltet immer nur ein Wort und der Absatz wirkt abgehackt. Mit vier
 * überlappenden Wörtern entsteht eine weiche Welle, die durch den Satz läuft.
 */
const WELLE = 4;

/**
 * Das natürliche Scrollfenster eines Absatzes – als Anteil der Fensterhöhe,
 * gemessen an seiner Position.
 *
 * Der Anfang zählt ab der Oberkante, das Ende ab der **Unterkante**: dadurch
 * braucht ein langer Absatz mehr Weg als ein kurzer, und die Welle wandert
 * ungefähr im Lesetempo durch den Text.
 */
const START_BEI = 0.85;
const ENDE_BEI = 0.55;
/** Mindestweg, damit einzeilige Absätze nicht schlagartig umschlagen. */
const MINDESTWEG = 0.3;
/**
 * Weg für Absätze, die beim Laden schon im Bild stehen. Kurz gehalten: der User
 * hat sie ohnehin vor sich, und die Überschrift darüber soll währenddessen noch
 * frei unter der Navbar stehen.
 */
const SICHTBARER_WEG = 0.2;
/**
 * Mindestweg, wenn die Kette einen Absatz überholt hat und er gestaucht wird.
 *
 * Bewusst nicht knapper: Sonst schlägt ausgerechnet der Tipp am Ende eines
 * Blog-Artikels in einem Wimpernschlag um, während er auf anderen Artikeln in
 * Ruhe aufleuchtet. Höher darf der Wert auch nicht – bei dicht gestapeltem Text
 * liegen die natürlichen Enden nur rund 0,17 vh auseinander, und die Kette
 * begänne sich aufzustauen.
 */
const KETTEN_WEG = 0.15;
/** Ab wie viel senkrechter Überlappung (px) zwei Absätze als eine Reihe gelten. */
const REIHEN_TOLERANZ = 20;
/** Wie viele Listenpunkte gleichzeitig einblenden. */
const LISTEN_WELLE = 2;
/** Wie weit ein Listenpunkt beim Einblenden von unten hereinrückt (px). */
const LISTEN_VERSATZ = 14;
/**
 * Scrollweg pro Listenschritt, als Anteil der Fensterhöhe.
 *
 * Listen bekommen daraus eine **feste** Fensterlänge (`Schritte × dieser Wert`)
 * statt einer aus ihrer Höhe und Position abgeleiteten. Nur so laufen alle
 * Listen der Seite gleich schnell – vorher hing das Tempo an Höhe und Abstand
 * der jeweiligen Liste, und sie wirkten sichtbar unterschiedlich.
 */
const LISTEN_SCHRITT = 0.05;

type Mass = { top: number; bottom: number; left: number; laenge?: number; gruppe?: string };
type Fenster = [number, number];

/**
 * Rechnet aus den Positionen aller Absätze ihre Scrollfenster aus.
 *
 * Zwei Regeln bestimmen das Ergebnis:
 *
 * 1. **Nebeneinander ist eine Reihe.** Absätze, deren senkrechte Ausdehnung sich
 *    überlappt (ein Kartenraster), leuchten gemeinsam auf – sie gehören optisch
 *    zusammen und würden nacheinander unruhig wirken.
 * 2. **Reihen laufen nacheinander.** Keine Reihe beginnt, bevor die darüber
 *    fertig ist. Das Ende bleibt dabei an der natürlichen Position verankert,
 *    die Reihe wird also gestaucht statt nach hinten geschoben – sonst würde
 *    sich der Rückstand über eine lange Seite immer weiter aufsummieren und der
 *    Text noch dunkel dastehen, wenn er längst vorbeigescrollt ist.
 *
 * Eine ausdrückliche `gruppe` sticht Regel 1: Alle Einträge mit demselben
 * Gruppennamen bilden **eine** Stufe, und diese Stufe verschmilzt mit nichts
 * anderem. Damit lassen sich nebeneinanderliegende Karten einzeln nacheinander
 * ansteuern (Kennzahlen), statt gemeinsam aufzuleuchten.
 */
type Reihe = {
  top: number;
  bottom: number;
  left: number;
  laengen: (number | undefined)[];
  indizes: number[];
  gruppe?: string;
};

function fensterBerechnen(masse: Mass[], vh: number): Fenster[] {
  // Gleiche Oberkante (Kartenraster) → die linke Kante entscheidet, also links
  // vor rechts. Bewusst **nicht** die Anmeldereihenfolge: Die Absätze melden
  // sich beim Mounten an, und nach einem Neu-Anmelden (Größenänderung, neue
  // Seite) steht ihre Reihenfolge in der Liste nicht mehr fest.
  const sortiert = masse
    .map((m, i) => ({ ...m, i }))
    .sort((a, b) => a.top - b.top || a.left - b.left || a.i - b.i);

  const reihen: Reihe[] = [];
  const nachGruppe = new Map<string, Reihe>();

  for (const eintrag of sortiert) {
    if (eintrag.gruppe != null) {
      const vorhanden = nachGruppe.get(eintrag.gruppe);
      if (vorhanden) {
        vorhanden.top = Math.min(vorhanden.top, eintrag.top);
        vorhanden.bottom = Math.max(vorhanden.bottom, eintrag.bottom);
        vorhanden.left = Math.min(vorhanden.left, eintrag.left);
        vorhanden.laengen.push(eintrag.laenge);
        vorhanden.indizes.push(eintrag.i);
      } else {
        const neu: Reihe = {
          top: eintrag.top,
          bottom: eintrag.bottom,
          left: eintrag.left,
          laengen: [eintrag.laenge],
          indizes: [eintrag.i],
          gruppe: eintrag.gruppe,
        };
        nachGruppe.set(eintrag.gruppe, neu);
        reihen.push(neu);
      }
      continue;
    }

    const letzte = reihen[reihen.length - 1];
    // Eine ausdrückliche Gruppe nimmt keine fremden Einträge auf.
    if (letzte && letzte.gruppe == null && eintrag.top < letzte.bottom - REIHEN_TOLERANZ) {
      letzte.top = Math.min(letzte.top, eintrag.top);
      letzte.bottom = Math.max(letzte.bottom, eintrag.bottom);
      letzte.left = Math.min(letzte.left, eintrag.left);
      letzte.laengen.push(eintrag.laenge);
      letzte.indizes.push(eintrag.i);
    } else {
      reihen.push({
        top: eintrag.top,
        bottom: eintrag.bottom,
        left: eintrag.left,
        laengen: [eintrag.laenge],
        indizes: [eintrag.i],
      });
    }
  }

  // Reihen in Lesereihenfolge bringen: erst in Bänder auf gleicher Höhe, darin
  // von links nach rechts.
  //
  // Ein reines Sortieren nach Oberkante genügt nicht: Nebeneinanderliegende
  // Karten zentrieren ihren Inhalt senkrecht, und wo die Beschriftung zweizeilig
  // umbricht, sitzt die Zahl darüber höher. Danach sortiert liefe die dritte
  // Karte vor der ersten. Die Anmeldereihenfolge taugt als Ersatz ebenfalls
  // nicht – sie steht nach einem Neu-Anmelden nicht mehr fest.
  reihen.sort((a, b) => a.top - b.top);

  const geordnet: Reihe[] = [];
  let band: Reihe[] = [];
  let bandUnten = Number.NEGATIVE_INFINITY;
  const bandAbschliessen = () => {
    if (band.length) geordnet.push(...band.sort((a, b) => a.left - b.left));
  };
  for (const reihe of reihen) {
    if (band.length && reihe.top < bandUnten - REIHEN_TOLERANZ) {
      band.push(reihe);
      bandUnten = Math.max(bandUnten, reihe.bottom);
    } else {
      bandAbschliessen();
      band = [reihe];
      bandUnten = reihe.bottom;
    }
  }
  bandAbschliessen();

  const fenster: Fenster[] = new Array(masse.length);
  let vorherEnde = Number.NEGATIVE_INFINITY;

  for (const reihe of geordnet) {
    // Nur wenn jedes Mitglied der Reihe eine feste Länge mitbringt (Listen),
    // läuft die Reihe nach fester Länge statt nach ihrer Ausdehnung.
    const festeLaenge = reihe.laengen.every((l) => l != null)
      ? Math.max(...(reihe.laengen as number[]))
      : null;

    let start = reihe.top - vh * START_BEI;
    let ende: number;

    if (festeLaenge != null) {
      if (start < 0) start = 0;
      start = Math.max(start, vorherEnde);
      ende = start + festeLaenge;
    } else {
      ende = reihe.bottom - vh * ENDE_BEI;
      if (ende - start < vh * MINDESTWEG) ende = start + vh * MINDESTWEG;

      // Steht die Reihe beim Laden schon im Bild, läge ihr Fenster in der
      // Vergangenheit – sie wäre ohne Zutun des Users bereits aufgeleuchtet.
      // Deshalb ans obere Seitenende schieben, mit kurzem Weg.
      if (start < 0) {
        ende = Math.min(ende - start, vh * SICHTBARER_WEG);
        start = 0;
      }

      start = Math.max(start, vorherEnde);
      ende = Math.max(ende, start + vh * KETTEN_WEG);
    }

    for (const i of reihe.indizes) fenster[i] = [start, ende];
    vorherEnde = ende;
  }

  return fenster;
}

type Eintrag = {
  el: HTMLElement;
  setzen: (f: Fenster) => void;
  /** Feste Fensterlänge statt einer aus der Ausdehnung abgeleiteten (Listen). */
  laenge?: (vh: number) => number;
  /** Name einer ausdrücklichen Stufe – gleiche Namen laufen gemeinsam. */
  gruppe?: string;
};

const SequenzContext = createContext<((eintrag: Eintrag) => () => void) | null>(null);

/**
 * Klammer um den Seiteninhalt: sammelt alle `MagicText` einer Seite ein und
 * verteilt ihre Scrollfenster, damit sie nacheinander aufleuchten.
 *
 * Liegt in `app/template.tsx` – das wird bei jeder Navigation neu gemountet,
 * die Sammlung startet also pro Seite frisch.
 */
export function MagicTextSequenz({ children }: { children: ReactNode }) {
  const eintraege = useRef<Eintrag[]>([]);
  const geplant = useRef<number | null>(null);

  const berechnen = useCallback(() => {
    const liste = eintraege.current;
    if (!liste.length) return;
    const vh = window.innerHeight;
    const masse = liste.map(({ el, laenge, gruppe }) => {
      const r = el.getBoundingClientRect();
      const top = r.top + window.scrollY;
      return { top, bottom: top + r.height, left: r.left, laenge: laenge?.(vh), gruppe };
    });
    const fenster = fensterBerechnen(masse, vh);
    liste.forEach((eintrag, i) => eintrag.setzen(fenster[i]));
  }, []);

  // Alle Absätze melden sich einzeln an; gerechnet wird gebündelt im nächsten
  // Frame, sonst liefe die Verteilung bei jedem einzelnen Mount neu.
  const planen = useCallback(() => {
    if (geplant.current !== null) return;
    geplant.current = requestAnimationFrame(() => {
      geplant.current = null;
      berechnen();
    });
  }, [berechnen]);

  const anmelden = useCallback(
    (eintrag: Eintrag) => {
      eintraege.current.push(eintrag);
      planen();
      return () => {
        eintraege.current = eintraege.current.filter((e) => e !== eintrag);
        planen();
      };
    },
    [planen],
  );

  useEffect(() => {
    const beobachter = new ResizeObserver(planen);
    beobachter.observe(document.body);
    window.addEventListener("resize", planen);
    // `Reveal` schiebt die Absätze beim Einblenden noch um 20 px – danach einmal
    // nachmessen, sonst sitzt jedes Fenster leicht daneben.
    const nachmessen = window.setTimeout(planen, 900);
    return () => {
      beobachter.disconnect();
      window.removeEventListener("resize", planen);
      window.clearTimeout(nachmessen);
      if (geplant.current !== null) cancelAnimationFrame(geplant.current);
    };
  }, [planen]);

  return <SequenzContext.Provider value={anmelden}>{children}</SequenzContext.Provider>;
}

/**
 * Meldet ein Element bei der Sequenz an und liefert seinen Fortschritt von 0
 * bis 1 – genutzt von Absätzen wie von Listen, damit beide in derselben Kette
 * hängen und nacheinander laufen.
 *
 * `schluessel` löst eine Neuanmeldung aus, wenn sich der Inhalt ändert.
 */
function useSequenzFortschritt(
  container: React.RefObject<HTMLElement | null>,
  schluessel: unknown,
  laenge?: (vh: number) => number,
  gruppe?: string,
) {
  const { scrollY } = useScroll();
  const anmelden = useContext(SequenzContext);
  // Wird nur beim Rechnen gelesen, soll aber nicht bei jedem Rendern neu
  // anmelden – deshalb über eine Referenz statt über die Effekt-Abhängigkeiten.
  const laengeRef = useRef(laenge);
  laengeRef.current = laenge;

  /**
   * Das Scrollfenster in Pixeln, in dem dieses Element läuft.
   *
   * Bis zur ersten Messung liegt das Ende unerreichbar weit unten – es startet
   * dadurch garantiert ruhend statt halb fertig.
   */
  const [fenster, setFenster] = useState<Fenster>([0, 1e6]);

  useEffect(() => {
    const el = container.current;
    if (!el) return;

    // Ob ein Element eine feste Länge will, steht für seine ganze Lebensdauer
    // fest – die Referenz liefert nur den jeweils aktuellen Wert.
    const festeLaenge = laengeRef.current ? (vh: number) => laengeRef.current!(vh) : undefined;

    // Im Verbund bestimmt die Sequenz das Fenster.
    if (anmelden) return anmelden({ el, setzen: setFenster, laenge: festeLaenge, gruppe });

    // Ohne Sequenz (Komponente allein genutzt) misst sich das Element selbst.
    const messen = () => {
      const r = el.getBoundingClientRect();
      const top = r.top + window.scrollY;
      const vh = window.innerHeight;
      setFenster(
        fensterBerechnen([{ top, bottom: top + r.height, left: r.left, laenge: festeLaenge?.(vh) }], vh)[0],
      );
    };
    messen();
    const beobachter = new ResizeObserver(messen);
    beobachter.observe(el);
    window.addEventListener("resize", messen);
    return () => {
      beobachter.disconnect();
      window.removeEventListener("resize", messen);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anmelden, schluessel, gruppe]);

  return useTransform(scrollY, fenster, [0, 1]);
}

export interface MagicTextProps {
  text: string;
  /** Element, das gerendert wird – Standard ist der Absatz. */
  as?: "p" | "div" | "span" | "blockquote";
  /** Klassen des ursprünglichen Textelements, damit die Optik gleich bleibt. */
  className?: string;
  /**
   * Farbe, in der der Text aufleuchtet. Ohne Angabe leuchtet er in der
   * geerbten Textfarbe auf. Der Ruhezustand bleibt davon immer unberührt –
   * so startet auch ein farbig aufleuchtender Absatz wie normaler Fließtext.
   */
  revealColor?: string;
  /** Deckkraft des noch nicht aufgeleuchteten Textes. */
  ghostOpacity?: number;
  /**
   * Name einer ausdrücklichen Stufe in der Sequenz.
   *
   * Alle `MagicText` mit demselben Namen leuchten gemeinsam auf, und die Stufe
   * verschmilzt mit keiner anderen. Gedacht für nebeneinanderliegende Karten,
   * die einzeln nacheinander an die Reihe kommen sollen – ohne das würden sie
   * als eine Reihe erkannt und gemeinsam aufleuchten.
   */
  gruppe?: string;
  /**
   * Feste Fensterlänge als Anteil der Fensterhöhe, statt einer aus Höhe und
   * Position abgeleiteten. Sinnvoll, wenn mehrere kurze Stufen hintereinander
   * laufen und zusammen in das Sichtfeld passen müssen.
   */
  festeLaenge?: number;
}

function Word({
  children,
  progress,
  range,
  ghostOpacity,
  revealColor,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  ghostOpacity: number;
  revealColor?: string;
}) {
  const opacity = useTransform(progress, range, [0, 1]);

  return (
    <span className="relative inline-block">
      {/* Ruhende Kopie: liegt an derselben Stelle, ist aber für Screenreader
          und Suchmaschinen unsichtbar – sonst stünde jeder Satz doppelt da.
          Sie behält immer die geerbte Textfarbe, auch wenn oben drüber in
          einer anderen Farbe aufgeleuchtet wird. */}
      <span className="absolute" style={{ opacity: ghostOpacity }} aria-hidden>
        {children}
      </span>
      <motion.span style={{ opacity, color: revealColor }}>{children}</motion.span>
    </span>
  );
}

export function MagicText({
  text,
  as: Component = "p",
  className,
  revealColor,
  ghostOpacity = 0.2,
  gruppe,
  festeLaenge,
}: MagicTextProps) {
  const container = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const laenge = useCallback(
    (vh: number) => vh * (festeLaenge as number),
    [festeLaenge],
  );
  const fortschritt = useSequenzFortschritt(
    container,
    text,
    festeLaenge != null ? laenge : undefined,
    gruppe,
  );

  const words = text.split(" ");

  // Wer weniger Bewegung möchte, bekommt schlicht den fertigen Text.
  if (reduce) {
    return (
      <Component className={className} style={revealColor ? { color: revealColor } : undefined}>
        {text}
      </Component>
    );
  }

  // Die Welle braucht über das letzte Wort hinaus Platz, damit auch dieses
  // seinen vollen Übergang bekommt und der Absatz bei 1 fertig ist.
  const schritte = words.length + WELLE - 1;

  return (
    <Component ref={container as React.Ref<never>} className={className}>
      {words.map((word, i) => (
        <React.Fragment key={i}>
          <Word
            progress={fortschritt}
            range={[i / schritte, (i + WELLE) / schritte]}
            ghostOpacity={ghostOpacity}
            revealColor={revealColor}
          >
            {word}
          </Word>
          {/* Normales Leerzeichen im Textfluss – so bleiben Wortabstand und
              Zeilenumbruch exakt wie bei einem gewöhnlichen Absatz. */}
          {i < words.length - 1 ? " " : null}
        </React.Fragment>
      ))}
    </Component>
  );
}

/* --------------------------------------------------------------------------
   Listen – blenden nacheinander ein, sobald der Absatz darüber fertig ist
   -------------------------------------------------------------------------- */

const ListeContext = createContext<{ fortschritt: MotionValue<number>; anzahl: number } | null>(null);

/**
 * Aufzählung, deren Punkte beim Scrollen nacheinander einblenden.
 *
 * Die Liste hängt in derselben Kette wie die Absätze (`MagicTextSequenz`) und
 * bekommt dadurch ihr Fenster erst zugeteilt, wenn der Fließtext darüber fertig
 * aufgeleuchtet ist – auf Leistungen wie in den Blog-Artikeln.
 *
 * Bewegung nur über Deckkraft und Verschiebung, kein `filter` (siehe DESIGN.md).
 */
export function MagicListe({
  as: Component = "ul",
  className,
  children,
}: {
  as?: "ul" | "ol";
  className?: string;
  children: ReactNode;
}) {
  const container = useRef<HTMLElement>(null);
  const anzahl = Math.max(1, React.Children.count(children));

  // Feste Länge aus der Zahl der Schritte: Damit ist der Abstand zwischen zwei
  // Punkten und die Dauer eines einzelnen Punktes in **jeder** Liste gleich,
  // egal wie viele Punkte sie hat und wo sie steht.
  const laenge = useCallback((vh: number) => vh * LISTEN_SCHRITT * (anzahl + LISTEN_WELLE - 1), [anzahl]);

  const fortschritt = useSequenzFortschritt(container, anzahl, laenge);
  const wert = useMemo(() => ({ fortschritt, anzahl }), [fortschritt, anzahl]);

  return (
    <Component ref={container as React.Ref<never>} className={className}>
      <ListeContext.Provider value={wert}>{children}</ListeContext.Provider>
    </Component>
  );
}

/** Ein Punkt einer `MagicListe`. `index` bestimmt, wann er an der Reihe ist. */
export function MagicListePunkt({
  index,
  className,
  children,
}: {
  index: number;
  className?: string;
  children: ReactNode;
}) {
  const liste = useContext(ListeContext);
  const reduce = useReducedMotion();
  // Ersatzwert, damit die Hook-Reihenfolge auch ohne Liste drumherum stimmt.
  const ruhend = useMotionValue(1);
  const fortschritt = liste?.fortschritt ?? ruhend;
  const anzahl = liste?.anzahl ?? 1;

  // Wie bei den Wörtern: Die Punkte überlappen sich leicht, damit die Liste
  // fließt statt durchzuschalten.
  const schritte = anzahl + LISTEN_WELLE - 1;
  const bereich: [number, number] = [index / schritte, (index + LISTEN_WELLE) / schritte];
  const opacity = useTransform(fortschritt, bereich, [0, 1]);
  const y = useTransform(fortschritt, bereich, [LISTEN_VERSATZ, 0]);

  if (reduce || !liste) {
    return <li className={className}>{children}</li>;
  }

  return (
    <motion.li className={className} style={{ opacity, y }}>
      {children}
    </motion.li>
  );
}
