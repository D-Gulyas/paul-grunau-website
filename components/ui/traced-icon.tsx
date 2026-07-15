"use client";

import { cloneElement, useId, type CSSProperties, type ReactElement } from "react";
import { motion, useReducedMotion } from "framer-motion";

// Gradient-Tracing: ein weicher Licht-Verlauf wandert über die Kontur eines
// lucide-Icons (Original-Technik: bewegter userSpaceOnUse-Verlauf).
//
// Das Icon wird als Children übergeben (nicht als Funktions-Prop), damit die
// Server-Component-Seiten es an diese Client-Component reichen dürfen.
type TraceColors = [string, string, string];

// Original-Demo-Farben aus dem Original-Prompt (demo.tsx: gradientColors) –
// Gelb zu Orange, wie auf der 21st.dev-Lightning-Bolt-Demo zu sehen.
const ORIGINAL: TraceColors = ["#F1C40F", "#F1C40F", "#E67E22"];

interface TracedIconProps {
  /** Genau ein lucide-Icon-Element, z. B. <Flame strokeWidth={1.5} />. */
  children: ReactElement<{ className?: string; stroke?: string; style?: CSSProperties }>;
  /** Größen-/Farbklassen für den Wrapper, z. B. "h-8 w-8 shrink-0 text-white". */
  className?: string;
  /** Dauer eines Durchlaufs in Sekunden. */
  duration?: number;
  /** Versatz für gestaffelte Reihen (Licht „fließt" über mehrere Icons). */
  delay?: number;
  colors?: TraceColors;
}

export function TracedIcon({
  children,
  className = "",
  duration = 2.4,
  delay = 0,
  colors = ORIGINAL,
}: TracedIconProps) {
  const reduce = useReducedMotion();
  const gradientId = `traced-icon-${useId().replace(/:/g, "")}`;

  // Blasse Basis – hält das Icon dauerhaft sichtbar.
  const base = cloneElement(children, {
    className: "absolute inset-0 h-full w-full opacity-30",
  });
  // Licht-Sweep darüber – Kontur per Verlaufs-Stroke, mit leichtem Shining.
  const overlay = cloneElement(children, {
    className: "absolute inset-0 h-full w-full",
    stroke: `url(#${gradientId})`,
    style: {
      filter: `drop-shadow(0 0 1px ${colors[0]}d9) drop-shadow(0 0 3px ${colors[2]}8c)`,
    },
  });

  return (
    <span className={`relative inline-flex ${className}`} aria-hidden>
      {/* Bewegter Verlauf – userSpaceOnUse im 24er-Raum der lucide-Icons,
          damit der Sweep einheitlich über alle Teilpfade läuft. */}
      <svg width="0" height="0" className="absolute" focusable="false" aria-hidden>
        <defs>
          <motion.linearGradient
            id={gradientId}
            gradientUnits="userSpaceOnUse"
            gradientTransform="rotate(-45 12 12)"
            x1={0}
            y1={0}
            x2={reduce ? 24 : 0}
            y2={0}
            animate={reduce ? undefined : { x1: [-12, 60], x2: [-12, 36] }}
            transition={{ duration, repeat: Infinity, ease: "linear", delay }}
          >
            <stop stopColor={colors[0]} stopOpacity="0" />
            <stop stopColor={colors[1]} />
            <stop offset="1" stopColor={colors[2]} stopOpacity="0" />
          </motion.linearGradient>
        </defs>
      </svg>
      {base}
      {overlay}
    </span>
  );
}
