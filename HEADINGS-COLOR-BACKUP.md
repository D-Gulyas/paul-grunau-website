# Überschriften-Farben – Verlauf und Rückwege

Aktueller Zustand: **alle Überschriften tragen den Marken-Verlauf rot → orange → gelb** (wie im Logo).
Diese Datei hält die beiden früheren Zustände fest, damit sie sich exakt zurückholen lassen.

## Zeitleiste

| Stand | Überschriften | Hero-Headline |
|---|---|---|
| bis 02.07.2026 | Verlauf `105deg`, quer | weiß |
| 02.07.2026 – 08.08.2026 | einfarbig Markenrot `#e11d2a` | rot `#e11d2a` |
| **seit 08.08.2026** | **Verlauf `170deg`, senkrecht** | **rot `#e11d2a`** (siehe unten) |

> [!] **Die Hero-Headline bekommt keinen Verlauf.** Eine wortweise Variante
> (`text-brand-gradient-word`) war kurzzeitig da und wurde wieder entfernt: sie verträgt sich
> nicht mit dem Wort-für-Wort-Blur von `BlurText`. Nicht erneut anlegen – Begründung unten.

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

## Warum die Hero-Headline außen vor bleibt

Sie ist die einzige Überschrift, die durch `BlurText` läuft: framer-motion animiert dort je Wort
`filter`, `opacity` und `y`. Damit bekommt **jedes Wort eine eigene Rendering-Ebene** – und ein
am Elternteil geclippter Verlauf kommt darin nicht an. Da `-webkit-text-fill-color: transparent`
aber vererbt wird, war die Headline mit `text-brand-gradient` schlicht **unsichtbar**.

Der Ausweg war, jedem Wort einen eigenen Verlauf zu geben und ihn per
`background-attachment: fixed` am Viewport zu verankern, damit er über die Wörter durchläuft
statt in jedem Wort neu bei Rot zu beginnen. Das sah im Standbild richtig aus, **während der
Einblendung aber nicht**: die Wörter bewegen sich (`y: 50 → 0`) und werden weichgezeichnet,
während der Verlauf am Viewport klebt – er wandert dabei sichtbar durch die Buchstaben.

Deshalb: **Headline solide rot** (`text-[#e11d2a]` direkt an beiden `BlurText` in
`components/home-hero.tsx`), alle übrigen Überschriften mit Verlauf. Wer es erneut versuchen
will, muss zuerst das Zusammenspiel von bewegtem Text und Verlaufsverankerung lösen – ein
anderer Winkel oder andere Stops ändern daran nichts.

## Rückweg 1 – alles einfarbig Markenrot (Stand 02.07. – 08.08.2026)

In `app/globals.css` bei `@utility text-brand-gradient` die fünf Verlaufszeilen
(`background-image`, beide `background-clip`, `-webkit-text-fill-color`, `color: transparent`)
ersetzen durch:

```css
color: #e11d2a;
```

`padding-inline` / `margin-inline` können dann ebenfalls raus – ohne `background-clip: text`
schneidet nichts mehr ab. Die Hero-Headline ist davon nicht betroffen, sie ist bereits rot.

## Rückweg 2 – Hero-Headline weiß (Stand bis 02.07.2026)

In `components/home-hero.tsx` an beiden `BlurText` in der `className` `text-[#e11d2a]`
durch `text-white` ersetzen.

## Wo der Verlauf überall hängt

An **einer** Stelle: `@utility text-brand-gradient` in `app/globals.css`, benutzt an 17 Stellen
(`components/ui.tsx` SectionHeading · `page-hero.tsx` · `legal.tsx` · `ui/blog-card.tsx` ·
`ansprechpartner-karten.tsx` · `app/page.tsx` · `leistungen` · `blog` + `blog/[slug]` ·
`kontakt` · `karriere` · `not-found`).

Die Hero-Headline gehört **nicht** dazu – sie steht solide rot direkt an den beiden `BlurText`
in `components/home-hero.tsx` (Begründung oben).

## Nicht eingefärbt (bewusst, da keine Überschriften)

Kennzahlen-Zahlen (`app/page.tsx`), Bewertungszahl „4,6" (`components/testimonials.tsx`),
„404"-Zahl (`app/not-found.tsx`), Zitat/Blockquote (`app/blog/[slug]/page.tsx`) – alle `text-white`.
