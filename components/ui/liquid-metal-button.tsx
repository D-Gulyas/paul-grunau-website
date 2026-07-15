"use client";

import { liquidMetalFragmentShader, ShaderMount } from "@paper-design/shaders";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { cx } from "@/components/ui";

interface LiquidMetalButtonProps {
  label: string;
  /** Link-Modus: rendert einen Next-Link (inkl. Hash-Anker). */
  href?: string;
  /** Button-Modus (z. B. Formular-Absenden), wenn kein href gesetzt ist. */
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

/**
 * Liquid-Metal-Button (Chrome-Shader) nach Button_Design.md.
 * Behält Text + Pfeil bei. Die Größe richtet sich rein nach dem Inhalt
 * (Text + Pfeil definieren die Breite, feste Höhe) – dadurch stimmt die
 * Größe bereits im ersten Frame (kein Nachjustieren / kein Größensprung).
 * Rendert einen Next-Link (href) oder einen <button> (Formular-Submit).
 */
export function LiquidMetalButton({ label, href, type = "button", onClick, disabled, className }: LiquidMetalButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);

  const shaderRef = useRef<HTMLDivElement>(null);
  // biome-ignore lint/suspicious/noExplicitAny: External library without types
  const shaderMount = useRef<any>(null);
  const interactiveRef = useRef<HTMLElement | null>(null);
  const rippleId = useRef(0);

  useEffect(() => {
    const styleId = "shader-canvas-style-exploded";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        .shader-container-exploded canvas {
          width: 100% !important;
          height: 100% !important;
          display: block !important;
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          border-radius: 100px !important;
        }
        @keyframes ripple-animation {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 0.6; }
          100% { transform: translate(-50%, -50%) scale(4); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }

    if (shaderRef.current) {
      shaderMount.current?.dispose?.();
      shaderMount.current = new ShaderMount(
        shaderRef.current,
        liquidMetalFragmentShader,
        {
          u_repetition: 4,
          u_softness: 0.5,
          u_shiftRed: 0.3,
          u_shiftBlue: 0.3,
          u_distortion: 0,
          u_contour: 0,
          u_angle: 45,
          u_scale: 8,
          u_shape: 0,
          u_offsetX: 0.1,
          u_offsetY: -0.1,
        },
        undefined,
        0.6,
      );
    }

    return () => {
      shaderMount.current?.dispose?.();
      shaderMount.current = null;
    };
  }, []);

  const handleMouseEnter = () => {
    setIsHovered(true);
    shaderMount.current?.setSpeed?.(1);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsPressed(false);
    shaderMount.current?.setSpeed?.(0.6);
  };

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    if (disabled) return;

    shaderMount.current?.setSpeed?.(2.4);
    setTimeout(() => {
      shaderMount.current?.setSpeed?.(isHovered ? 1 : 0.6);
    }, 300);

