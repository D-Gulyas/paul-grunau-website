import { asset } from "@/lib/base-path";

/**
 * Paul Grunau Firmenlogo – Flamme (Brandschutz) + Blitz (Elektrotechnik)
 * in den Firmenfarben. Neues PNG mit transparentem Hintergrund.
 */
export function BrandMark({ title = "Paul Grunau Logo", className }: { title?: string; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={asset("/images/logo-neu.png")} alt={title} className={className} />
  );
}

/** Logo-Lockup: Markenzeichen + Wortmarke */
export function BrandLockup({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-2.5 text-white">
      <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full">
        <BrandMark className="h-12 w-12 text-white" />
      </span>
      {!compact && (
        <span className="flex flex-col leading-tight">
          <span className="font-body text-[13px] font-medium tracking-tight text-white">
            Brandschutz &amp; Elektrotechnik
          </span>
          <span className="font-body text-[10px] font-light uppercase tracking-[0.18em] text-white/50">
            Meisterbetrieb Paul Grunau
          </span>
        </span>
      )}
    </span>
  );
}
