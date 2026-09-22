"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeLogo } from "@/components/theme-logo";
import { cn } from "@/lib/utils";
import { LocationTag } from "./ui/location-tag";

export default function Header() {
  const pathname = usePathname();
  const isBlogPage = pathname.startsWith("/blog");

  return (
    <header className="w-full flex justify-between items-center py-8 px-4 sm:px-8 max-w-4xl mx-auto">
      <motion.div
        animate={{ opacity: 1, x: 0 }}
        initial={{ opacity: 0, x: -20 }}
      >
        <Link
          aria-label="Mukul Chugh, home"
          className="flex items-center gap-3"
          href="/"
        >
          <ThemeLogo
            className="h-8 w-8 object-cover"
            height={32}
            priority
            width={32}
          />
          {isBlogPage && (
            <div className="flex items-center gap-3">
              <div className="h-5 w-px bg-foreground/20" />
              <span
                className={cn(
                  "font-heading",
                  "text-lg font-semibold text-foreground/90"
                )}
              >
                Blog
              </span>
            </div>
          )}
        </Link>
      </motion.div>

      <motion.div
        animate={{ opacity: 1, x: 0 }}
        initial={{ opacity: 0, x: 20 }}
      >
        <LocationTag city="San Francisco" country="CA" timezone="PST" />
      </motion.div>
    </header>
  );
}
