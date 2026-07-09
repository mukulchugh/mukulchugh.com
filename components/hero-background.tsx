// Pure-CSS aurora backdrop — no WebGL, no Three.js.
// Subtle warm-neutral blobs add depth behind glass tiles at very low opacity.
// Grain overlay provides premium texture at very low opacity.

export function HeroBackground() {
  return (
    <div
      className="fixed inset-0 -z-10 overflow-hidden"
      style={{ background: "#faf9f7" }}
      aria-hidden="true"
    >
      {/* Blob 1 — warm silver, top-left */}
      <div className="aurora-blob aurora-blob-1" />
      {/* Blob 2 — cool silver, top-right */}
      <div className="aurora-blob aurora-blob-2" />
      {/* Blob 3 — warm peach, bottom-center */}
      <div className="aurora-blob aurora-blob-3" />
      {/* Blob 4 — neutral, bottom-right */}
      <div className="aurora-blob aurora-blob-4" />
      {/* Radial vignette — very subtle warm wash at edges */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_85%_65%_at_50%_0%,transparent_0%,rgba(245,243,240,0.40)_100%)]" />
      {/* Grain / noise overlay — premium texture at low opacity */}
      <div className="absolute inset-0 grain-overlay pointer-events-none" />
    </div>
  );
}
