"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const MoltenMetal = dynamic(() => import("@/components/ui/molten-metal").then((m) => m.MoltenMetal), {
  ssr: false,
});

/**
 * Molten-Metal-Hintergrund für den Inhaltsbereich der Startseite
 * (ab „Unsere Philosophie" bis einschließlich „Kundenstimmen").
 *
 * Lädt three.js wie der Footer-Strahl erst nach dem ersten Seitenaufbau – der
 * Bereich liegt ohnehin unterhalb des Hero und ist beim Start nicht zu sehen.
 * Farben nach Molten-Metal.md: Schwarz + zweimal Gelb.
 */
export function MoltenMetalBackground() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setReady(true), 1200);
    return () => window.clearTimeout(id);
  }, []);

  if (!ready) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
      <MoltenMetal
        color1="#000000"
        color2="#EAB308"
        color3="#EAB308"
        speed={0.35}
        scale={4}
        detail={3}
        glow={1.6}
        coreSize={0.1}
        swirl={1}
        fold={-0.2}
        blackPoint={0.05}
        brightness={1.3}
        colorMode="molten"
        grain
        grainIntensity={0.05}
        mouseInteraction
        mouseStrength={0.3}
        opacity={1.0}
      />
    </div>
  );
}
