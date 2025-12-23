"use client";

import React, { useEffect, useRef, useCallback } from "react";
import * as THREE from "three";

export interface InteractiveNebulaShaderProps {
  className?: string;
  theme?: "light" | "dark";
}

export function InteractiveNebulaShader({
  className = "",
  theme = "dark",
}: InteractiveNebulaShaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationIdRef = useRef<number | null>(null);
  const uniformsRef = useRef<{
    iTime: { value: number };
    iResolution: { value: THREE.Vector2 };
    isDarkMode: { value: number };
  } | null>(null);

  // Update theme uniform when theme changes
  useEffect(() => {
    if (uniformsRef.current) {
      uniformsRef.current.isDarkMode.value = theme === "dark" ? 1.0 : 0.0;
    }
    if (rendererRef.current) {
      const clearColor = theme === "dark" ? 0x000000 : 0xffffff;
      rendererRef.current.setClearColor(clearColor, 1);
    }
  }, [theme]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // OPTIMIZATION 1: Lower pixel ratio (max 1.5 instead of 2)
    const pixelRatio = Math.min(window.devicePixelRatio, 1.5);

    // OPTIMIZATION 2: Disable antialiasing and use powerPreference
    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: false,
      powerPreference: "low-power",
      precision: "mediump"
    });
    rendererRef.current = renderer;
    renderer.setPixelRatio(pixelRatio);
    const clearColor = theme === "dark" ? 0x000000 : 0xffffff;
    renderer.setClearColor(clearColor, 1);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // Vertex shader
    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    // OPTIMIZATION 3: Simplified fragment shader with fewer iterations and calculations
    const fragmentShader = `
      precision mediump float;
      uniform vec2 iResolution;
      uniform float iTime;
      uniform float isDarkMode;
      varying vec2 vUv;

      #define t iTime

      mat2 rot(float a) {
        float c = cos(a), s = sin(a);
        return mat2(c, -s, s, c);
      }

      float map(vec3 p) {
        p.xz *= rot(t * 0.1);
        p.xy *= rot(t * 0.08);
        vec3 q = p * 2.0 + t * 0.3;
        return length(p + vec3(sin(t * 0.2))) * log(length(p) + 1.0)
             + sin(q.x + sin(q.z + sin(q.y))) * 0.5 - 1.0;
      }

      void main() {
        vec2 fragCoord = vUv * iResolution;

        // Background color based on theme
        vec3 bgColor = isDarkMode > 0.5 ? vec3(0.0) : vec3(1.0);

        // Center the nebula
        vec2 center = iResolution * 0.5;
        center.y = iResolution.y * (iResolution.x / iResolution.y < 1.0 ? 0.5 : 0.45);

        vec2 uv = (fragCoord - center) / min(iResolution.x, iResolution.y) * 0.6;
        vec3 col = vec3(0.0);
        float d = 2.5;

        // OPTIMIZATION: Reduced iterations from 8 to 5
        for (int i = 0; i < 5; i++) {
          vec3 p = vec3(0.0, 0.0, 4.0) + normalize(vec3(uv, -1.0)) * d;
          float rz = map(p);
          float f = clamp((rz - map(p + 0.1)) * 0.5, -0.1, 1.0);

          // Theme-aware nebula colors
          vec3 base = isDarkMode > 0.5
            ? vec3(0.15, 0.35, 0.45) + vec3(4.0, 2.0, 2.5) * f
            : vec3(0.85, 0.7, 0.85) + vec3(0.8, 0.5, 0.9) * f;

          col = col * base + smoothstep(3.0, 0.0, rz) * 0.55 * base;
          d += min(rz, 1.2);
        }

        // Adjust brightness
        col *= isDarkMode > 0.5 ? 1.4 : 1.2;

        // Center dimming for text readability
        float dist = distance(fragCoord, iResolution * 0.5);
        float radius = max(iResolution.x, iResolution.y) * 0.5;
        float dim = smoothstep(radius * 0.15, radius * 0.5, dist);

        // Final color mixing
        vec3 finalCol;
        if (isDarkMode > 0.5) {
          finalCol = mix(col * 0.3, col, dim);
        } else {
          vec3 nebulaEffect = col * 0.5;
          float centerWhite = 1.0 - dim * 0.7;
          finalCol = bgColor - nebulaEffect * (1.0 - centerWhite * 0.5);
          finalCol = max(finalCol, vec3(0.75));
          finalCol = mix(finalCol, finalCol + nebulaEffect * 0.4, dim * 0.8);
          finalCol = mix(bgColor * 0.95, finalCol, 0.85);
        }

        gl_FragColor = vec4(finalCol, 1.0);
      }
    `;

    // Uniforms (removed unused iMouse)
    const uniforms = {
      iTime: { value: 0 },
      iResolution: { value: new THREE.Vector2() },
      isDarkMode: { value: theme === "dark" ? 1.0 : 0.0 },
    };
    uniformsRef.current = uniforms;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
    });
    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Resize handler with debounce
    let resizeTimeout: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const w = container.clientWidth;
        const h = container.clientHeight;
        renderer.setSize(w, h);
        uniforms.iResolution.value.set(w * pixelRatio, h * pixelRatio);
      }, 100);
    };
    window.addEventListener("resize", onResize);

    // Initial size
    const w = container.clientWidth;
    const h = container.clientHeight;
    renderer.setSize(w, h);
    uniforms.iResolution.value.set(w * pixelRatio, h * pixelRatio);

    // OPTIMIZATION 4: Frame rate limiting (30 FPS instead of 60)
    let lastTime = 0;
    const targetFPS = 30;
    const frameInterval = 1000 / targetFPS;

    const animate = (currentTime: number) => {
      animationIdRef.current = requestAnimationFrame(animate);

      const delta = currentTime - lastTime;
      if (delta < frameInterval) return;

      lastTime = currentTime - (delta % frameInterval);
      uniforms.iTime.value = currentTime * 0.001; // Convert to seconds
      renderer.render(scene, camera);
    };

    animationIdRef.current = requestAnimationFrame(animate);

    // OPTIMIZATION 5: Pause animation when tab is not visible
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (animationIdRef.current) {
          cancelAnimationFrame(animationIdRef.current);
          animationIdRef.current = null;
        }
      } else {
        if (!animationIdRef.current) {
          lastTime = performance.now();
          animationIdRef.current = requestAnimationFrame(animate);
        }
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearTimeout(resizeTimeout);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      material.dispose();
      geometry.dispose();
      renderer.dispose();
      rendererRef.current = null;
      uniformsRef.current = null;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 ${className}`}
      aria-hidden="true"
    />
  );
}
