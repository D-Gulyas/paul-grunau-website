"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const FooterBeam = dynamic(() => import("@/components/footer-beam").then((m) => m.FooterBeam), { ssr: false });

/**
 * Lädt three.js (~460 kB) erst gut eine Sekunde nach dem ersten Seitenaufbau.
 * Der Lichtstrahl ist reine Dekoration ganz unten – ihn sofort mitzuladen kostet
 * auf dem Handy Zeit an genau der Stelle, an der die Seite lesbar werden soll.
 *
 * Auf der Startseite entfällt er: dort läuft der Molten-Metal-Hintergrund aus dem
 * Layout durchgehend bis ans Seitenende, der Strahl würde sich damit überlagern.
 */
export function FooterBeamLazy() {
  const [ready, setReady] = useState(false);
  const istStartseite = usePathname() === "/";

  useEffect(() => {
    const id = window.setTimeout(() => setReady(true), 1200);
    return () => window.clearTimeout(id);
  }, []);

  return ready && !istStartseite ? <FooterBeam /> : null;
}
