"use client";

import React, { useEffect, useRef, useCallback } from "react";
import {
  WebGLRenderer,
  Scene,
  OrthographicCamera,
  ShaderMaterial,
  PlaneGeometry,
  Mesh,
  Vector2,
  Matrix3,
} from "@/lib/three-minimal";

export interface InteractiveNebulaShaderProps {
  className?: string;
}

// Device capability detection for adaptive quality
function getDeviceCapabilities(): {
  iterations: number;
  pixelRatio: number;
  targetFPS: number;
} {
  if (typeof window === "undefined") {
    return { iterations: 5, pixelRatio: 1.5, targetFPS: 30 };
  }

  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl");
    if (!gl) {
      return { iterations: 3, pixelRatio: 1, targetFPS: 24 };
    }

    const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = debugInfo
      ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
      : "";

    // Detect low-end GPUs
    const isLowEnd = /Intel|Mali-4|Mali-T[1-6]|Adreno [1-4]|PowerVR/i.test(
      renderer
    );
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (isLowEnd || isMobile) {
      return { iterations: 3, pixelRatio: 1, targetFPS: 24 };
    }

    return {
      iterations: 5,
      pixelRatio: Math.min(window.devicePixelRatio, 1.5),
      targetFPS: 30,
    };
  } catch {
    return { iterations: 3, pixelRatio: 1, targetFPS: 24 };
  }
}

