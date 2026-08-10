"use client";

import { IconMoon, IconSun } from "@tabler/icons-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className={cn("hover:bg-transparent", className)}
            onClick={() => setTheme(isDark ? "light" : "dark")}
            size="icon"
            type="button"
            variant="ghost"
          />
        }
      >
        {isDark ? (
          <IconSun className={iconClassName} stroke={2} />
        ) : (
          <IconMoon className={iconClassName} stroke={2} />
        )}
      </TooltipTrigger>
      <TooltipContent side="top">
        {isDark ? "Light mode" : "Dark mode"}
      </TooltipContent>
    </Tooltip>
  );
}