    if (interactiveRef.current) {
      const rect = interactiveRef.current.getBoundingClientRect();
      const ripple = { x: e.clientX - rect.left, y: e.clientY - rect.top, id: rippleId.current++ };
      setRipples((prev) => [...prev, ripple]);
      setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== ripple.id)), 600);
    }

    onClick?.();
  };

  const textColor = "#e6e6e6";
  const pressTransform = isPressed ? "translateY(1px) scale(0.98)" : "translateY(0) scale(1)";

  // Alle Ebenen liegen absolut über dem Vordergrund (inset: 0) und übernehmen
  // dessen inhaltsbasierte Größe.
  const layerBase: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    transformStyle: "preserve-3d",
  };

  const interactiveStyle: React.CSSProperties = {
    ...layerBase,
    background: "transparent",
    cursor: disabled ? "default" : "pointer",
    outline: "none",
    zIndex: 40,
    transform: "translateZ(25px)",
    overflow: "hidden",
    borderRadius: "100px",
  };

  const rippleNodes = ripples.map((ripple) => (
    <span
      key={ripple.id}
      style={{
        position: "absolute",
        left: `${ripple.x}px`,
        top: `${ripple.y}px`,
        width: "20px",
        height: "20px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 70%)",
        pointerEvents: "none",
        animation: "ripple-animation 0.6s ease-out",
      }}
    />
  ));

  return (
    <div
      className={cx("relative inline-block", className)}
      style={{ opacity: disabled ? 0.6 : 1, transition: "opacity 0.3s ease" }}
    >
      <div style={{ perspective: "1000px", perspectiveOrigin: "50% 50%" }}>
        <div style={{ position: "relative", transformStyle: "preserve-3d" }}>
          {/* Vordergrund: Text + Pfeil – definiert die Größe (feste Höhe, Breite nach Inhalt) */}
          <div
            className="font-body"
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              height: "46px",
              padding: "0 26px",
              transformStyle: "preserve-3d",
              transform: "translateZ(20px)",
              zIndex: 30,
              pointerEvents: "none",
              whiteSpace: "nowrap",
            }}
          >
            <span
              style={{
                fontSize: "14px",
                color: textColor,
                fontWeight: 500,
                textShadow: "0px 1px 2px rgba(0, 0, 0, 0.6)",
              }}
            >
              {label}
            </span>
            <ArrowUpRight
              size={16}
              style={{
                color: textColor,
                filter: "drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.6))",
                transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                transform: isHovered ? "translate(2px, -2px)" : "translate(0, 0)",
              }}
            />
          </div>

          {/* Schwarze Innenfläche (2px innen → Chrome-Rand bleibt sichtbar) */}
          <div style={{ ...layerBase, transform: `translateZ(10px) ${pressTransform}`, zIndex: 20 }}>
            <div
              style={{
                position: "absolute",
                inset: "2px",
                borderRadius: "100px",
                background: "linear-gradient(180deg, #202020 0%, #000000 100%)",
                boxShadow: isPressed
                  ? "inset 0px 2px 4px rgba(0, 0, 0, 0.4), inset 0px 1px 2px rgba(0, 0, 0, 0.3)"
                  : "none",
                transition: "box-shadow 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            />
          </div>

          {/* Chrome-Shader + Schatten */}
          <div style={{ ...layerBase, transform: `translateZ(0px) ${pressTransform}`, zIndex: 10 }}>
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "100px",
                boxShadow: isPressed
                  ? "0px 0px 0px 1px rgba(0, 0, 0, 0.5), 0px 1px 2px 0px rgba(0, 0, 0, 0.3)"
                  : isHovered
                    ? "0px 0px 0px 1px rgba(0, 0, 0, 0.4), 0px 12px 6px 0px rgba(0, 0, 0, 0.05), 0px 8px 5px 0px rgba(0, 0, 0, 0.1), 0px 4px 4px 0px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.2)"
                    : "0px 0px 0px 1px rgba(0, 0, 0, 0.3), 0px 36px 14px 0px rgba(0, 0, 0, 0.02), 0px 20px 12px 0px rgba(0, 0, 0, 0.08), 0px 9px 9px 0px rgba(0, 0, 0, 0.12), 0px 2px 5px 0px rgba(0, 0, 0, 0.15)",
                transition: "box-shadow 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
                background: "rgb(0 0 0 / 0)",
              }}
            >
              <div
                ref={shaderRef}
                className="shader-container-exploded"
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "100px",
                  overflow: "hidden",
                }}
              />
            </div>
          </div>

          {/* Klickbare Ebene (Navigation bzw. Submit + Ripple) */}
          {href ? (
            <Link
              ref={(el) => {
                interactiveRef.current = el;
              }}
              href={href}
              onClick={handleClick}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onMouseDown={() => setIsPressed(true)}
              onMouseUp={() => setIsPressed(false)}
              aria-label={label}
              style={interactiveStyle}
            >
              {rippleNodes}
            </Link>
          ) : (
            <button
              ref={(el) => {
                interactiveRef.current = el;
              }}
              type={type}
              disabled={disabled}
              onClick={handleClick}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onMouseDown={() => setIsPressed(true)}
              onMouseUp={() => setIsPressed(false)}
              aria-label={label}
              style={{ ...interactiveStyle, border: "none" }}
            >
              {rippleNodes}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
