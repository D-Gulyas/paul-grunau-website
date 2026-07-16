"use client";

import { useEffect, useState } from "react";
import { Lightbulb, LightbulbOff } from "lucide-react";
import { cx } from "@/components/ui";

/**
 * Tag-/Nacht-Umschalter im Glas-Design.
 * Elektriker-Metapher: Glühbirne AN = Tag (heller Modus),
 * Glühbirne AUS = Nacht (dunkler Modus – Standard).
 * Der gewählte Modus wird in localStorage gespeichert; das No-Flash-Script
 * in app/layout.tsx setzt data-theme bereits vor dem ersten Rendern.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  // Anfangszustand aus dem <html data-theme>-Attribut übernehmen (vom Script gesetzt).
  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === "light" ? "light" : "dark");
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("pg-theme", next);
    } catch {
      /* localStorage ggf. blockiert – Umschalten funktioniert trotzdem für die Sitzung */
    }
  };

  const isLight = theme === "light";

  return (
    <button
      type="button"
      onClick={toggle}
      data-area="theme-toggle"
      aria-label={isLight ? "In den Nachtmodus wechseln" : "In den Tagmodus wechseln"}
      aria-pressed={isLight}
      title={isLight ? "Tagmodus aktiv – zum Nachtmodus wechseln" : "Nachtmodus aktiv – zum Tagmodus wechseln"}
      className={cx(
        "grid h-9 w-9 shrink-0 place-items-center rounded-full text-white transition-transform duration-300 hover:-translate-y-0.5",
        className,
      )}
    >
      {isLight ? (
        <Lightbulb className="h-[18px] w-[18px]" strokeWidth={1.75} />
      ) : (
        <LightbulbOff className="h-[18px] w-[18px]" strokeWidth={1.75} />
      )}
    </button>
  );
}
