import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { StaggerGroup, StaggerItem } from "@/components/motion-primitives";
import { Section } from "@/components/ui";
import { BlogCard } from "@/components/ui/blog-card";
import { blogPosts } from "@/lib/content";
import { asset } from "@/lib/base-path";

export const metadata: Metadata = {
  title: "Blog – Fachwissen & Aktuelles",
  description:
    "Wertvolle Informationen, Tipps und Neuigkeiten rund um Brandschutz und Elektrotechnik. Unser Team teilt regelmäßig sein Expertenwissen.",
};

export default function BlogPage() {
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
        {/* Fünf gleichwertige Karten im neuen Design (`ui/blog-card.tsx`) – kein
            hervorgehobener Artikel mehr, damit alle Karten dieselbe Form haben. */}
        <StaggerGroup
          area="blog-artikel-liste"
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {blogPosts.map((post) => (
            <StaggerItem key={post.slug} className="h-[420px] sm:h-[440px]">
              <BlogCard
                imageUrl={asset(post.image)}
                category={post.category}
                readingTime={post.readingTime}
                title={post.title}
                href={`/blog/${post.slug}`}
              />
            </StaggerItem>
          ))}
        </StaggerGroup>
      </Section>
    </>
  );
}
