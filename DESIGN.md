# Designsystem – Paul Grunau (Brandschutz & Elektrotechnik)

Verbindliche Referenz für das **komplette Design** der Webseite. Ziel dieses Dokuments: alle
Design-Entscheidungen festhalten, damit **keine Schritte rückwärts** gemacht werden. Vor Änderungen am
Look bitte hier nachlesen. Basis ist der `Cinematic_Space_Travel_Landing_Page_Prompt.md` (eine Ebene über
dem Projekt), dessen **Designsystem** auf den Meisterbetrieb Paul Grunau übertragen wurde.

---

## 1. Grundprinzip

**Cinematic Liquid Glass auf tiefschwarzem Grund.** Reines Schwarz als Bühne, weißer/weiß-transparenter
Text, Glas-Chrome als einziges „UI-Material", filmische Blur-In-Animationen. Einziger Farbakzent: der
Marken-Farbverlauf (Rot → Orange → Gelb) auf Überschriften. Alles ruhig, hochwertig, reduziert.

---

## 2. Farbsystem

| Rolle | Wert |
|---|---|
| Hintergrund (global) | `#000000` (reines Schwarz, `body` in `globals.css`) |
| Text primär | Weiß `#fff` |
| Text sekundär | `text-white/90`, `/70`, `/65` (abgestufte Transparenz) |
| **Marken-Verlauf** (Headlines) | `linear-gradient(105deg, #e11d2a 0%, #f26619 50%, #f5b301 100%)` |
| Hover-Akzent | Markenorange `#f26619` (Footer-Links, Social, Kontaktkarten) |
| Hero-Telefonnummer Hover | Markenrot `#e11d2a` |
| Textauswahl | `rgba(255,255,255,0.22)` |
| Scrollbar-Thumb | `rgba(255,255,255,0.18)` |

- Alle Bereichs-Überschriften laufen über `@utility text-brand-gradient`: aktuell **solides Markenrot
  `#e11d2a`**, `text-transform:uppercase`, `width:fit-content` und **`font-weight:700` (fett, in beiden
  Modi – wie der Firmenname im Hero)**. Der ursprüngliche Rot→Orange→Gelb-Verlauf ist als Kommentar in
  `globals.css` archiviert (siehe `HEADINGS-COLOR-BACKUP.md`).
- **Keine** flächigen Farbverläufe im Hintergrund, kein Grün. Farbe erscheint ausschließlich als
  Text-Verlauf und als Hover-Akzent.

---

## 3. Typografie

| Token | Schrift | Einsatz |
|---|---|---|
| `--font-heading` | **Instrument Serif** | Headlines – **immer italic**, negatives Tracking |
| `--font-body` | **Barlow** | Fließtext (Weights 300–600, Default 300) |

- Headlines: `font-heading italic`, oft `tracking-[-1px]`…`[-4px]`, `leading` eng (`0.8`–`0.95`).
- Zahlen/Kennzahlen ebenfalls Instrument Serif italic.
- Body: Barlow, `font-light` als Grundgewicht, `leading-relaxed`/`leading-snug`.
- Eingebunden via `next/font/google` (`app/layout.tsx`).

---

## 4. Liquid-Glass-System (Kern des Looks)

Definiert in `app/globals.css` (`@layer utilities`). Zwei Stärken + identische Alias-Klassen:

| Klasse | Blur | Einsatz |
|---|---|---|
| `.liquid-glass` / `.glass` | `blur(4px)` | Nav-Pille, Chips, Cards, kleine Flächen |
| `.liquid-glass-strong` / `.glass-strong` | `blur(50px)` | Primär-CTA, mobiles Menü |

