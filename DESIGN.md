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
| **Marken-Verlauf** (Headlines) | `linear-gradient(170deg, #e11d2a 8%, #f26619 46%, #f5b301 84%)` |
| Hover-Akzent | Markenorange `#f26619` (Footer-Links, Social, Kontaktkarten) |
| Hero-Telefonnummer Hover | Markenrot `#e11d2a` |
| Textauswahl | `rgba(255,255,255,0.22)` |
| Scrollbar-Thumb | `rgba(255,255,255,0.18)` |

- Alle Bereichs-Überschriften laufen über `@utility text-brand-gradient`: **Marken-Verlauf
  rot → orange → gelb wie im Logo**, `text-transform:uppercase`, `width:fit-content` und
  **`font-weight:700` (fett, in beiden Modi – wie der Firmenname im Hero)**.
  - Der Verlauf läuft **fast senkrecht** (`170deg`), nicht quer. Grund: `width:fit-content` liefert
    bei umbrechendem Text die **ungebrochene** Breite (Seiten-Überschrift: 896 px Box gegenüber
    364 px längster Zeile) – quer bliebe die Überschrift fast ganz rot. Die Box**höhe** passt
    dagegen immer zum gesetzten Text.
  - `padding-inline: 0.2em` + ausgleichendes negatives Margin: kursive Glyphen ragen bis 0,167 em
    seitlich über die Box, und `background-clip: text` färbt nur innerhalb der Box. Genau daran
    scheiterte der Verlauf beim ersten Anlauf. **Folge:** an einer Überschrift **kein** `mx-auto` /
    `ml-*` / `mr-*` – das überschreibt die Kompensation; zentriert wird über den Elternteil.
  - **Ausnahme Hero-Headline:** die steht solide rot (`text-[#e11d2a]` an beiden `BlurText` in
    `home-hero.tsx`). Ein Verlauf verträgt sich dort nicht mit dem Wort-für-Wort-Blur – am
    Elternteil geclippt wäre sie unsichtbar, wortweise wandert der Verlauf während der
    Einblendung durch die Buchstaben. Ausführlich in `HEADINGS-COLOR-BACKUP.md`;
    **nicht erneut versuchen**, ohne das gelöst zu haben.
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
- **`ui/cascade-text` (`TextReveal`)**: Zeichen-Kaskade **beim Hover** – jedes Zeichen rollt versetzt
  nach oben (Zweitzeichen per `text-shadow`), gleichzeitig Farbwechsel auf `hoverColor`.
  Genutzt für die Kennzahlen (`hoverColor="#f5b301"`). Ein früheres Count-up gibt es **nicht** mehr.
- **Icons:** lucide-Icons sind **statisch** (keine Animation). Gelb (`text-brand-yellow` = `#f5b301`,
  11,33:1 auf Schwarz) sind **nur die Inhalts-Icons**, per Klasse am Icon gesetzt:
  Philosophie-Karten, Leistungs-Blöcke, Team-Karten und Kontaktdaten – dazu die Bewertungssterne, die
  denselben Ton schon immer hatten. **Alle übrigen Icons bleiben weiß**: Burger-Menü, Footer-Kontakt,
  Button-Pfeile, Blog-Uhren, Formular-Haken. Bewusste Entscheidung – flächendeckendes Gelb wurde
  getestet und wieder verworfen. **Keine globale `svg.lucide`-Regel einführen**, sie würde genau das
  wiederherstellen.
  - Die frühere `TracedIcon`-Komponente (wandernder Licht-Sweep über die Kontur) wurde **entfernt** – sie
    lief pro Icon als Endlos-Animation mit zwei `drop-shadow`-Filtern und machte auf dem Handy Probleme.
    **Nicht wieder einführen.**
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
  Hersteller-Pille + **Logo-Loop** (siehe unten).
