"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/lib/data";
import { IconMapPin, IconClock } from "@tabler/icons-react";

function usePSTTime() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    function update() {
      setTime(
        new Date().toLocaleTimeString("en-US", {
          timeZone: "America/Los_Angeles",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      );
    }
    update();
    const id = setInterval(update, 30_000);
    return () => clearInterval(id);
  }, []);

  return time;
}

export function LocationTile() {
  const time = usePSTTime();

  return (
    <div className="h-full min-h-[120px] flex flex-col items-center justify-center gap-3.5 p-5 text-center relative overflow-hidden">
      {/* Subtle neutral diffusion blob behind the icon */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(24,24,27,0.06) 0%, transparent 70%)",
          filter: "blur(16px)",
        }}
        aria-hidden="true"
      />

      {/* Icon badge */}
      <div
        className="relative w-9 h-9 rounded-xl bg-zinc-100 border border-zinc-200
                   flex items-center justify-center shadow-inner shadow-zinc-900/5"
      >
        <IconMapPin className="h-4 w-4 text-zinc-500" aria-hidden="true" />
      </div>

      {/* Location text */}
      <div className="relative space-y-0.5">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.14em] mb-1">
          Based in
        </p>
        <p className="text-[13px] font-semibold text-foreground leading-snug">
          {siteConfig.location}
        </p>

        {/* Local time */}
        {time && (
          <p className="flex items-center justify-center gap-1 text-[11px] text-muted-foreground mt-1">
            <IconClock className="h-3 w-3 flex-shrink-0 text-zinc-400" aria-hidden="true" />
            <span>{time} PST</span>
          </p>
        )}
        {!time && (
          <p className="text-[11px] text-muted-foreground mt-0.5">PST · UTC−8</p>
        )}
      </div>
    </div>
  );
}