**Exakte Basis (Vorlage-treu):**
```css
background: rgba(255,255,255,0.01);
background-blend-mode: luminosity;
backdrop-filter: blur(4px);              /* strong: blur(50px) */
border: none;
box-shadow: inset 0 1px 1px rgba(255,255,255,0.1);   /* strong: 4px 4px 4px rgba(0,0,0,.05), inset 0 1px 1px rgba(255,255,255,.15) */
position: relative; overflow: hidden;
```
- `::before` erzeugt die **Gradient-Kante** (1.4px, `mask-composite: exclude`): heller oben/unten,
  transparent in der Mitte. Bei `-strong` kräftiger (Stops 0.5 / 0.2 / 0).
- **Hilfsklassen:** `.glass-glow` (Hover: `translateY(-4px)`), `.brand-aura`
  (`radial-gradient(60% 50% at 50% 0%, rgba(255,255,255,0.06), transparent 70%)`, global im Layout),
  `.hairline`, `.grain` (Filmkorn, global im Layout).

> ⚠️ **Wichtige Regel:** Auf Vorfahren von Glas-Elementen **kein** `filter`/`transform` setzen – das
> deaktiviert den `backdrop-filter` (Glas wird undurchsichtig). Deshalb nutzt die Navbar nur
> `opacity`/`y` für Animationen, nie `filter`. (Kommentiert in `site-navbar.tsx`.)

---

## 5. Form / Radius

- **Pills als Default:** Buttons, Chips, Nav → `rounded-full` (Vorlage: Default-Radius `9999px`).
- Cards: `rounded-3xl` bzw. `rounded-[1.25rem]`.

---

## 6. Motion-System

- **Entrance-Konvention:** `initial { filter: blur(10px), opacity: 0, y: 20 }` → sichtbar, `easeOut`
  bzw. `ease [0.22, 1, 0.36, 1]`, gestaffelte `delay`s.
- **`BlurText`** (`blur-text.tsx`): Wort-für-Wort-Blur-In der Headlines (Stagger pro Wort).
- **`Reveal` / `StaggerGroup` / `StaggerItem`** (`motion-primitives.tsx`): Scroll-Reveal & Staffelung
  (`whileInView`, `once`).
- **`app/template.tsx`** (Passthrough): erzwingt bei **jeder** Navigation einen frischen Mount des
  Seiteninhalts. Sonst verwendet React auf strukturgleichen Unterseiten (alle `PageHero` + `Section`)
  die `motion`-Instanzen wieder → Einblendungen laufen uneinheitlich. Dadurch erscheinen die Elemente
  auf allen Unterseiten bei jedem Aufruf sauber neu – wie auf der Startseite. (Navbar/Footer im Layout
  bleiben unberührt; Scroll-Reveal unterhalb des Folds bleibt erhalten.)
- **`stat-value`**: Count-up der Kennzahlen beim Sichtbarwerden.
- **`TracedIcon`** (`ui/traced-icon.tsx`): Icons „zeichnen" sich per Stroke-Animation.
- **Kundenstimmen:** vertikales Spalten-Marquee (versetzte Richtungen/Tempi, nahtlose Endlosschleife).
- **`prefers-reduced-motion`** wird **durchgängig** respektiert: global via CSS (Animationsdauern → ~0)
  und in Komponenten via `useReducedMotion()` (statische Endzustände statt Animation).

---

## 7. Hero-Video (Startseite)

Kernstück des Looks. Ein Hintergrund-Video (lokal, `public/videos/hero.mp4`), das in Dauerschleife läuft.

**Aufbau:** ein natives `<video>` in `home-hero.tsx` mit `autoPlay loop muted playsInline`
(`muted` + `playsInline` sind Pflicht, sonst blockieren Browser den Autostart), `object-cover`
über die volle Herofläche. Die Bewegung kommt allein aus dem Video – kein Motion-Wrapper, kein Timer.

**Weitere Hero-Details:**
- **Statischer schwarzer Blur-Rand:** `box-shadow: inset 0 0 110px 26px rgba(0,0,0,0.72)` – rahmt das Bild,
  Motiv bleibt scharf. (Kein Lade-/Erscheinen-Effekt – bewusst entfernt, siehe §11.)
