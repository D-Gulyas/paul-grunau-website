import Link from "next/link";
import { BrandMark } from "@/components/brand-logo";
import { ButtonLink } from "@/components/ui";

export default function NotFound() {
  return (
    <section className="grid min-h-dvh place-items-center px-5">
      <div className="text-center">
        <BrandMark className="mx-auto h-16 w-16 text-white" />
        <p className="mt-8 font-heading text-8xl italic tracking-[-2px] text-white">404</p>
        <h1 className="mx-auto mt-4 font-heading text-3xl italic tracking-[-1px] text-brand-gradient">Seite nicht gefunden</h1>
        <p className="mx-auto mt-3 max-w-md font-body font-light text-white/65">
          Die gewünschte Seite existiert nicht oder wurde verschoben. Kehren Sie zur Startseite zurück.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <ButtonLink href="/">Zur Startseite</ButtonLink>
          <Link
            href="/kontakt"
            className="inline-flex items-center rounded-pill border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-white/30"
          >
            Kontakt
          </Link>
        </div>
      </div>
    </section>
  );
}
