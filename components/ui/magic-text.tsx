"use client";

import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";

/**
 * Scroll-gesteuertes Aufleuchten von Fließtext.
 *
 * Jedes Wort liegt doppelt übereinander: eine ruhende Geister-Kopie mit
 * geringer Deckkraft und darüber eine, deren Opacity am Scrollfortschritt
 * hängt. Beim Scrollen leuchtet der Absatz als weiche Welle auf.
 *
 * Typografie (Schriftart, Größe, Gewicht, Farbe, Zeilenhöhe) wird bewusst vom
 * umgebenden Element geerbt – die Komponente bringt nur den Effekt mit, nicht
 * das Design. Deshalb bekommt sie die Klassen des ursprünglichen Absatzes
 * unverändert übergeben (gleiches Vorgehen wie bei `TextReveal`).
 *
 * Bewegung nur über Deckkraft – kein `filter`, damit das `backdrop-filter` der
 * Glasflächen nicht bricht (siehe DESIGN.md).
 */

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
}

/**
 * Wie viele Wörter gleichzeitig übergehen.
 *
 * Bei 1 schaltet immer nur ein Wort und der Absatz wirkt abgehackt. Mit vier
 * überlappenden Wörtern entsteht eine weiche Welle, die durch den Satz läuft.
 */
const WELLE = 4;

/**
 * Das Scrollfenster, über das ein Absatz aufleuchtet – als Anteil der
 * Fensterhöhe, gemessen an der Absatzposition.
 *
 * Der Anfang zählt ab der Oberkante, das Ende ab der **Unterkante**: dadurch
 * braucht ein langer Absatz mehr Weg als ein kurzer, und die Welle wandert
 * ungefähr im Lesetempo durch den Text.
 */
const START_BEI = 0.85;
const ENDE_BEI = 0.55;
/** Mindestweg, damit einzeilige Texte nicht schlagartig umschlagen. */
const MINDESTWEG = 0.3;

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
}: MagicTextProps) {
  const container = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();

  /**
   * Das Scrollfenster in Pixeln, in dem dieser Absatz aufleuchtet.
   *
   * Bis zur ersten Messung liegt das Ende unerreichbar weit unten – der Absatz
   * startet dadurch garantiert ruhend statt halb aufgeleuchtet.
   */
  const [fenster, setFenster] = useState<[number, number]>([0, 1e6]);

  useEffect(() => {
    const el = container.current;
    if (!el) return;

    const messen = () => {
      const rect = el.getBoundingClientRect();
      const oben = rect.top + window.scrollY;
      const unten = oben + rect.height;
      const vh = window.innerHeight;

      let start = oben - vh * START_BEI;
      let ende = unten - vh * ENDE_BEI;
      if (ende - start < vh * MINDESTWEG) ende = start + vh * MINDESTWEG;

      // Steht der Absatz beim Laden schon im Bild, läge sein Fenster in der
      // Vergangenheit – er wäre ohne Zutun des Users bereits aufgeleuchtet.
      // Deshalb ans obere Seitenende schieben; die Länge bleibt gleich.
      if (start < 0) {
        ende -= start;
        start = 0;
      }

      setFenster([start, ende]);
    };

    messen();
    // Fängt auch nachgeladene Schriften und Bilder ab, die den Absatz
    // verschieben, nachdem er zum ersten Mal gemessen wurde.
    const beobachter = new ResizeObserver(messen);
    beobachter.observe(el);
    beobachter.observe(document.body);
    window.addEventListener("resize", messen);
    return () => {
      beobachter.disconnect();
      window.removeEventListener("resize", messen);
    };
  }, [text]);

  const fortschritt = useTransform(scrollY, fenster, [0, 1]);

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
