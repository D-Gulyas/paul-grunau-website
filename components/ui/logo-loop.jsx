"use client";

/**
 * LogoLoop – Endlos-Laufband für die Hersteller-Logos.
 *
 * Aufbau nach der React-Bits-Vorlage (Hersteller/logo_loop.md): die Breiten werden
 * gemessen und die Logo-Liste so oft kopiert, dass der Container immer gefüllt ist.
 *
 * Die Bewegung selbst läuft über framer-motion – wie jede andere Animation der
 * Seite – statt über eine eigene requestAnimationFrame-Schleife:
 *
 *   • `x`     – MotionValue mit dem Versatz des Tracks, gerendert vom `motion.div`
 *   • `tempo` – MotionValue mit der Geschwindigkeit in px/s. Hover blendet sie über
 *               `animate()` weich auf `hoverSpeed` und danach wieder zurück.
 *   • `useAnimationFrame` – schreibt die Position pro Frame fort und hängt damit an
 *               derselben Frame-Schleife wie alle übrigen Animationen.
 *
 * Ein Keyframe-Lauf (`animate={{ x: [...] }}` mit `repeat: Infinity`, wie bei den
 * Kundenstimmen) reicht hier nicht: das Band hat einen einmaligen Einlauf von außen
 * und muss beim Hover weich auf 0 abbremsen statt hart zu stoppen. Beides sind
 * fortlaufende Änderungen am selben Wert – dafür ist der MotionValue da.
 */

import { useCallback, useEffect, useMemo, useRef, useState, memo } from "react";
import { motion, animate, useMotionValue, useAnimationFrame, useReducedMotion } from "framer-motion";
import "./logo-loop.css";

const MIN_COPIES = 2;
const COPY_HEADROOM = 2;

/** Überblendung auf ein neues Tempo (Start, Hover an/aus) – der Standard-Ease des Projekts. */
const TEMPO_WECHSEL = { duration: 0.5, ease: [0.22, 1, 0.36, 1] };

/** Ein Frame nach einem Tab-Wechsel kann sehr lang sein – gedeckelt, damit das Band nicht springt. */
const MAX_FRAME_MS = 100;

const toCssLength = (value) => (typeof value === "number" ? `${value}px` : (value ?? undefined));

const useResizeObserver = (callback, elements, dependencies) => {
  useEffect(() => {
    if (!window.ResizeObserver) {
      const handleResize = () => callback();
      window.addEventListener("resize", handleResize);
      callback();
      return () => window.removeEventListener("resize", handleResize);
    }
    const observers = elements.map((ref) => {
      if (!ref.current) return null;
      const observer = new ResizeObserver(callback);
      observer.observe(ref.current);
      return observer;
    });
    callback();
    return () => {
      observers.forEach((observer) => observer?.disconnect());
    };
  }, [callback, elements, dependencies]);
};

const useImageLoader = (seqRef, onLoad, dependencies) => {
  useEffect(() => {
    const images = seqRef.current?.querySelectorAll("img") ?? [];
    if (images.length === 0) {
      onLoad();
      return;
    }
    let remainingImages = images.length;
    const handleImageLoad = () => {
      remainingImages -= 1;
      if (remainingImages === 0) onLoad();
    };
    images.forEach((img) => {
      if (img.complete) {
        handleImageLoad();
      } else {
        img.addEventListener("load", handleImageLoad, { once: true });
        img.addEventListener("error", handleImageLoad, { once: true });
      }
    });
    return () => {
      images.forEach((img) => {
        img.removeEventListener("load", handleImageLoad);
        img.removeEventListener("error", handleImageLoad);
      });
    };
  }, [onLoad, seqRef, dependencies]);
};

/**
 * Treibt den Track: Tempo als eigener MotionValue, Position pro Frame fortgeschrieben.
 * `x` wird nur angefasst, wenn beide Breiten gemessen sind – vorher steht der Track
 * über seinen Startwert außerhalb des Sichtfelds.
 */
