"use client";

import * as React from "react";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";

/**
 * Scroll-gesteuertes Aufleuchten von Fließtext.
 *
 * Jedes Wort liegt doppelt übereinander: eine ruhende Geister-Kopie mit
 * geringer Deckkraft und darüber eine Kopie, deren Opacity am Scrollfortschritt
 * des Absatzes hängt. Beim Scrollen leuchtet der Satz Wort für Wort auf.
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
  /** Deckkraft des noch nicht aufgeleuchteten Textes. */
  ghostOpacity?: number;
}

function Word({
  children,
  progress,
  range,
  ghostOpacity,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  ghostOpacity: number;
}) {
  const opacity = useTransform(progress, range, [0, 1]);

  return (
    <span className="relative inline-block">
      {/* Ruhende Kopie: liegt an derselben Stelle, ist aber für Screenreader
          und Suchmaschinen unsichtbar – sonst stünde jeder Satz doppelt da. */}
      <span className="absolute" style={{ opacity: ghostOpacity }} aria-hidden>
        {children}
      </span>
      <motion.span style={{ opacity }}>{children}</motion.span>
    </span>
  );
}

export function MagicText({ text, as: Component = "p", className, ghostOpacity = 0.2 }: MagicTextProps) {
  const container = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start 0.9", "start 0.25"],
  });

  const words = text.split(" ");

  // Wer weniger Bewegung möchte, bekommt schlicht den fertigen Text.
  if (reduce) {
    return <Component className={className}>{text}</Component>;
  }

  return (
    <Component ref={container as React.Ref<never>} className={className}>
      {words.map((word, i) => (
        <React.Fragment key={i}>
          <Word
            progress={scrollYProgress}
            range={[i / words.length, (i + 1) / words.length]}
            ghostOpacity={ghostOpacity}
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
