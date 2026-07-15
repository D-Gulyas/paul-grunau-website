import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone, User } from "lucide-react";
import { TracedIcon } from "@/components/ui/traced-icon";
import { PageHero } from "@/components/page-hero";
import { ContactForm } from "@/components/contact-form";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/motion-primitives";
import { Section, SectionHeading } from "@/components/ui";
import { team } from "@/lib/content";

export const metadata: Metadata = {
  title: "Kontakt",
  description:
    "Kontaktieren Sie den Meisterbetrieb Paul Grunau in Waldbröl – ob Brandschutzlösung, Elektroinstallation oder Wartung. Wir sind für Sie da.",
};

const contactInfo = [
  { icon: MapPin, label: "Adresse", value: "Homburger Straße 48\n51545 Waldbröl", href: undefined },
  { icon: Phone, label: "Telefon", value: "+49 151 21069600", href: "tel:+4915121069600" },
  { icon: Mail, label: "E-Mail", value: "paul@grunau.mobi", href: "mailto:paul@grunau.mobi" },
  { icon: Clock, label: "Öffnungszeiten", value: "Mo–Do 08:00–16:00\nFr 08:00–14:00", href: undefined },
];

export default function KontaktPage() {
  return (
    <>
      <PageHero
        area="kontakt-hero"
        eyebrow="Kontakt"
        title={
          <>
            Haben Sie Fragen? <span className="italic">Sprechen</span> wir darüber.
          </>
        }
        intro="Egal, ob Sie eine Brandschutzlösung benötigen, eine Elektroinstallation planen oder eine Wartung anfragen möchten – wir sind für Sie da."
      />

      {/* Team */}
      <Section area="kontakt-team" className="pt-12">
        <Reveal>
          <SectionHeading eyebrow="Ihre Ansprechpartner" title="Persönlicher Kontakt steht bei uns im Mittelpunkt" />
        </Reveal>
        <StaggerGroup className="mt-12 grid gap-6 md:grid-cols-3">
          {team.map((m, i) => (
            <StaggerItem key={m.name}>
              <div className="glass glass-glow flex h-full flex-col rounded-3xl p-7">
                <TracedIcon className="h-9 w-9 text-white" delay={i * 0.4}>
                  <User strokeWidth={1.5} />
                </TracedIcon>
                <h3 className="mt-5 font-heading text-2xl italic tracking-[-0.5px] text-brand-gradient">{m.name}</h3>
                <p className="font-body text-sm font-normal text-white/70">{m.role}</p>
                <p className="mt-3 font-body text-sm font-light leading-relaxed text-white/65">{m.bio}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </Section>

      {/* Kontaktinfos + Formular */}
      <Section id="direkt-erreichbar" area="kontakt-direkt-erreichbar" className="pt-0">
        <div className="grid gap-8 lg:grid-cols-5">
          {/* Infos */}
          <div data-area="kontakt-infos" className="lg:col-span-2">
            <Reveal>
              <h2 className="font-heading text-3xl italic tracking-[-1px] text-brand-gradient">Direkt erreichbar</h2>
              <p className="mt-3 font-body text-sm font-light leading-relaxed text-white/65">
                Wir legen Wert auf direkte, unkomplizierte Kommunikation. Rufen Sie uns an oder schreiben Sie uns – wir
                beraten Sie gerne persönlich.
              </p>
            </Reveal>
            <StaggerGroup className="mt-7 space-y-3">
              {contactInfo.map((c, i) => (
                <StaggerItem key={c.label}>
                  <div className="glass group flex items-start gap-4 rounded-2xl p-4">
                    <TracedIcon className="mt-0.5 h-6 w-6 shrink-0 text-white" delay={i * 0.3}>
                      <c.icon strokeWidth={1.5} />
                    </TracedIcon>
                    <div>
                      <div className="font-body text-xs font-medium uppercase tracking-wider text-white/50">
                        {c.label}
                      </div>
                      {c.href ? (
                        <a
                          href={c.href}
                          className="font-body text-sm text-white transition-colors group-hover:text-[#e11d2a]"
                        >
                          {c.value}
                        </a>
                      ) : (
                        <div className="whitespace-pre-line font-body text-sm font-light text-white/80 transition-colors group-hover:text-[#e11d2a]">
                          {c.value}
                        </div>
                      )}
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>

          {/* Formular */}
          <div className="lg:col-span-3">
            <Reveal delay={0.1}>
              <ContactForm />
            </Reveal>
          </div>
        </div>
      </Section>
    </>
  );
}
