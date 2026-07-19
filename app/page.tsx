import { Flame, ShieldCheck, Zap } from "lucide-react";
import { HomeHero } from "@/components/home-hero";
import SideRays from "@/components/side-rays";
import { TracedIcon } from "@/components/ui/traced-icon";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/motion-primitives";
import { Section, SectionHeading } from "@/components/ui";
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";
import { TextReveal } from "@/components/ui/cascade-text";
import { Testimonials } from "@/components/testimonials";
import { stats } from "@/lib/content";

const highlights = [
  {
    icon: Flame,
    title: "Brandschutz aus Meisterhand",
    text: "Aktive und passive Brandschutzkonzepte – von der Planung über die Installation bis zur regelmäßigen Wartung.",
  },
  {
    icon: ShieldCheck,
    title: "Sicherheit nach VDE",
    text: "Wir arbeiten mit höchster Präzision nach neuesten Standards für maximale Sicherheit Ihrer Anlagen.",
  },
  {
    icon: Zap,
    title: "Moderne Elektrotechnik",
    text: "Von komplexen Elektroinstallationen über Smart Home bis zur E-Mobilität – effizient und zukunftssicher.",
  },
];

export default function HomePage() {
  return (
    <>
      <HomeHero />

      {/* Inhaltsbereich der Startseite mit dekorativen Lichtstrahlen im Hintergrund.
          Hero und Footer bleiben bewusst außen vor und unverändert. */}
      <div className="relative">
        {/* Dekorative Lichtstrahlen – rein visuell, ohne Interaktion */}
        <div
          data-area="home-lichtstrahlen"
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
        >
          <SideRays
            speed={2.5}
            rayColor1="#EAB308"
            rayColor2="#96c8ff"
            intensity={2}
            spread={2}
            origin="top-right"
            tilt={0}
            saturation={1.5}
            blend={0.75}
            falloff={1.6}
            opacity={0.5}
          />
        </div>

        {/* Inhalt liegt über den Strahlen */}
        <div className="relative z-10">
      {/* Unsere Philosophie */}
      <Section area="home-philosophie">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <SectionHeading title="Unsere Philosophie" />
            <div className="mt-6 space-y-4 font-body text-base font-light leading-relaxed text-white/70">
              <p>
                Für uns ist gutes Handwerk mehr als Technik – es ist Verantwortung. Was wir planen und installieren,
                schützt Menschen, Werte und Zuhause und muss über viele Jahre zuverlässig funktionieren. Deshalb arbeiten
                wir lieber einmal gründlich als zweimal schnell.
              </p>
              <p>
                Wir glauben an ehrliche Beratung auf Augenhöhe, an saubere und präzise Ausführung und an Lösungen mit
                Weitblick. Meisterqualität heißt für uns, Sorgfalt nicht als Aufwand zu sehen, sondern als
                Selbstverständlichkeit – bei jedem Kunden, ob privat, gewerblich oder öffentlich.
              </p>
            </div>
            <div className="mt-8">
              <LiquidMetalButton label="Alle Leistungen ansehen" href="/leistungen" />
            </div>
          </Reveal>

          <StaggerGroup area="home-philosophie-highlights" className="grid gap-4">
            {highlights.map((h, i) => (
              <StaggerItem key={h.title}>
                <div className="glass glass-glow flex gap-5 rounded-3xl p-6">
                  <TracedIcon className="h-8 w-8 shrink-0 text-white" delay={i * 0.4}>
                    <h.icon strokeWidth={1.5} />
                  </TracedIcon>
                  <div>
                    <h3 className="font-heading text-xl italic tracking-[-0.5px] text-brand-gradient">{h.title}</h3>
                    <p className="mt-1.5 font-body text-sm font-light leading-relaxed text-white/65">{h.text}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </Section>

      {/* Stats – Kennzahlen zählen beim Sichtbarwerden hoch */}
      <Section area="home-kennzahlen" className="py-10 md:py-12">
        <StaggerGroup className="grid auto-rows-fr grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((s) => (
            <StaggerItem key={s.label} className="h-full">
              <div className="glass flex h-full flex-col items-center justify-center rounded-3xl px-6 py-8 text-center">
                <div className="font-heading text-4xl italic leading-none tracking-[-1px] text-white md:text-5xl">
                  <TextReveal as="span" text={s.value} fontSize="inherit" hoverColor="#e11d2a" />
                </div>
                <div className="mt-3 font-body text-sm font-light text-white/70">{s.label}</div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </Section>

      {/* Kundenstimmen – Google-Rezensionen als Diashow */}
      <Section area="home-kundenstimmen">
        <Reveal>
          <h2 className="font-heading text-4xl italic leading-[0.95] tracking-[-2px] text-brand-gradient sm:text-5xl md:text-6xl lg:text-7xl">
            Kundenstimmen
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <Testimonials />
        </Reveal>
      </Section>
        </div>
      </div>
    </>
  );
}
