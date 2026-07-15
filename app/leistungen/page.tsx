import type { Metadata } from "next";
import { Check, Cpu, Sun, Zap } from "lucide-react";
import { TracedIcon } from "@/components/ui/traced-icon";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/motion-primitives";
import { Eyebrow, Section } from "@/components/ui";
import { services } from "@/lib/content";
import { asset } from "@/lib/base-path";

export const metadata: Metadata = {
  title: "Leistungen",
  description:
    "Elektrotechnik, KNX & Smarthome und Photovoltaik aus Meisterhand. Umfassende Lösungen in Brandschutz und Elektrotechnik für Waldbröl und Umgebung.",
};

const icons: Record<string, typeof Zap> = {
  elektrotechnik: Zap,
  "knx-smarthome": Cpu,
  photovoltaik: Sun,
};

export default function LeistungenPage() {
  return (
    <>
      <PageHero
        eyebrow="Unsere Expertise"
        title={
          <>
            Für Ihre <span className="italic">Sicherheit</span> und Effizienz
          </>
        }
        intro="Als erfahrener Meisterbetrieb bieten wir Ihnen ein breites Spektrum an Dienstleistungen im Bereich Brandschutz und Elektrotechnik. Von der Planung über die Installation bis zur Wartung."
      />

      {/* Detailblöcke je Leistung */}
      <Section className="space-y-24 pt-12">
        {services.map((s, i) => {
          const Icon = icons[s.id] ?? Zap;
          const reversed = i % 2 === 1;
          return (
            <div
              key={s.id}
              id={s.id}
              className="grid scroll-mt-28 items-center gap-10 lg:grid-cols-2 lg:gap-16"
            >
              <Reveal className={reversed ? "lg:order-2" : ""}>
                <div className="glass glass-glow overflow-hidden rounded-[2rem]">
                  <div className="relative h-72 md:h-96">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={asset(s.image)} alt={s.title} className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.1} className={reversed ? "lg:order-1" : ""}>
                <div className="flex items-center gap-3">
                  <TracedIcon className="h-8 w-8 shrink-0 text-white" delay={i * 0.4}>
                    <Icon strokeWidth={1.5} />
                  </TracedIcon>
                  <Eyebrow>{s.tag}</Eyebrow>
                </div>
                <h2 className="mt-5 font-heading text-4xl italic tracking-[-1px] text-brand-gradient md:text-5xl">{s.title}</h2>
                <p className="mt-4 font-body text-base font-light leading-relaxed text-white/70">{s.description}</p>
                <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                  {s.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 font-body text-sm font-light text-white/80">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-white" />
                      {f}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          );
        })}
      </Section>
    </>
  );
}
