// HeroBackground — delegates to the WebGL ShaderBackground (with CSS fallback).
// The ShaderBackground handles: WebGL detection, error boundary, reduced-motion.
// Import is dynamic so the canvas never runs on the server.
"use client";

import dynamic from "next/dynamic";

/* CSS-only fallback shown while the client bundle hydrates */
function CSSBackground() {
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
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_85%_65%_at_50%_0%,transparent_0%,rgba(245,243,240,0.40)_100%)]" />
      <div className="absolute inset-0 grain-overlay pointer-events-none" />
    </div>
  );
}

const ShaderBackground = dynamic(
  () =>
    import("@/components/shader-background").then((m) => m.ShaderBackground),
  {
    ssr: false,
    loading: () => <CSSBackground />,
  }
);

export function HeroBackground() {
  return <ShaderBackground />;
}
