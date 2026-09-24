"use client";

import { motion } from "motion/react";
import { usePathname } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";
import { fadeTransition } from "@/lib/motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";

export function RouteTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  // Do not retain old App Router trees for an exit: navigation stays immediate.
  // Opacity also avoids making a transformed ancestor for fixed/sticky content.
  return (
    <motion.div
      animate={{ opacity: 1 }}
      initial={reduce || !mounted ? false : { opacity: 0.65 }}
      key={pathname}
      transition={fadeTransition}
    >
      {children}
    </motion.div>
  );
}
