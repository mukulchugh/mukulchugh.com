"use client";

import { IconMoon, IconSun } from "@tabler/icons-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ThemeToggleProps = {
  className?: string;
  iconClassName?: string;
};

export function ThemeToggle({ className, iconClassName }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <Button
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={cn("hover:bg-transparent", className)}
      disabled={!mounted}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      size="icon"
      title={isDark ? "Light mode" : "Dark mode"}
      type="button"
      variant="ghost"
    >
      <span className="theme-icons" data-dark={isDark}>
        <IconSun
          aria-hidden="true"
          className={cn("theme-sun", iconClassName)}
          stroke={2}
        />
        <IconMoon
          aria-hidden="true"
          className={cn("theme-moon", iconClassName)}
          stroke={2}
        />
      </span>
    </Button>
  );
}
