"use client";

import Link from "next/link";
import { useEffect } from "react";
import {
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import { ArrowUpRight, Phone } from "lucide-react";
import { BlurText } from "@/components/blur-text";
import { asset } from "@/lib/base-path";

// Hero-Diashow: identisch gerahmte Vorher/Nachher/Nacht-Aufnahme desselben Hauses.
// hausBau = Rohbau mit Gerüst, hausFertig = fertig montierte PV-Anlage, hausNacht = selbes Haus bei Nacht mit Licht an.
const hausBau = asset("/images/hero-haus-1.webp");
const hausFertig = asset("/images/hero-haus-2.webp");
const hausNacht = asset("/images/hero-haus-3.webp");

// Weiche Übergangskante (Federbreite in %) der Baufortschritts-Front.
const FEATHER = 14;

const partners = ["KNX", "Gira", "Hager", "SMA", "Busch-Jaeger"];

const fade = (delay: number, reduce: boolean | null) => ({
  initial: reduce ? { opacity: 0 } : { filter: "blur(10px)", opacity: 0, y: 20 },
  animate: { filter: "blur(0px)", opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const, delay },
});

export function HomeHero() {
  const reduce = useReducedMotion();

  // Bau-Front in % (–FEATHER = verdeckt, 100 = fertig). Läuft diagonal von links unten
  // zur Abendsonne oben rechts und baut haus_1 → haus_2 auf.
  const front = useMotionValue(reduce ? 100 : -FEATHER);
  const frontEnd = useTransform(front, (v) => v + FEATHER);
  // Reset-Front in % (–FEATHER = Tag/Nacht voll sichtbar, 100 = vollständig weg).
  // Läuft diagonal von der Sonne oben rechts nach unten links und enthüllt wieder haus_1.
  const reset = useMotionValue(-FEATHER);
  const resetEnd = useTransform(reset, (v) => v + FEATHER);
  // Übergang Tag → Nacht: haus_3 (dunklerer Himmel + Licht an) blendet sanft über das fertige Tagbild.
  const nachtOpacity = useMotionValue(0);
  // Aufbau-Maske auf dem fertigen Bild: alles "hinter" der Bau-Front (#000) ist sichtbar.
  const fertigMask = useMotionTemplate`linear-gradient(to top right, #000 0%, #000 ${front}%, rgba(0,0,0,0) ${frontEnd}%, rgba(0,0,0,0) 100%)`;
  // Reset-Maske über Tag+Nacht: wischt von oben rechts nach unten links weg und legt haus_1 frei.
  const resetMask = useMotionTemplate`linear-gradient(to bottom left, rgba(0,0,0,0) 0%, rgba(0,0,0,0) ${reset}%, #000 ${resetEnd}%, #000 100%)`;

  useEffect(() => {
    if (reduce) return;
    let cancelled = false;
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

    async function loop() {
      while (!cancelled) {
        // 0. haus_1 (Rohbau mit Gerüst) kurz für sich stehen lassen.
        await sleep(1400);
        if (cancelled) return;
        // 1. Bau: Front wandert langsam & diagonal über das Dach – Gerüst verschwindet, Module wachsen.
        //    Bewusst gemächlich, damit der Aufbau ruhig & smooth statt hastig wirkt.
        await animate(front, 100, { duration: 8, ease: [0.45, 0, 0.15, 1] }).finished;
        if (cancelled) return;
        // 2. Fertiges Tagbild (haus_2) ein paar Sekunden halten.
        await sleep(3000);
        if (cancelled) return;
        // 3. Tag → Nacht: Himmel dunkelt sanft ab und die Lichter gehen an (haus_3 blendet weich auf).
        await animate(nachtOpacity, 1, { duration: 4, ease: "easeInOut" }).finished;
        if (cancelled) return;
        // 4. Nächtlichen Zustand mit Licht ein paar Sekunden halten.
        await sleep(3200);
        if (cancelled) return;
        // 5. Reset diagonal: von der Sonne oben rechts nach unten links wischt Tag+Nacht weg und haus_1 erscheint wieder.
        await animate(reset, 100, { duration: 6, ease: [0.45, 0, 0.15, 1] }).finished;
        if (cancelled) return;
        // 6. Unsichtbar zurücksetzen (haus_1 liegt jetzt frei) und Loop sanft erneut starten.
        front.set(-FEATHER);
        nachtOpacity.set(0);
        reset.set(-FEATHER);
        await sleep(500);
      }
    }
    loop();
    return () => {
      cancelled = true;
    };
  }, [reduce, front, reset, nachtOpacity]);

  return (
    <section data-area="home-hero" className="relative flex min-h-dvh flex-col overflow-hidden">
      {/* Slideshow Hintergrund: Baufortschritts-Übergang */}
      <div data-area="home-hero-slideshow" className="absolute inset-0 z-0">
        <motion.div
          className="absolute inset-0"
          animate={reduce ? undefined : { scale: [1, 1.06] }}
          transition={{ duration: 16, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" }}
        >
          {/* Basis: Rohbau mit Gerüst */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={hausBau}
            alt="Einfamilienhaus im Bau mit Gerüst in der Abendsonne"
            className="absolute inset-0 h-full w-full object-cover"
          />
          {/* Wrapper über Tag+Nacht: wird beim Reset diagonal von oben rechts nach unten links weggewischt und legt haus_1 frei */}
          <motion.div
            className="absolute inset-0"
            style={{ maskImage: resetMask, WebkitMaskImage: resetMask }}
          >
            {/* Overlay: fertiges Haus mit PV-Anlage, durch die Bau-Maske enthüllt */}
            <motion.div
              className="absolute inset-0"
              style={{ maskImage: fertigMask, WebkitMaskImage: fertigMask }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={hausFertig}
                alt="Fertiges Einfamilienhaus mit montierter Photovoltaikanlage in der Abendsonne"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </motion.div>
            {/* Overlay: dasselbe Haus bei Nacht mit Licht an – blendet sanft über das fertige Tagbild */}
            <motion.div className="absolute inset-0" style={{ opacity: nachtOpacity }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={hausNacht}
                alt="Fertiges Einfamilienhaus mit Photovoltaikanlage bei Nacht mit eingeschalteter Beleuchtung"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </motion.div>
          </motion.div>
        </motion.div>
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
          {/* Zeile 1: obere Headline – immer größer als Zeile 2 (gleiche vw-Skala, höhere Werte) */}
          <BlurText
            text="Brandschutz & Elektrotechnik"
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
        <div className="flex flex-nowrap items-center justify-center gap-x-3 gap-y-3 sm:flex-wrap sm:gap-x-12 md:gap-x-16">
          {partners.map((p) => (
            <span
              key={p}
              className="whitespace-nowrap font-heading text-base italic tracking-tight text-white sm:text-2xl md:text-3xl"
            >
              {p}
            </span>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
