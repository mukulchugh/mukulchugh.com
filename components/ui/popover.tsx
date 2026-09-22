"use client";

import { Popover as PopoverPrimitive } from "@base-ui/react/popover";
import { cn } from "@/lib/utils";

// Base UI still owns dismissal, positioning, refs and focus restoration.
function Popup({ className, ...props }: PopoverPrimitive.Popup.Props) {
  return (
    <PopoverPrimitive.Popup
      {...props}
      className={
        typeof className === "function"
          ? (state) =>
              cn("liquid-surface liquid-floating rounded-2xl", className(state))
          : cn("liquid-surface liquid-floating rounded-2xl", className)
      }
    />
  );
}

export const Popover = { ...PopoverPrimitive, Popup };
