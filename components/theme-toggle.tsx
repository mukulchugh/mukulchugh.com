"use client";

import { IconMoon, IconSun } from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { microSpring } from "@/lib/motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/utils";

type ThemeToggleProps = {
  className?: string;
  iconClassName?: string;
};

export function ThemeToggle({ className, iconClassName }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className={cn("hover:bg-transparent", className)}
            disabled={!mounted}
            onClick={() => setTheme(isDark ? "light" : "dark")}
            size="icon"
            type="button"
            variant="ghost"
          />
        }
      >
        <AnimatePresence initial={false} mode="popLayout">
          <motion.span
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            className="flex"
            exit={{
              opacity: 0,
              rotate: reduce ? 0 : 30,
              transition: { duration: reduce ? 0 : 0.1 },
            }}
            initial={{
              opacity: 0,
              rotate: reduce ? 0 : -30,
              scale: reduce ? 1 : 0.8,
            }}
            key={isDark ? "dark" : "light"}
            transition={reduce ? { duration: 0 } : microSpring}
          >
            {isDark ? (
              <IconSun
                aria-hidden="true"
                className={iconClassName}
                stroke={2}
              />
            ) : (
              <IconMoon
                aria-hidden="true"
                className={iconClassName}
                stroke={2}
              />
            )}
          </motion.span>
        </AnimatePresence>
      </TooltipTrigger>
      <TooltipContent side="top">
        {isDark ? "Light mode" : "Dark mode"}
      </TooltipContent>
    </Tooltip>
  );
}
