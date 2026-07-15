import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Clock } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { StaggerGroup, StaggerItem } from "@/components/motion-primitives";
import { Section } from "@/components/ui";
import { blogPosts } from "@/lib/content";
import { asset } from "@/lib/base-path";

export const metadata: Metadata = {
  title: "Blog – Fachwissen & Aktuelles",
  description:
    "Wertvolle Informationen, Tipps und Neuigkeiten rund um Brandschutz und Elektrotechnik. Unser Team teilt regelmäßig sein Expertenwissen.",
};

export default function BlogPage() {
  const [featured, ...rest] = blogPosts;

  return (
    <>
      <PageHero
        area="blog-hero"
        eyebrow="Fachwissen & Aktuelles"
        title={
          <>
            Wissen, das <span className="italic">Sicherheit</span> schafft
          </>
        }
        intro="Hier finden Sie wertvolle Informationen, Tipps und Neuigkeiten rund um die Themen Brandschutz und Elektrotechnik."
      />

      <Section area="blog-liste" className="pt-12">
        {/* Featured Artikel */}
        <StaggerGroup area="blog-artikel-featured">
          <StaggerItem>
            <Link
              href={`/blog/${featured.slug}`}
              className="glass glass-glow group grid overflow-hidden rounded-[2rem] lg:grid-cols-2"
            >
              <div className="relative h-64 overflow-hidden lg:h-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={asset(featured.image)}
                  alt={featured.title}
                  className="h-full w-full transform-gpu object-cover transition-transform duration-500 ease-out [will-change:transform] group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent lg:bg-gradient-to-r" />
              </div>
              <div className="flex flex-col justify-center p-8 md:p-10">
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-white px-3 py-1 font-body text-xs font-medium text-black">
                    {featured.category}
                  </span>
                  <span className="inline-flex items-center gap-1.5 font-body text-xs text-white/55">
                    <Clock className="h-3.5 w-3.5" /> {featured.readingTime}
                  </span>
                </div>
                <h2 className="mt-5 text-balance font-heading text-2xl italic leading-tight tracking-[-1px] text-brand-gradient md:text-[1.7rem]">
                  {featured.title}
                </h2>
                <p className="mt-4 font-body text-sm font-light leading-relaxed text-white/65 md:text-base">
                  {featured.excerpt}
                </p>
                <span className="mt-6 inline-flex items-center gap-1.5 font-body text-sm font-medium text-white/85">
                  Artikel lesen
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>
            </Link>
          </StaggerItem>
        </StaggerGroup>

        {/* Weitere Artikel */}
        <StaggerGroup area="blog-artikel-liste" className="mt-6 grid gap-6 md:grid-cols-2">
          {rest.map((post) => (
            <StaggerItem key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="glass glass-glow group flex h-full flex-col overflow-hidden rounded-3xl"
              >
                <div className="relative h-48 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={asset(post.image)}
                    alt={post.title}
                    className="h-full w-full transform-gpu object-cover transition-transform duration-500 ease-out [will-change:transform] group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-white px-3 py-1 font-body text-xs font-medium text-black">
                      {post.category}
                    </span>
                    <span className="inline-flex items-center gap-1.5 font-body text-xs text-white/55">
                      <Clock className="h-3.5 w-3.5" /> {post.readingTime}
                    </span>
                  </div>
                  <h3 className="mt-3 text-balance font-heading text-xl italic leading-snug tracking-[-0.5px] text-brand-gradient">
                    {post.title}
                  </h3>
                  <p className="mt-2 flex-1 font-body text-sm font-light leading-relaxed text-white/65">{post.excerpt}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 font-body text-sm font-medium text-white/80 transition-colors group-hover:text-white">
                    Weiterlesen
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </Section>
    </>
  );
}
