import type { ReactNode } from "react";
import { Reveal } from "@/components/motion-primitives";
import { Eyebrow } from "@/components/ui";

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
  return (
    <section data-area={area} className="relative overflow-hidden px-5 pb-8 pt-36 md:px-8 md:pt-44">
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
            <p className="mt-6 max-w-2xl text-pretty font-body text-lg font-light leading-relaxed text-white/70">
              {intro}
            </p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
