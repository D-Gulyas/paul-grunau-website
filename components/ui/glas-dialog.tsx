"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

/**
 * Pop-up im Liquid-Glass-Look – die Hülle für alle „Mehr erfahren"-Karten.
 *
 * Zuerst gab es das nur bei den Ansprechpartnern auf der Kontaktseite. Als die
 * Karriereseite dieselbe Mechanik brauchte, ist die Hülle hierher gewandert,
 * statt sie ein zweites Mal zu schreiben: Overlay, Panel, Schließen-Knopf,
 * Escape und die Scroll-Sperre sind an **einer** Stelle.
 *
 * Der Inhalt kommt als Render-Funktion herein und nicht als fertiger Knoten.
 * Grund ist das Ausblenden: `AnimatePresence` behält das entfernte Element
 * während der Exit-Animation im Baum. Wäre der Inhalt außerhalb an einen
 * Zustand gebunden, der beim Schließen sofort `null` wird, liefe das Panel
 * leer aus. So rendert es bis zum Schluss den zuletzt gezeigten Eintrag.
 *
 * Gerendert wird per Portal an `document.body`. Das ist keine Vorsicht auf
 * Vorrat: Die Benefits-Karte steckt in einem `StaggerItem`, und dessen
 * `transform`/`filter` macht es zum Bezugsrahmen für `position: fixed` – das
 * Pop-up erschien dadurch winzig **innerhalb** der Karte statt über der Seite.
 *
 * Bewegung nur über Deckkraft und Verschiebung – kein `filter` auf den
 * Glasflächen, sonst bricht deren `backdrop-filter` (siehe DESIGN.md).
 */
export function GlasDialog<T>({
  inhalt,
  label,
  onSchliessen,
  children,
}: {
  /** Der gezeigte Eintrag – `null` heißt zu. */
  inhalt: T | null;
  /** Beschriftung des Dialogs für Screenreader. */
  label: (eintrag: T) => string;
  onSchliessen: () => void;
  children: (eintrag: T) => ReactNode;
}) {
  // Das Portal braucht `document` – erst ab dem ersten Client-Render, sonst
  // unterscheidet sich die Ausgabe vom Server und die Hydration meckert.
  const [bereit, setBereit] = useState(false);
  useEffect(() => setBereit(true), []);

  // Escape schließt, und der Hintergrund soll nicht mitscrollen.
  useEffect(() => {
    if (!inhalt) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onSchliessen();
    };
    document.addEventListener("keydown", onKey);
    const vorher = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = vorher;
    };
  }, [inhalt, onSchliessen]);

  if (!bereit) return null;

  return createPortal(
    <AnimatePresence>
      {inhalt && (
        <motion.div
          className="fixed inset-0 z-[60] grid place-items-center px-5 py-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <button
            type="button"
            aria-label="Schließen"
            onClick={onSchliessen}
            className="absolute inset-0 cursor-default bg-black/75"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={label(inhalt)}
            className="liquid-glass-strong relative max-h-full w-full max-w-lg overflow-y-auto rounded-3xl p-7"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              type="button"
              onClick={onSchliessen}
              aria-label="Schließen"
              className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-full text-white/70 transition-colors hover:text-[#f5b301]"
            >
              <X className="h-5 w-5" />
            </button>

            {children(inhalt)}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