const useLaufband = (x, zielTempo, seqWidth, containerWidth, reduce) => {
  const tempo = useMotionValue(0);
  const einlaufRef = useRef(true);
  const nachLinks = zielTempo >= 0;

  // Tempowechsel weich überblenden – beim Mount von 0 auf Marschtempo, beim Hover
  // auf `hoverSpeed` und zurück. Ein harter Wechsel würde das Band ruckeln lassen.
  useEffect(() => {
    if (reduce) {
      tempo.set(0);
      return;
    }
    const controls = animate(tempo, zielTempo, TEMPO_WECHSEL);
    return () => controls.stop();
  }, [tempo, zielTempo, reduce]);

  // Einlauf: der Track startet komplett außerhalb auf der Seite, von der die Logos
  // hereinkommen. Dadurch ist zuerst nichts zu sehen und der Lauf beginnt sichtbar
  // mit dem ersten Eintrag der Liste.
  useEffect(() => {
    if (reduce) {
      x.set(0);
      return;
    }
    if (seqWidth <= 0 || containerWidth <= 0) return;
    x.set(nachLinks ? containerWidth : -containerWidth);
    einlaufRef.current = true;
    // Absichtlich ohne `nachLinks`/`x` in den Abhängigkeiten: der Einlauf soll an
    // eine neue Messung gekoppelt sein, nicht an jede Tempoänderung.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seqWidth, containerWidth, reduce]);

  useAnimationFrame((_, delta) => {
    if (reduce || seqWidth <= 0 || containerWidth <= 0) return;

    const sekunden = Math.min(delta, MAX_FRAME_MS) / 1000;
    const next = x.get() - tempo.get() * sekunden;

    // Solange der Einlauf läuft, wird nicht umgebrochen – sonst spränge der Track
    // sofort in den Umlaufbereich und der Einlauf wäre nie zu sehen.
    if (einlaufRef.current) {
      if (nachLinks ? next > 0 : next < 0) {
        x.set(next);
        return;
      }
      einlaufRef.current = false;
    }

    // Umlauf: eine Sequenzbreite ist genau eine Kopie der Liste, ein Versatz um diese
    // Breite ist deshalb nicht zu sehen – daher der nahtlose Sprung per Modulo.
    const rest = ((next % seqWidth) + seqWidth) % seqWidth;
    x.set(nachLinks ? rest - seqWidth : rest);
  });
};

/* Props sind in logo-loop.d.ts typisiert – die Implementierung bleibt JavaScript. */
export const LogoLoop = memo(function LogoLoop({
  logos,
  speed = 120,
  direction = "left",
  width = "100%",
  logoHeight = 28,
  gap = 32,
  hoverSpeed,
  fadeOut = false,
  fadeOutColor,
  scaleOnHover = false,
  ariaLabel = "Partner logos",
  className,
  style,
}) {
  const containerRef = useRef(null);
  const seqRef = useRef(null);

  const [seqWidth, setSeqWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [copyCount, setCopyCount] = useState(MIN_COPIES);
  const [isHovered, setIsHovered] = useState(false);

  const reduce = useReducedMotion();

  // Startwert als Prozentangabe: der Track steht schon im ersten Frame außerhalb,
  // bevor die erste Messung da ist. Ab der Messung rechnet das Laufband in Pixeln.
  const x = useMotionValue("100%");

  const marschTempo = useMemo(() => {
    const magnitude = Math.abs(speed);
    const directionMultiplier = direction === "left" ? 1 : -1;
    const speedMultiplier = speed < 0 ? -1 : 1;
    return magnitude * directionMultiplier * speedMultiplier;
  }, [speed, direction]);

  const zielTempo = isHovered && hoverSpeed !== undefined ? hoverSpeed : marschTempo;

  const updateDimensions = useCallback(() => {
    const breite = containerRef.current?.clientWidth ?? 0;
    const sequenceWidth = seqRef.current?.getBoundingClientRect?.().width ?? 0;
    if (breite > 0) setContainerWidth(Math.ceil(breite));
    if (sequenceWidth > 0) {
      setSeqWidth(Math.ceil(sequenceWidth));
      const copiesNeeded = Math.ceil(breite / sequenceWidth) + COPY_HEADROOM;
      setCopyCount(Math.max(MIN_COPIES, copiesNeeded));
    }
  }, []);

  useResizeObserver(updateDimensions, [containerRef, seqRef], [logos, gap, logoHeight]);
  useImageLoader(seqRef, updateDimensions, [logos, gap, logoHeight]);
  useLaufband(x, zielTempo, seqWidth, containerWidth, reduce);

  const cssVariables = useMemo(
    () => ({
      "--logoloop-gap": `${gap}px`,
      "--logoloop-logoHeight": `${logoHeight}px`,
      ...(fadeOutColor && { "--logoloop-fadeColor": fadeOutColor }),
    }),
    [gap, logoHeight, fadeOutColor],
  );

  const rootClassName = useMemo(
    () =>
      ["logoloop", fadeOut && "logoloop--fade", scaleOnHover && "logoloop--scale-hover", className]
        .filter(Boolean)
        .join(" "),
    [fadeOut, scaleOnHover, className],
  );

  const handleMouseEnter = useCallback(() => {
    if (hoverSpeed !== undefined) setIsHovered(true);
  }, [hoverSpeed]);
  const handleMouseLeave = useCallback(() => {
    if (hoverSpeed !== undefined) setIsHovered(false);
  }, [hoverSpeed]);

  const logoLists = useMemo(
    () =>
      Array.from({ length: copyCount }, (_, copyIndex) => (
        <ul
          className="logoloop__list"
          key={`copy-${copyIndex}`}
          role="list"
          aria-hidden={copyIndex > 0}
          ref={copyIndex === 0 ? seqRef : undefined}
        >
          {logos.map((item, itemIndex) => (
            <li className="logoloop__item" key={`${copyIndex}-${itemIndex}`} role="listitem">
              {/* Das Logo wird als Maske gefüllt – die Farbe kommt aus `background-color`
                  (weiß, beim Hover gelb) und ist dadurch exakt. Das <img> darunter ist
                  unsichtbar und liefert nur die richtige Breite zur Logo-Höhe. */}
              <span
                className={`logoloop__logo ${item.className ?? ""}`.trim()}
                style={{ maskImage: `url(${item.src})`, WebkitMaskImage: `url(${item.src})` }}
              >
                {/* Bewusst kein loading="lazy": die Logos starten außerhalb des Sichtfelds,
                    lazy würde das Laden verhindern – und ohne geladenes SVG gibt es keine
                    Breite, womit die Schleife gar nicht erst anliefe. */}
                <img
                  src={item.src}
                  alt={item.alt ?? ""}
                  title={item.title}
                  decoding="async"
                  draggable={false}
                />
              </span>
            </li>
          ))}
        </ul>
      )),
    [copyCount, logos],
  );

  const containerStyle = useMemo(
    () => ({ width: toCssLength(width) ?? "100%", ...cssVariables, ...style }),
    [width, cssVariables, style],
  );

  return (
    <div ref={containerRef} className={rootClassName} style={containerStyle} role="region" aria-label={ariaLabel}>
      <motion.div
        className="logoloop__track"
        style={{ x }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {logoLists}
      </motion.div>
    </div>
  );
});

export default LogoLoop;
