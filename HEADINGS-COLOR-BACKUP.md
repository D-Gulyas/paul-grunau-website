# Backup: Überschriften-Farben (Stand vor der „alles rot"-Umstellung)

Dieser Snapshot hält die **ursprüngliche Farbeinstellung aller Überschriften** fest, damit sie sich
jederzeit exakt wiederherstellen lässt. Angelegt am 2026-07-02, unmittelbar bevor alle Überschriften auf
Markenrot `#e11d2a` gesetzt wurden.

## Wiederherstellung – so kommt der Original-Zustand zurück

### 1. Marken-Farbverlauf der Bereichs-/Seiten-Überschriften (`app/globals.css`)

Alle mit der Utility `text-brand-gradient` gesetzten Überschriften (16 Stellen, siehe Liste unten)
hingen an **einem** Verlauf. Original-Definition der Utility:

```css
@utility text-brand-gradient {
  width: fit-content;
  background-image: linear-gradient(105deg, #e11d2a 0%, #f26619 50%, #f5b301 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}
```

→ Zum Wiederherstellen die `background-image`-Zeile wieder auf den obigen **Verlauf** setzen
(`linear-gradient(105deg, #e11d2a 0%, #f26619 50%, #f5b301 100%)`).

### 2. Hero-Headline (`components/home-hero.tsx`)

Beide BlurText-Zeilen der Hero-Headline waren **weiß** (`text-white`):

- Zeile 1 „Brandschutz & Elektrotechnik": `… tracking-[-1px] text-white`
- Zeile 2 „Meisterbetrieb Paul Grunau": `… tracking-[-1px] text-white`

→ Zum Wiederherstellen `text-[#e11d2a]` wieder auf `text-white` zurücksetzen.

## Betroffene Überschriften mit `text-brand-gradient` (Original: Verlauf rot→orange→gelb)

| Datei | Überschrift |
|---|---|
| `components/ui.tsx` | `SectionHeading` (h2) – z. B. „Unsere Philosophie" |
| `components/page-hero.tsx` | Seiten-Hero-Titel (h1) |
| `components/legal.tsx` | Rechtstexte-Abschnitte (h2) |
| `app/page.tsx` | Highlight-Karten (h3), „Kundenstimmen" (h2) |
| `app/leistungen/page.tsx` | Leistungs-Titel (h2) |
| `app/blog/page.tsx` | Blog-Titel (h2), Beitrags-Titel (h3) |
| `app/blog/[slug]/page.tsx` | Artikel-Titel (h1), Abschnitte (h2), „Fragen…" (h3), „Weitere Artikel" (h2) |
| `app/kontakt/page.tsx` | Team-Namen (h3), „Direkt erreichbar" (h2) |
| `app/karriere/page.tsx` | Block-Titel (h3) |
| `app/not-found.tsx` | „Seite nicht gefunden" (h1) |

## NICHT geändert (bewusst, da keine Überschriften)

Diese `font-heading`-Elemente bleiben in ihrer Original-Farbe (`text-white`):
Kennzahlen-Zahlen (`app/page.tsx`), Hersteller-Namen KNX/Gira/… (`components/home-hero.tsx`),
Bewertungszahl „4,6" (`components/testimonials.tsx`), „404"-Zahl (`app/not-found.tsx`),
Zitat/Blockquote (`app/blog/[slug]/page.tsx`).
