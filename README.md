# 🔥 Paul Grunau – Brandschutz & Elektrotechnik

Unternehmenswebseite des Meisterbetriebs **Brandschutz & Elektrotechnik Paul Grunau** (Waldbröl) –
ein cinematisches **Liquid-Glass-Design** auf tiefschwarzem Grund, überwiegend monochrom, mit
**Marken-Farbverlauf (Rot → Orange → Gelb)** auf den Überschriften.

![Status](https://img.shields.io/badge/Status-Im%20Aufbau-orange) ![Next.js](https://img.shields.io/badge/Next.js-16-black) ![React](https://img.shields.io/badge/React-19-61dafb) ![TypeScript](https://img.shields.io/badge/TypeScript-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4-38bdf8)

> 🚧 **Hinweis:** Die Webseite befindet sich aktuell im Aufbau.

## ✨ Features

- **🪞 Liquid-Glass-Design** – cinematischer Look mit Glas-Effekten (`backdrop-filter`) und Gradient-Kanten
- **🎬 Animationen** – Blur-In-Hero, Reveal/Stagger, hochzählende Kennzahlen, Kundenstimmen-Marquee, Hero-Slideshow
- **🌟 WebGL-Footer** – bewegter Lichtstrahl (three.js-Shader), läuft nur im Viewport
- **⭐ Echte Kundenstimmen** – Google-Rezensionen als vertikales Spalten-Marquee
- **📱 Voll Responsive** – inkl. mobilem Menü, `prefers-reduced-motion` wird durchgängig respektiert
- **⚡ Static Export** – vorgerendertes HTML für schnelle Ladezeiten

## 🚀 Live Demo

🌐 **https://grunau.mobi**

## 🛠️ Tech-Stack

| Bereich | Technologie |
|---|---|
| Framework | **Next.js 16** (App Router, Turbopack) |
| Sprache | **TypeScript** + **React 19** |
| Styling | **Tailwind CSS v4** (`@theme`-Tokens, eigene Utilities) |
| Animationen | **framer-motion 12** |
| 3D / Shader | **three.js** (Footer-Lichtstrahl) |
| Icons | **lucide-react** + Inline-SVGs |
| Schriften | **Instrument Serif** (Headlines) + **Barlow** (Body) |
| Ausgabe | **Static Export** nach `out/` |
| Formulare | **PHP**-Handler (`kontakt.php`, `bewerbung.php`) |

## 📄 Seiten

| Route | Inhalt |
|---|---|
| `/` | Hero-Slideshow · Philosophie · Kennzahlen · Kundenstimmen |
| `/leistungen` | Elektrotechnik · KNX & Smarthome · Photovoltaik |
| `/blog` + `/blog/[slug]` | Übersicht + 5 Artikel |
| `/karriere` | Infoblöcke + Bewerbungsformular |
| `/kontakt` | Team + Kontaktformular |
| `/impressum`, `/datenschutz` | Rechtstexte |

## 📁 Projektstruktur

```
app/                 Seiten (App Router), layout.tsx, globals.css, icon.png
components/          Navbar, Footer, Hero, Formulare, UI-Bausteine
lib/content.ts       Zentrale Inhalte (Leistungen, Blog, Team, Kennzahlen)
public/
  images/            Bilder & Logo
  kontakt.php        Formular-Handler (Kontakt)
  bewerbung.php      Formular-Handler (Bewerbung)
```

## 💻 Entwicklung

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # erzeugt out/ – statisches HTML, alle Seiten vorgerendert
```

> 🎨 Das komplette Designsystem ist in [`DESIGN.md`](./DESIGN.md) festgehalten.
