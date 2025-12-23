"use client";

import dynamic from "next/dynamic";
import { useTheme } from "@/context/theme-context";

// Dynamic import to avoid SSR issues with Three.js
const InteractiveNebulaShader = dynamic(
  () => import("@/components/ui/liquid-shader").then((mod) => mod.InteractiveNebulaShader),
  { ssr: false }
);

export function HeroBackground() {
  const { theme } = useTheme();

  return (
    <div className="absolute inset-x-0 top-0 h-screen -z-10 overflow-hidden">
      <InteractiveNebulaShader theme={theme} />
      {/* Overlay with blur - dark tint for dark mode, light tint for light mode */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none backdrop-blur-[2px]"
        style={{
          background: theme === "dark"
            ? 'rgba(0,0,0,0.15)'
            : 'rgba(255,255,255,0.2)',
        }}
      />
      {/* Top gradient overlay for header area - theme aware */}
      <div
        className="absolute inset-x-0 top-0 h-40 pointer-events-none"
        style={{
          background: theme === "dark"
            ? 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)'
            : 'linear-gradient(to bottom, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
        }}
      />
      {/* Bottom fade to blend with content - theme aware */}
      <div
        className="absolute inset-x-0 bottom-0 h-48 pointer-events-none"
        style={{
          background: theme === "dark"
            ? 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.6) 40%, transparent 100%)'
            : 'linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,0.6) 40%, transparent 100%)',
        }}
      />
      {/* Subtle vignette effect on edges - theme aware */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: theme === "dark"
            ? 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.3) 100%)'
            : 'radial-gradient(ellipse at center, transparent 50%, rgba(255,255,255,0.3) 100%)',
        }}
      />
    </div>
  );
}
