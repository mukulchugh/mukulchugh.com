"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { type CSSProperties, useEffect, useState } from "react";
import { siteConfig } from "@/lib/data";
import { cn } from "@/lib/utils";

type ThemeLogoProps = {
  alt?: string;
  className?: string;
  height?: number;
  priority?: boolean;
  width?: number;
};

export function ThemeLogo({
  alt = siteConfig.name,
  className,
  height = 24,
  priority = false,
  width = 24,
}: ThemeLogoProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const src =
    mounted && resolvedTheme === "dark"
      ? siteConfig.images.logoDark
      : siteConfig.images.logoLight;

  return (
    <span
      className={cn(
        "relative inline-block shrink-0 h-[var(--logo-height)] w-[var(--logo-width)]",
        className
      )}
      style={
        {
          "--logo-height": `${height}px`,
          "--logo-width": `${width}px`,
        } as CSSProperties
      }
    >
      <Image
        alt={alt}
        className="object-contain"
        fill
        priority={priority}
        sizes={`${width}px`}
        src={src}
      />
    </span>
  );
}
