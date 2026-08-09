"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, User, X } from "lucide-react";
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
 * Bewegung nur über Deckkraft und Verschiebung – kein `filter` auf den
 * Glasflächen, sonst bricht deren `backdrop-filter` (siehe DESIGN.md).
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

  const schliessen = () => {
    setOffen(null);
    ausloeser.current?.blur();
    ausloeser.current = null;
  };

  // Escape schließt, und der Hintergrund soll nicht mitscrollen.
  useEffect(() => {
    if (!offen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOffen(null);
      ausloeser.current?.blur();
      ausloeser.current = null;
    };
    document.addEventListener("keydown", onKey);
    const vorher = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = vorher;
    };
  }, [offen]);

  return (
    <>
      {/* Erste Ebene: die persönlichen Ansprechpartner, gleichrangig nebeneinander */}
      <StaggerGroup area="kontakt-ansprechpartner" className="mt-12 grid gap-6 md:grid-cols-2">
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
              <MagicText text={p.role} className="font-body text-sm font-normal text-white/70" />
              <MagicText text={p.bio} className="mt-3 font-body text-sm font-light leading-relaxed text-white/65" />
              {/* Im Pop-up bleibt der Text unverändert: dort ist der Seiten-Scroll
                  gesperrt, der Effekt käme nie über seinen Startzustand hinaus. */}
              {/* Gleiche Optik wie „Artikel lesen“ auf den Blog-Karten */}
              <span className="mt-6 inline-flex items-center gap-1.5 font-body text-sm font-medium text-white/85">
                Mehr erfahren
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </button>
          </StaggerItem>
        ))}
      </StaggerGroup>

      <AnimatePresence>
        {offen && (
          <motion.div
            className="fixed inset-0 z-[60] grid place-items-center px-5 py-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <button
              type="button"
              aria-label="Schließen"
              onClick={schliessen}
              className="absolute inset-0 cursor-default bg-black/75"
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={offen.name}
              className="liquid-glass-strong relative max-h-full w-full max-w-lg overflow-y-auto rounded-3xl p-7"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <button
                type="button"
                onClick={schliessen}
                aria-label="Schließen"
                className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-full text-white/70 transition-colors hover:text-[#f5b301]"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-5 pr-10">
                <Portrait person={offen} />
                <div>
                  <h3 className="font-heading text-2xl italic tracking-[-0.5px] text-brand-gradient">{offen.name}</h3>
                  <p className="font-body text-sm font-normal text-white/70">{offen.role}</p>
                </div>
              </div>

              <div className="mt-6 space-y-3 font-body text-sm font-light leading-relaxed text-white/70">
                {(offen.werdegang?.length ? offen.werdegang : [offen.bio]).map((absatz) => (
                  <p key={absatz}>{absatz}</p>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