- **Hersteller-Loop** (`home-hero-partner`): `ui/logo-loop.jsx` + `ui/logo-loop.css` – Aufbau nach der
  Vorlage „LogoLoop" (React Bits, Variante **JavaScript + CSS**) aus `Hersteller/logo_loop.md`,
  die Bewegung selbst aber über **framer-motion** statt über eine eigene `requestAnimationFrame`-
  Schleife (siehe unten). Die Logos laufen endlos von **rechts nach links**, an beiden Rändern
  weichgezeichnet (`fadeOut`, `fadeOutColor="#000000"`). Der Track misst sich per `ResizeObserver`
  selbst und legt so viele Kopien der Liste an, wie die Containerbreite braucht – dadurch keine Lücke
  beim Umlauf. Container `max-w-3xl`, `logoHeight={32}`, `gap={56}` → **fünf Logos gleichzeitig**
  sichtbar (Desktop), drei auf dem Handy.
  - **Alle Logos einheitlich weiß, kein Hintergrund-Streifen.** Umgesetzt über eine **CSS-Maske**
    (`.logoloop__logo`): die Farbe kommt aus `background-color`, das `<img>` darunter ist unsichtbar
    und liefert nur die Breite. Grund: ein CSS-`filter` kann das Marken-Gelb nicht exakt treffen.
  - **Antrieb über framer-motion, nicht über eigenes rAF.** Zwei MotionValues: `x` (Versatz des
    Tracks, gerendert vom `motion.div`) und `tempo` (px/s). `useAnimationFrame` schreibt `x` pro
    Frame fort – dieselbe Frame-Schleife wie alle anderen Animationen der Seite. Reduzierte
    Bewegung läuft über `useReducedMotion()` (die CSS-Regel bleibt als Absicherung fürs erste Bild).
  - **Hover auf einem Logo:** Der Lauf bremst weich auf `hoverSpeed={0}` ab – `animate()` blendet
    `tempo` in 0,5 s über, statt hart zu stoppen. Das Logo zoomt auf `scale(1.12)` und wechselt auf
    `#f5b301`. Beim Verlassen läuft alles genauso weich wieder an. **Genau dafür** der MotionValue
    und kein Keyframe-Lauf mit `repeat: Infinity` (wie bei den Kundenstimmen) – ein Keyframe-Lauf
    ließe sich nur anhalten, nicht abbremsen.
  - **Einlauf nach dem Laden:** `x` startet bei `+containerWidth`, der Track steht also rechts
    außerhalb; die Logos laufen von rechts herein, beginnend mit **Schneider Merten** (erster Eintrag
    im `partners`-Array). Erst nach dem Einlauf greift der Modulo-Umlauf – gemessen springt `x` dann
    um exakt eine Sequenzbreite, der Umschlag ist deshalb unsichtbar.
  - **Kein `loading="lazy"`** an den Logo-Bildern: sie starten außerhalb des Sichtfelds, lazy würde
    das Laden verhindern – ohne geladenes SVG gibt es keine Breite und die Schleife liefe nicht an.
  - **Reihenfolge = Array-Reihenfolge.** Schneider Merten steht bewusst an erster Stelle.
  - **Neuer Hersteller:** SVG nach `public/logos/` (Kleinbuchstaben) und eine Zeile im
    `partners`-Array in `home-hero.tsx`. Ist das Logo schwarz, zusätzlich `className: INVERT`.
  - Die Props sind in `logo-loop.d.ts` typisiert, weil die Komponente bewusst JavaScript bleibt.

---

## 8. Layout & Sektionen

- **Navbar** (`site-navbar.tsx`): fixiert `top-4`; links Logo (`BrandLockup compact`, **ohne Glas** –
  nur das Logo, kein Kreis); Mitte `liquid-glass`-Pille (`data-area="nav-links-desktop"`) mit Links
  (Leistungen · Blog · Karriere · Kontakt) und `LiquidMetalButton` „Anfragen"; mobil Hamburger →
  `liquid-glass`-Dropdown. Das Logo (`BrandMark`, h-12) ist ein farbiges WebP.
- **Startseite** (`/`): Hero → **Unsere Philosophie** (2-spaltig: Text + 3 `glass`-Highlight-Cards mit
  gelben lucide-Icons) → **Kennzahlen** (4 `glass`-Cards; Zahlen **fett**, Hover-Farbe
  Marken-Gelb) → **Kundenstimmen** (Spalten-Marquee, echte Google-Rezensionen, 4,6 ★ (20)) →
  **`kundenstimmen-cta`**: `LiquidMetalButton` „Rezension schreiben" (blendet per `Reveal` ein,
  öffnet im neuen Tab). Ziel steht als Konstante `REZENSION_URL` oben in `app/page.tsx` – vorläufig
  eine Google-Maps-Suche auf den Betrieb, ersetzbar durch den direkten `g.page/r/…/review`-Link.
- **Hover-Farben:** im **Footer** (Links, Telefon/Mail, Social-Icons) und bei den **Kennzahlen** ist der
  Hover **Marken-Gelb**. Auf der Kontaktseite und beim Hero-Telefon bleibt er bewusst **rot** (`#e11d2a`).
