"use client";

import { useEffect } from "react";
import Link from "next/link";
import { syne } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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
            syne.className,
            "text-6xl md:text-8xl font-bold text-foreground mb-4"
          )}
        >
          Oops!
        </h1>
        <h2
          className={cn(
            syne.className,
            "text-2xl md:text-3xl font-semibold text-foreground mb-6"
          )}
        >
          Something went wrong
        </h2>
        <p className="text-muted-foreground text-lg mb-8">
          We encountered an unexpected error. Please try again or contact support if the problem persists.
        </p>
        {error.digest && (
          <p className="text-sm text-muted-foreground mb-8">
            Error ID: {error.digest}
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={reset} className="rounded-full">
            Try Again
          </Button>
          <Button variant="outline" asChild className="rounded-full">
            <Link href="/">Go Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
