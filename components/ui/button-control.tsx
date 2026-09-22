"use client";

import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { motion } from "motion/react";
import { microSpring } from "@/lib/motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/** Keep the variant helper server-safe while sharing physical press feedback. */
export function ButtonControl({
  render,
  style,
  ...props
}: ButtonPrimitive.Props) {
  const reduce = useReducedMotion();
  return (
    <ButtonPrimitive
      {...props}
      render={
        render ?? (
          <motion.button
            transition={microSpring}
            whileTap={reduce || props.disabled ? undefined : { scale: 0.97 }}
          />
        )
      }
      style={(state) => ({
        ...(typeof style === "function" ? style(state) : style),
        transitionProperty: "background-color, color, border-color, box-shadow",
      })}
    />
  );
}
