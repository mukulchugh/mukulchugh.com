"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface TimelineProps {
  children: React.ReactNode;
  className?: string;
}

export function Timeline({ children, className }: TimelineProps) {
  return (
    <div className={cn("relative", className)}>
      {/* Central vertical line - visible on larger screens */}
      <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-[2px] bg-gray-200 dark:bg-gray-700" />
      <div className="flex flex-col gap-8">{children}</div>
    </div>
  );
}
