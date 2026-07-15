import type { ReactNode } from "react";
import { Reveal } from "@/components/motion-primitives";

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Reveal>
      <section className="glass rounded-3xl p-6 md:p-8">
        <h2 className="font-heading text-2xl italic tracking-[-0.5px] text-brand-gradient">{title}</h2>
        <div className="mt-4 space-y-3 font-body text-sm font-light leading-relaxed text-white/70">{children}</div>
      </section>
    </Reveal>
  );
}
