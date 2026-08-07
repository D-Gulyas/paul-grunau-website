"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const FooterBeam = dynamic(() => import("@/components/footer-beam").then((m) => m.FooterBeam), { ssr: false });
const MoltenMetal = dynamic(() => import("@/components/ui/molten-metal").then((m) => m.MoltenMetal), { ssr: false });

/**
 * Lädt three.js (~460 kB) erst gut eine Sekunde nach dem ersten Seitenaufbau.
 * Der Hintergrund ist reine Dekoration ganz unten – ihn sofort mitzuladen kostet
 * auf dem Handy Zeit an genau der Stelle, an der die Seite lesbar werden soll.
 *
 * TEST: Auf der Startseite steht im Footer statt des Lichtstrahls derselbe
 * Molten-Metal-Hintergrund wie im Inhaltsbereich darüber. Auf allen anderen
 * Seiten bleibt der Lichtstrahl. Zum Zurückdrehen genügt es, den `istStartseite`-
 * Zweig zu entfernen.
 */
export function FooterBeamLazy() {
  const [ready, setReady] = useState(false);
  const istStartseite = usePathname() === "/";

  useEffect(() => {
    const id = window.setTimeout(() => setReady(true), 1200);
    return () => window.clearTimeout(id);
  }, []);

  if (!ready) return null;

  // Werte identisch zu molten-metal-background.tsx, damit der Footer wie eine
  // Fortsetzung des Bereichs darüber wirkt.
  if (istStartseite) {
    return (
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
    );
  }

  return <FooterBeam />;
}
