"use client";

import { Progress } from "@base-ui/react/progress";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useSpring,
} from "motion/react";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { pointerSpring } from "@/lib/motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";

export function articleProgress(top: number, height: number, viewport: number) {
  const distance = height - viewport;
  // Short notes have no positive scroll range; finish when the last line fits.
  return distance > 0
    ? Math.min(1, Math.max(0, -top / distance))
    : Number(top + height <= viewport);
}

export function ReadingProgress({ children }: { children: ReactNode }) {
  const articleRef = useRef<HTMLDivElement>(null);
  const scrollYProgress = useMotionValue(0);
  const smooth = useSpring(scrollYProgress, pointerSpring);
  const reduce = useReducedMotion();
  const [percent, setPercent] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (value) =>
    setPercent(Math.round(value * 100))
  );
  useEffect(() => {
    const article = articleRef.current;
    if (!article) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const { top, height } = article.getBoundingClientRect();
      scrollYProgress.set(articleProgress(top, height, window.innerHeight));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const observer = new ResizeObserver(schedule);
    observer.observe(article);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    update();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [scrollYProgress]);
  return (
    <>
      <Progress.Root
        aria-label="Reading progress"
        className="fixed inset-x-0 top-0 z-30 h-0.5 bg-muted"
        value={percent}
      >
        <motion.div
          className="h-full origin-left bg-foreground"
          style={{ scaleX: reduce ? scrollYProgress : smooth }}
        />
      </Progress.Root>
      <div ref={articleRef}>{children}</div>
    </>
  );
}
