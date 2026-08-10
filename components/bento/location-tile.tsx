"use client";

import { IconClock, IconWorld } from "@tabler/icons-react";
import { useEffect, useState } from "react";

function useSFTime() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    function update() {
      setTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          hour12: true,
          minute: "2-digit",
          timeZone: "America/Los_Angeles",
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
  const time = useSFTime();

  return (
    <div className="flex h-full min-h-[120px] flex-col justify-center gap-4 p-5 sm:p-6">
      {/* Based in */}
      <div className="flex items-center gap-3">
        <div className="icon-chip grid h-9 w-9 shrink-0 place-items-center rounded-none">
          <IconWorld
            aria-hidden="true"
            className="h-4 w-4 text-muted-foreground"
          />
        </div>
        <div className="min-w-0">
          {/* Mono section label — 10px unified */}
          <p className="ui-label text-muted-foreground">Based in</p>
          {/* Tile/card title scale — 14px semibold */}
          <p className="text-[14px] font-semibold text-foreground">India</p>
        </div>
      </div>

      <div className="h-px bg-foreground/[0.07]" />

      {/* Working hours */}
      <div className="flex items-center gap-3">
        <div className="icon-chip grid h-9 w-9 shrink-0 place-items-center rounded-none">
          <IconClock
            aria-hidden="true"
            className="h-4 w-4 text-muted-foreground"
          />
        </div>
        <div className="min-w-0">
          {/* Mono section label */}
          <p className="ui-label text-muted-foreground">Working</p>
          {/* Tile/card title scale */}
          <p className="text-[14px] font-semibold text-foreground">
            SF hours
            <span className="ml-1.5 text-[12px] font-normal text-muted-foreground tabular-nums">
              {time ? `${time} PST` : "PST · UTC−8"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
