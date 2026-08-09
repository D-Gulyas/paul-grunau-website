import { ArrowUpRight } from "lucide-react";

/**
 * Der Pfeil an Links, Buttons und Karten.
 *
 * Beim Zeigen rückt er leicht nach oben rechts **und leuchtet auf** – er ruht
 * gedämpft und wird erst im Hover voll deckend. Vorbild sind die Karten unter
 * „Weitere Artikel" im Blog-Artikel; seit 09.08.2026 verhalten sich alle Pfeile
 * dieser Art gleich.
 *
 * Braucht ein Elternteil mit der Klasse `group` – ohne das bleibt der Pfeil
 * dauerhaft gedämpft.
 *
 * Der Pfeil auf dem `LiquidMetalButton` steckt in dessen Inline-Styles und
 * bringt dasselbe Verhalten dort separat mit (Shader-Fläche, eigene Farbe).
 */
export function Pfeil({
  className,
  /** Für helle Flächen: der Pfeil leuchtet dann nach Schwarz statt nach Weiß. */
  aufHell = false,
}: {
  className?: string;
  aufHell?: boolean;
}) {
  const farbe = aufHell
    ? "text-black/40 group-hover:text-black"
    : "text-white/40 group-hover:text-white";

  return (
    <ArrowUpRight
      className={[
        "h-4 w-4 transition duration-300",
        farbe,
        "group-hover:translate-x-0.5 group-hover:-translate-y-0.5",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );
}
