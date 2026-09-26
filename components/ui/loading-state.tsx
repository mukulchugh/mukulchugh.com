import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const dot = (
  <span
    aria-hidden="true"
    className="size-1.5 shrink-0 animate-pulse rounded-full bg-current motion-reduce:animate-none"
  />
);

// Loading-only: never render this for success, empty, or error states.
export function LoadingState({
  label,
  variant = "page",
  className,
}: {
  label: string;
  variant?: "compact" | "page";
  className?: string;
}) {
  if (variant === "compact")
    return (
      <p
        className={cn(
          "flex items-center gap-2 text-muted-foreground",
          className
        )}
        role="status"
      >
        {dot}
        {label}
      </p>
    );
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div aria-hidden="true" className="flex flex-col gap-4">
        <Skeleton className="h-7 w-2/5" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-4 w-3/5" />
        </div>
        <Skeleton className="h-40 w-full" />
      </div>
      <p className="text-muted-foreground" role="status">
        {label}
      </p>
    </div>
  );
}
