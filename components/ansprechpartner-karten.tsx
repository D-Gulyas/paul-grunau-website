"use client";

import { useCallback, useRef, useState } from "react";
import { User } from "lucide-react";
import { Pfeil } from "@/components/ui/pfeil";
import { GlasDialog } from "@/components/ui/glas-dialog";
import { StaggerGroup, StaggerItem } from "@/components/motion-primitives";
import { MagicText } from "@/components/ui/magic-text";
import { asset } from "@/lib/base-path";
import type { Ansprechpartner } from "@/lib/content";

/**
 * Karten der persönlichen Ansprechpartner mit Pop-up.
 *
 * Solange kein `image` gesetzt ist, steht ein dezenter Platzhalter an der
 * Stelle des Porträts; sobald das Feld in `lib/content.ts` gefüllt wird,
 * erscheint das Foto ohne weitere Änderung.
 *
 * Die Hülle des Pop-ups (Overlay, Panel, Escape, Scroll-Sperre) steckt in
 * `ui/glas-dialog.tsx` und wird mit der Benefits-Karte auf der Karriereseite
 * geteilt – hier steht nur noch, was **im** Pop-up zu sehen ist.
 */

function Portrait({ person, gross = false }: { person: Ansprechpartner; gross?: boolean }) {
  const groesse = gross ? "h-24 w-24" : "h-20 w-20";
  if (person.image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={asset(person.image)}
        alt={person.name}
        className={`${groesse} shrink-0 rounded-full object-cover ring-1 ring-white/15`}
      />
    );
  }
  return (
    <span
      className={`${groesse} grid shrink-0 place-items-center rounded-full bg-white/5 ring-1 ring-white/10`}
      aria-hidden
    >
      <User strokeWidth={1.5} className="h-9 w-9 text-brand-yellow" />
    </span>
  );
}

export function AnsprechpartnerKarten({ personen }: { personen: Ansprechpartner[] }) {
  const [offen, setOffen] = useState<Ansprechpartner | null>(null);
  // Karte, über die geöffnet wurde – sie behält sonst den Fokus und der Browser
  // zeichnet nach dem Tastendruck seinen Fokusring um die Karte.
  const ausloeser = useRef<HTMLButtonElement | null>(null);

  // `useCallback`, weil der Dialog die Funktion in einer Effekt-Abhängigkeit führt.
  const schliessen = useCallback(() => {
    setOffen(null);
    ausloeser.current?.blur();
    ausloeser.current = null;
  }, []);

  return (
    <>
      {/* Erste Ebene: die persönlichen Ansprechpartner, gleichrangig nebeneinander.
          Der große Abstand nach oben gibt der Überschrift Luft, bevor die Karten
          folgen. */}
      <StaggerGroup area="kontakt-ansprechpartner" className="mt-28 grid gap-6 md:mt-32 md:grid-cols-2">
        {personen.map((p) => (
          <StaggerItem key={p.name} className="h-full">
            <button
              type="button"
              onClick={(e) => {
                ausloeser.current = e.currentTarget;
                setOffen(p);
              }}
              aria-haspopup="dialog"
              className="glass glass-glow group flex h-full w-full flex-col items-start rounded-3xl p-7 text-left"
            >
              <Portrait person={p} gross />
              <h3 className="mt-5 font-heading text-2xl italic tracking-[-0.5px] text-brand-gradient">{p.name}</h3>
              {/* Eine kurze Stufe je Karte: Sonst zieht die Kette den Textabschluss
                  so weit nach hinten, dass die Karte dabei schon halb hinter der
                  Navbar liegt. Nebeneffekt – die Karten leuchten nacheinander auf. */}
              <MagicText
                text={p.role}
                gruppe={`ansprechpartner-${p.name}`}
                festeLaenge={0.12}
                className="font-body text-sm font-normal text-white/70"
              />
              <MagicText
                text={p.bio}
                gruppe={`ansprechpartner-${p.name}`}
                festeLaenge={0.12}
                className="mt-3 font-body text-sm font-light leading-relaxed text-white/65"
              />
              {/* Im Pop-up bleibt der Text unverändert: dort ist der Seiten-Scroll
                  gesperrt, der Effekt käme nie über seinen Startzustand hinaus. */}
              {/* Gleiche Optik wie „Artikel lesen“ auf den Blog-Karten */}
              <span className="mt-6 inline-flex items-center gap-1.5 font-body text-sm font-medium text-white/85">
                Mehr erfahren
                <Pfeil />
              </span>
            </button>
          </StaggerItem>
        ))}
      </StaggerGroup>

      <GlasDialog inhalt={offen} label={(p) => p.name} onSchliessen={schliessen}>
        {(person) => (
          <>
            <div className="flex items-center gap-5 pr-10">
              <Portrait person={person} />
              <div>
                <h3 className="font-heading text-2xl italic tracking-[-0.5px] text-brand-gradient">{person.name}</h3>
                <p className="font-body text-sm font-normal text-white/70">{person.role}</p>
              </div>
            </div>

            <div className="mt-6 space-y-3 font-body text-sm font-light leading-relaxed text-white/70">
              {(person.werdegang?.length ? person.werdegang : [person.bio]).map((absatz) => (
                <p key={absatz}>{absatz}</p>
              ))}
            </div>
          </>
        )}
      </GlasDialog>
    </>
  );
}
