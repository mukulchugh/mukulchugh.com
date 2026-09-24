"use client";

import { usePathname } from "next/navigation";
import { type ReactNode, useLayoutEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/use-reduced-motion";

export function RouteTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const element = useRef<HTMLDivElement>(null);
  const previousPath = useRef(pathname);
  useLayoutEffect(() => {
    const changed = previousPath.current !== pathname;
    previousPath.current = pathname;
    if (!changed || reduce) return;
    const animation = element.current?.animate(
      [{ opacity: 0.65 }, { opacity: 1 }],
      {
        duration: 160,
        easing: "cubic-bezier(0.16, 1, 0.3, 1)",
      }
    );
    return () => animation?.cancel();
  }, [pathname, reduce]);
  // Do not retain old App Router trees for an exit: navigation stays immediate.
  // Opacity also avoids making a transformed ancestor for fixed/sticky content.
  return (
    <div key={pathname} ref={element}>
      {children}
    </div>
  );
}
