# 🗺️ Bereichs-Namen der Webseite (`data-area`)

Jeder Bereich der Webseite trägt einen eindeutigen, sprechenden Namen im Attribut
`data-area="…"`. Diese Namen sind **unsichtbar** und beeinflussen weder Design,
Inhalt noch Funktion – sie dienen nur der schnellen Verständigung.

**So nutzt du sie:**
- **Fehler melden:** Nenne einfach den Bereichsnamen, z. B. „Im Bereich
  `kontakt-formular` ist ein Feld verrutscht." → Die Codestelle wird sofort per
  Suche nach `data-area="kontakt-formular"` gefunden.
- **Im Browser finden:** Rechtsklick auf das Element → „Untersuchen" → im HTML
  steht das `data-area`-Attribut.

> Technischer Hinweis: Geteilte Bausteine setzen den Namen über eine `area`-Prop
> (`Section` in `components/ui.tsx`, `PageHero` in `components/page-hero.tsx`,
> `StaggerGroup` in `components/motion-primitives.tsx`).

---

## 🌐 Global (auf jeder Seite sichtbar)

| Name | Bereich |
|---|---|
| `nav-hauptmenue` | Kopfleiste gesamt |
| `nav-links-desktop` | Menü-Pille mit Links (Desktop) |
| `nav-burger-button` | Burger-Button (Mobil) |
| `nav-menue-mobil` | Aufgeklapptes Mobil-Menü (nur bei geöffnetem Menü) |
| `theme-toggle` | Tag-/Nacht-Umschalter (Glühbirne) in der Navbar |
| `footer` | Fußzeile gesamt |
| `footer-firma` | Logo + Adresse/Kontakt (links) |
| `footer-leistungen` | Spalte „Leistungen" |
| `footer-links` | Spalte „Links" (Rechtliches) |
| `footer-social` | Social-Media-Icons |
| `footer-copyright` | Unterste Copyright-Zeile |

## 🏠 Startseite (`/`)

| Name | Bereich |
|---|---|
| `home-lichtstrahlen` | Dekorative Lichtstrahlen (WebGL) hinter dem Inhalt – zwischen Hero und Footer |
| `home-hero` | Hero gesamt |
| `home-hero-slideshow` | Hintergrund-Bilderslideshow |
| `home-hero-headline` | Firmenname / Überschrift |
| `home-hero-cta` | Button „Mehr erfahren" + Telefonnummer |
| `home-hero-partner` | „Wir arbeiten mit führenden Herstellern" |
| `home-philosophie` | Sektion „Unsere Philosophie" |
| `home-philosophie-highlights` | Die 3 Karten rechts |
| `home-kennzahlen` | Zahlen-Kacheln |
| `home-kundenstimmen` | Sektion Kundenstimmen |
| `kundenstimmen-bewertung` | Google-Gesamtbewertung (4,6 ★) |
| `kundenstimmen-marquee` | Laufende Rezensions-Spalten |

## 🔧 Leistungen (`/leistungen`)

| Name | Bereich |
|---|---|
| `leistungen-hero` | Kopfbereich |
| `leistungen-liste` | Alle Detailblöcke |
| `leistung-elektrotechnik` | Block Elektrotechnik |
| `leistung-knx-smarthome` | Block KNX & Smarthome |
| `leistung-photovoltaik` | Block Photovoltaik |

## 📝 Blog (`/blog` & einzelne Artikel)

| Name | Bereich |
|---|---|
| `blog-hero` | Kopfbereich Übersicht |
| `blog-liste` | Container Artikelliste |
| `blog-artikel-featured` | Hervorgehobener Artikel |
| `blog-artikel-liste` | Weitere Artikel (Grid) |
| `blogartikel` | Einzelartikel gesamt |
| `blogartikel-kopf` | Titelbild + Überschrift |
| `blogartikel-inhalt` | Artikeltext |
| `blogartikel-cta` | „Fragen zu diesem Thema?"-Box |
| `blogartikel-weitere` | „Weitere Artikel" unten |

## 💼 Karriere (`/karriere`)

| Name | Bereich |
|---|---|
| `karriere-hero` | Kopfbereich |
| `karriere-infobloecke` | Die 3 Info-Karten |
| `karriere-bewerbung` | Sektion Bewerbung |
| `karriere-bewerbungsformular` | Das Formular selbst |

## 📞 Kontakt (`/kontakt`)

| Name | Bereich |
|---|---|
| `kontakt-hero` | Kopfbereich |
| `kontakt-team` | Ansprechpartner-Karten |
| `kontakt-direkt-erreichbar` | Sektion „Direkt erreichbar" |
| `kontakt-infos` | Adresse / Telefon / Mail / Öffnungszeiten |
| `kontakt-formular` | Das Kontaktformular |

## ⚖️ Rechtliches & Sonstiges

| Name | Bereich |
|---|---|
| `impressum-hero` | Impressum – Kopfbereich |
| `impressum-inhalt` | Impressum – Inhalt |
| `datenschutz-hero` | Datenschutz – Kopfbereich |
| `datenschutz-inhalt` | Datenschutz – Inhalt |
| `fehler-404` | 404-Fehlerseite |
