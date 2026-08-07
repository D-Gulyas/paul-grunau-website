"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const MoltenMetal = dynamic(() => import("@/components/ui/molten-metal").then((m) => m.MoltenMetal), {
  ssr: false,
});

/**
 * Molten-Metal-Hintergrund der Startseite – EIN durchgehendes Feld von
 * „Unsere Philosophie" bis zum Ende des Footers.
 *
 * Sitzt bewusst im Layout und nicht in `page.tsx`, weil der Footer dort ein
 * Geschwister von `<main>` ist. Nur so laufen Inhalt und Footer über denselben
 * Canvas – zwei getrennte Canvas hätten je eine eigene Zeitbasis und wirkten
 * dadurch wie zwei verschiedene Hintergründe.
 *
 * `top-[100dvh]` überspringt den Hero (`min-h-dvh`), sodass der Effekt genau
 * darunter beginnt. Selbst wenn der Hero einmal höher würde, bliebe er unberührt:
 * er liegt in `<main>` auf z-10 über diesem Feld und ist ohnehin deckend.
 *
 * three.js wird wie beim Footer-Strahl erst nach dem ersten Seitenaufbau geladen.
 */
export function MoltenMetalBackground() {
  const [ready, setReady] = useState(false);
  const istStartseite = usePathname() === "/";

  useEffect(() => {
    const id = window.setTimeout(() => setReady(true), 1200);
    return () => window.clearTimeout(id);
  }, []);

  if (!ready || !istStartseite) return null;

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 top-[100dvh] z-0" aria-hidden>
      <MoltenMetal
        color1="#000000"
        color2="#f5b301"
        color3="#f5b301"
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
