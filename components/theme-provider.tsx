"use client";

import { MotionConfig } from "motion/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentProps } from "react";
import { fadeTransition, softSpring } from "@/lib/motion";

export function ThemeProvider({
  children,
  ...props
}: ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider {...props}>
      <MotionConfig
        reducedMotion="user"
        transition={{ ...softSpring, opacity: fadeTransition }}
      >
        {children}
      </MotionConfig>
    </NextThemesProvider>
  );
}
