import type { Metadata } from "next";
import { Building2, GraduationCap, Briefcase } from "lucide-react";
import { TracedIcon } from "@/components/ui/traced-icon";
import { PageHero } from "@/components/page-hero";
import { ApplicationForm } from "@/components/application-form";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/motion-primitives";
import { Section, SectionHeading } from "@/components/ui";

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
        eyebrow="Karriere bei Paul Grunau"
        title={
          <>
            Gestalten Sie die <span className="italic">Zukunft</span> mit uns
          </>
        }
        intro="Werden Sie Teil unseres Teams und gestalten Sie die Zukunft des Brandschutzes und der Elektrotechnik mit. Wir legen Wert auf Fachwissen, Teamgeist und persönliche Entwicklung."
      />

      {/* Infoblöcke */}
      <Section className="pt-12">
        <StaggerGroup className="grid gap-6 md:grid-cols-3">
          {blocks.map((b, i) => (
            <StaggerItem key={b.title}>
              <div className="glass glass-glow flex h-full flex-col rounded-3xl p-7">
                <TracedIcon className="h-8 w-8 text-white" delay={i * 0.4}>
                  <b.icon strokeWidth={1.5} />
                </TracedIcon>
                <h3 className="mt-5 font-heading text-2xl italic tracking-[-0.5px] text-brand-gradient">{b.title}</h3>
                <p className="mt-2.5 font-body text-sm font-light leading-relaxed text-white/65">{b.text}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </Section>

      {/* Bewerbungsformular */}
      <Section className="pt-0">
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
