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
- **`.no-glass-edge`** schaltet genau diese `::before`-Kante ab (`display:none`) – für Elemente ohne
  zusätzlichen Glasrand (Theme-Toggle, Logo-Kreis).
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
- **`Reveal` / `StaggerGroup` / `StaggerItem`** (`motion-primitives.tsx`): Scroll-Reveal & Staffelung.
- **`stat-value`**: Count-up der Kennzahlen beim Sichtbarwerden.
- **`TracedIcon`** (`ui/traced-icon.tsx`): Icons „zeichnen" sich per Stroke-Animation.
- **Kundenstimmen:** vertikales Spalten-Marquee (versetzte Richtungen/Tempi, nahtlose Endlosschleife).
- **`prefers-reduced-motion`** wird **durchgängig** respektiert: global via CSS (Animationsdauern → ~0)
  und in Komponenten via `useReducedMotion()` (statische Endzustände statt Animation).

---

## 7. Hero-Slideshow (Startseite)

Kernstück des Looks. Drei identisch gerahmte Aufnahmen desselben Hauses (lokal, `public/images/`):

- `hero-haus-1.webp` – Rohbau mit Gerüst (Abendsonne)
- `hero-haus-2.webp` – fertige PV-Anlage, Tag
- `hero-haus-3.webp` – dasselbe Haus bei Nacht mit Licht

**Aufbau (Schichten, unten → oben):**
1. Basis-`<img>` haus_1.
2. **Reset-Wrapper** mit `resetMask` – enthält:
   - Ebene mit `fertigMask` → haus_2,
   - Ebene mit `nachtOpacity` → haus_3.

**Zwei diagonale Masken** (`FEATHER = 14` weiche Kante):
- `fertigMask`: `linear-gradient(to top right …)` – baut haus_1 → haus_2 auf (Front läuft von unten-links
  zur Abendsonne oben-rechts; Gerüst verschwindet, Module wachsen).
- `resetMask`: `linear-gradient(to bottom left …)` – wischt Tag+Nacht von oben-rechts nach unten-links
  weg und legt haus_1 wieder frei.

**Loop-Timeline** (in `home-hero.tsx`):
| # | Aktion | Dauer |
|---|---|---|
| 0 | haus_1 halten | 1,4 s |
| 1 | Bau haus_1 → haus_2 (diagonal, bewusst gemächlich) | 8 s |
| 2 | fertiges Tagbild halten | 3 s |
| 3 | Tag → Nacht (haus_3 blendet weich auf) | 4 s |
| 4 | Nachtbild halten | 3,2 s |
| 5 | Diagonaler Reset (Tag+Nacht weg, haus_1 erscheint) | 6 s |
| 6 | unsichtbar zurücksetzen, Loop neu | 0,5 s |

**Weitere Hero-Details:**
- **Ken-Burns:** langsamer Zoom `scale [1 → 1.06]`, 16 s, `mirror`-Loop.
- **Statischer schwarzer Blur-Rand:** `box-shadow: inset 0 0 110px 26px rgba(0,0,0,0.72)` – rahmt das Bild,
  Motiv bleibt scharf. (Kein Lade-/Erscheinen-Effekt – bewusst entfernt, siehe §11.)
- **Scrim für Lesbarkeit:** `bg-gradient-to-b from-black/70 via-black/45 to-black` +
  radiale Vignette `radial-gradient(80% 60% at 50% 40%, transparent, rgba(0,0,0,0.65))`.
- **reduced-motion:** Front direkt auf `100` (statisches fertiges Tagbild), keine Loop-Animation.
- **Inhalt:** zweizeilige BlurText-Headline („Brandschutz & Elektrotechnik" größer, „Meisterbetrieb Paul
  Grunau" ~70 %), CTAs „Mehr erfahren" (`liquid-glass-strong` + ArrowUpRight) und Telefonnummer,
  Hersteller-Pille + Namen (KNX · Gira · Hager · SMA · Busch-Jaeger) in Serif-Italic.

---

## 8. Layout & Sektionen

- **Navbar** (`site-navbar.tsx`): fixiert `top-4`; links Logo (`BrandLockup compact`, Kreis mit
  `no-glass-edge`); Mitte `liquid-glass`-Pille (`data-area="nav-links-desktop"`) mit Links
  (Leistungen · Blog · Karriere · Kontakt), **Theme-Toggle** (`theme-toggle.tsx`, Glühbirne, zwischen
  Kontakt und Anfragen) und `LiquidMetalButton` „Anfragen"; mobil Hamburger → `liquid-glass`-Dropdown.
  Im **Tag-Modus** ist die Links-Pille per CSS **identisch** zum Dunkel-Modus gestylt (transparentes
  Glas + helle Kante); nur der Burger behält eine helle Fläche für Lesbarkeit über dem Hero.
- **Startseite** (`/`): Hero → **Unsere Philosophie** (2-spaltig: Text + 3 `glass`-Highlight-Cards mit
  TracedIcon) → **Kennzahlen** (4 `glass`-Cards, Count-up) → **Kundenstimmen** (Spalten-Marquee, echte
  Google-Rezensionen, 4,6 ★ (20)).
- **Weitere Seiten:** `/leistungen` (Hero + Elektrotechnik · KNX/Smarthome · Photovoltaik), `/blog` +
  `/blog/[slug]` (5 Artikel), `/karriere` (+ Bewerbungsformular), `/kontakt` (Team + Formular),
  `/impressum`, `/datenschutz`, markenkonforme 404.
- **Footer** (`site-footer.tsx`): enthält **`footer-beam.tsx`** – bewegter WebGL-Lichtstrahl (three.js
  Fragment-Shader, „Chrome look" mit minimaler RGB-Aufspaltung; läuft nur im Viewport,
  reduced-motion-fest).

---

## 9. Komponenten-Inventar (Quelle der Wahrheit)

```
home-hero · page-hero · blur-text · motion-primitives
site-navbar · site-footer · footer-beam (WebGL)
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
- **Hintergrund:** Hero nutzt eine **3-Bild-Slideshow** (Bau → fertig → Nacht) statt Loop-Videos.
  → Die `FadingVideo`-Komponente/rAF-Video-Crossfade der Vorlage ist **nicht** umgesetzt (keine Videos).
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
  sofort da; nur Ken-Burns + Slideshow-Loop bewegen sich. Der schwarze Rand ist **statisch**.
- **Kein `filter`/`transform` auf Glas-Vorfahren** (sonst bricht `backdrop-filter`).
- **`prefers-reduced-motion`** bleibt in allen neuen Komponenten Pflicht.
- Bilder bleiben **lokal** unter `public/images/` (kein `next/image` wegen Static Export).
