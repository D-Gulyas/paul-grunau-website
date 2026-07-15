"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { BrandLockup } from "@/components/brand-logo";
import { cx } from "@/components/ui";
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";

const links = [
  { href: "/leistungen", label: "Leistungen" },
  { href: "/blog", label: "Blog" },
  { href: "/karriere", label: "Karriere" },
  { href: "/kontakt", label: "Kontakt" },
];

export function SiteNavbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Menü bei Routenwechsel schließen
  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    // Kein filter/transform auf der Leiste – sonst deaktiviert CSS den backdrop-filter der Pille.
    <header data-area="nav-hauptmenue" className="fixed inset-x-0 top-4 z-50 px-5 sm:px-8 lg:px-16">
      <div className="flex items-center justify-between">
        {/* Links: nur das Logo (Firmenname entfernt) */}
        <Link href="/" aria-label="Zur Startseite">
          <BrandLockup compact />
        </Link>

        {/* Mitte (nur Desktop): liquid-glass-Pille mit Links + weißem Button */}
        <nav data-area="nav-links-desktop" className="liquid-glass hidden items-center gap-1 rounded-full p-1.5 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cx(
                "rounded-full px-3 py-2 font-body text-sm font-medium transition-colors duration-300",
                isActive(l.href) ? "bg-white/10 text-white" : "text-white/90 hover:text-white",
              )}
            >
              {l.label}
            </Link>
          ))}
          <LiquidMetalButton label="Anfragen" href="/kontakt#direkt-erreichbar" className="ml-1" />
        </nav>

        {/* Rechts: 48px-Spacer zur Balance (Desktop) / Mobile-Toggle */}
        <div className="hidden w-12 md:block" />
        <button
          type="button"
          data-area="nav-burger-button"
          aria-label={open ? "Menü schließen" : "Menü öffnen"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="liquid-glass grid h-11 w-11 place-items-center rounded-full text-white md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menü (nur opacity/y – kein filter, damit das Glas blurrt) */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            data-area="nav-menue-mobil"
            className="liquid-glass mt-3 flex flex-col gap-1 rounded-3xl p-3 md:hidden"
          >
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cx(
                  "rounded-2xl px-4 py-3 font-body text-base font-medium transition-colors",
                  isActive(l.href) ? "bg-white/10 text-white" : "text-white/80 hover:bg-white/5 hover:text-white",
                )}
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-1 flex justify-center">
              <LiquidMetalButton label="Jetzt anfragen" href="/kontakt#direkt-erreichbar" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
