import Link from "next/link";
import { syne } from "@/lib/fonts";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-2xl mx-auto">
        <h1
          className={cn(
            syne.className,
            "text-6xl md:text-8xl font-bold text-foreground mb-4"
          )}
        >
          404
        </h1>
        <h2
          className={cn(
            syne.className,
            "text-2xl md:text-3xl font-semibold text-foreground mb-6"
          )}
        >
          Page Not Found
        </h2>
        <p className="text-muted-foreground text-lg mb-8">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved or deleted.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
          >
            Go Home
          </Link>
          <Link
            href="/blog"
            className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-border text-foreground font-medium hover:bg-secondary transition-colors"
          >
            Browse Blog
          </Link>
        </div>
      </div>
    </div>
  );
}
