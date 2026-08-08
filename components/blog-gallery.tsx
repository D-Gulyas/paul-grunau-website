"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BlogCard } from "@/components/ui/blog-card";
import { cx } from "@/components/ui";
import { asset } from "@/lib/base-path";
import type { BlogPost } from "@/lib/content";

/**
 * BlogGallery – zeigt die Artikel einzeln und zentriert statt alle nebeneinander.
 * Weiterschalten über die Pfeile oder die Punkte darunter; am Ende geht es von vorn los.
 *
 * Das Seitenverhältnis ist **3:2 wie die Titelbilder** (1536 × 1024). Dadurch schneidet
 * `bg-cover` in der Karte praktisch nichts vom Motiv ab – in einem quadratischeren Rahmen
 * fiel gut ein Drittel der Bildbreite weg.
 */

/* Ein Schritt nach rechts schiebt die neue Karte von rechts herein und die alte nach links. */
const folien: Variants = {
  rein: (richtung: number) => ({ x: richtung >= 0 ? "100%" : "-100%", opacity: 0 }),
  da: { x: 0, opacity: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  raus: (richtung: number) => ({
    x: richtung >= 0 ? "-100%" : "100%",
    opacity: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

/* Bei reduzierter Bewegung wird nur überblendet, nichts geschoben. */
const ueberblenden: Variants = {
  rein: { opacity: 0 },
  da: { opacity: 1, transition: { duration: 0.2 } },
  raus: { opacity: 0, transition: { duration: 0.2 } },
};

export function BlogGallery({ posts }: { posts: BlogPost[] }) {
  const reduce = useReducedMotion();
  // `richtung` merkt sich, ob vor- oder zurückgeblättert wurde – danach richtet sich der Schub.
  const [{ index, richtung }, setStand] = useState({ index: 0, richtung: 0 });

  const blaettern = (schritt: number) =>
    setStand(({ index: i }) => ({
      index: (i + schritt + posts.length) % posts.length,
      richtung: schritt,
    }));

  const springe = (ziel: number) =>
    setStand(({ index: i }) => ({ index: ziel, richtung: ziel > i ? 1 : -1 }));

  const post = posts[index];

  return (
    <div data-area="blog-artikel-galerie" className="flex flex-col items-center">
      {/* Rahmen im Bildformat. `overflow-hidden` hält die hinein- und
          hinausfahrenden Karten innerhalb der Galerie. */}
      <div className="relative aspect-[3/2] w-full max-w-2xl overflow-hidden rounded-2xl">
        <AnimatePresence initial={false} custom={richtung}>
          <motion.div
            key={post.slug}
            custom={richtung}
            variants={reduce ? ueberblenden : folien}
            initial="rein"
            animate="da"
            exit="raus"
            className="absolute inset-0"
          >
            <BlogCard
              imageUrl={asset(post.image)}
              category={post.category}
              readingTime={post.readingTime}
              title={post.title}
              href={`/blog/${post.slug}`}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Steuerung bewusst unter der Karte statt darüber: auf dem Handy läge sie sonst
          auf der Überschrift, und der Inhalt der Karte soll frei bleiben. */}
      <div className="mt-6 flex items-center gap-4">
        <button
          type="button"
          onClick={() => blaettern(-1)}
          aria-label="Vorheriger Artikel"
          className="liquid-glass grid h-10 w-10 place-items-center rounded-full text-white transition-transform duration-300 hover:-translate-y-0.5"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2">
          {posts.map((p, i) => (
            <button
              key={p.slug}
              type="button"
              onClick={() => springe(i)}
              aria-label={`Artikel ${i + 1} von ${posts.length}: ${p.title}`}
              aria-current={i === index ? "true" : undefined}
              className={cx(
                "h-2 rounded-full transition-all duration-300",
                i === index ? "w-6 bg-white" : "w-2 bg-white/30 hover:bg-white/60",
              )}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => blaettern(1)}
          aria-label="Nächster Artikel"
          className="liquid-glass grid h-10 w-10 place-items-center rounded-full text-white transition-transform duration-300 hover:-translate-y-0.5"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Für Screenreader: sagt an, welcher Artikel gerade sichtbar ist. */}
      <p aria-live="polite" className="sr-only">
        {`Artikel ${index + 1} von ${posts.length}: ${post.title}`}
      </p>
    </div>
  );
}
