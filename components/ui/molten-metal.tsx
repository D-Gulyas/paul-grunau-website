"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * MoltenMetal-Hintergrund nach Molten-Metal.md (React Bits).
 *
 * Der GLSL-Shader ist unverändert aus der Vorlage übernommen. Angebunden ist er
 * über das im Projekt bereits vorhandene **three.js** statt über `ogl` – so kommt
 * keine dritte WebGL-Bibliothek dazu (abgestimmt). Aufbau wie `footer-beam.tsx`:
 * RawShaderMaterial + Orthographic-Kamera + Vollbild-Dreieck.
 *
 * Läuft nur, wenn er im Bild ist und der Tab aktiv ist; bei reduzierter Bewegung
 * wird ein einziges Standbild gezeichnet.
 */

const vertexShader = /* glsl */ `
in vec3 position;
void main() {
  gl_Position = vec4(position, 1.0);
}
`;

// Unverändert aus Molten-Metal.md; nur die Zeile `#version 300 es` entfällt,
// three.js setzt sie über `glslVersion: GLSL3` selbst davor.
const fragmentShader = /* glsl */ `
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform float uSpeed;
uniform float uScale;
uniform float uDetail;
uniform float uGlow;
uniform float uCoreSize;
uniform float uSwirl;
uniform float uFold;
uniform float uBlackPoint;
uniform float uBrightness;
uniform float uColorMode;
uniform float uGrain;
uniform float uGrainIntensity;
uniform float uOpacity;
uniform vec2 uMouse;
uniform float uMouseStrength;
uniform bool uEnableMouse;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
out vec4 fragColor;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  float time = iTime * uSpeed;
  vec2 p = uScale * ((gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y) - 0.5;

  vec2 drift = vec2(0.0);
  if (uEnableMouse) {
    drift = (uMouse - 0.5) * uMouseStrength * 2.0;
  }
  p += drift;

  vec2 i = p;
  float c = 0.0;
  float r = length(p + vec2(sin(time), sin(time * 0.3 + 5.0)) * 0.5);
  float d = length(p);
  float rot = d + time + p.x * uSwirl;

  float cosRot = cos(rot);
  mat2 warp = mat2(cos(rot - sin(time / 5.0)), sin(rot), -sin(cosRot - time), cosRot) * uFold;
  float glowCore = uGlow * uCoreSize;

  for (float n = 0.0; n < 8.0; n++) {
    if (n >= uDetail) break;
    p *= warp;
    float t = r - time / (n + 3.0);
    i -= p + vec2(cos(t - i.x - r) + sin(t + i.y), sin(t - i.y) + cos(t + i.x) + r);
    c += glowCore / length(vec2(sin(i.x + t), cos(i.y + t)));
  }

  c /= 6.0;

  float intensity = max(c - uBlackPoint, 0.0) * uBrightness;

  float g = clamp(intensity, 0.0, 1.0);

  float mid = 0.5;
  if (uColorMode > 1.5) {
    mid = 0.65;
  } else if (uColorMode > 0.5) {
    mid = 0.35;
  }

  vec3 col = mix(uColor1, uColor2, smoothstep(0.0, mid, g));
  col = mix(col, uColor3, smoothstep(mid, 1.0, g));

  float a = g;
  if (uGrain > 0.5) {
    float gr = hash(gl_FragCoord.xy + iTime);
    a += (gr - 0.5) * uGrainIntensity;
  }
  a = clamp(a, 0.0, 1.0) * uOpacity;
  fragColor = vec4(col * a, a);
}
`;

const colorModeToFloat = (mode: string) => (mode === "ember" ? 1 : mode === "frost" ? 2 : 0);

export interface MoltenMetalProps {
  color1?: string;
  color2?: string;
  color3?: string;
  speed?: number;
  scale?: number;
  detail?: number;
  glow?: number;
  coreSize?: number;
  swirl?: number;
  fold?: number;
  blackPoint?: number;
  brightness?: number;
  colorMode?: "molten" | "ember" | "frost";
  grain?: boolean;
  grainIntensity?: number;
  mouseInteraction?: boolean;
  mouseStrength?: number;
  opacity?: number;
  className?: string;
}