- **Scrim für Lesbarkeit:** `bg-gradient-to-b from-black/70 via-black/45 to-black` +
  radiale Vignette `radial-gradient(80% 60% at 50% 40%, transparent, rgba(0,0,0,0.65))`.
- **Poster:** `images/hero-poster.webp` (1,7 kB) ist exakt Frame 0 des Videos → der Hero ist sofort
  gefüllt, der Wechsel auf das Video ist unsichtbar.
- **reduced-motion:** kein `autoPlay`, das Poster bleibt stehen.
- **Kodierung (wichtig beim Austausch des Videos):** H.264 CRF 26, `preset slow`, **ohne Tonspur**
  (`-an`, das Video ist stumm) und mit `-movflags +faststart`, damit die Wiedergabe startet, bevor
  die Datei komplett geladen ist. So wiegt der Clip 3,4 MB statt 23,9 MB.
- **Inhalt:** zweizeilige BlurText-Headline („Brandschutz & Elektrotechnik" größer, „Meisterbetrieb Paul
  Grunau" ~70 %). Zeile 1 ist per `as="h1"` das **einzige `<h1>` der Startseite** – nicht auf `p`
  zurückdrehen, sonst hat die Startseite keine Hauptüberschrift mehr. CTAs „Mehr erfahren" (`liquid-glass-strong` + ArrowUpRight) und Telefonnummer,
  Hersteller-Pille + Namen (KNX · Gira · Hager · SMA · Busch-Jaeger) in Serif-Italic.

---

## 8. Layout & Sektionen

- **Navbar** (`site-navbar.tsx`): fixiert `top-4`; links Logo (`BrandLockup compact`, **ohne Glas** –
  nur das Logo, kein Kreis); Mitte `liquid-glass`-Pille (`data-area="nav-links-desktop"`) mit Links
  (Leistungen · Blog · Karriere · Kontakt), **Theme-Toggle** (`theme-toggle.tsx`, Glühbirne **ohne
  Glas**, zwischen Kontakt und Anfragen) und `LiquidMetalButton` „Anfragen"; mobil Hamburger →
  `liquid-glass`-Dropdown.
  Im **Tag-Modus** ist die Links-Pille per CSS **identisch** zum Dunkel-Modus gestylt (transparentes
  Glas + helle Kante); nur der Burger behält eine helle Fläche für Lesbarkeit über dem Hero.
  **Scroll-Farbe im Tag-Modus:** Links + Glühbirne der Pille sind **weiß**, solange die Navbar über
  einem dunklen Bild-Hero liegt, und **schwarz**, sobald heller Inhalt darunter scrollt. Umschaltung
  per JS: `site-navbar.tsx` setzt `data-over-hero` (Scroll-Listener, prüft `home-hero`/`blogartikel-kopf`),
  CSS reagiert darauf. Der Burger bleibt (eigene helle Fläche) immer schwarz. Das Logo (`BrandMark`,
  h-12) ist ein farbiges WebP → von der Farbumschaltung unberührt.
- **Startseite** (`/`): Hero → **Unsere Philosophie** (2-spaltig: Text + 3 `glass`-Highlight-Cards mit
  TracedIcon) → **Kennzahlen** (4 `glass`-Cards, Count-up) → **Kundenstimmen** (Spalten-Marquee, echte
  Google-Rezensionen, 4,6 ★ (20)).
- **Weitere Seiten:** `/leistungen` (Hero + Elektrotechnik · KNX/Smarthome · Photovoltaik), `/blog` +
  `/blog/[slug]` (5 Artikel), `/karriere` (+ Bewerbungsformular), `/kontakt` (Team + Formular),
  `/impressum`, `/datenschutz`, markenkonforme 404.
- **Footer** (`site-footer.tsx`): enthält **`footer-beam.tsx`** – bewegter WebGL-Lichtstrahl (three.js
  Fragment-Shader, „Chrome look" mit minimaler RGB-Aufspaltung; läuft nur im Viewport,
  reduced-motion-fest). Eingebunden über **`footer-beam-lazy.tsx`**: three.js (~460 kB) wird erst
  gut eine Sekunde nach dem Seitenaufbau geladen, damit der Startbundle klein bleibt. **Nicht** wieder
  direkt importieren – das schiebt three.js zurück in den kritischen Ladepfad jeder Seite.

---

## 9. Komponenten-Inventar (Quelle der Wahrheit)

```
home-hero · page-hero · blur-text · motion-primitives
site-navbar · site-footer · footer-beam (WebGL) + footer-beam-lazy (Nachladen)
testimonials (Spalten-Marquee) · stat-value (Count-up)
brand-logo · ui (Section, SectionHeading, ButtonLink, cx) · ui/traced-icon
form-fields · contact-form · application-form · glass-select (eigenes Glas-Dropdown)
legal
lib/content.ts  → zentrale Inhalte (Leistungen, Blog, Team, Kennzahlen, Bildpfade)
```

---

## 10. Abgleich mit dem Cinematic-Prompt

**✅ Vollständig übernommen (Designsystem):**
- Schwarzer Grund, weißer/weiß-transparenter Text.
- Instrument Serif (italic) Headlines + Barlow Body.
- Liquid-Glass-Utilities **exakt** nach Vorlage (`.liquid-glass` / `-strong`, Gradient-Kante via `::before`).
- Pills als Default-Radius.
- Navbar: Glas-Pille mit Links + weißer Pill-CTA + ArrowUpRight.
- `BlurText` Wort-für-Wort-Blur-In; Framer-Entrance (`blur/opacity/y`, easeOut).
- Cards aus Glas mit verschachtelten Glas-Icon-Flächen + Pill-Tags.
- Partner-/Hersteller-Reihe in Serif-Italic; Kennzahlen in Serif-Italic.
- Vollhohe Sektionen.

**🔁 Bewusste Abweichungen (Marken-Anpassung, kein Fehler):**
- **Inhalt:** Brandschutz & Elektrotechnik statt Space-Travel.
- **Tech-Stack:** Next.js 16 + React 19 + Tailwind v4 statt CDN-React/Babel (echte Produktions-App).
- **Hintergrund:** Hero nutzt **ein** Loop-Video (`public/videos/hero.mp4`) statt mehrerer Clips.
  → Die `FadingVideo`-Komponente/rAF-Video-Crossfade der Vorlage ist **nicht** umgesetzt (nur ein Clip).
- **Marken-Farbverlauf** (Rot→Orange→Gelb) auf Überschriften – die Vorlage war rein monochrom
  („no gradient / all white"). Bewusster Marken-Akzent.
- **Footer-Lichtstrahl** (three.js) ergänzt (nicht in der Vorlage).
- **Hero-Badge-Chip** der Vorlage weggelassen; **Kennzahlen** als eigene Sektion statt inline im Hero.

**❌ Nicht übernommen (weil space-spezifisch):** Space-Texte, Video-URLs, Capabilities-Karteninhalte,
das Space-Icon-Set.

---

## 11. Verbindliche Entscheidungen — NICHT zurückdrehen

- **Inhaltssektionen-Hintergrund = reines Schwarz.** Ein experimentelles WebGL-**Eck-Lichtfeld**
  (ab „Philosophie") wurde getestet und **vollständig entfernt** (Komponente `home-light-field.tsx`,
  Einbindung in `page.tsx`, Shader). **Nicht erneut hinzufügen**, außer ausdrücklich gewünscht.
- **Hero ohne „Erscheinen"-Effekt:** kein Blur-/Fade-/Zoom-Einschwung beim Laden. Der Hintergrund ist
  sofort da; nur das Loop-Video selbst bewegt sich. Der schwarze Rand ist **statisch**.
- **Kein `filter`/`transform` auf Glas-Vorfahren** (sonst bricht `backdrop-filter`).
- **`prefers-reduced-motion`** bleibt in allen neuen Komponenten Pflicht.
- Bilder bleiben **lokal** unter `public/images/` (kein `next/image` wegen Static Export).
