import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";
import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "ui-label liquid-badge inline-flex max-w-full items-center gap-1.5 rounded-[6px] border px-2.5 py-1 [overflow-wrap:anywhere] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
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
        secondary: "border-transparent bg-muted text-foreground",
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
     * same subtle treatment (translucent fill + tinted border),
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
        background: withAlpha(accentColor, 0.09),
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

export { Badge };
