"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";

/**
 * Lichtspur durch den Bereich „Ihre Ansprechpartner“.
 *
 * Beim Scrollen zeichnet sich unter der Überschrift ein glühender Streifen nach
 * unten, teilt sich auf die beiden Ansprechpartner-Karten auf, umschließt deren
 * Rand, führt darunter wieder zusammen und wandert weiter zu den beiden
 * Fachbereichs-Karten. Bei der letzten Karte wechselt er auf Marken-Rot.
 *
 * Technik: ein SVG-Overlay über dem Abschnitt, dessen Pfade über
 * `strokeDashoffset` am Scrollfortschritt hängen – dieselbe Mechanik wie bei
 * `MagicText`, nur auf Pfaden statt auf Wörtern. Kein three.js: Der WebGL-Strahl
 * im Footer wird bewusst nachgeladen, für einen Rand im Inhalt wäre das zu
 * schwer (siehe „Ladezeit ist ein Feature“).
 *
 * Die Geometrie wird aus dem DOM gemessen, nicht fest verdrahtet – sonst würde
 * die Spur bei jedem Umbruch danebenliegen. Gemessen wird per `ResizeObserver`.
 *
 * Das Overlay liegt **neben** den Glasflächen, nicht um sie herum: Ein `filter`
 * auf einem Vorfahren würde deren `backdrop-filter` brechen (siehe DESIGN.md).
 */

const GELB = "#f5b301";
const ROT = "#e11d2a";
/** Eckenradius der Karten – entspricht `rounded-3xl`. */
const RADIUS = 24;
/** Abstand des Verteilpunkts über und unter einer Kartenreihe. */
const LUECKE = 44;
/** Scrollfenster des Abschnitts, als Anteil der Fensterhöhe. */
const START_BEI = 0.75;
const ENDE_BEI = 0.4;
/** Mindestanteil eines Schritts an der Gesamtlänge, in Pfad-Pixeln gerechnet. */
const MINDESTGEWICHT = 260;

type Rechteck = { x: number; y: number; b: number; h: number };
type Punkt = { x: number; y: number };
type Segment = { id: string; d: string; laenge: number; farbe: string; von: number; bis: number };

/* --- Pfad-Bausteine. Jeder liefert die Pfaddaten und seine ungefähre Länge,
       damit sich der Scrollweg gleichmäßig auf die Abschnitte verteilen lässt. --- */

function linie(von: Punkt, nach: Punkt) {
  const laenge = Math.hypot(nach.x - von.x, nach.y - von.y);
  return { d: `M ${von.x} ${von.y} L ${nach.x} ${nach.y}`, laenge };
}

/** Weicher S-Bogen – für das Abzweigen und Zusammenführen. */
function bogen(von: Punkt, nach: Punkt) {
  const mitte = (von.y + nach.y) / 2;
  const laenge = Math.hypot(nach.x - von.x, nach.y - von.y) * 1.15;
  return { d: `M ${von.x} ${von.y} C ${von.x} ${mitte}, ${nach.x} ${mitte}, ${nach.x} ${nach.y}`, laenge };
}

/** Bogen über zwei nebeneinanderliegende Punkte hinweg. */
function ueberbogen(von: Punkt, nach: Punkt, hoehe: number) {
  const scheitel = Math.min(von.y, nach.y) - hoehe;
  const laenge = Math.hypot(nach.x - von.x, nach.y - von.y) + hoehe;
  return { d: `M ${von.x} ${von.y} C ${von.x} ${scheitel}, ${nach.x} ${scheitel}, ${nach.x} ${nach.y}`, laenge };
}

/** Kartenrand, beginnend oben in der Mitte, im Uhrzeigersinn einmal herum. */
function kartenrand(k: Rechteck) {
  const r = Math.min(RADIUS, k.b / 2, k.h / 2);
  const mx = k.x + k.b / 2;
  const d = [
    `M ${mx} ${k.y}`,
    `H ${k.x + k.b - r}`,
    `A ${r} ${r} 0 0 1 ${k.x + k.b} ${k.y + r}`,
    `V ${k.y + k.h - r}`,
    `A ${r} ${r} 0 0 1 ${k.x + k.b - r} ${k.y + k.h}`,
    `H ${k.x + r}`,
    `A ${r} ${r} 0 0 1 ${k.x} ${k.y + k.h - r}`,
    `V ${k.y + r}`,
    `A ${r} ${r} 0 0 1 ${k.x + r} ${k.y}`,
    `H ${mx}`,
  ].join(" ");
  const laenge = 2 * (k.b + k.h) - 8 * r + 2 * Math.PI * r;
  return { d, laenge };
}

const obenMitte = (k: Rechteck): Punkt => ({ x: k.x + k.b / 2, y: k.y });
const untenMitte = (k: Rechteck): Punkt => ({ x: k.x + k.b / 2, y: k.y + k.h });

