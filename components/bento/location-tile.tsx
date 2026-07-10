"use client";

import { useEffect, useState } from "react";
import { IconWorld, IconClock } from "@tabler/icons-react";

function useSFTime() {
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
  const time = useSFTime();

  return (
    <div className="flex h-full min-h-[120px] flex-col justify-center gap-4 p-5 sm:p-6">
      {/* Based in */}
      <div className="flex items-center gap-3">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-zinc-200 bg-zinc-100">
          <IconWorld className="h-4 w-4 text-zinc-500" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          {/* Mono section label — 10px unified */}
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-400">
            Based in
          </p>
          {/* Tile/card title scale — 14px semibold */}
          <p className="text-[14px] font-semibold text-zinc-900">India</p>
        </div>
      </div>

      <div className="h-px bg-black/[0.06]" />

      {/* Working hours */}
      <div className="flex items-center gap-3">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-zinc-200 bg-zinc-100">
          <IconClock className="h-4 w-4 text-zinc-500" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          {/* Mono section label */}
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-400">
            Working
          </p>
          {/* Tile/card title scale */}
          <p className="text-[14px] font-semibold text-zinc-900">
            SF hours
            <span className="ml-1.5 text-[12px] font-normal text-zinc-400">
              {time ? `${time} PST` : "PST · UTC−8"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
