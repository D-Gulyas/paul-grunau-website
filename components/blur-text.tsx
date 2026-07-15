"use client";

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
}: {
  text: string;
  className?: string;
  delay?: number;
  nowrap?: boolean;
}) {
  const reduce = useReducedMotion();
  const words = text.split(" ");

  return (
    <p
      className={className}
      style={{ display: "flex", flexWrap: nowrap ? "nowrap" : "wrap", justifyContent: "center", rowGap: "0.1em" }}
    >
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
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
      ))}
    </p>
  );
}
