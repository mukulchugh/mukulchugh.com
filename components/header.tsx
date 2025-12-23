"use client";

import React from "react";
import { motion } from "motion/react";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/lib/data";
import Image from "next/image";
import { syne } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { LocationTag } from "./ui/location-tag";

export default function Header() {
  const pathname = usePathname();
  const isBlogPage = pathname.startsWith("/blog");

  return (
    <header className="w-full flex justify-between items-center py-8 px-4 sm:px-8 max-w-4xl mx-auto">
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
      >
        <Link href="/" className="flex items-center gap-3">
          <Image
            src={siteConfig.images.logoDark}
            alt={siteConfig.name}
            quality="80"
            priority={true}
            width={32}
            height={32}
            className="h-8 w-8 object-cover"
          />
          {isBlogPage ? (
            <div className="flex items-center gap-3">
              <div className="h-5 w-px bg-white/20" />
              <span
                className={cn(
                  syne.className,
                  "text-lg font-semibold text-white/90"
                )}
              >
                Blog
              </span>
            </div>
          ) : (
            <span
              className={cn(
                syne.className,
                "text-lg font-semibold text-white/90"
              )}
            >
              {siteConfig.name}
            </span>
          )}
        </Link>
      </motion.div>

      <motion.div
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
      >
        <LocationTag city="San Francisco" country="CA" timezone="PST" />
      </motion.div>
    </header>
  );
}
