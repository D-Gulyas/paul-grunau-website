import type { ReactNode } from "react";
import { cx } from "@/components/ui";

// text-base auf Mobil (16px) verhindert das automatische Einzoomen von iOS Safari
// beim Fokussieren; ab md zurück auf das gewünschte text-sm.
const fieldBase =
  "w-full rounded-2xl border border-white/15 bg-white/[0.04] px-4 py-3 font-body text-base font-light text-white placeholder:text-white/35 outline-none transition-colors duration-300 focus:border-white/45 focus:bg-white/[0.07] md:text-sm";

export function Label({
  htmlFor,
  children,
  required,
}: {
  htmlFor: string;
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <label htmlFor={htmlFor} className="mb-2 block font-body text-sm font-normal text-white/80">
      {children}
      {required && <span className="ml-0.5 text-white">*</span>}
    </label>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cx(fieldBase, props.className)} />;
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cx(fieldBase, "min-h-32 resize-y", props.className)} />;
}

export function FieldHint({ children }: { children: ReactNode }) {
  return <p className="mt-1.5 text-xs text-white/40">{children}</p>;
}
