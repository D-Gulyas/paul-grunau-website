"use client";

import { Fragment } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Star, StarHalf } from "lucide-react";

/* Echte Google-Rezensionen (gekürzt auf die Kernaussage, Emojis/Tippfehler bereinigt).
   Gesamtbewertung des Google-Profils: 4,6 ★ aus 20 Rezensionen. */
const rating = { average: "4,6", count: 20 };

type Review = { name: string; initials: string; date: string; text: string };

const reviews: Review[] = [
  {
    name: "Ignacio Yelamos",
    initials: "IY",
    date: "vor 8 Monaten",
    text: "Als sich ein Problem mit unserer Solaranlage ergab, war Herr Grunau noch am selben Tag erreichbar und beriet uns zügig und kompetent aus der Ferne. So einen super Kundenservice haben wir sehr selten erlebt – klare Weiterempfehlung!",
  },
  {
    name: "Bernd Stromberg",
    initials: "BS",
    date: "vor einem Jahr",
    text: "Die Abnahme unserer PV-Anlage und der Austausch des Stromzählers wurden absolut reibungslos durchgeführt. Das Team war professionell, kompetent und sehr freundlich – ich kann diesen Betrieb uneingeschränkt weiterempfehlen!",
  },
  {
    name: "Liv Grete Poiree",
    initials: "LP",
    date: "vor einem Jahr",
    text: "Top Arbeit und Preis-/Leistungsverhältnis. Installation von PV-Anlage und komplett neue Verteilung kann man wohl nicht besser und freundlicher machen. Klare Empfehlung für das ganze Team!",
  },
  {
    name: "Dr. Ben Schneider",
    initials: "BS",
    date: "vor 10 Monaten",
    text: "Alles bestens und sehr zu empfehlen! Ich würde jederzeit wieder mit Herrn Grunau und seinen Mitarbeitern zusammenarbeiten – alles strukturiert und kompetent abgewickelt.",
  },
  {
    name: "Hans-Joachim Kuck",
    initials: "HK",
    date: "vor einem Jahr",
    text: "Von der fachlichen Beratung bis zur Inbetriebnahme unserer PV-Anlage eine ausgesprochen gute Leistung. Man fühlt sich gut aufgehoben und kann diesen Betrieb bestens empfehlen.",
  },
  {
    name: "Dieter Rehfeldt",
    initials: "DR",
    date: "vor einem Jahr",
    text: "Diese Firma kann ich nur weiterempfehlen. Sehr freundliche und kompetente Mitarbeiter, der Arbeitsplatz wird stets sauber hinterlassen. Jederzeit gerne wieder.",
  },
  {
    name: "Magnus S.",
    initials: "MS",
    date: "vor 8 Jahren",
    text: "Bester Elektriker in Waldbröl – fachlich und sachlich hervorragend. Er hilft in der Not auch bei engem Zeitplan, und dabei stimmt sogar noch die Qualität seiner Arbeit!",
  },
  {
    name: "D. P.",
    initials: "DP",
    date: "vor 2 Jahren",
    text: "Herr Grunau ist bemüht, schnell und kundenfreundlich zu helfen – was heute leider nicht mehr selbstverständlich ist, wenn man schnell einen Handwerker benötigt.",
  },
  {
    name: "Stephan Kugelmeier",
    initials: "SK",
    date: "vor 9 Monaten",
    text: "Gute vorab Beratung, kompetentes Personal und termingerechte Ausführung. Sehr zu empfehlen.",
  },
  {
    name: "Denis Bernhard",
    initials: "DB",
    date: "vor 3 Jahren",
    text: "Super kompetent, schnelle Lösung und auch bei einem echten Notfall am selben Tag vor Ort! Einfach nur klasse – ich kann nur Danke sagen!",
  },
  {
    name: "Marcus Brockmöller",
    initials: "MB",
    date: "vor 2 Jahren",
    text: "Klasse Elektro-Betrieb, der sogar 200 km weit anreist, um bei uns die Technik an unserer PV-Anlage perfekt zu installieren!",
  },
];

function GoogleG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function TestimonialCard({ r }: { r: Review }) {
  return (
    <figure className="glass mb-6 w-80 max-w-[86vw] rounded-2xl p-6">
      <div className="flex gap-1 text-[#f5b301]">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-current" />
        ))}
      </div>
      <blockquote className="mt-4 font-body text-sm font-light leading-relaxed text-white/85">„{r.text}"</blockquote>
      <figcaption className="mt-5 flex items-center gap-3">
        <span className="liquid-glass grid h-9 w-9 shrink-0 place-items-center rounded-full font-body text-xs font-medium text-white">
          {r.initials}
        </span>
        <div>
          <div className="font-body text-sm font-medium text-white">{r.name}</div>
          <div className="font-body text-xs text-white/50">{r.date}</div>
        </div>
      </figcaption>
    </figure>
  );
}

function Column({
  items,
  duration,
  direction = "up",
  className,
  reduce,
}: {
  items: Review[];
  duration: number;
  direction?: "up" | "down";
  className?: string;
  reduce: boolean | null;
}) {
  // Abstand kommt aus mb-6 der Karten (kein flex-gap) → -50% trifft exakt eine
  // Kopie → nahtlose Endlosschleife. Richtung pro Spalte versetzt.
  const from = direction === "up" ? "0%" : "-50%";
  const to = direction === "up" ? "-50%" : "0%";
  return (
    <div className={className}>
      <motion.div
        initial={reduce ? undefined : { y: from }}
        animate={reduce ? undefined : { y: to }}
        transition={reduce ? undefined : { duration, repeat: Infinity, ease: "linear", repeatType: "loop" }}
        className="flex flex-col"
      >
        {(reduce ? [0] : [0, 1]).map((dup) => (
          <Fragment key={dup}>
            {items.map((r, i) => (
              <TestimonialCard key={`${dup}-${i}`} r={r} />
            ))}
          </Fragment>
        ))}
      </motion.div>
    </div>
  );
}

export function Testimonials() {
  const reduce = useReducedMotion();
  const col1 = reviews.slice(0, 4);
  const col2 = reviews.slice(4, 8);
  const col3 = reviews.slice(8);

  return (
    <div className="mt-12">
      {/* Echte Google-Gesamtbewertung */}
      <div data-area="kundenstimmen-bewertung" className="mb-12 flex flex-col items-center gap-2 text-center">
        <div className="flex items-center gap-3">
          <span className="font-heading text-5xl italic leading-none text-white">{rating.average}</span>
          <span className="flex text-[#f5b301]">
            {Array.from({ length: 4 }).map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-current" />
            ))}
            <StarHalf className="h-5 w-5 fill-current" />
          </span>
        </div>
        <p className="flex items-center gap-1.5 font-body text-sm text-white/60">
          <GoogleG className="h-4 w-4" />
          {rating.count} Google-Rezensionen · Waldbröl
        </p>
      </div>

      {/* Spalten-Marquee – keine Maus-/Hover-Interaktion (pointer-events-none),
          versetzte Laufrichtungen + unterschiedliche Geschwindigkeiten. */}
      <div
        data-area="kundenstimmen-marquee"
        className={
          reduce
            ? "flex flex-wrap justify-center gap-x-6"
            : "pointer-events-none flex max-h-[680px] justify-center gap-6 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,#000_16%,#000_84%,transparent)]"
        }
      >
        <Column items={col1} duration={32} direction="up" reduce={reduce} />
        <Column items={col2} duration={46} direction="down" className="hidden md:block" reduce={reduce} />
        <Column items={col3} duration={38} direction="up" className="hidden lg:block" reduce={reduce} />
      </div>
    </div>
  );
}
