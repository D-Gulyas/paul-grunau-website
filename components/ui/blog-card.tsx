import type { HTMLAttributes } from "react";
import Link from "next/link";
import { Clock } from "lucide-react";
import { Pfeil } from "@/components/ui/pfeil";
import { cx } from "@/components/ui";

/**
 * BlogCard – Artikelkarte im Aufbau aus `new-card-design.md`
 * (Vorlage „card-21 / DestinationCard"), auf das Design dieser Seite gezogen.
 *
 * **Nur für den Blog.** Alle anderen Karten bleiben beim Glas-Design
 * (`.glass` + `.glass-glow`) – das hier ist bewusst die einzige Ausnahme.
 *
 * Die Glaskante (`.glass-edge`) ist dieselbe wie an den Karten in Karriere und Kontakt,
 * damit die Seite durchgehend gleich wirkt.
 *
 * Ruhezustand: nur das Titelbild – oben scharf, zur unteren Hälfte hin weichgezeichnet.
 * Beim Zeigen: das Bild zoomt, ein schwarzer Verlauf blendet ein und der Inhalt
 * fährt von links herein – Pille, Lesezeit, rote Überschrift, „Weiterlesen".
 *
 * Angepasst gegenüber der Vorlage:
 * - `next/link` statt `<a>` – sonst bricht die Navigation unter einem Unterpfad (basePath).
 * - `cx` aus `components/ui` statt `cn` aus `@/lib/utils` – dieselbe Aufgabe, ist schon da,
 *   spart zwei Abhängigkeiten (clsx + tailwind-merge).
 * - Kein `forwardRef`: die Karte wird serverseitig gerendert, eine Ref gäbe es dort ohnehin nicht.
 * - Keine Themenfarben je Fachbereich mehr und kein Zoom der ganzen Karte – beides ersetzt
 *   durch einen einheitlichen, dezenten Blur, damit alle fünf Karten gleich auftreten.
 * - Das Seitenverhältnis gibt der Rahmen vor (`BlogGallery`: 3:2 wie die Titelbilder),
 *   damit `bg-cover` möglichst wenig vom Motiv abschneidet.
 * - Statt der getönten Leiste wieder das schlichte „Weiterlesen" mit `ArrowUpRight`,
 *   wie an allen anderen Stellen der Seite.
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
}

/* Der Blur wirkt nur auf der unteren Hälfte: bis 30 % Höhe voll, bis 55 % ausgeblendet.
   Darüber bleibt das Bild scharf, damit das Motiv erkennbar ist. */
const MASKE_UNTERE_HAELFTE = "linear-gradient(to top, #000 0%, #000 30%, transparent 55%)";

/* Einblenden von links. `group-focus-within` holt den Inhalt auch bei Tastaturbedienung
   hervor; `(hover: none)` zeigt ihn auf Touchgeräten dauerhaft – dort gibt es kein Hover,
   ohne diese Zeile bliebe die Karte auf dem Handy leer. */
const EINBLENDEN =
  "opacity-0 -translate-x-4 transition-all duration-500 ease-out " +
  "group-hover:translate-x-0 group-hover:opacity-100 " +
  "group-focus-within:translate-x-0 group-focus-within:opacity-100 " +
  "[@media(hover:none)]:translate-x-0 [@media(hover:none)]:opacity-100";

export function BlogCard({ className, imageUrl, category, readingTime, title, href, ...props }: BlogCardProps) {
  return (
    // `group` schaltet die Hover-Effekte der Kinder
    <div className={cx("group h-full w-full", className)} {...props}>
      <Link
        href={href}
        aria-label={`Artikel lesen: ${title}`}
        className="relative block h-full w-full overflow-hidden rounded-2xl shadow-lg"
      >
        {/* Titelbild in zwei Ebenen, gemeinsam gezoomt.
            `scale-105` schon im Ruhezustand, damit die weichen Blur-Kanten außerhalb
            des Rahmens liegen – sonst schimmerte ringsum ein heller Saum durch. */}
        <div className="absolute inset-0 scale-105 transition-transform duration-500 ease-in-out group-hover:scale-110">
          {/* scharf – das Bild soll erkennbar bleiben */}
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${imageUrl})` }} />
          {/* dieselbe Ebene weichgezeichnet, per Maske nur auf der unteren Hälfte:
              unten voll, nach oben ausblendend. Trägt später den Text. */}
          <div
            className="absolute inset-0 bg-cover bg-center blur-[2px]"
            style={{
              backgroundImage: `url(${imageUrl})`,
              maskImage: MASKE_UNTERE_HAELFTE,
              WebkitMaskImage: MASKE_UNTERE_HAELFTE,
            }}
          />
        </div>

        {/* Schwarzer Verlauf hinter dem Text – trägt die rote Überschrift.
            Blendet zusammen mit dem Inhalt ein, damit die Karte in Ruhe sauber bleibt. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-black via-black/75 to-transparent opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100 group-focus-within:opacity-100 [@media(hover:none)]:opacity-100"
        />

        {/* Inhalt: bewusst knapp – Pille, Lesezeit, Überschrift, „Weiterlesen".
            Kein Anrisstext, der Text steht im Artikel. */}
        <div className={cx("relative flex h-full flex-col justify-end p-6 text-white", EINBLENDEN)}>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-white px-3 py-1 font-body text-xs font-medium text-black">
              {category}
            </span>
            <span className="inline-flex items-center gap-1.5 font-body text-xs text-white/75">
              <Clock className="h-3.5 w-3.5" /> {readingTime}
            </span>
          </div>

          <h3 className="mt-4 text-balance font-heading text-2xl italic leading-tight tracking-[-0.5px] text-brand-gradient">
            {title}
          </h3>

          <span className="mt-5 inline-flex items-center gap-1.5 font-body text-sm font-medium text-white/80 transition-colors group-hover:text-white">
            Weiterlesen
            <Pfeil />
          </span>
        </div>

        {/* Glaskante wie an den Karten in Karriere und Kontakt. Als letztes Kind und
            damit über dem Titelbild – `.glass::before` läge darunter und wäre unsichtbar. */}
        <div aria-hidden className="glass-edge absolute inset-0" />
      </Link>
    </div>
  );
}

export default BlogCard;
