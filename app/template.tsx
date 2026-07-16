/**
 * Next.js-Template: Anders als das Layout wird ein Template bei JEDER Navigation
 * neu instanziiert. Dadurch wird der Seiteninhalt frisch gemountet, statt dass
 * React die vorhandenen `motion`-Komponenten strukturgleicher Seiten wiederverwendet.
 *
 * Ergebnis: Die Einblend-Animationen (Reveal/Stagger) laufen auf ALLEN Unterseiten
 * bei jedem Aufruf sauber und einheitlich neu ab – so wie auf der Startseite,
 * unabhängig davon, in welcher Reihenfolge die Links aufgerufen werden.
 * (Tag- und Nacht-Modus verhalten sich identisch, da die Animationen rein
 * über Opacity/Blur/Position laufen, nicht über Farben.)
 *
 * Navbar und Footer liegen im Layout und bleiben davon unberührt.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