/** Karten, die sich senkrecht überlappen, bilden eine Reihe (links vor rechts). */
function reihenBilden(karten: Rechteck[]): Rechteck[][] {
  const reihen: Rechteck[][] = [];
  for (const k of [...karten].sort((a, b) => a.y - b.y || a.x - b.x)) {
    const letzte = reihen[reihen.length - 1];
    const letzteUnten = letzte ? Math.max(...letzte.map((r) => r.y + r.h)) : 0;
    if (letzte && k.y < letzteUnten - 40) letzte.push(k);
    else reihen.push([k]);
  }
  return reihen.map((r) => [...r].sort((a, b) => a.x - b.x));
}

/**
 * Baut die Abschnitte der Spur.
 *
 * Ein Schritt ist eine Gruppe von Abschnitten, die sich **gleichzeitig**
 * zeichnen – so teilt sich die Spur bei den beiden Ansprechpartner-Karten auf,
 * während die Fachbereichs-Karten nacheinander umrundet werden.
 */
function spurBauen(startY: number, karten: Rechteck[], breite: number): Segment[] {
  if (!karten.length) return [];

  const reihen = reihenBilden(karten);
  const cx = breite / 2;
  const letzte = reihen[reihen.length - 1];
  const letzteKarte = letzte[letzte.length - 1];
  const schritte: Omit<Segment, "von" | "bis">[][] = [];
  let y = startY;
  let n = 0;
  const mach = (d: { d: string; laenge: number }, farbe: string) => ({ id: `s${n++}`, ...d, farbe });

  reihen.forEach((reihe, i) => {
    const oben = Math.min(...reihe.map((k) => k.y));
    const unten = Math.max(...reihe.map((k) => k.y + k.h));

    // Verteil- und Treffpunkt dürfen nie in eine Karte hineinragen: Reicht der
    // Zwischenraum nicht für `LUECKE`, rücken sie auf dessen Mitte.
    const vorherUnten = i > 0 ? Math.max(...reihen[i - 1].map((k) => k.y + k.h)) : startY;
    const knoten: Punkt = { x: cx, y: Math.max(oben - LUECKE, (vorherUnten + oben) / 2) };
    const nachherOben =
      i < reihen.length - 1 ? Math.min(...reihen[i + 1].map((k) => k.y)) : unten + 2 * LUECKE;
    const treffY = Math.min(unten + LUECKE, (unten + nachherOben) / 2);

    schritte.push([mach(linie({ x: cx, y }, knoten), GELB)]);

    const istLetzte = (k: Rechteck) => k === letzteKarte;
    const farbe = (k: Rechteck) => (istLetzte(k) ? ROT : GELB);

    if (reihe.length >= 2 && i === 0) {
      // Erste Reihe: Die Spur teilt sich und umschließt beide Karten zugleich.
      schritte.push(reihe.map((k) => mach(bogen(knoten, obenMitte(k)), farbe(k))));
      schritte.push(reihe.map((k) => mach(kartenrand(k), farbe(k))));
      const treffpunkt: Punkt = { x: cx, y: treffY };
      schritte.push(reihe.map((k) => mach(bogen(untenMitte(k), treffpunkt), farbe(k))));
      y = treffpunkt.y;
      return;
    }

    // Weitere Reihen: eine Karte nach der anderen.
    reihe.forEach((k, j) => {
      if (j === 0) {
        schritte.push([mach(bogen(knoten, obenMitte(k)), farbe(k))]);
      } else {
        // Übergang zur Nachbarkarte – hier wechselt die Farbe auf Rot.
        schritte.push([mach(ueberbogen(obenMitte(reihe[j - 1]), obenMitte(k), LUECKE), farbe(k))]);
      }
      schritte.push([mach(kartenrand(k), farbe(k))]);
    });

    if (i < reihen.length - 1) {
      const treffpunkt: Punkt = { x: cx, y: treffY };
      const zuletzt = reihe[reihe.length - 1];
      schritte.push([mach(bogen(untenMitte(zuletzt), treffpunkt), farbe(zuletzt))]);
      y = treffpunkt.y;
    }
  });

  // Scrollweg verteilen: Ein Schritt bekommt so viel Anteil, wie sein längster
  // Abschnitt misst – gleichzeitig gezeichnete Abschnitte teilen sich denselben
  // Bereich. Das Mindestgewicht sorgt dafür, dass die kurzen Verbindungsstücke
  // nicht durchblitzen: Ein Kartenrand misst über 1000 px, ein Abzweig keine
  // 100 – rein proportional wäre der Abzweig nach wenigen Scrollpixeln vorbei.
  const laengen = schritte.map((s) => Math.max(MINDESTGEWICHT, ...s.map((seg) => seg.laenge)));
  const gesamt = laengen.reduce((a, b) => a + b, 0) || 1;

  const segmente: Segment[] = [];
  let angesammelt = 0;
  schritte.forEach((schritt, i) => {
    const von = angesammelt / gesamt;
    angesammelt += laengen[i];
    const bis = angesammelt / gesamt;
    schritt.forEach((seg) => segmente.push({ ...seg, von, bis }));
  });
  return segmente;
}

