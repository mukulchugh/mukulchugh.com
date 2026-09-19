"use client";

import Image from "next/image";
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
    <div className="bento-location bento-surface">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute"
        style={{ height: "110%", left: "26%", top: "-1%", width: "78%" }}
      >
        <Image
          alt=""
          className="object-fill opacity-55 grayscale mix-blend-multiply dark:invert dark:mix-blend-screen"
          fill
          sizes="(min-width: 768px) 30vw, 75vw"
          src="/design/location-map.png"
        />
        <span
          className="absolute flex aspect-square w-[4.2%] min-w-[10px] max-w-4 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary"
          style={{ left: "65.5%", top: "45.7%" }}
        >
          <span className="size-[40%] rounded-full bg-black" />
        </span>
      </div>
      <p className="bento-label relative">03 / Location</p>
      <div className="relative mt-auto">
        <p className="font-semibold">India</p>
        <p className="bento-location-time">
          SF hours{" "}
          <span className="ml-2 text-muted-foreground tabular-nums">
            {time ?? "Pacific time"}
          </span>
        </p>
      </div>
      <p
        aria-hidden="true"
        className="bento-marginalia absolute bottom-[10%] right-[4%]"
      >
        Same
        <br />
        Planet
        <br />
        Different
        <br />
        Timezone
      </p>
    </div>
  );
}
