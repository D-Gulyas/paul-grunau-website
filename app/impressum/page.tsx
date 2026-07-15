import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { LegalSection } from "@/components/legal";
import { Section } from "@/components/ui";

export const metadata: Metadata = {
  title: "Impressum",
  description: "Impressum des Meisterbetriebs Paul Grunau – Brandschutz & Elektrotechnik, Waldbröl.",
};

export default function ImpressumPage() {
  return (
    <>
      <PageHero area="impressum-hero" eyebrow="Rechtliches" title="Impressum" />
      <Section area="impressum-inhalt" className="max-w-3xl space-y-5 pt-12">
        <LegalSection title="Angaben gemäß § 5 TMG">
          <p>
            <strong className="text-white">Brandschutz &amp; Elektrotechnik Meisterbetrieb Paul Grunau</strong>
            <br />
            Homburger Str. 48
            <br />
            51545 Waldbröl
            <br />
            Deutschland
          </p>
        </LegalSection>

        <LegalSection title="Kontakt">
          <p>
            E-Mail:{" "}
            <a href="mailto:paul@grunau.mobi" className="text-white underline-offset-2 hover:underline">
              Paul@grunau.mobi
            </a>
            <br />
            Telefon:{" "}
            <a href="tel:+4915121069600" className="text-white underline-offset-2 hover:underline">
              +49 151 21069600
            </a>
            <br />
            Telefax: {"{Faxnummer, falls vorhanden}"}
          </p>
        </LegalSection>

        <LegalSection title="Vertreten durch">
          <p>Paul Grunau</p>
        </LegalSection>

        <LegalSection title="Registereintrag">
          <p>
            Eintragung im {"{Handelsregister/Vereinsregister}"}.<br />
            Registernummer: {"{Registernummer}"}
          </p>
        </LegalSection>

        <LegalSection title="Umsatzsteuer-ID">
          <p>
            Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:
            <br />
            {"{USt-IdNr.}"}
          </p>
        </LegalSection>

        <LegalSection title="Aufsichtsbehörde">
          <p>{"{Name der zuständigen Aufsichtsbehörde}"}</p>
        </LegalSection>

        <LegalSection title="Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV">
          <p>Paul Grunau</p>
        </LegalSection>

        <LegalSection title="Streitschlichtung">
          <p>
            Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{" "}
            <a
              href="https://ec.europa.eu/consumers/odr/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white underline-offset-2 hover:underline"
            >
              https://ec.europa.eu/consumers/odr/
            </a>
          </p>
          <p>Unsere E-Mail-Adresse finden Sie oben im Impressum.</p>
          <p>
            Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
            teilzunehmen.
          </p>
        </LegalSection>
      </Section>
    </>
  );
}
