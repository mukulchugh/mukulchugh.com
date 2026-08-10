"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-2xl mx-auto">
        <h1
          className={cn(
            "font-syne",
            "text-6xl md:text-8xl font-bold text-foreground mb-4"
          )}
        >
          Oops!
        </h1>
        <h2
          className={cn(
            "font-syne",
            "text-2xl md:text-3xl font-semibold text-foreground mb-6"
          )}
        >
          Something went wrong
        </h2>
        <p className="text-muted-foreground text-lg mb-8">
          Something broke on my end. Try again, or email me if it keeps
          happening.
        </p>
        {error.digest && (
          <p className="text-sm text-muted-foreground mb-8">
            Error ID: {error.digest}
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button className="rounded-none" onClick={reset}>
            Try Again
          </Button>
          <Link
            className={cn(
              buttonVariants({ variant: "outline" }),
              "rounded-none"
            )}
            href="/"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
