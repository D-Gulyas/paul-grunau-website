import type { Metadata } from "next";
import { Building2, GraduationCap, Briefcase } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { ApplicationForm } from "@/components/application-form";
import { BenefitsKarte } from "@/components/benefits-karte";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/motion-primitives";
import { Section, SectionHeading } from "@/components/ui";
import { MagicText } from "@/components/ui/magic-text";

export const metadata: Metadata = {
  title: "Karriere",
  description:
    "Werden Sie Teil des Meisterbetriebs Paul Grunau. Offene Stellen für Meister, Fachkräfte und Auszubildende in Brandschutz und Elektrotechnik.",
};

const blocks = [
  {
    icon: Building2,
    title: "Unser Unternehmen",
    text: "Erfahren Sie, was Paul Grunau als Arbeitgeber auszeichnet. Wir sind ein engagiertes Team, das innovative Lösungen in Brandschutz und Elektrotechnik bietet.",
  },
  {
    icon: GraduationCap,
    title: "Ihre Entwicklung",
    text: "Wir investieren in unsere Mitarbeiter durch Weiterbildung und bieten klare Karrierewege in einem dynamischen Umfeld.",
  },
  {
    icon: Briefcase,
    title: "Offene Stellen",
    text: "Egal ob erfahrene Fachkraft, Berufsstarter oder Azubi – wir suchen Talente wie Sie. Finden Sie die passende Position.",
  },
];

export default function KarrierePage() {
  return (
    <>
      <PageHero
        area="karriere-hero"
        eyebrow="Karriere bei Paul Grunau"
        title={
          <>
            Gestalten Sie die <span className="italic">Zukunft</span> mit uns
          </>
        }
        intro="Werden Sie Teil unseres Teams und gestalten Sie die Zukunft des Brandschutzes und der Elektrotechnik mit. Wir legen Wert auf Fachwissen, Teamgeist und persönliche Entwicklung."
      />

      {/* Infoblöcke */}
      {/* Infoblöcke – seit der Benefits-Karte sind es vier. Deshalb `sm:grid-cols-2`
          (2×2) und erst ab `lg` eine Reihe zu viert; bei `md:grid-cols-3` wäre die
          vierte Karte allein in einer zweiten Reihe gelandet. */}
      {/* Der große Abstand nach oben gehört zur Animation – gleiche Begründung wie bei den
          Kennzahlen der Startseite. Die vier Karten leuchten einzeln nacheinander auf und
          brauchen dafür zusammen rund 400 px Scrollweg. Mit dem alten `pt-12` hing das
          Kartenraster an der Kette des Intro-Absatzes: Das Fenster war am Absatz verankert,
          nicht an den Karten, und die vierte Karte wurde erst fertig, als die Reihe schon
          knapp unter der Navbar stand (gemessen 137 px bei 96 px Navbar-Unterkante).
          Ab `lg` liegen die vier Karten nebeneinander – dort fällt das am stärksten auf,
          deshalb steigt der Abstand mit der Breite. */}
      <Section area="karriere-infobloecke" className="pt-12 sm:pt-28 lg:pt-52">
        <StaggerGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {blocks.map((b) => (
            <StaggerItem key={b.title}>
              <div className="glass glass-glow flex h-full flex-col rounded-3xl p-7">
                <b.icon strokeWidth={1.5} className="h-8 w-8 text-brand-yellow" aria-hidden />
                <h3 className="mt-5 font-heading text-2xl italic tracking-[-0.5px] text-brand-gradient">{b.title}</h3>
                {/* `gruppe` + `festeLaenge` wie bei den Kennzahlen der Startseite:
                    Ohne die Angabe erkennt die Sequenz die nebeneinanderliegenden
                    Karten als **eine** Reihe und lässt sie gemeinsam aufleuchten.
                    Mit eigener Stufe je Karte kommt erst „Unser Unternehmen", dann
                    „Ihre Entwicklung", dann „Offene Stellen", dann „Benefits".
                    Bewusst **ohne** `revealColor`: Die Karten leuchten in ihrer
                    geerbten weißen Textfarbe auf, das Gelb bleibt den Kennzahlen
                    vorbehalten.

                    `festeLaenge` ist mit 0.09 kürzer als die 0.12 der Kennzahlen –
                    das ist kein Zufall, sondern gegen die Navbar gerechnet: Die
                    Sequenz ist am **Absatz in der Karte** verankert, und der sitzt
                    hier 122 px unter der Kartenoberkante (Icon + Überschrift darüber),
                    bei den Kennzahlen nur rund 30 px. Die Karte steht beim Abschluss
                    der letzten Stufe also um diesen Betrag höher. Vier Stufen zu 0.12
                    schoben die Reihe auf einem 800 px hohen Fenster bis auf 173 px
                    hoch (Navbar endet bei 96 px) und auf flachen Laptop-Fenstern bis
                    unter die Navbar. Mit 0.09 bleibt sie frei darunter stehen.
                    Der gestaffelte Ablauf ändert sich dadurch nicht. */}
                <MagicText
                  text={b.text}
                  gruppe={`karriere-block-${b.title}`}
                  festeLaenge={0.09}
                  className="mt-2.5 font-body text-sm font-light leading-relaxed text-white/65"
                />
              </div>
            </StaggerItem>
          ))}
          {/* Einzige Karte mit Zustand (Pop-up) und darum eine Client-Insel. */}
          <StaggerItem className="h-full">
            <BenefitsKarte gruppe="karriere-block-Benefits" festeLaenge={0.09} />
          </StaggerItem>
        </StaggerGroup>
      </Section>

      {/* Bewerbungsformular */}
      <Section area="karriere-bewerbung" className="pt-0">
        <div className="grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Reveal>
              <SectionHeading
                eyebrow="Ihre Bewerbung"
                title="Ihre Karriere beginnt hier."
                intro="Nutzen Sie unser Formular, um uns Ihre vollständigen Bewerbungsunterlagen zukommen zu lassen. Wir freuen uns auf Sie!"
              />
            </Reveal>
          </div>
          <div className="lg:col-span-3">
            <Reveal delay={0.1}>
              <ApplicationForm />
            </Reveal>
          </div>
        </div>
      </Section>
    </>
  );
}
