# Paul Grunau – Brandschutz & Elektrotechnik

Unternehmenswebseite des Meisterbetriebs **Brandschutz & Elektrotechnik Paul Grunau** (Waldbröl).
Cinematic **Liquid-Glass-Design** auf tiefschwarzem Grund, überwiegend monochrom (weißer Text),
mit **Marken-Farbverlauf (Rot → Orange → Gelb)** auf den Überschriften.

---

## Tech-Stack

| Bereich | Technologie |
|---|---|
| Framework | **Next.js 16** (App Router, Turbopack) |
| Sprache | **TypeScript** + **React 19** |
| Styling | **Tailwind CSS v4** (`@theme`-Tokens, `@utility`, eigene Utilities in `app/globals.css`) |
| Animationen | **framer-motion 12** (BlurText-Hero, Reveal/Stagger, Count-up, Kundenstimmen-Marquee, Hero-Slideshow) |
| 3D / Shader | **three.js 0.160** (bewegter Lichtstrahl im Footer, WebGL-Fragment-Shader) |
| Icons | **lucide-react** + Inline-SVGs (Social, Google-G) |
| Schriften | **Instrument Serif** (italic Headlines) + **Barlow** (Body) via `next/font/google` |
| Logo | PNG `public/images/logo-neu.png` (Flamme + Blitz, Firmenfarben) · Favicon `app/icon.png` |
| Ausgabe | **Static Export** nach `out/` (`output: "export"`, `images.unoptimized`, `trailingSlash: true`) |
| Formulare | **PHP**-Handler in `public/kontakt.php` + `public/bewerbung.php` |

> Bilder liegen **lokal** als `.webp` unter `public/images/` (Hero-Slideshow `hero-haus-1/2/3`, Leistungen,
> Blog) und werden per `<img>` eingebunden (kein `next/image` wegen Static Export). Vor Release prüfen,
> ob es die finalen, echten Fotos sind.
>
> 🎨 **Das komplette Designsystem ist in [`DESIGN.md`](./DESIGN.md) festgehalten** – dort stehen alle
> verbindlichen Design-Entscheidungen (bitte vor Änderungen am Look konsultieren, um keine Schritte
> rückwärts zu machen).

---

## Entwicklung

```bash
npm install
npm run dev      # http://localhost:3000  (oder: npm run dev -- --port 3100)
```

**Windows / PowerShell:** Falls „Ausführung von Skripts ist deaktiviert" erscheint, einmalig
`Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned` ausführen – alternativ `npm.cmd run dev`.

> Hinweis: Nach Änderungen an `app/globals.css` (neue Utilities) ggf. den Dev-Server **neu starten**,
> falls Turbopack die CSS nicht sofort übernimmt.

## Build & statischer Export

```bash
npm run build    # erzeugt out/ – statisches HTML, alle Seiten vorgerendert
```

`out/` enthält die fertige Seite **inklusive** der PHP-Dateien und Bilder aus `public/`.

---

## Designsystem (Kurzüberblick)

- **Hintergrund:** reines Schwarz; Text überwiegend weiß / weiß-transparent.
- **Liquid Glass:** `.glass` / `.liquid-glass` / `.glass-strong` (`backdrop-filter`-Glas mit Gradient-Kante).
- **Überschriften-Verlauf:** `@utility text-brand-gradient` (Rot `#e11d2a` → Orange `#f26619` → Gelb `#f5b301`,
  `background-clip:text`, `width:fit-content`, damit der Verlauf über den ganzen Text läuft).
