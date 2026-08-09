"use client";

import { IconArrowUpRight } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface LocationTagProps {
  city?: string;
  country?: string;
  timezone?: string;
}

export function LocationTag({
  city = "San Francisco",
  country = "CA",
  timezone = "PST",
}: LocationTagProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          hour12: false,
          minute: "2-digit",
          timeZone: "America/Los_Angeles",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Button
      className="group relative flex items-center gap-3 rounded-full border border-border bg-foreground/[0.05] px-4 py-2.5 h-auto transition-all duration-500 ease-out hover:border-border hover:bg-foreground/[0.08] hover:shadow-[0_2px_12px_rgba(20,20,40,0.07)]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      variant="ghost"
    >
      {/* Live pulse indicator */}
      <div className="relative flex items-center justify-center">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>
      </div>

      {/* Location text */}
      <div className="flex items-center gap-2 overflow-hidden">
        <span
          className="text-sm font-medium text-foreground/90 transition-all duration-500"
          style={{
            opacity: isHovered ? 0 : 1,
            transform: isHovered ? "translateY(-100%)" : "translateY(0)",
          }}
        >
          {city}, {country}
        </span>

        <span
          className="absolute left-11 text-sm font-medium text-foreground/90 transition-all duration-500"
          style={{
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? "translateY(0)" : "translateY(100%)",
          }}
        >
          {currentTime} {timezone}
        </span>
      </div>

      {/* Arrow indicator */}
      <IconArrowUpRight
        aria-hidden="true"
        className="h-3 w-3 text-foreground/50 transition-all duration-300"
        stroke={2}
        style={{
          opacity: isHovered ? 1 : 0.5,
          transform: isHovered
            ? "translateX(2px) rotate(-45deg)"
            : "translateX(0) rotate(0)",
        }}
      />
    </Button>
  );
}
