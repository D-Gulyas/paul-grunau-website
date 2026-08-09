import { asset } from "@/lib/base-path";

/**
 * Paul Grunau Firmenlogo – Flamme (Brandschutz) + Blitz (Elektrotechnik)
 * in den Firmenfarben. Verlustfreies WebP mit transparentem Hintergrund,
 * 256 px – deckt die größte Darstellung (64 px) auch auf Retina-Displays ab.
 */
export function BrandMark({ title = "Paul Grunau Logo", className }: { title?: string; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={asset("/images/logo-neu.webp")} alt={title} className={className} width={256} height={256} />
  );
}

/** Logo-Lockup: Markenzeichen + Wortmarke */
export function BrandLockup({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-2.5 text-white">
      {/* Auf dem Desktop deutlich größer (48 → 64 px), damit das Logo neben der Navbar-Pille
          nicht verloren wirkt. Auf dem Handy bleibt es klein – dort steht der Burger daneben. */}
      <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full md:h-[72px] md:w-[72px]">
        <BrandMark className="h-12 w-12 text-white md:h-16 md:w-16" />
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
