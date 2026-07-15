import type { Metadata } from "next";
import { Barlow, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { SiteNavbar } from "@/components/site-navbar";
import { SiteFooter } from "@/components/site-footer";

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-barlow",
  display: "swap",
});

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://grunau.mobi"),
  title: {
    default: "Paul Grunau – Brandschutz & Elektrotechnik | Meisterbetrieb Waldbröl",
    template: "%s | Paul Grunau Meisterbetrieb",
  },
  description:
    "Meisterbetrieb für Brandschutz & Elektrotechnik in Waldbröl und Umgebung. Elektroinstallation, KNX & Smarthome, Photovoltaik – mit Erfahrung ans Ziel.",
  keywords: [
    "Brandschutz",
    "Elektrotechnik",
    "Elektriker Waldbröl",
    "KNX",
    "Smarthome",
    "Photovoltaik",
    "Meisterbetrieb",
  ],
  openGraph: {
    title: "Paul Grunau – Brandschutz & Elektrotechnik",
    description: "Meisterbetrieb für Brandschutz & Elektrotechnik in Waldbröl. Mit Erfahrung ans Ziel.",
    locale: "de_DE",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" data-scroll-behavior="smooth" className={`${barlow.variable} ${instrument.variable}`}>
      <body className="relative min-h-dvh antialiased">
        {/* Ambient brand aura + Filmkorn über die ganze Seite */}
        <div className="pointer-events-none fixed inset-0 -z-10 brand-aura" aria-hidden />
        <div className="pointer-events-none fixed inset-0 -z-10 opacity-60 grain" aria-hidden />

        <SiteNavbar />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
