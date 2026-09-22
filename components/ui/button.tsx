import type { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { ButtonControl } from "./button-control";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-[10px] font-sans text-sm font-medium leading-5 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    defaultVariants: {
      size: "default",
      variant: "default",
    },
    variants: {
      size: {
        default: "h-11 px-6 py-2",
        icon: "h-11 w-11 shrink-0 p-2",
        lg: "h-12 px-8 py-3",
        sm: "h-9 px-4 py-2 text-xs",
        unstyled: "",
      },
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-red-700 text-white hover:bg-red-800",
        ghost: "bg-transparent text-foreground hover:bg-foreground/[0.07]",
        link: "text-foreground/90 underline-offset-4 hover:underline",
        outline:
          "border border-foreground/20 bg-transparent text-foreground hover:bg-muted",
        secondary: "bg-muted text-foreground hover:bg-foreground/[0.12]",
        unstyled: "",
      },
    },
  }
);

export type ButtonProps = ButtonPrimitive.Props &
  VariantProps<typeof buttonVariants>;

function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <ButtonControl
      className={
        typeof className === "function"
          ? (state) => cn(buttonVariants({ size, variant }), className(state))
          : cn(buttonVariants({ className, size, variant }))
      }
      data-slot="button"
      {...props}
    />
  );
}

export { Button, buttonVariants };
