import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { LegalSection } from "@/components/legal";
import { Section } from "@/components/ui";

export const metadata: Metadata = {
  title: "Datenschutzerklärung",
  description: "Datenschutzerklärung des Meisterbetriebs Paul Grunau – Brandschutz & Elektrotechnik, Waldbröl.",
};

export default function DatenschutzPage() {
  return (
    <>
      <PageHero
        eyebrow="Rechtliches · Stand Juli 2025"
        title="Datenschutzerklärung"
        intro="Der Schutz Ihrer persönlichen Daten ist uns ein wichtiges Anliegen. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend den gesetzlichen Vorschriften (DSGVO, BDSG)."
        area="datenschutz-hero"
      />
      <Section area="datenschutz-inhalt" className="max-w-3xl space-y-5 pt-12">
        <LegalSection title="1. Verantwortliche Stelle">
          <p>
            Verantwortlicher im Sinne der DSGVO ist:
            <br />
            <strong className="text-white">Paul Grunau Brandschutz und Elektrotechnik</strong>
            <br />
            Homburger Str. 48, 51545 Waldbröl
            <br />
            E-Mail: paul@grunau.mobi · Telefon: +49 151 21069600
          </p>
        </LegalSection>

        <LegalSection title="2. Arten der verarbeiteten Daten">
          <p>
            Wir verarbeiten personenbezogene Daten, die Sie uns aktiv mitteilen oder die bei der Nutzung unserer Website
            automatisch erhoben werden.
          </p>
          <p className="font-medium text-white/85">a) Bestandsdaten (von Ihnen bereitgestellt):</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Name</li>
            <li>E-Mail-Adresse</li>
            <li>Telefonnummer (optional)</li>
            <li>Betreff der Nachricht</li>
            <li>Inhalt Ihrer Nachricht</li>
          </ul>
          <p className="font-medium text-white/85">b) Nutzungsdaten (automatisch erhoben):</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>IP-Adresse</li>
            <li>Datum und Uhrzeit des Zugriffs</li>
            <li>Name und URL der abgerufenen Datei</li>
            <li>Referrer-URL</li>
            <li>Verwendeter Browser und ggf. Betriebssystem</li>
            <li>Name Ihres Access-Providers</li>
          </ul>
        </LegalSection>

        <LegalSection title="3. Zwecke der Datenverarbeitung">
          <p>
            <strong className="text-white">Kontaktaufnahme und Bearbeitung Ihrer Anfragen:</strong> Beantwortung Ihrer
            Anfragen über das Kontaktformular oder per E-Mail. Rechtsgrundlage: Art. 6 Abs. 1 lit. b bzw. lit. f DSGVO.
          </p>
          <p>
            <strong className="text-white">Bereitstellung und Optimierung der Website:</strong> Gewährleistung eines
            reibungslosen Verbindungsaufbaus, Systemsicherheit und administrative Zwecke. Rechtsgrundlage: Art. 6 Abs. 1
            lit. f DSGVO.
          </p>
          <p>
            <strong className="text-white">Erfüllung rechtlicher Pflichten:</strong> Einhaltung gesetzlicher
            Aufbewahrungsfristen. Rechtsgrundlage: Art. 6 Abs. 1 lit. c DSGVO.
          </p>
        </LegalSection>

        <LegalSection title="4. Weitergabe von Daten an Dritte">
          <p>
            Grundsätzlich geben wir Ihre personenbezogenen Daten nicht an Dritte weiter, es sei denn, Sie haben
            eingewilligt (lit. a), es ist zur Vertragsabwicklung erforderlich (lit. b), es besteht eine gesetzliche
            Verpflichtung (lit. c) oder es ist zur Geltendmachung von Rechtsansprüchen erforderlich (lit. f). Eingesetzte
            Auftragsverarbeiter sind streng an unsere Weisungen gebunden.
          </p>
        </LegalSection>

        <LegalSection title="5. Ihre Rechte als betroffene Person">
          <ul className="list-disc space-y-1 pl-5">
            <li>Recht auf Auskunft (Art. 15 DSGVO)</li>
            <li>Recht auf Berichtigung (Art. 16 DSGVO)</li>
            <li>Recht auf Löschung (Art. 17 DSGVO)</li>
            <li>Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
            <li>Recht auf Datenübertragbarkeit (Art. 20 DSGVO)</li>
            <li>Recht auf Widerspruch (Art. 21 DSGVO)</li>
            <li>Recht auf Widerruf der Einwilligung (Art. 7 Abs. 3 DSGVO)</li>
            <li>Recht auf Beschwerde bei einer Aufsichtsbehörde (Art. 77 DSGVO)</li>
          </ul>
        </LegalSection>

        <LegalSection title="6. Datensicherheit">
          <p>
            Wir setzen technische und organisatorische Sicherheitsmaßnahmen ein, um Ihre Daten gegen Manipulation,
            Verlust, Zerstörung oder unberechtigten Zugriff zu schützen. Wir verwenden eine SSL-/TLS-Verschlüsselung
            (erkennbar an „https://" in der Adresszeile).
          </p>
        </LegalSection>

        <LegalSection title="7. Speicherdauer der personenbezogenen Daten">
          <p>
            Wir speichern Ihre Daten nur so lange, wie dies für die Erfüllung des jeweiligen Zwecks erforderlich ist oder
            gesetzliche Aufbewahrungspflichten dies vorsehen. Danach werden die Daten routinemäßig gelöscht.
          </p>
        </LegalSection>

        <LegalSection title="8. Änderungen dieser Datenschutzerklärung">
          <p>
            Wir behalten uns vor, diese Datenschutzerklärung anzupassen, um sie stets den aktuellen rechtlichen
            Anforderungen anzupassen. Für Ihren erneuten Besuch gilt dann die neue Datenschutzerklärung.
          </p>
          <p className="text-white/45">Stand: Juli 2025</p>
        </LegalSection>
      </Section>
    </>
  );
}