- **Hover-Akzent:** Markenorange `#f26619` (Footer-Links inkl. Mail/Telefon/Social, Hero-Telefonnummer,
  Kontakt-Karten „Direkt erreichbar").
- **Fonts:** Serif-Italic für Headlines, Barlow für Fließtext. `prefers-reduced-motion` wird durchgängig respektiert.

---

## Seiten & Aufbau

| Route | Inhalt |
|---|---|
| `/` | **Hero** (3-Bild-Slideshow, Outline-Headline „Brandschutz & Elektrotechnik" + „Meisterbetrieb Paul Grunau", Buttons „Mehr erfahren" + Telefonnummer, Hersteller-Pille) · **Unsere Philosophie** · **Kennzahlen** (zählen beim Sichtbarwerden hoch) · **Kundenstimmen** (Spalten-Marquee) |
| `/leistungen` | Hero + 3 Detailblöcke: Elektrotechnik · KNX & Smarthome · Photovoltaik |
| `/blog` + `/blog/[slug]` | Übersicht + 5 Artikel (statisch via `generateStaticParams`) |
| `/karriere` | Infoblöcke + Bewerbungsformular (→ `bewerbung.php`) |
| `/kontakt` | Team + Kontaktformular (→ `kontakt.php`) |
| `/impressum`, `/datenschutz` | Rechtstexte |
| 404 | markenkonforme Fehlerseite |

### Projektstruktur

```
app/                 Seiten (App Router), layout.tsx, globals.css, icon.png
components/
  site-navbar / site-footer (mit footer-beam WebGL-Lichtstrahl)
  home-hero / page-hero / blur-text / motion-primitives
  testimonials (Spalten-Marquee) / stat-value (Count-up)
  brand-logo / ui / legal
  form-fields / contact-form / application-form / glass-select (eigenes Glas-Dropdown)
lib/content.ts       Zentrale Inhalte (Leistungen, Blog, Team, Kennzahlen)
public/
  images/logo-neu.png  Firmenlogo
  kontakt.php / bewerbung.php  Formular-Handler (Mailversand)
```

### Besonderheiten
- **Kundenstimmen:** echte Google-Rezensionen (11 Stück) als vertikales **Spalten-Marquee**
  (versetzte Laufrichtungen, unterschiedliche Tempi, nahtlose Endlosschleife, keine Maus-Interaktion),
  plus echte Gesamtbewertung **4,6 ★ (20)**. Daten in `components/testimonials.tsx`.
- **Eigenes Glas-Dropdown** (`glass-select.tsx`) für die Formular-Selects, da native `<select>`-Popups
  nicht zuverlässig stylebar sind.
- **Footer-Lichtstrahl** (`footer-beam.tsx`): three.js-Shader, läuft nur im Viewport, reduced-motion-fest.

---

## ✅ Aktueller Stand

- Alle Seiten gebaut & verifiziert (`npm run build` → 15 Routen inkl. 5 Blog-Artikel).
- Sauberer Code: `npx tsc --noEmit --noUnusedLocals --noUnusedParameters` ohne Befund.
- Responsiv inkl. mobilem Menü; Animationen reduced-motion-fest.
- **Hintergrund der Inhaltssektionen ist bewusst reines Schwarz.** Ein experimentelles WebGL-Lichtfeld
  (Eck-Lichtschein ab „Philosophie") wurde getestet und **wieder vollständig entfernt** – Komponente,
  Einbindung und Shader-Code sind raus. Nicht erneut hinzufügen, außer es wird ausdrücklich gewünscht.
- Cinematic-Prompt-Abgleich durchgeführt (siehe [`DESIGN.md`](./DESIGN.md) → Abschnitt „Abgleich mit dem
  Cinematic-Prompt"): das **Designsystem** (Liquid Glass, Typo, Blur-In, Schwarz/Weiß) ist vollständig
  umgesetzt; bewusste Abweichungen sind dokumentiert (Bild-Slideshow statt Hintergrund-Videos,
  Marken-Farbverlauf auf Überschriften, Next.js statt CDN-React).

---

## ⚠️ Vor dem Release unbedingt erledigen

### 1. Formulare lauffähig machen — **PHP-Hosting erforderlich**
Kontakt- und Bewerbungsformular senden ein `POST` an `/kontakt.php` bzw. `/bewerbung.php`. Diese laufen
**nur auf einem Server mit PHP** (Shared Hosting wie IONOS, Strato, All-Inkl, Hetzner) – **nicht** auf
rein statischem Hosting (GitHub Pages, Netlify, Vercel-Static).
1. `out/` auf PHP-fähiges Hosting laden (die `.php`-Dateien landen automatisch im Root).
2. In **beiden** PHP-Dateien `$empfaenger = 'paul@grunau.mobi';` prüfen/anpassen.
3. E-Mail-Versand sicherstellen: entweder `mail()` ist konfiguriert **oder** (empfohlen) auf **SMTP via PHPMailer**
   umstellen, damit Mails nicht im Spam landen.
4. **Spam-Schutz** ergänzen (Honeypot oder Cloudflare Turnstile / hCaptcha).
5. Beide Formulare **end-to-end testen** (Eingang prüfen, auch der PDF-Upload bei der Bewerbung).

### 2. Inhalte / Assets finalisieren
- **Bilder prüfen/finalisieren:** Alle Bilder liegen bereits lokal als `.webp` in `public/images/`
  (Hero-Slideshow `hero-haus-1/2/3` in `components/home-hero.tsx`, Leistungen/Blog in `lib/content.ts`).
  Vor Release sicherstellen, dass es die **finalen, echten Fotos** des Betriebs sind (nicht länger nur
  Platzhalter) und die Hero-Slideshow-Bilder identisch gerahmt sind (Bau → fertig → Nacht).
- **Impressum vervollständigen** (`app/impressum/page.tsx`): `{USt-IdNr.}`, `{Registernummer}`,
  `{Aufsichtsbehörde}`, ggf. Faxnummer.
- **Social-Media-Links** (`components/site-footer.tsx`): aktuell Platzhalter
  (`facebook.com` / `instagram.com` / `linkedin.com`) → echte Profile eintragen.
- **Favicon optimieren:** `app/icon.png` ist das volle Logo (~900 KB) → kleinere Icon-Variante hinterlegen.

### 3. Rechtliches / SEO
- **Kundenstimmen:** Es sind echte Google-Rezensionen (gut!). Vor Release prüfen, ob die Darstellung
  (Namen, gekürzte Texte) so gewünscht ist; Datumsangaben sind ein Schnappschuss und altern.
- **Domain/SEO:** `metadataBase` in `app/layout.tsx` ist auf `https://grunau.mobi` gesetzt – bei
  abweichender Domain anpassen. Optional `app/sitemap.ts` + `app/robots.ts` ergänzen.

### 4. Technik / QA
- **Cross-Browser-Test**, besonders Footer-Lichtstrahl (WebGL/three.js) und `backdrop-filter`-Glas.
- **Performance:** `three.js` ist relativ groß und wird (Footer = jede Seite) seitenweit geladen.
  Bei Bedarf den Footer-Shader in reinem WebGL (ohne three) schlanker umsetzen.
- Test auf kleinem Smartphone (375 px) und mit aktivierter Bewegungsreduktion.

---

## Deployment-Kurzfassung

```bash
npm run build
# Inhalt von out/ per FTP/SFTP auf PHP-Hosting laden
# $empfaenger in kontakt.php & bewerbung.php prüfen → Formulare testen
```
