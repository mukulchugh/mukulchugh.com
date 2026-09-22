"use client";

import { useEffect, useState } from "react";
import { WorldMap } from "./world-map";

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
          timeZoneName: "short",
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
    <div className="bento-location bento-surface" style={{ minHeight: 156 }}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute"
        style={{ height: "94%", right: "2%", top: "0%", width: "76%" }}
      >
        <WorldMap />
      </div>
      <p className="bento-label relative">Based in India</p>
      <div className="relative mt-auto">
        <p className="font-semibold">India</p>
        <p className="bento-location-time">
          SF hours{" "}
          <span className="ml-2 text-muted-foreground tabular-nums">
            {time ?? "Pacific time"}
          </span>
        </p>
      </div>
    </div>
  );
}
