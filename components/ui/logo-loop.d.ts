import type { CSSProperties, FC } from "react";

/**
 * Typen für logo-loop.jsx. Die Komponente selbst ist bewusst JavaScript
 * (Variante „JavaScript + CSS" der Vorlage); TypeScript braucht diese
 * Deklaration, um die Props an den Aufrufstellen zu prüfen.
 */
export interface LogoItem {
  src: string;
  alt?: string;
  title?: string;
}

export interface LogoLoopProps {
  logos: LogoItem[];
  /** Pixel pro Sekunde. */
  speed?: number;
  direction?: "left" | "right";
  width?: number | string;
  logoHeight?: number;
  gap?: number;
  /** Tempo beim Hovern; 0 pausiert. Ohne Angabe reagiert der Lauf nicht auf Hover. */
  hoverSpeed?: number;
  fadeOut?: boolean;
  fadeOutColor?: string;
  scaleOnHover?: boolean;
  ariaLabel?: string;
  className?: string;
  style?: CSSProperties;
}

export declare const LogoLoop: FC<LogoLoopProps>;
export default LogoLoop;
