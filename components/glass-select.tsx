"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cx } from "@/components/ui";

/**
 * Eigenes Dropdown im Liquid-Glass-Look (native <select>-Popups lassen sich
 * nicht zuverlässig stylen). Reicht den gewählten Wert über ein verstecktes,
 * fokussierbares Input ans Formular weiter – inkl. nativer required-Prüfung.
 */
export function GlassSelect({
  id,
  name,
  options,
  placeholder = "Bitte auswählen…",
  required,
}: {
  id?: string;
  name: string;
  options: string[];
  placeholder?: string;
  required?: boolean;
}) {
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listId = useId();

  // Schließen bei Klick außerhalb
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const choose = (opt: string) => {
    setValue(opt);
    setOpen(false);
    buttonRef.current?.focus();
  };

  const openMenu = () => {
    setActive(value ? Math.max(0, options.indexOf(value)) : 0);
    setOpen(true);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!open) openMenu();
        else setActive((i) => Math.min(options.length - 1, i + 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        if (open) setActive((i) => Math.max(0, i - 1));
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (open && active >= 0) choose(options[active]);
        else openMenu();
        break;
      case "Escape":
        setOpen(false);
        break;
    }
  };

  return (
    <div ref={rootRef} className="relative">
      {/* Verstecktes Feld: Formular-Submit + native required-Prüfung */}
      <input
        type="text"
        name={name}
        value={value}
        onChange={() => {}}
        required={required}
        tabIndex={-1}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-0"
      />

      <button
        ref={buttonRef}
        type="button"
        id={id}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={onKeyDown}
        className={cx(
          "flex w-full items-center justify-between rounded-2xl border border-white/15 bg-white/[0.04] px-4 py-3 text-left font-body text-base font-light outline-none transition-colors duration-300 focus:border-white/45 focus:bg-white/[0.07] md:text-sm",
          value ? "text-white" : "text-white/35",
        )}
      >
        <span className="truncate">{value || placeholder}</span>
        <ChevronDown
          className={cx("ml-2 h-4 w-4 shrink-0 text-white/50 transition-transform duration-300", open && "rotate-180")}
        />
      </button>

      {open && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-30 mt-2 max-h-64 w-full overflow-auto rounded-2xl border border-white/12 bg-[#0c0c0f]/90 p-1.5 shadow-[0_24px_60px_-18px_rgba(0,0,0,0.9)] backdrop-blur-2xl"
        >
          {options.map((opt, i) => {
            const selected = opt === value;
            return (
              <li
                key={opt}
                role="option"
                aria-selected={selected}
                onMouseEnter={() => setActive(i)}
                onClick={() => choose(opt)}
                className={cx(
                  "flex cursor-pointer items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 font-body text-sm transition-colors duration-150",
                  active === i ? "bg-white/10 text-white" : "text-white/80",
                )}
              >
                <span>{opt}</span>
                {selected && <Check className="h-4 w-4 shrink-0 text-white" />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
