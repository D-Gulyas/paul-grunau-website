import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock } from "lucide-react";
import { Pfeil } from "@/components/ui/pfeil";
import { Reveal } from "@/components/motion-primitives";
import { Section } from "@/components/ui";
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";
import { MagicListe, MagicListePunkt, MagicText } from "@/components/ui/magic-text";
import { blogPosts, type BlogBlock } from "@/lib/content";
import { asset } from "@/lib/base-path";

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return { title: "Artikel nicht gefunden" };
  return { title: post.title, description: post.excerpt };
}

function Block({ block }: { block: BlogBlock }) {
  switch (block.type) {
    case "p":
      return <MagicText text={block.text} className="font-body text-base font-light leading-relaxed text-white/75" />;
    case "h":
      return <h2 className="pt-4 font-heading text-3xl italic tracking-[-1px] text-brand-gradient">{block.text}</h2>;
    // Listen blenden Punkt für Punkt ein, sobald der Absatz darüber fertig
    // aufgeleuchtet ist – beides hängt in derselben Kette.
    case "list":
      return block.ordered ? (
        <MagicListe as="ol" className="space-y-3">
          {block.items.map((it, i) => (
            <MagicListePunkt key={it} index={i} className="flex gap-3 font-body font-light text-white/75">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white text-xs font-semibold text-black">
                {i + 1}
              </span>
              <span className="leading-relaxed">{it}</span>
            </MagicListePunkt>
          ))}
        </MagicListe>
      ) : (
        <MagicListe className="space-y-2.5">
          {block.items.map((it, i) => (
            <MagicListePunkt key={it} index={i} className="flex gap-3 font-body font-light text-white/75">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white" />
              <span className="leading-relaxed">{it}</span>
            </MagicListePunkt>
          ))}
        </MagicListe>
      );
    case "quote":
      return (
        <figure className="glass relative overflow-hidden rounded-3xl p-7">
          <figcaption className="font-body text-xs font-medium uppercase tracking-[0.16em] text-white/60">
            {block.label}
          </figcaption>
          {/* Der Tipp ruht wie jeder andere Fließtext in Weiß und leuchtet erst
              durch die Animation im Marken-Gelb auf – er ist die Kernaussage
              des Artikels und soll sich am Ende davon abheben. */}
          <MagicText
            as="blockquote"
            text={`„${block.text}"`}
            className="mt-3 font-heading text-2xl italic leading-snug text-white/90"
            revealColor="#f5b301"
          />
        </figure>
      );
    case "table":
      return (
        <div className="glass overflow-x-auto rounded-2xl">
          <table className="w-full min-w-[30rem] text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-white/50">
                {block.head.map((h) => (
                  <th key={h} className="px-4 py-3 font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, i) => (
                <tr key={i} className="border-b border-white/5 last:border-0">
                  {row.map((cell, j) => (
                    <td key={j} className={j === 0 ? "px-4 py-3 font-medium text-white/85" : "px-4 py-3 text-white/65"}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {block.note && <p className="px-4 py-3 text-xs text-white/40">{block.note}</p>}
        </div>
      );
  }
}

export default async function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  const related = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <article data-area="blogartikel">
      {/* Header mit Titelbild */}
      <header data-area="blogartikel-kopf" className="relative">
        {/* Bild und Text liegen im selben Rasterfeld übereinander (`col-start-1 row-start-1`).
            Die Kopfhöhe ist damit die größere der beiden Höhen – und die Bildhöhe darf aus
            dem Bild selbst kommen (`w-full` ganz ohne Höhenangabe).

            Vorher stand das Bild in einer Box mit fester vh-Höhe und `object-cover`. Auf dem
            Handy passte das zufällig, auf dem Desktop war die Box 2,56:1 gegen ein 3:2-Bild –
            rund 40 % des Motivs wurden oben und unten weggeschnitten. `object-contain` wäre
            der naheliegende Weg, gibt aber schwarze Balken an den Seiten; über die Bildhöhe
            zu gehen zeigt das Motiv vollständig **und** randlos. Aus demselben Grund trägt
            der `<header>` kein `overflow-hidden` mehr: das stutzte das Bild auf Texthöhe.

            Der Kopfabstand (früher `pt-28` am Header) sitzt jetzt an der Textspalte, sonst
            begänne das Bild erst unterhalb der Navbar statt am Seitenanfang.

            **Erst ab `md` wird gestapelt.** Ein 3:2-Bild ist auf Handybreite nur rund 250 px
            hoch – der Text läge dann genau auf der Unterkante des Bildes, wo der schwarze
            Verlauf mitten im Übergang ist (der Zurück-Link war dort kaum zu lesen). Auf dem
            Handy steht der Text deshalb im Fluss **unter** dem Bild auf Schwarz. */}
        <div className="md:grid">
          <div className="relative md:col-start-1 md:row-start-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset(post.image)} alt={post.title} className="block w-full" />
            {/* Scrim für Titel, Zurück-Link und die Navbar darüber – nur im oberen Bereich,
                damit das Motiv darunter sichtbar bleibt. */}
            <div className="absolute inset-0 bg-gradient-to-b from-ink/75 via-ink/30 via-40% to-transparent to-70%" />
            {/* Weicher schwarzer Rand nach unten: das Bild läuft ohne sichtbare Kante in die
                schwarze Seite aus. Kurz gehalten, damit er den unteren Bildteil nicht zudeckt –
                deshalb der schnelle Abfall (65 % schon nach einem Fünftel) mit langem Ausläufer. */}
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/65 via-20% to-transparent to-50%" />
          </div>

          <div className="mx-auto w-full max-w-3xl px-5 pb-4 pt-10 md:col-start-1 md:row-start-1 md:px-8 md:pt-64">
            <Reveal>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" /> Zurück zum Blog
              </Link>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-6 flex items-center gap-3">
                <span className="rounded-full bg-white px-3 py-1 font-body text-xs font-medium text-black">
                  {post.category}
                </span>
                <span className="inline-flex items-center gap-1.5 font-body text-xs text-white/60">
                  <Clock className="h-3.5 w-3.5" /> {post.readingTime} Lesezeit
                </span>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <h1 className="mt-5 text-balance font-heading text-2xl italic leading-[1.05] tracking-[-1px] text-brand-gradient md:text-3xl">
                {post.title}
              </h1>
            </Reveal>
          </div>
        </div>
      </header>

      {/* Inhalt */}
      <div data-area="blogartikel-inhalt" className="mx-auto w-full max-w-3xl px-5 py-14 md:px-8">
        {/* `amount="some"`: Dieses eine `Reveal` umhüllt den kompletten Artikeltext (rund
            1860 px). Mit dem Standardwert 0,2 wären auf dem Handy nie genug Prozent davon
            gleichzeitig im Bild – der Text blieb bis zum ersten Scrollen unsichtbar. */}
        <Reveal amount="some">
          <div className="space-y-6">
            {post.body.map((block, i) => (
              <Block key={i} block={block} />
            ))}
          </div>
        </Reveal>

        <div className="hairline my-12" />

        {/* Mini-CTA */}
        <Reveal>
          <div data-area="blogartikel-cta" className="glass-strong flex flex-col items-start justify-between gap-5 rounded-3xl p-7 sm:flex-row sm:items-center">
            <div>
              <h3 className="font-heading text-2xl italic tracking-[-0.5px] text-brand-gradient">Fragen zu diesem Thema?</h3>
              {/* Bewusst ohne MagicText: Der Tipp ist der letzte Block des
                  Artikels und soll auch das Letzte sein, was aufleuchtet. */}
              <p className="mt-1 font-body text-sm font-light text-white/65">
                Unser Meisterteam berät Sie gerne persönlich.
              </p>
            </div>
            <LiquidMetalButton label="Kontakt aufnehmen" href="/kontakt" />
          </div>
        </Reveal>
      </div>

      {/* Weitere Artikel */}
      <Section area="blogartikel-weitere" className="pt-0">
        <h2 className="font-heading text-3xl italic tracking-[-1px] text-brand-gradient">Weitere Artikel</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {related.map((p) => (
            <Link
              key={p.slug}
              href={`/blog/${p.slug}`}
              className="glass glass-glow group flex items-center gap-4 overflow-hidden rounded-2xl p-3"
            >
              <div className="h-20 w-24 shrink-0 overflow-hidden rounded-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={asset(p.image)} alt={p.title} className="h-full w-full object-cover" />
              </div>
              <div className="min-w-0 flex-1 pr-2">
                <span className="font-body text-xs text-white/55">{p.category}</span>
                <h3 className="mt-0.5 line-clamp-2 font-body text-sm font-medium text-white">{p.title}</h3>
              </div>
              <Pfeil className="mr-2 shrink-0" />
            </Link>
          ))}
        </div>
      </Section>
    </article>
  );
}