function Abschnitt({
  segment,
  fortschritt,
  ruhend,
}: {
  segment: Segment;
  fortschritt: MotionValue<number>;
  ruhend: boolean;
}) {
  const versatz = useTransform(fortschritt, [segment.von, segment.bis], [1, 0]);
  return (
    <motion.path
      d={segment.d}
      fill="none"
      stroke={segment.farbe}
      strokeWidth={2}
      strokeLinecap="round"
      pathLength={1}
      strokeDasharray={1}
      style={{ strokeDashoffset: ruhend ? 0 : versatz }}
    />
  );
}

export function KontaktLichtspur({ children }: { children: ReactNode }) {
  const wurzel = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();

  const [mass, setMass] = useState<{ breite: number; hoehe: number }>({ breite: 0, hoehe: 0 });
  const [segmente, setSegmente] = useState<Segment[]>([]);
  // Bis zur ersten Messung liegt das Ende unerreichbar weit unten – die Spur
  // startet dadurch garantiert ungezeichnet.
  const [fenster, setFenster] = useState<[number, number]>([0, 1e6]);

  useEffect(() => {
    const el = wurzel.current;
    if (!el) return;

    const messen = () => {
      const wb = el.getBoundingClientRect();
      const start = el.querySelector<HTMLElement>('[data-spur="start"]');
      const karten = [...el.querySelectorAll<HTMLElement>('[data-spur="karte"]')];
      if (!start || !karten.length) return;

      const rel = (e: HTMLElement): Rechteck => {
        const b = e.getBoundingClientRect();
        return { x: b.left - wb.left, y: b.top - wb.top, b: b.width, h: b.height };
      };

      const startKasten = rel(start);
      const kartenKasten = karten.map(rel);
      setMass({ breite: wb.width, hoehe: wb.height });
      setSegmente(spurBauen(startKasten.y + startKasten.h + 12, kartenKasten, wb.width));

      // Scrollfenster: von kurz nachdem die Überschrift nach oben gewandert ist
      // bis die letzte Karte gut im Bild steht.
      const vh = window.innerHeight;
      const oben = wb.top + window.scrollY;
      const letzte = kartenKasten[kartenKasten.length - 1];
      let a = oben + startKasten.y + startKasten.h - vh * START_BEI;
      let b = oben + letzte.y + letzte.h - vh * ENDE_BEI;
      if (b - a < vh * 0.5) b = a + vh * 0.5;
      if (a < 0) {
        b -= a;
        a = 0;
      }
      setFenster([a, b]);
    };

    messen();
    const beobachter = new ResizeObserver(messen);
    beobachter.observe(el);
    beobachter.observe(document.body);
    window.addEventListener("resize", messen);
    // Die Karten blenden über `StaggerItem` ein und verschieben sich dabei noch.
    const nachmessen = window.setTimeout(messen, 900);
    return () => {
      beobachter.disconnect();
      window.removeEventListener("resize", messen);
      window.clearTimeout(nachmessen);
    };
  }, []);

  const fortschritt = useTransform(scrollY, fenster, [0, 1]);

  const gelbe = segmente.filter((s) => s.farbe === GELB);
  const rote = segmente.filter((s) => s.farbe === ROT);

  return (
    <div ref={wurzel} className="relative">
      {children}
      {mass.breite > 0 && (
        <svg
          className="pointer-events-none absolute inset-0 z-10 h-full w-full overflow-visible"
          viewBox={`0 0 ${mass.breite} ${mass.hoehe}`}
          preserveAspectRatio="none"
          aria-hidden
        >
          {/* Glühen je Farbe an der Gruppe statt an jedem Pfad – ein `filter`
              pro Abschnitt wäre unnötig teuer. */}
          <g style={{ filter: `drop-shadow(0 0 3px ${GELB}) drop-shadow(0 0 9px ${GELB})` }}>
            {gelbe.map((s) => (
              <Abschnitt key={s.id} segment={s} fortschritt={fortschritt} ruhend={!!reduce} />
            ))}
          </g>
          <g style={{ filter: `drop-shadow(0 0 3px ${ROT}) drop-shadow(0 0 9px ${ROT})` }}>
            {rote.map((s) => (
              <Abschnitt key={s.id} segment={s} fortschritt={fortschritt} ruhend={!!reduce} />
            ))}
          </g>
        </svg>
      )}
    </div>
  );
}
