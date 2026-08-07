import { Factory, Flame, ShieldCheck, Zap } from "lucide-react";
import { HomeHero } from "@/components/home-hero";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/motion-primitives";
import { Section, SectionHeading } from "@/components/ui";
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";
import { TextReveal } from "@/components/ui/cascade-text";
import { Testimonials } from "@/components/testimonials";
import { MoltenMetalBackground } from "@/components/molten-metal-background";
import { stats } from "@/lib/content";

/**
 * Ziel des „Rezension schreiben"-Buttons.
 *
 * VORLÄUFIG: Google-Maps-Suche auf den Betrieb – funktioniert, führt aber erst
 * auf den Eintrag, von dem aus bewertet wird. Sobald der direkte Bewertungslink
 * des Google-Unternehmensprofils vorliegt (Profil → „Rezensionen" → „Mehr
 * Rezensionen erhalten", Form `https://g.page/r/…/review`), nur diese eine
 * Konstante ersetzen – sonst ändert sich nichts.
 */
const REZENSION_URL =
  "https://www.google.com/maps/search/?api=1&query=Paul+Grunau+Brandschutz+Elektrotechnik+Homburger+Stra%C3%9Fe+48+51545+Waldbr%C3%B6l";

const highlights = [
  {
    icon: Flame,
    title: "Brandschutz aus Meisterhand",
    text: "Aktive und passive Brandschutzkonzepte – von der Planung über die Installation bis zur regelmäßigen Wartung.",
  },
  {
    icon: ShieldCheck,
    title: "Sicherheit nach VDE & DGUV",
    text: "Wir arbeiten mit höchster Präzision nach neuesten Standards für maximale Sicherheit Ihrer Anlagen.",
  },
  {
    icon: Zap,
    title: "Moderne Elektrotechnik",
    text: "Von komplexen Elektroinstallationen über Smart Home bis zur E-Mobilität – effizient und zukunftssicher.",
  },
  {
    icon: Factory,
    title: "Industriebetreuung Installation & Reparatur",
    text: "Wir betreuen Gewerbe- und Industriebetriebe dauerhaft – von der Installation neuer Anlagen über schnelle Reparaturen im laufenden Betrieb bis zur wiederkehrenden Prüfung. Kurze Wege, planbare Termine, möglichst wenig Stillstand.",
  },
];

export default function HomePage() {
  return (
    <>
      <HomeHero />

      {/* Molten-Metal-Hintergrund – bewusst nur um diesen Block gelegt, damit er
          ab „Unsere Philosophie" bis einschließlich „Kundenstimmen" liegt und
          weder den Hero mit dem Video noch den Footer berührt. */}
      <div className="relative">
        <MoltenMetalBackground />
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
            {highlights.map((h) => (
              <StaggerItem key={h.title}>
                <div className="glass glass-glow flex gap-5 rounded-3xl p-6">
                  <h.icon strokeWidth={1.5} className="h-8 w-8 shrink-0 text-brand-yellow" aria-hidden />
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
                <div className="font-heading text-4xl font-bold italic leading-none tracking-[-1px] text-white md:text-5xl">
                  <TextReveal as="span" text={s.value} fontSize="inherit" hoverColor="#f5b301" />
                </div>
                <div className="mt-3 font-body text-sm font-light text-white/70">{s.label}</div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </Section>

      {/* Kundenstimmen – Google-Rezensionen als laufendes Spalten-Marquee */}
      <Section area="home-kundenstimmen">
        <Reveal>
          <h2 className="font-heading text-4xl italic leading-[0.95] tracking-[-2px] text-brand-gradient sm:text-5xl md:text-6xl lg:text-7xl">
            Kundenstimmen
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <Testimonials />
        </Reveal>
        {/* Aufruf zur eigenen Bewertung – blendet wie die übrigen Blöcke per Blur ein */}
        <Reveal delay={0.2} area="kundenstimmen-cta" className="mt-12 flex justify-center">
          <LiquidMetalButton label="Rezension schreiben" href={REZENSION_URL} target="_blank" />
        </Reveal>
          </Section>
        </div>
      </div>
    </>
  );
}