export function InteractiveNebulaShader({
  className = "",
}: InteractiveNebulaShaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<WebGLRenderer | null>(null);
  const animationIdRef = useRef<number | null>(null);
  const isVisibleRef = useRef(true);
  const uniformsRef = useRef<{
    iTime: { value: number };
    iResolution: { value: Vector2 };
    uRotXZ: { value: Matrix3 };
    uRotXY: { value: Matrix3 };
  } | null>(null);

  const startAnimation = useCallback((animate: (time: number) => void) => {
    if (!animationIdRef.current && isVisibleRef.current) {
      animationIdRef.current = requestAnimationFrame(animate);
    }
  }, []);

  const stopAnimation = useCallback(() => {
    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current);
      animationIdRef.current = null;
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Get device-appropriate settings
    const capabilities = getDeviceCapabilities();

    const renderer = new WebGLRenderer({
      antialias: false,
      alpha: false,
      powerPreference: "low-power",
      precision: "mediump",
      stencil: false,
      depth: false,
    });
    rendererRef.current = renderer;
    renderer.setPixelRatio(capabilities.pixelRatio);
    renderer.setClearColor(0x000000, 1);
    container.appendChild(renderer.domElement);

    const scene = new Scene();
    const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // Optimized vertex shader
    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    // Optimized fragment shader - dark mode only, pre-calculated rotations
    const fragmentShader = `
      precision mediump float;
      uniform vec2 iResolution;
      uniform float iTime;
      uniform mat3 uRotXZ;
      uniform mat3 uRotXY;
      varying vec2 vUv;

      float map(vec3 p) {
        // Apply pre-calculated rotations (much faster than calculating sin/cos per pixel)
        p = uRotXZ * p;
        p = uRotXY * p;
        vec3 q = p * 2.0 + iTime * 0.3;
        return length(p + vec3(sin(iTime * 0.2))) * log(length(p) + 1.0)
             + sin(q.x + sin(q.z + sin(q.y))) * 0.5 - 1.0;
      }

      void main() {
        vec2 fragCoord = vUv * iResolution;

        // Center the nebula
        vec2 center = iResolution * 0.5;
        float aspectRatio = iResolution.x / iResolution.y;
        center.y = iResolution.y * mix(0.5, 0.45, step(1.0, aspectRatio));

        vec2 uv = (fragCoord - center) / min(iResolution.x, iResolution.y) * 0.6;
        vec3 col = vec3(0.0);
        float d = 2.5;

        // Dynamic iterations based on device capability (injected at compile time)
        for (int i = 0; i < ${capabilities.iterations}; i++) {
          vec3 p = vec3(0.0, 0.0, 4.0) + normalize(vec3(uv, -1.0)) * d;
          float rz = map(p);
          float f = clamp((rz - map(p + 0.1)) * 0.5, -0.1, 1.0);

          // Dark mode nebula colors
          vec3 base = vec3(0.15, 0.35, 0.45) + vec3(4.0, 2.0, 2.5) * f;
          col = col * base + smoothstep(3.0, 0.0, rz) * 0.55 * base;
          d += min(rz, 1.2);
        }

        col *= 1.4;

        // Center dimming for text readability
        float dist = distance(fragCoord, iResolution * 0.5);
        float radius = max(iResolution.x, iResolution.y) * 0.5;
        float dim = smoothstep(radius * 0.15, radius * 0.5, dist);

        vec3 finalCol = mix(col * 0.3, col, dim);
        gl_FragColor = vec4(finalCol, 1.0);
      }
    `;

    // Uniforms with pre-calculated rotation matrices
    const uniforms = {
      iTime: { value: 0 },
      iResolution: { value: new Vector2() },
      uRotXZ: { value: new Matrix3() },
      uRotXY: { value: new Matrix3() },
    };
    uniformsRef.current = uniforms;

    const material = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
    });
    const geometry = new PlaneGeometry(2, 2);
    const mesh = new Mesh(geometry, material);
    scene.add(mesh);

    // Resize handler with debounce
    let resizeTimeout: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const w = container.clientWidth;
        const h = container.clientHeight;
        renderer.setSize(w, h);
        uniforms.iResolution.value.set(
          w * capabilities.pixelRatio,
          h * capabilities.pixelRatio
        );
      }, 100);
    };
    window.addEventListener("resize", onResize);

    // Initial size
    const w = container.clientWidth;
    const h = container.clientHeight;
    renderer.setSize(w, h);
    uniforms.iResolution.value.set(
      w * capabilities.pixelRatio,
      h * capabilities.pixelRatio
    );

    // Frame rate limiting
    let lastTime = 0;
    const frameInterval = 1000 / capabilities.targetFPS;

    const animate = (currentTime: number) => {
      animationIdRef.current = requestAnimationFrame(animate);

      const delta = currentTime - lastTime;
      if (delta < frameInterval) return;

      lastTime = currentTime - (delta % frameInterval);
      const time = currentTime * 0.001;
      uniforms.iTime.value = time;

      // Pre-calculate rotation matrices (once per frame instead of per pixel)
      const cosXZ = Math.cos(time * 0.1);
      const sinXZ = Math.sin(time * 0.1);
      const cosXY = Math.cos(time * 0.08);
      const sinXY = Math.sin(time * 0.08);

      // XZ rotation matrix (rotation around Y axis)
      uniforms.uRotXZ.value.set(
        cosXZ, 0, sinXZ,
        0, 1, 0,
        -sinXZ, 0, cosXZ
      );

      // XY rotation matrix (rotation around Z axis)
      uniforms.uRotXY.value.set(
        cosXY, -sinXY, 0,
        sinXY, cosXY, 0,
        0, 0, 1
      );

      renderer.render(scene, camera);
    };

    // Intersection Observer - only render when in viewport
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          lastTime = performance.now();
          startAnimation(animate);
        } else {
          stopAnimation();
        }
      },
      { threshold: 0.1 }
    );
    intersectionObserver.observe(container);

    // Visibility change handler - pause when tab is hidden
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopAnimation();
      } else if (isVisibleRef.current) {
        lastTime = performance.now();
        startAnimation(animate);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Start animation if visible
    if (isVisibleRef.current) {
      animationIdRef.current = requestAnimationFrame(animate);
    }

    return () => {
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      intersectionObserver.disconnect();
      clearTimeout(resizeTimeout);
      stopAnimation();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      material.dispose();
      geometry.dispose();
      renderer.dispose();
      rendererRef.current = null;
      uniformsRef.current = null;
    };
  }, [startAnimation, stopAnimation]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 ${className}`}
      aria-hidden="true"
    />
  );
}