- **Weitere Seiten:** `/leistungen` (Hero + Elektrotechnik · KNX/Smarthome · Photovoltaik), `/blog` +
  `/blog/[slug]` (5 Artikel), `/karriere` (+ Bewerbungsformular), `/kontakt` (Team + Formular),
  `/impressum`, `/datenschutz`, markenkonforme 404.
- **Blog-Übersicht** (`blog-artikel-galerie`): **eine Karte zur Zeit, zentriert**, weiterzuklicken
  über Pfeile oder Punkte darunter (`components/blog-gallery.tsx`, am Ende geht es von vorn los).
  Fünf Karten nebeneinander wirkten überladen; der frühere „Featured"-Block und die
  `data-area`s `blog-artikel-featured` / `blog-artikel-liste` sind entfallen.
  - **Rahmen im Bildformat 3:2** (`aspect-[3/2] max-w-2xl`) – genau das Verhältnis der Titelbilder
    (1536 × 1024). Dadurch schneidet `bg-cover` fast nichts mehr ab; im vorherigen, fast
    quadratischen Rahmen fiel rund ein Drittel der Bildbreite weg.
  - Die Steuerung liegt **unter** der Karte, nicht darüber: auf dem Handy läge sie sonst auf der
    Überschrift. Beim Blättern schiebt framer-motion die Karten seitlich (`AnimatePresence`),
    bei reduzierter Bewegung wird nur überblendet.
  - Die Karte ist **`ui/blog-card.tsx`**, Aufbau nach der Vorlage aus `new-card-design.md`
    („card-21 / DestinationCard"), auf dieses Design gezogen.
  - **Nur im Blog.** Alle anderen Karten der Seite bleiben beim Glas-Design (`.glass` +
    `.glass-glow`). Diese eine Ausnahme ist gewollt – nicht auf Leistungen, Kennzahlen o. Ä. ausrollen.
  - **In Ruhe zeigt die Karte nur das Titelbild**, kein Text und kein Verlauf. Das Bild liegt in
    **zwei Ebenen**: oben scharf, darüber dieselbe Ebene mit `blur-[2px]`, per Maske
    `linear-gradient(to top, #000 0%, #000 30%, transparent 55%)` nur auf der **unteren Hälfte**.
    Oben bleibt das Motiv damit klar erkennbar, unten trägt die Weichzeichnung später den Text.
    Die Themenfarben je Fachbereich sind bewusst **entfallen** – dieser eine Blur ersetzt sie.
  - Beide Ebenen stehen im Ruhezustand auf `scale-105`, damit die weichen Blur-Kanten außerhalb
    des Rahmens liegen – sonst schimmert ringsum ein heller Saum durch. Kostet rund 5 % des
    Bildes; bewusst in Kauf genommen, ein sichtbarer Saum wäre schlimmer.
  - **Beim Zeigen:** Bild zoomt auf `scale-110`, ein schwarzer Verlauf blendet ein und der
    Inhalt fährt von links herein (`-translate-x-4` → `0`, Deckkraft 0 → 1, 500 ms).
    **Die Karte selbst zoomt nicht** – nur das Bild darin.
  - **Inhalt bewusst knapp:** weiße Pille (Fachbereich), Uhr + Lesezeit, Überschrift, „Weiterlesen"
    mit `ArrowUpRight` (dieselbe Optik wie überall sonst auf der Seite, keine getönte Leiste).
    **Kein Anrisstext** (`excerpt`) – der Text steht im Artikel, die Karte soll ruhig bleiben.
    `excerpt` bleibt in `lib/content.ts` und wird weiterhin für die Meta-Beschreibung gebraucht.
  - **Überschrift in `text-brand-gradient`** (Marken-Verlauf): der schwarze Verlauf dahinter ist
    genau dafür da. Ohne ihn wäre die warme Schrift auf dem Bild zu kontrastarm.
  - **Glaskante** wie an den Karten in Karriere und Kontakt, damit die Seite durchgehend gleich
    wirkt. Sie kommt über die Utility **`.glass-edge`** auf ein eigenes Overlay als **letztes Kind**
    der Karte. `.glass` selbst geht hier nicht: dessen `::before` läge unter dem Titelbild und wäre
    unsichtbar – und Fläche plus `backdrop-filter` braucht die Karte ohnehin nicht.
    Die Werte in `.glass-edge` sind identisch zu `.glass::before`; ändert sich dort etwas,
    hier mitziehen.

> [!warning] Der Hover-Inhalt braucht zwei Rückfälle – nicht entfernen
> Tailwind v4 packt `group-hover:` in `@media (hover: hover)`. Ohne Gegenstück bliebe die
> Karte auf dem Handy **komplett leer** – kein Titel, kein Link-Text. Deshalb stehen an
> Verlauf und Inhalt zusätzlich `[@media(hover:none)]:opacity-100` (Touch zeigt alles
> dauerhaft) und `group-focus-within:` (Tastaturbedienung). Beides ist geprüft:
> unter `(hover: none)` steht der Inhalt auf Deckkraft 1 und ohne Versatz.
- **Footer** (`site-footer.tsx`): enthält **`footer-beam.tsx`** – bewegter WebGL-Lichtstrahl (three.js
  Fragment-Shader, „Chrome look" mit minimaler RGB-Aufspaltung; läuft nur im Viewport,
  reduced-motion-fest). Eingebunden über **`footer-beam-lazy.tsx`**: three.js (~460 kB) wird erst
  gut eine Sekunde nach dem Seitenaufbau geladen, damit der Startbundle klein bleibt. **Nicht** wieder
  direkt importieren – das schiebt three.js zurück in den kritischen Ladepfad jeder Seite.

---

## 9. Komponenten-Inventar (Quelle der Wahrheit)

```
home-hero · page-hero · blur-text · motion-primitives (Reveal, StaggerGroup, StaggerItem)
site-navbar · site-footer · footer-beam (WebGL) + footer-beam-lazy (Nachladen)
testimonials (Spalten-Marquee) · ui/cascade-text (TextReveal, Kennzahlen-Hover)
ansprechpartner-karten (Kontakt-Personen + Pop-up)
brand-logo · ui (Section, SectionHeading, ButtonLink, Eyebrow, cx)
ui/liquid-metal-button (Shader-Button) · ui/logo-loop (Hersteller-Schleife, .jsx + .css + .d.ts)
ui/blog-card (Artikelkarte – NUR im Blog) · blog-gallery (Galerie darum, siehe Abschnitt 8)
form-fields · contact-form · application-form · glass-select (eigenes Glas-Dropdown)
legal
lib/content.ts  → zentrale Inhalte (Leistungen, Blog, Ansprechpartner, Fachbereiche, Kennzahlen)
lib/base-path.ts → asset() für nackte <img>/<a> bei Unterpfad-Deployment
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
- Kennzahlen in Serif-Italic. (Die Hersteller-Reihe zeigt inzwischen Logos statt Serif-Namen.)
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

- **Es gibt nur EIN Design: den Dunkel-Modus.** Der frühere Tag-/Nacht-Umschalter wurde **vollständig
  entfernt** – Komponente `theme-toggle.tsx`, das No-Flash-Script in `layout.tsx`, der komplette
  `[data-theme="light"]`-Block in `globals.css` (~195 Zeilen) und der `data-over-hero`-Scroll-Listener
  in `site-navbar.tsx`, der ausschließlich den Tag-Modus bediente. Die Firmenfarben sind **Schwarz,
  Rot (`#e11d2a`) und Gelb (`#f5b301`)**; ein heller Modus verfälscht sie. **Nicht wieder einführen.**
- **Inhaltssektionen-Hintergrund = reines Schwarz.** Zwei WebGL-Flächenhintergründe wurden getestet
  und **wieder vollständig entfernt**: ein **Eck-Lichtfeld** (`home-light-field.tsx`) und der
  **Molten-Metal-Hintergrund** (`ui/molten-metal.tsx` + `molten-metal-background.tsx`, Shader aus
  `Molten-Metal.md`). **Nicht erneut hinzufügen**, außer ausdrücklich gewünscht.
  Der einzige verbliebene WebGL-Effekt ist der **Footer-Lichtstrahl** (`footer-beam.tsx`), der auf
  allen Seiten läuft.
- **Hero ohne „Erscheinen"-Effekt:** kein Blur-/Fade-/Zoom-Einschwung beim Laden. Der Hintergrund ist
  sofort da; nur das Loop-Video selbst bewegt sich. Der schwarze Rand ist **statisch**.
- **Kein `filter`/`transform` auf Glas-Vorfahren** (sonst bricht `backdrop-filter`).
- **`prefers-reduced-motion`** bleibt in allen neuen Komponenten Pflicht.
- Bilder bleiben **lokal** unter `public/images/` (kein `next/image` wegen Static Export).
