import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";

/* --- Class merge helper (klein, ohne Dependency) --- */
export function cx(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

/* --- Primary / Secondary Button (pill, liquid glass) --- */
type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  icon?: boolean;
  className?: string;
};

export function ButtonLink({ href, children, variant = "primary", icon = true, className }: ButtonProps) {
  const external = href.startsWith("http") || href.startsWith("mailto") || href.startsWith("tel");
  const base =
    "group inline-flex items-center gap-2 rounded-full px-6 py-3 font-body text-sm font-medium transition-all duration-300";
  const styles =
    variant === "primary"
      ? "bg-white text-black hover:-translate-y-0.5"
      : "liquid-glass-strong text-white/90 hover:text-white hover:-translate-y-0.5";

  const content = (
    <>
      {children}
      {icon && (
        <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      )}
    </>
  );

  if (external) {
    return (
      <a href={href} className={cx(base, styles, className)}>
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={cx(base, styles, className)}>
      {content}
    </Link>
  );
}

/* --- Tag / Eyebrow pill (nur intern von Eyebrow genutzt) --- */
function Pill({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cx(
        "liquid-glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 font-body text-xs font-medium tracking-wide text-white/80",
        className,
      )}
    >
      {children}
    </span>
  );
}

/* --- Eyebrow mit Punkt --- */
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <Pill>
      <span className="h-1.5 w-1.5 rounded-full bg-white" />
      <span className="uppercase tracking-[0.16em] text-white/65">{children}</span>
    </Pill>
  );
}

/* --- Section Heading Block --- */
export function SectionHeading({
  eyebrow,
  title,
  intro,
  center,
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  center?: boolean;
}) {
  return (
    <div className={cx("flex flex-col gap-5", center && "items-center text-center")}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="max-w-3xl text-balance font-heading text-4xl italic leading-[0.95] tracking-[-1px] text-brand-gradient sm:text-5xl md:text-6xl">
        {title}
      </h2>
      {intro && (
        <p className="max-w-2xl text-pretty font-body text-base font-light leading-relaxed text-white/70 md:text-lg">
          {intro}
        </p>
      )}
    </div>
  );
}

/* --- Section wrapper mit konsistentem Spacing ---
   `area`: sprechender Bereichsname für Fehlermeldungen/Updates (data-area). */
export function Section({
  children,
  className,
  id,
  area,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  area?: string;
}) {
  return (
    <section
      id={id}
      data-area={area}
      className={cx("mx-auto w-full max-w-6xl px-5 py-20 md:px-8 md:py-28", className)}
    >
      {children}
    </section>
  );
}
