"use client";

import { Fragment } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Wort-für-Wort Blur-In (nach Cinematic-Vorlage).
 * Jedes Wort: blur(10px)/opacity 0/y 50 → blur(5px)/0.5/-5 → blur(0)/1/0.
 * Stagger 100ms je Wort, easeOut.
 */
export function BlurText({
  text,
  className,
  delay = 0,
  nowrap = false,
  gradient = false,
  as: Tag = "p",
}: {
  text: string;
  className?: string;
  delay?: number;
  nowrap?: boolean;
  /**
   * Marken-Verlauf statt einfarbigem Text. Der Verlauf sitzt an **jedem Wort**, nicht am
   * Elternteil: das animierte `filter` je Wort gibt ihm eine eigene Rendering-Ebene, in der
   * ein am Elternteil geclippter Verlauf nicht ankommt – die Überschrift wäre unsichtbar.
   * Details in `globals.css` bei `text-brand-gradient-word`.
   */
  gradient?: boolean;
  /** Semantisches Element – für die Haupt-Überschrift einer Seite `h1`. Ändert die Optik nicht. */
  as?: "p" | "h1" | "h2";
}) {
  const reduce = useReducedMotion();
  const words = text.split(" ");

  return (
    <Tag
      className={className}
      style={{ display: "flex", flexWrap: nowrap ? "nowrap" : "wrap", justifyContent: "center", rowGap: "0.1em" }}
    >
      {words.map((word, i) => (
        // Echtes Leerzeichen zwischen den Wörtern, damit der Text als "Brandschutz & Elektrotechnik"
        // ausgelesen wird und nicht zusammengeklebt. Im Flex-Container werden reine Leerzeichen
        // nicht dargestellt – die Optik bleibt exakt gleich, den Abstand macht weiterhin marginRight.
        <Fragment key={`${word}-${i}`}>
          {i > 0 && " "}
          <motion.span
            className={gradient ? "text-brand-gradient-word" : undefined}
            style={{ display: "inline-block", marginRight: "0.28em" }}
            initial={reduce ? { opacity: 0 } : { filter: "blur(10px)", opacity: 0, y: 50 }}
            whileInView={
              reduce
                ? { opacity: 1 }
                : {
                    filter: ["blur(10px)", "blur(5px)", "blur(0px)"],
                    opacity: [0, 0.5, 1],
                    y: [50, -5, 0],
                  }
            }
            viewport={{ once: true, amount: 0.1 }}
            transition={{
              duration: 0.7,
              times: [0, 0.5, 1],
              ease: "easeOut",
              delay: delay + (i * 100) / 1000,
            }}
          >
            {word}
          </motion.span>
        </Fragment>
      ))}
    </Tag>
  );
}
