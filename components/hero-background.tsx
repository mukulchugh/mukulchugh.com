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
      <div
        className="absolute inset-0 w-full h-full pointer-events-none backdrop-blur-[2px]"
        style={{
          background: 'rgba(0,0,0,0.15)',
        }}
      />
      {/* Top gradient overlay for header area */}
      <div
        className="absolute inset-x-0 top-0 h-40 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)',
        }}
      />
      {/* Bottom fade to blend with content */}
      <div
        className="absolute inset-x-0 bottom-0 h-48 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.6) 40%, transparent 100%)',
        }}
      />
      {/* Subtle vignette effect on edges */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.3) 100%)',
        }}
      />
    </div>
  );
}
