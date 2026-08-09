import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98]",
  {
    defaultVariants: {
      size: "default",
      variant: "default",
    },
    variants: {
      size: {
        default: "h-11 px-6 py-2",
        icon: "h-10 w-10 p-2",
        lg: "h-12 px-8 py-3",
        sm: "h-9 px-4 py-2 text-xs",
      },
      variant: {
        default:
          "bg-foreground text-background shadow-sm hover:bg-foreground/90 hover:-translate-y-0.5",
        destructive: "bg-red-500/90 text-white hover:bg-red-500",
        ghost:
          "bg-transparent text-foreground/70 hover:bg-foreground/[0.07] hover:text-foreground",
        link: "text-foreground/90 underline-offset-4 hover:underline",
        outline:
          "border border-border bg-transparent text-foreground hover:bg-foreground/[0.06]",
        secondary:
          "bg-foreground/[0.07] ring-1 ring-border shadow-sm text-foreground hover:bg-foreground/[0.10] hover:-translate-y-0.5",
      },
    },
  }
);

export type ButtonProps = ButtonPrimitive.Props &
  VariantProps<typeof buttonVariants>;

function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <ButtonPrimitive
      className={cn(buttonVariants({ className, size, variant }))}
      data-slot="button"
      {...props}
    />
  );
}

export { Button, buttonVariants };