export function MoltenMetal({
  color1 = "#5227FF",
  color2 = "#FF9FFC",
  color3 = "#FFFFFF",
  speed = 0.35,
  scale = 4,
  detail = 3,
  glow = 1.6,
  coreSize = 0.1,
  swirl = 1,
  fold = -0.2,
  blackPoint = 0.05,
  brightness = 1.3,
  colorMode = "molten",
  grain = true,
  grainIntensity = 0.05,
  mouseInteraction = true,
  mouseStrength = 0.3,
  opacity = 1.0,
  className = "",
}: MoltenMetalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, -1);

    const uniforms = {
      iTime: { value: 0 },
      iResolution: { value: new THREE.Vector2(1, 1) },
      uSpeed: { value: speed },
      uScale: { value: scale },
      uDetail: { value: detail },
      uGlow: { value: glow },
      uCoreSize: { value: Math.max(coreSize, 0.001) },
      uSwirl: { value: swirl },
      uFold: { value: fold },
      uBlackPoint: { value: blackPoint },
      uBrightness: { value: brightness },
      uColorMode: { value: colorModeToFloat(colorMode) },
      uGrain: { value: grain ? 1 : 0 },
      uGrainIntensity: { value: grainIntensity },
      uOpacity: { value: opacity },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uMouseStrength: { value: mouseStrength },
      uEnableMouse: { value: mouseInteraction },
      uColor1: { value: new THREE.Color(color1) },
      uColor2: { value: new THREE.Color(color2) },
      uColor3: { value: new THREE.Color(color3) },
    };

    // Vollbild-Dreieck: deckt den Ausschnitt mit drei statt sechs Eckpunkten ab.
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]), 3),
    );

    const material = new THREE.RawShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      glslVersion: THREE.GLSL3,
      transparent: true,
      premultipliedAlpha: true,
      depthTest: false,
      depthWrite: false,
      side: THREE.DoubleSide,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.frustumCulled = false;
    scene.add(mesh);

    const resize = () => {
      const w = canvas.clientWidth || 1;
      const h = canvas.clientHeight || 1;
      renderer.setSize(w, h, false);
      uniforms.iResolution.value.set(canvas.width, canvas.height);
    };

    const renderFrame = () => renderer.render(scene, camera);

    const ziel: [number, number] = [0.5, 0.5];
    const jetzt: [number, number] = [0.5, 0.5];
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      ziel[0] = (e.clientX - rect.left) / rect.width;
      ziel[1] = 1 - (e.clientY - rect.top) / rect.height;
    };

    let raf = 0;
    let laeuft = false;
    const t0 = performance.now();

    const animate = () => {
      uniforms.iTime.value = (performance.now() - t0) * 0.001;
      jetzt[0] += 0.05 * (ziel[0] - jetzt[0]);
      jetzt[1] += 0.05 * (ziel[1] - jetzt[1]);
      uniforms.uMouse.value.set(jetzt[0], jetzt[1]);
      renderFrame();
      raf = requestAnimationFrame(animate);
    };

    const start = () => {
      if (laeuft || reduce) return;
      laeuft = true;
      raf = requestAnimationFrame(animate);
    };
    const stop = () => {
      laeuft = false;
      cancelAnimationFrame(raf);
    };

    resize();
    renderFrame();

    const ro = new ResizeObserver(() => {
      resize();
      if (!laeuft) renderFrame();
    });
    ro.observe(canvas);

    // Nur rechnen, wenn der Bereich im Bild ist …
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          resize();
          if (reduce) renderFrame();
          else start();
        } else {
          stop();
        }
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    // … und nicht, wenn der Tab im Hintergrund liegt.
    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);

    // Der Canvas ist pointer-events:none, deshalb hört der Elternbereich mit.
    const maus = canvas.parentElement ?? canvas;
    if (mouseInteraction && !reduce) maus.addEventListener("mousemove", onMouseMove, { passive: true });

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      maus.removeEventListener("mousemove", onMouseMove);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
    // Setup läuft genau einmal – die Werte stehen an der Aufrufstelle fest.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <canvas ref={canvasRef} className={`block h-full w-full ${className}`.trim()} aria-hidden="true" />;
}
