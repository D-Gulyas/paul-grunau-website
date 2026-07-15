"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Bewegter Lichtstrahl als dezenter Footer-Hintergrund.
 * WebGL-Fragment-Shader aus footer_design.md – auf den Footer-Container
 * zugeschnitten, läuft nur im Viewport und respektiert prefers-reduced-motion.
 */
export function FooterBeam() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const vertexShader = `
      attribute vec3 position;
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      precision highp float;
      uniform vec2 resolution;
      uniform float time;
      uniform float xScale;
      uniform float yScale;
      uniform float distortion;

      void main() {
        vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

        float d = length(p) * distortion;

        float rx = p.x * (1.0 + d);
        float gx = p.x;
        float bx = p.x * (1.0 - d);

        float r = 0.05 / abs(p.y + sin((rx + time) * xScale) * yScale);
        float g = 0.05 / abs(p.y + sin((gx + time) * xScale) * yScale);
        float b = 0.05 / abs(p.y + sin((bx + time) * xScale) * yScale);

        gl_FragColor = vec4(r, g, b, 1.0);
      }
    `;

    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(new THREE.Color(0x000000));

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, -1);

    const uniforms = {
      resolution: { value: [1, 1] as [number, number] },
      time: { value: 0 },
      // Chrome-Look: sehr geringe Aufspaltung → weißer/silbriger Kern, Farben
      // (blau/grün/orange) nur als minimaler Spektral-Rand.
      xScale: { value: 0.6 },
      yScale: { value: 0.7 },
      distortion: { value: 0.012 },
    };

    const verts = [-1, -1, 0, 1, -1, 0, -1, 1, 0, 1, -1, 0, -1, 1, 0, 1, 1, 0];
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(verts), 3));

    const material = new THREE.RawShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      // Ohne DoubleSide wird eines der beiden Quad-Dreiecke weggecullt → diagonaler Keil.
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let raf = 0;
    let running = false;

    const resize = () => {
      const w = canvas.clientWidth || 1;
      const h = canvas.clientHeight || 1;
      renderer.setSize(w, h, false);
      uniforms.resolution.value = [canvas.width, canvas.height];
    };

    const renderFrame = () => renderer.render(scene, camera);

    const animate = () => {
      uniforms.time.value += 0.01;
      renderFrame();
      raf = requestAnimationFrame(animate);
    };

    const start = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(animate);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    resize();

    const ro = new ResizeObserver(() => {
      resize();
      if (!running) renderFrame();
    });
    ro.observe(canvas);

    // Nur animieren, wenn der Footer sichtbar ist
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

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="h-full w-full" aria-hidden="true" />;
}
