"use client";

import { useCallback, useRef, useState } from "react";
import { Gift } from "lucide-react";
import { Pfeil } from "@/components/ui/pfeil";
import { GlasDialog } from "@/components/ui/glas-dialog";
import { MagicText } from "@/components/ui/magic-text";

/**
 * Vierte Karte der Karriereseite: „Benefits" mit Pop-up.
 *
 * Die drei Nachbarkarten sind reine Textblöcke und stehen deshalb weiterhin im
 * Server-Bauteil `app/karriere/page.tsx`. Nur diese eine Karte braucht Zustand
 * (offen/zu) – sie ist darum die einzige Client-Insel im Raster und sitzt dort
 * in einem `StaggerItem`, damit sie mit den anderen zusammen einfliegt.
 *
 * Aussehen und Verhalten sind bewusst von den Ansprechpartner-Karten der
 * Kontaktseite übernommen (gleiche Glaskarte, gleiches „Mehr erfahren" mit
 * Pfeil, gleiches Pop-up über `ui/glas-dialog.tsx`) – nur ohne Foto.
 */

const BENEFITS = [
  {
    titel: "Kalt- und Warmgetränke",
    text: "Wasser, Kaffee und Tee stehen jederzeit kostenlos bereit – im Betrieb wie auf der Baustelle.",
  },
  {
    titel: "Täglich frisches Obst",
    text: "Jeden Tag frisches Obst für alle im Team. Kleine Sache, großer Unterschied an langen Tagen.",
  },
  {
    titel: "Firmenfahrzeug",
    text: "Für die Arbeit im Außendienst stellen wir ein gepflegtes Fahrzeug samt Ausstattung.",
  },
  {
    titel: "Flexible Arbeitszeiten",
    text: "Wir stimmen die Zeiten gemeinsam ab, damit Termine beim Kunden und das Privatleben zusammenpassen.",
  },
];

/** Der Dialog zeigt immer denselben Inhalt – der Zustand ist nur „offen" oder „zu". */
const BENEFITS_DIALOG = { titel: "Benefits" };

export function BenefitsKarte({
  /** Eigene Stufe der Magic-Text-Sequenz, damit die Karte nach den drei
      Nachbarkarten aufleuchtet statt gemeinsam mit ihnen (siehe karriere/page.tsx). */
  gruppe,
  festeLaenge,
}: {
  gruppe?: string;
  festeLaenge?: number;
}) {
  const [offen, setOffen] = useState<typeof BENEFITS_DIALOG | null>(null);
  // Karte, über die geöffnet wurde – sie behält sonst den Fokus und der Browser
  // zeichnet nach dem Tastendruck seinen Fokusring um die Karte.
  const ausloeser = useRef<HTMLButtonElement | null>(null);

  const schliessen = useCallback(() => {
    setOffen(null);
    ausloeser.current?.blur();
    ausloeser.current = null;
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          ausloeser.current = e.currentTarget;
          setOffen(BENEFITS_DIALOG);
        }}
        aria-haspopup="dialog"
        data-area="karriere-benefits"
        className="glass glass-glow group flex h-full w-full flex-col items-start rounded-3xl p-7 text-left"
      >
        <Gift strokeWidth={1.5} className="h-8 w-8 text-brand-yellow" aria-hidden />
        <h3 className="mt-5 font-heading text-2xl italic tracking-[-0.5px] text-brand-gradient">Benefits</h3>
        <MagicText
          text="Gute Arbeit verdient ein gutes Umfeld. Vom Firmenfahrzeug bis zur flexiblen Zeiteinteilung – bei uns stimmt auch das, was neben der Baustelle zählt."
          gruppe={gruppe}
          festeLaenge={festeLaenge}
          className="mt-2.5 font-body text-sm font-light leading-relaxed text-white/65"
        />
        {/* `mt-auto` hält das „Mehr erfahren" am unteren Kartenrand, auch wenn die
            Nachbarkarten längere Texte haben und das Raster die Höhe angleicht. */}
        <span className="mt-auto inline-flex items-center gap-1.5 pt-6 font-body text-sm font-medium text-white/85">
          Mehr erfahren
          <Pfeil />
        </span>
      </button>

      <GlasDialog inhalt={offen} label={(b) => b.titel} onSchliessen={schliessen}>
        {(b) => (
          <>
            {/* Das Icon steht frei – wie auf der Karte selbst. Ein Kreis mit
                Fläche dahinter wäre hier ein Foto-Platzhalter, und ein Foto gibt
                es zu den Benefits nicht (anders als bei den Ansprechpartnern). */}
            <div className="flex items-center gap-4 pr-10">
              <Gift strokeWidth={1.5} className="h-9 w-9 shrink-0 text-brand-yellow" aria-hidden />
              <div>
                <h3 className="font-heading text-2xl italic tracking-[-0.5px] text-brand-gradient">{b.titel}</h3>
                <p className="font-body text-sm font-normal text-white/70">Was wir unserem Team mitgeben</p>
              </div>
            </div>

            {/* Bewusst ohne MagicText: im Pop-up ist der Seiten-Scroll gesperrt,
                der Effekt käme nie über seinen Startzustand hinaus. */}
            <ul className="mt-6 space-y-4">
              {BENEFITS.map((v) => (
                <li key={v.titel} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white" />
                  <div>
                    <p className="font-body text-sm font-medium text-white/90">{v.titel}</p>
                    <p className="font-body text-sm font-light leading-relaxed text-white/70">{v.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </GlasDialog>
    </>
  );
}
