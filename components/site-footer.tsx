import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { BrandMark } from "@/components/brand-logo";
import { FooterBeam } from "@/components/footer-beam";

const leistungen = [
  { href: "/leistungen#elektrotechnik", label: "Elektrotechnik" },
  { href: "/leistungen#knx-smarthome", label: "KNX & Smarthome" },
  { href: "/leistungen#photovoltaik", label: "Photovoltaik" },
];

const rechtliches = [
  { href: "/datenschutz", label: "Datenschutzerklärung" },
  { href: "/impressum", label: "Impressum" },
  { href: "/kontakt", label: "Kontakt" },
  { href: "/karriere", label: "Karriere" },
];

const socials = [
  {
    label: "Facebook",
    href: "https://facebook.com",
    path: "M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.52 1.49-3.91 3.78-3.91 1.1 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.9h-2.34V22c4.78-.79 8.44-4.94 8.44-9.94Z",
  },
  {
    label: "Instagram",
    href: "https://instagram.com",
    path: "M12 2c2.72 0 3.06.01 4.12.06 1.07.05 1.8.22 2.43.47.66.25 1.22.6 1.77 1.15.55.55.9 1.11 1.15 1.77.25.63.42 1.36.47 2.43.05 1.07.06 1.4.06 4.12s-.01 3.06-.06 4.12c-.05 1.07-.22 1.8-.47 2.43a4.9 4.9 0 0 1-1.15 1.77c-.55.55-1.11.9-1.77 1.15-.63.25-1.36.42-2.43.47-1.07.05-1.4.06-4.12.06s-3.06-.01-4.12-.06c-1.07-.05-1.8-.22-2.43-.47a4.9 4.9 0 0 1-1.77-1.15 4.9 4.9 0 0 1-1.15-1.77c-.25-.63-.42-1.36-.47-2.43C2.01 15.06 2 14.72 2 12s.01-3.06.06-4.12c.05-1.07.22-1.8.47-2.43.25-.66.6-1.22 1.15-1.77.55-.55 1.11-.9 1.77-1.15.63-.25 1.36-.42 2.43-.47C8.94 2.01 9.28 2 12 2Zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 8.25a3.25 3.25 0 1 1 0-6.5 3.25 3.25 0 0 1 0 6.5ZM17.5 6.75a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5Z",
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    path: "M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.8 0 0 .78 0 1.74v20.52C0 23.22.8 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.74V1.74C24 .78 23.2 0 22.22 0Z",
  },
];

export function SiteFooter() {
  return (
    <footer className="relative mt-10 overflow-hidden">
      {/* Bewegter Lichtstrahl – dezenter Hintergrund (footer_design.md) */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-70 [mask-image:linear-gradient(to_bottom,transparent,#000_10%,#000_90%,transparent)]">
        <FooterBeam />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-16 md:px-8">
        <div className="hairline" />
        <div className="mt-14 grid gap-12 md:mt-16 md:grid-cols-12">
          {/* Brand + Büro */}
          <div className="md:col-span-5">
            <Link href="/" className="flex items-center gap-2.5">
              <BrandMark className="h-9 w-9" />
              <span className="flex flex-col leading-tight">
                <span className="text-base font-semibold tracking-tight text-white">
                  Brandschutz &amp; Elektrotechnik
                </span>
                <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/45">
                  Meisterbetrieb Paul Grunau
                </span>
              </span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/50">
              Ihr Meisterbetrieb für Brandschutz und moderne Elektrotechnik in Waldbröl und Umgebung. Mit Erfahrung ans
              Ziel.
            </p>

            <ul className="mt-7 space-y-3 text-sm text-white/65">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-white/60" />
                <span>Homburger Straße 48, 51545 Waldbröl</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-white/60" />
                <a href="tel:+4915121069600" className="transition-colors hover:text-[#e11d2a]">
                  +49 151 21069600
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-white/60" />
                <a href="mailto:paul@grunau.mobi" className="transition-colors hover:text-[#e11d2a]">
                  paul@grunau.mobi
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-white/60" />
                <span>
                  Mo–Do 08:00–16:00 · Fr 08:00–14:00
                  <br />
                  <span className="text-white/40">Sa–So geschlossen</span>
                </span>
              </li>
            </ul>
          </div>

          {/* Leistungen */}
          <div className="md:col-span-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-white/40">Leistungen</h3>
            <ul className="mt-5 space-y-3 text-sm">
              {leistungen.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-white/60 transition-colors hover:text-[#e11d2a]">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Rechtliches */}
          <div className="md:col-span-2">
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-white/40">Links</h3>
            <ul className="mt-5 space-y-3 text-sm">
              {rechtliches.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-white/60 transition-colors hover:text-[#e11d2a]">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div className="md:col-span-2">
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-white/40">Social Media</h3>
            <div className="-ml-3 mt-3 flex gap-1">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="grid h-11 w-11 place-items-center rounded-full text-white/70 transition-colors hover:text-[#e11d2a]"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="hairline my-10" />

        <div className="flex flex-col items-center justify-between gap-3 text-xs text-white/40 sm:flex-row">
          <p>© {new Date().getFullYear()} Brandschutz &amp; Elektrotechnik Meisterbetrieb Paul Grunau</p>
          <p>Mit Erfahrung ans Ziel.</p>
        </div>
      </div>
    </footer>
  );
}
