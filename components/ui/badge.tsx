import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";
import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "ui-label inline-flex items-center rounded-none border px-2.5 py-0.5 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    defaultVariants: {
      variant: "default",
    },
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        // Glass badge — same no-backdrop-blur recipe as .glass-tile (opaque
        // gradient fill + layered neutral-grey shadow), scaled down for a pill.
        secondary:
          "border-white/[0.09] bg-gradient-to-b from-foreground/[0.06] to-foreground/[0.03] text-secondary-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_1px_2px_rgba(24,24,24,0.04),0_4px_10px_-6px_rgba(24,24,24,0.12)] hover:from-foreground/[0.09] hover:to-foreground/[0.05] dark:border-white/[0.08] dark:from-white/[0.07] dark:to-white/[0.03] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_1px_2px_rgba(0,0,0,0.25),0_4px_10px_-6px_rgba(0,0,0,0.35)]",
      },
    },
  }
);

export type BadgeProps = useRender.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & {
    /**
     * Per-instance tint (e.g. from `accentColorFor`/`accentColorForTags` in
     * lib/blog-topic) that overrides the variant's static color with a
     * content-seeded hue. cva variants are static classes and can't encode
     * a per-instance hash, so this is applied as an inline style instead —
     * same glass treatment (translucent gradient fill + tinted border),
     * just colored per tag rather than uniformly neutral.
     */
    accentColor?: string;
  };

/** "rgb(r,g,b)" -> "rgba(r,g,b,alpha)". Falls back to the input unchanged
 * for any other color format (accentColorFor/accentColorForTags always
 * return the "rgb(...)" form, so this only needs to handle that shape). */
function withAlpha(color: string, alpha: number): string {
  return color.startsWith("rgb(")
    ? color.replace("rgb(", "rgba(").replace(")", `,${alpha})`)
    : color;
}

function Badge({
  className,
  variant,
  accentColor,
  render,
  ...props
}: BadgeProps) {
  const accentStyle: CSSProperties | undefined = accentColor
    ? {
        background: `linear-gradient(to bottom, ${withAlpha(accentColor, 0.16)}, ${withAlpha(accentColor, 0.07)})`,
        borderColor: withAlpha(accentColor, 0.3),
        color: "hsl(var(--foreground))",
      }
    : undefined;

  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
        style: accentStyle,
      },
      props
    ),
    render,
    state: { slot: "badge", variant },
  });
}

export { Badge, badgeVariants };
