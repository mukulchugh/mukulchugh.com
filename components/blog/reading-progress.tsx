"use client";

import { useEffect, useState } from "react";

export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Respect prefers-reduced-motion — still show bar at 0, but don't animate
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    function onScroll() {
      const doc = document.documentElement;
      const scrollTop = window.scrollY;
      const docHeight = doc.scrollHeight - doc.clientHeight;
      const pct =
        docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0;
      setProgress(prefersReduced ? 100 : pct);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // set initial value
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      aria-label="Reading progress"
      aria-valuemax={100}
      aria-valuemin={0}
      aria-valuenow={Math.round(progress)}
      className="fixed top-0 left-0 right-0 h-[2px] z-50 bg-muted"
      role="progressbar"
    >
      <div
        className="h-full bg-foreground transition-none"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
