"use client";

import { Button as ButtonPrimitive } from "@base-ui/react/button";

/** Keep the variant helper server-safe while sharing physical press feedback. */
export function ButtonControl({
  render,
  style,
  ...props
}: ButtonPrimitive.Props) {
  return (
    <ButtonPrimitive
      {...props}
      data-native-press={render ? undefined : ""}
      render={render}
      style={(state) => ({
        ...(typeof style === "function" ? style(state) : style),
        transitionProperty:
          "background-color, color, border-color, box-shadow, scale",
      })}
    />
  );
}
