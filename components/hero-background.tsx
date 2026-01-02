"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Dynamic import to avoid SSR issues with Three.js
// Defer loading until after initial paint for better LCP
const InteractiveNebulaShader = dynamic(
  () => import("@/components/ui/liquid-shader").then((mod) => mod.InteractiveNebulaShader),
  { ssr: false, loading: () => <div className="absolute inset-0 bg-black" /> }
);

export function HeroBackground() {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    // Defer loading until after LCP (use requestIdleCallback or setTimeout)
    const timer = setTimeout(() => {
      setShouldLoad(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="absolute inset-x-0 top-0 h-screen -z-10 overflow-hidden">
      {shouldLoad ? <InteractiveNebulaShader /> : <div className="absolute inset-0 bg-black" />}
      {/* Overlay with blur */}
      <div className="absolute inset-0 w-full h-full pointer-events-none backdrop-blur-[2px] bg-black/15" />
      {/* Top gradient overlay for header area */}
      <div className="absolute inset-x-0 top-0 h-40 pointer-events-none bg-gradient-to-b from-black/60 via-black/30 to-transparent" />
      {/* Bottom fade to blend with content */}
      <div className="absolute inset-x-0 bottom-0 h-48 pointer-events-none bg-[linear-gradient(to_top,rgba(0,0,0,1)_0%,rgba(0,0,0,0.6)_40%,transparent_100%)]" />
      {/* Subtle vignette effect on edges */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.3)_100%)]" />
    </div>
  );
}
