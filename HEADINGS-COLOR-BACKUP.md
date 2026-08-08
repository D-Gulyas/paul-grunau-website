# Überschriften-Farben – Verlauf und Rückwege

Aktueller Zustand: **alle Überschriften tragen den Marken-Verlauf rot → orange → gelb** (wie im Logo).
Diese Datei hält die beiden früheren Zustände fest, damit sie sich exakt zurückholen lassen.

## Zeitleiste

| Stand | Überschriften | Hero-Headline |
|---|---|---|
| bis 02.07.2026 | Verlauf `105deg`, quer | weiß |
| 02.07.2026 – 08.08.2026 | einfarbig Markenrot `#e11d2a` | rot `#e11d2a` |
| **seit 08.08.2026** | **Verlauf `170deg`, senkrecht** | **Verlauf, wortweise** |

## Warum der Verlauf jetzt anders läuft als 2026-07

Der alte Verlauf lief **quer** (`105deg`). Das hatte zwei Probleme, die beim zweiten Anlauf
behoben wurden – beide stecken samt Begründung in `app/globals.css`:

1. **Kursive Glyphen wurden abgeschnitten.** `background-clip: text` gibt nur innerhalb der Box
   Farbe ab; die kursive Instrument Serif ragt bis zu **0,167 em** rechts und **0,082 em** links
   darüber hinaus (gemessen). Genau daran scheiterte der Verlauf damals, und deshalb wurde auf
   solides Rot umgestellt. Lösung: `padding-inline: 0.2em` plus ausgleichendes negatives Margin.
2. **Quer laufende Verläufe kamen bei umbrechenden Überschriften nicht durch.** `width: fit-content`
   liefert die **ungebrochene** Textbreite: bei der Seiten-Überschrift 896 px Box gegenüber 364 px
   längster Zeile – der sichtbare Text sah nur die ersten 40 % des Verlaufs und blieb fast ganz rot.
   Lösung: der Verlauf läuft jetzt fast senkrecht (`170deg`). Die Box**höhe** entspricht immer
   exakt dem gesetzten Text, damit läuft er in jeder Überschrift vollständig durch.

> [!] An einer Überschrift mit `text-brand-gradient` **kein** `mx-auto` / `ml-*` / `mr-*` setzen –
> das überschreibt die Margin-Kompensation aus Punkt 1. Zentriert wird über den Elternteil
> (`flex justify-center`), so gelöst in `app/not-found.tsx`.

## Rückweg 1 – alles einfarbig Markenrot (Stand 02.07. – 08.08.2026)

In `app/globals.css` bei `@utility text-brand-gradient` die fünf Verlaufszeilen
(`background-image`, beide `background-clip`, `-webkit-text-fill-color`, `color: transparent`)
ersetzen durch:

```css
color: #e11d2a;
```

`padding-inline` / `margin-inline` können dann ebenfalls raus – ohne `background-clip: text`
schneidet nichts mehr ab. Für den Hero in `components/home-hero.tsx` an beiden `BlurText`
die Prop `gradient` entfernen und `text-[#e11d2a]` an die `className` hängen.

## Rückweg 2 – Hero-Headline weiß (Stand bis 02.07.2026)

In `components/home-hero.tsx` an beiden `BlurText` die Prop `gradient` entfernen und
`text-white` an die `className` hängen.

## Wo der Verlauf überall hängt

An **einer** Stelle: `@utility text-brand-gradient` in `app/globals.css`, benutzt an 17 Stellen
(`components/ui.tsx` SectionHeading · `page-hero.tsx` · `legal.tsx` · `ui/blog-card.tsx` ·
`ansprechpartner-karten.tsx` · `app/page.tsx` · `leistungen` · `blog` + `blog/[slug]` ·
`kontakt` · `karriere` · `not-found`).

Dazu die Sonderform `@utility text-brand-gradient-word` – **nur** für `BlurText` im Hero.
Grund: dort animiert framer-motion je Wort ein `filter`, wodurch jedes Wort eine eigene
Rendering-Ebene bekommt und ein am Elternteil geclippter Verlauf darin nicht ankommt – die
Überschrift wäre unsichtbar. Deshalb trägt dort jedes Wort seinen eigenen Verlauf, per
`background-attachment: fixed` am Viewport verankert, damit er über die Wörter durchläuft.

## Nicht eingefärbt (bewusst, da keine Überschriften)

Kennzahlen-Zahlen (`app/page.tsx`), Bewertungszahl „4,6" (`components/testimonials.tsx`),
„404"-Zahl (`app/not-found.tsx`), Zitat/Blockquote (`app/blog/[slug]/page.tsx`) – alle `text-white`.
