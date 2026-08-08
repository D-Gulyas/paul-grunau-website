import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/motion-primitives";
import { Section } from "@/components/ui";
import { BlogGallery } from "@/components/blog-gallery";
import { blogPosts } from "@/lib/content";

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
        {/* Ein Artikel nach dem anderen, zentriert und selbst weiterzuklicken –
            fünf Karten nebeneinander wirkten überladen. */}
        <Reveal>
          <BlogGallery posts={blogPosts} />
        </Reveal>
      </Section>
    </>
  );
}
