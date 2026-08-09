import { Factory, Flame, ShieldCheck, Zap } from "lucide-react";
import { HomeHero } from "@/components/home-hero";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/motion-primitives";
import { Section, SectionHeading } from "@/components/ui";
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";
import { MagicText } from "@/components/ui/magic-text";
import { Testimonials } from "@/components/testimonials";
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

      {/* Unsere Philosophie – der erste Block nach dem Hero bekommt oben bewusst mehr
          Abstand als der Section-Standard (pt-20/md:pt-28). Der Hero endet mit der
          Partner-Zeile dicht am unteren Rand; ohne den Zuschlag laufen Hero und
          Philosophie optisch ineinander. */}
      <Section area="home-philosophie" className="pt-32 md:pt-44">
        {/* Überschrift über beiden Spalten, damit Fließtext und Karten auf
            derselben Höhe beginnen. Stünde sie in der linken Spalte, müsste die
            rechte um die Höhe der Überschrift versetzt werden – die ändert sich
            aber mit jedem Breakpoint. */}
        <Reveal>
          <SectionHeading title="Unsere Philosophie" />
        </Reveal>
        <div className="mt-6 grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div className="space-y-4 font-body text-base font-light leading-relaxed text-white/70">
              <MagicText text="Für uns ist gutes Handwerk mehr als Technik – es ist Verantwortung. Was wir planen und installieren, schützt Menschen, Werte und Zuhause und muss über viele Jahre zuverlässig funktionieren. Deshalb arbeiten wir lieber einmal gründlich als zweimal schnell." />
              <MagicText text="Wir glauben an ehrliche Beratung auf Augenhöhe, an saubere und präzise Ausführung und an Lösungen mit Weitblick. Meisterqualität heißt für uns, Sorgfalt nicht als Aufwand zu sehen, sondern als Selbstverständlichkeit – bei jedem Kunden, ob privat, gewerblich oder öffentlich." />
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
                    <MagicText
                      text={h.text}
                      className="mt-1.5 font-body text-sm font-light leading-relaxed text-white/65"
                    />
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </Section>

      {/* Kennzahlen – jede Karte leuchtet beim Scrollen einzeln nacheinander im
          Marken-Gelb auf. Der Abstand nach oben ist bewusst groß: Die vier
          Stufen brauchen Scrollweg, und die Karten müssen dabei frei unter der
          Navbar stehen bleiben, sonst laufen sie hinter ihr fertig. */}
      <Section area="home-kennzahlen" className="pb-10 pt-28 md:pb-12 md:pt-36">
        <StaggerGroup className="grid auto-rows-fr grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((s) => (
            <StaggerItem key={s.label} className="h-full">
              <div className="glass flex h-full flex-col items-center justify-center rounded-3xl px-6 py-8 text-center">
                {/* Zahl und Beschriftung teilen sich eine Stufe (`gruppe`), damit
                    die Karte als Ganzes aufleuchtet – nur die Zahl steht fett. */}
                <MagicText
                  as="div"
                  gruppe={`kennzahl-${s.label}`}
                  festeLaenge={0.12}
                  text={s.value}
                  revealColor="#f5b301"
                  className="font-heading text-4xl font-bold italic leading-none tracking-[-1px] text-white md:text-5xl"
                />
                <MagicText
                  as="div"
                  gruppe={`kennzahl-${s.label}`}
                  festeLaenge={0.12}
                  text={s.label}
                  revealColor="#f5b301"
                  className="mt-3 font-body text-sm font-light text-white/70"
                />
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
    </>
  );
}
