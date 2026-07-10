"use client";

/**
 * ShaderBackground — subtle monochrome flowing shader behind the whole page.
 *
 * Uses @paper-design/shaders-react <MeshGradient> (battle-tested WebGL) with a
 * strictly grayscale / warm-neutral palette so it reads as premium depth and
 * never competes with text. A translucent scrim + grain sit on top.
 *
 * Robustness:
 *   - prefers-reduced-motion → static CSS fallback (no WebGL, no motion)
 *   - React error boundary → if the shader throws, silently fall back to CSS
 *   - fixed inset-0 -z-10 pointer-events-none, so it never intercepts input
 */

import React, { Component, type ReactNode } from "react";
import { useReducedMotion } from "motion/react";
import { Dithering } from "@paper-design/shaders-react";

/* ─── Static CSS fallback (reduced-motion / no WebGL / shader error) ─────── */
function CSSFallback() {
  return (
    <div
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
      style={{ background: "#faf9f7" }}
      aria-hidden="true"
    >
      <div className="aurora-blob aurora-blob-1" />
      <div className="aurora-blob aurora-blob-2" />
      <div className="aurora-blob aurora-blob-3" />
      <div className="aurora-blob aurora-blob-4" />
      <div className="absolute inset-0 grain-overlay pointer-events-none" />
    </div>
  );
}

/* ─── Error boundary so a shader crash never surfaces to the user ────────── */
class ShaderErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; fallback: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

/* ─── Public component ─────────────────────────────────────────────────── */
export function ShaderBackground() {
  const shouldReduce = useReducedMotion();

  if (shouldReduce) return <CSSFallback />;

  return (
    <ShaderErrorBoundary fallback={<CSSFallback />}>
      <div
        className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
        style={{ background: "#faf9f7" }}
        aria-hidden="true"
      >
        {/* Cool monochrome warp-dithering field (2-color Bayer) */}
        <Dithering
          colorBack="#faf9f7"
          colorFront="#cbc7bd"
          shape="warp"
          type="4x4"
          size={2}
          scale={0.9}
          speed={0.6}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
          }}
        />
        {/* Light scrim so text over the margins stays readable */}
        <div
          className="absolute inset-0"
          style={{ background: "rgba(250,249,247,0.20)" }}
        />
        {/* Vignette + grain for editorial texture */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_-5%,transparent_0%,rgba(250,249,247,0.55)_100%)]" />
        <div className="absolute inset-0 grain-overlay pointer-events-none" />
      </div>
    </ShaderErrorBoundary>
  );
}
