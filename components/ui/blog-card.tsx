import type { HTMLAttributes, CSSProperties } from "react";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { cx } from "@/components/ui";

/**
 * BlogCard – Kartendesign aus `new-card-design.md` (Vorlage „card-21 / DestinationCard").
 *
 * **Nur für den Blog.** Alle anderen Karten der Seite bleiben beim Glas-Design
 * (`.glass` + `.glass-glow`) – das hier ist bewusst die einzige Ausnahme.
 *
 * Aufbau wie in der Vorlage: bildfüllender Hintergrund mit Zoom beim Hover, darüber
 * ein Farbverlauf in der Themenfarbe, unten der Inhalt und eine Glasleiste mit Pfeil.
 * Die Themenfarbe kommt als HSL-Tripel (`"356 72% 24%"`) über die CSS-Variable
 * `--theme-color` herein und färbt Verlauf, Schein und Leiste in einem Zug.
 *
 * Angepasst gegenüber der Vorlage:
 * - `next/link` statt `<a>` – sonst bricht die Navigation unter einem Unterpfad (basePath).
 * - `cx` aus `components/ui` statt `cn` aus `@/lib/utils` – dieselbe Aufgabe, ist schon da,
 *   spart zwei Abhängigkeiten (clsx + tailwind-merge).
 * - Kein `forwardRef`: die Karte wird serverseitig gerendert, eine Ref gäbe es dort ohnehin nicht.
 *
 * > Das `backdrop-blur-md` an der Leiste ist hier wirkungslos und bleibt nur, weil es so in
 * > der Vorlage steht. Grund: `StaggerItem` hält als Vorfahre ein `filter` (die Blur-Einblendung)
 * > und schneidet damit den Backdrop ab – der bekannte Fallstrick aus DESIGN.md. Sichtbar ist
 * > die Leiste ohnehin über ihre eigene Tönung; hinter ihr liegt der Verlauf bei 0,9 Deckkraft,
 * > es gäbe also praktisch nichts zu verwischen. **Nicht** versuchen, den Blur „zu reparieren".
 */

export interface BlogCardProps extends HTMLAttributes<HTMLDivElement> {
  /** Bildpfad, bereits durch `asset()` geschickt. */
  imageUrl: string;
  /** Fachbereich – erscheint als weiße Pille. */
  category: string;
  /** z. B. „6 Min." – erscheint neben dem Uhr-Symbol. */
  readingTime: string;
  title: string;
  href: string;
  /** HSL-Tripel ohne `hsl()`, z. B. `"356 72% 24%"`. */
  themeColor: string;
}

/* Themenfarben aus dem Marken-Verlauf (Rot → Orange → Gelb), abgedunkelt auf
   Verlaufstiefe. Bewusst nur diese drei Töne – kein neuer Farbkreis fürs Blog. */
const THEMEN: Record<string, string> = {
  Brandschutz: "356 72% 24%",
  Sicherheit: "356 72% 24%",
  Elektrotechnik: "44 95% 22%",
  Praxistipps: "21 85% 24%",
};

/** Themenfarbe zum Fachbereich; unbekannte Bereiche bekommen Marken-Rot. */
export function themeForCategory(category: string) {
  return THEMEN[category] ?? "356 72% 24%";
}

export function BlogCard({
  className,
  imageUrl,
  category,
  readingTime,
  title,
  href,
  themeColor,
  ...props
}: BlogCardProps) {
  return (
    // `group` schaltet die Hover-Effekte der Kinder
    <div
      style={{ "--theme-color": themeColor } as CSSProperties}
      className={cx("group h-full w-full", className)}
      {...props}
    >
      <Link
        href={href}
        aria-label={`Artikel lesen: ${title}`}
        className="relative block h-full w-full overflow-hidden rounded-2xl shadow-lg transition-all duration-500 ease-in-out group-hover:scale-105 group-hover:shadow-[0_0_60px_-15px_hsl(var(--theme-color)/0.6)]"
        style={{ boxShadow: "0 0 40px -15px hsl(var(--theme-color) / 0.5)" }}
      >
        {/* Titelbild mit Zoom beim Hover */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-in-out group-hover:scale-110"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />

        {/* Verlauf in der Themenfarbe – trägt den Text und hält ihn lesbar */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, hsl(var(--theme-color) / 0.9), hsl(var(--theme-color) / 0.6) 30%, transparent 60%)",
          }}
        />

        {/* Inhalt: Pille + Lesezeit, Überschrift, Leiste. Bewusst ohne Anrisstext –
            die Karte soll ruhig bleiben, der Text steht im Artikel. */}
        <div className="relative flex h-full flex-col justify-end p-6 text-white">
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-white px-3 py-1 font-body text-xs font-medium text-black">
              {category}
            </span>
            <span className="inline-flex items-center gap-1.5 font-body text-xs text-white/75">
              <Clock className="h-3.5 w-3.5" /> {readingTime}
            </span>
          </div>

          <h3 className="mt-4 text-balance font-heading text-2xl italic leading-tight tracking-[-0.5px]">
            {title}
          </h3>

          <div className="mt-6 flex items-center justify-between rounded-lg border border-[hsl(var(--theme-color)/0.3)] bg-[hsl(var(--theme-color)/0.2)] px-4 py-3 backdrop-blur-md transition-all duration-300 group-hover:border-[hsl(var(--theme-color)/0.5)] group-hover:bg-[hsl(var(--theme-color)/0.4)]">
            <span className="font-body text-sm font-semibold tracking-wide">Weiterlesen</span>
            <ArrowRight className="h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </div>
      </Link>
    </div>
  );
}

export default BlogCard;
