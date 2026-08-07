"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Phone } from "lucide-react";
import { BlurText } from "@/components/blur-text";
import { LogoLoop } from "@/components/ui/logo-loop";
import { asset } from "@/lib/base-path";

// Hersteller, mit denen der Betrieb arbeitet – laufen als Endlos-Schleife durch.
// Die Reihenfolge hier ist die Reihenfolge im Lauf: Schneider Merten steht bewusst
// an erster Stelle. Neue Hersteller: SVG nach public/logos/ legen und eine Zeile ergänzen.
//
// Alle Logos laufen in ihren Originalfarben – möglich durch den hellen Streifen
// hinter der Schleife. Einzige Ausnahme ist Hager: ein rein weißes Logo, das auf
// Hell unsichtbar wäre und deshalb schwarz dargestellt wird (siehe logo-loop.css).
const LOGO_GRUND = "#f4f5f7";
const DARKEN = "logoloop__img--darken";

const partners = [
  { src: asset("/logos/schneider-merten.svg"), alt: "Schneider Electric – Merten" },
  { src: asset("/logos/knx.svg"), alt: "KNX" },
  { src: asset("/logos/gira.svg"), alt: "Gira" },
  { src: asset("/logos/hager.svg"), alt: "Hager", className: DARKEN },
  { src: asset("/logos/sma.svg"), alt: "SMA" },
  { src: asset("/logos/busch-jaeger.svg"), alt: "Busch-Jaeger" },
  { src: asset("/logos/kostal.svg"), alt: "Kostal" },
  { src: asset("/logos/qcells.svg"), alt: "Qcells" },
  { src: asset("/logos/sigenergy.svg"), alt: "Sigenergy" },
  { src: asset("/logos/e3.svg"), alt: "E3/DC" },
  { src: asset("/logos/easee.svg"), alt: "Easee" },
  { src: asset("/logos/keba.svg"), alt: "KEBA" },
];

const fade = (delay: number, reduce: boolean | null) => ({
  initial: reduce ? { opacity: 0 } : { filter: "blur(10px)", opacity: 0, y: 20 },
  animate: { filter: "blur(0px)", opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const, delay },
});

export function HomeHero() {
  const reduce = useReducedMotion();

  return (
    <section data-area="home-hero" className="relative flex min-h-dvh flex-col overflow-hidden">
      {/* Hintergrund-Video: läuft stumm in Dauerschleife (bei reduced-motion bleibt das Poster stehen).
          Das Poster ist exakt das erste Videobild – es füllt den Hero sofort, der Wechsel ist unsichtbar. */}
      <div data-area="home-hero-video" className="absolute inset-0 z-0">
        <video
          src={asset("/videos/hero.mp4")}
          poster={asset("/images/hero-poster.webp")}
          autoPlay={!reduce}
          loop
          muted
          playsInline
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Scrim für Lesbarkeit des weißen Textes */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/45 to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_40%,transparent,rgba(0,0,0,0.65))]" />
        {/* Weicher schwarzer Blur-Rand: nur der Bildrand wird sanft abgedunkelt, das Bild bleibt scharf. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ boxShadow: "inset 0 0 110px 26px rgba(0,0,0,0.72)" }}
        />
      </div>

      {/* Inhalt */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 pt-28 text-center">
        {/* Headline – Firmenname, Wort-für-Wort Blur-In */}
        <div data-area="home-hero-headline" className="flex flex-col items-center">
          {/* Zeile 1: obere Headline – immer größer als Zeile 2 (gleiche vw-Skala, höhere Werte).
              Zugleich das <h1> der Startseite (Google/Screenreader), Optik unverändert. */}
          <BlurText
            text="Brandschutz & Elektrotechnik"
            as="h1"
            nowrap
            className="justify-center font-heading text-[clamp(1.2rem,6vw,5rem)] font-bold italic uppercase leading-[0.95] tracking-[-1px] text-[#e11d2a]"
          />
          {/* Zeile 2: untere Headline – proportional ~70 % von Zeile 1, damit sie nie größer wirkt */}
          <BlurText
            text="Meisterbetrieb Paul Grunau"
            delay={0.4}
            className="max-w-4xl justify-center font-heading text-[clamp(0.85rem,4.2vw,3.5rem)] font-bold italic uppercase leading-[0.95] tracking-[-1px] text-[#e11d2a]"
          />
        </div>

        {/* CTAs: Mehr erfahren + Telefonnummer – auf Mobil bewusst dezent, damit der Firmenname dominiert */}
        <motion.div {...fade(0.6, reduce)} data-area="home-hero-cta" className="mt-5 flex items-center gap-3 sm:mt-8 sm:gap-6">
          <Link
            href="/leistungen"
            className="liquid-glass-strong group inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 font-body text-xs font-medium text-white transition-transform duration-300 hover:-translate-y-0.5 sm:gap-2 sm:px-5 sm:py-2.5 sm:text-sm"
          >
            Mehr erfahren
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 sm:h-5 sm:w-5" />
          </Link>
          <a
            href="tel:+4915121069600"
            className="group inline-flex items-center gap-1.5 font-body text-xs font-medium text-white/90 sm:gap-2 sm:text-sm"
          >
            <Phone className="h-3.5 w-3.5 text-white/90 sm:h-4 sm:w-4" />
            <span className="transition-colors group-hover:text-[#e11d2a]">+49 151 21069600</span>
          </a>
        </motion.div>
      </div>

      {/* Partner */}
      <motion.div {...fade(0.9, reduce)} data-area="home-hero-partner" className="relative z-10 flex flex-col items-center gap-4 px-4 pb-8">
        <span className="liquid-glass rounded-full px-3.5 py-1 font-body text-xs font-medium text-white">
          Wir arbeiten mit führenden Herstellern
        </span>
        {/* Endlos-Schleife: Logos laufen von rechts nach links, an beiden Rändern ausgeblendet.
            Breite begrenzt, damit etwa fünf Logos gleichzeitig zu sehen sind.
            Heller Streifen dahinter: erst dadurch sind die Logos in Originalfarben lesbar.
            fadeOutColor muss exakt der Streifenfarbe entsprechen, sonst sieht man die Kante. */}
        <div
          className="w-full max-w-3xl rounded-full px-4 py-3 sm:px-8"
          style={{ backgroundColor: LOGO_GRUND }}
        >
          <LogoLoop
            logos={partners}
            speed={55}
            direction="left"
            logoHeight={32}
            gap={56}
            fadeOut
            fadeOutColor={LOGO_GRUND}
            ariaLabel="Hersteller, mit denen wir arbeiten"
          />
        </div>
      </motion.div>
    </section>
  );
}
