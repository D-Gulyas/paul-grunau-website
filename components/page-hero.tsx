import type { ReactNode } from "react";
import { Reveal } from "@/components/motion-primitives";
import { Eyebrow } from "@/components/ui";
import { MagicText } from "@/components/ui/magic-text";

export function PageHero({
  eyebrow,
  title,
  intro,
  area,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  area?: string;
}) {
  // Der Abstand nach oben ist bewusst groß: Der Intro-Absatz darunter leuchtet über
  // die ersten Scrollpixel auf, und in dieser Zeit muss die Überschrift noch frei
  // unter der Navbar stehen – sonst liest der User sie nie fertig.
  return (
    <section data-area={area} className="relative overflow-hidden px-5 pb-8 pt-60 md:px-8 md:pt-64">
      {/* dezenter Markenglow im Kopfbereich */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[60%] opacity-80 brand-aura"
        aria-hidden
      />
      <div className="mx-auto w-full max-w-6xl">
        <Reveal>
          <Eyebrow>{eyebrow}</Eyebrow>
        </Reveal>
        <Reveal delay={0.1}>
          <h1 className="mt-6 max-w-4xl text-balance font-heading text-5xl italic leading-[0.92] tracking-[-2px] text-brand-gradient sm:text-6xl md:text-7xl">
            {title}
          </h1>
        </Reveal>
        {intro && (
          <Reveal delay={0.2}>
            {/* Fließtext leuchtet beim Scrollen wortweise auf; nur reiner Text
                lässt sich in Wörter zerlegen, alles andere bleibt unverändert. */}
            {typeof intro === "string" ? (
              <MagicText
                text={intro}
                className="mt-6 max-w-2xl text-pretty font-body text-lg font-light leading-relaxed text-white/70"
              />
            ) : (
              <p className="mt-6 max-w-2xl text-pretty font-body text-lg font-light leading-relaxed text-white/70">
                {intro}
              </p>
            )}
          </Reveal>
        )}
      </div>
    </section>
  );
}
