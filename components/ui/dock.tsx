"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useActiveSectionContext } from "@/context/active-section-context";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/data";
import {
  Home,
  User,
  FolderKanban,
  BookOpen,
  Briefcase,
  Mail,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const navItems = [
  { name: "Home", hash: "#home", icon: Home },
  { name: "About", hash: "#about", icon: User },
  { name: "Projects", hash: "#projects", icon: FolderKanban },
  { name: "Blog", hash: "/blog", icon: BookOpen },
  { name: "Experience", hash: "#experience", icon: Briefcase },
  { name: "Contact", hash: "#contact", icon: Mail },
] as const;

export function Dock() {
  const { activeSection, setActiveSection, setTimeOfLastClick } =
    useActiveSectionContext();
  const pathname = usePathname();
  const router = useRouter();
  const isHomePage = pathname === "/";
  const [isAtBottom, setIsAtBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Hide dock when within 150px of the bottom
      const threshold = 150;
      const isNearBottom = scrollTop + windowHeight >= documentHeight - threshold;

      setIsAtBottom(isNearBottom);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Check initial position

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSectionClick = (item: typeof navItems[number]) => {
    setActiveSection(item.name);
    setTimeOfLastClick(Date.now());

    if (isHomePage) {
      // On home page, just scroll to the section
      const element = document.querySelector(item.hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      // On other pages, navigate to home with hash
      router.push(`/${item.hash}`);
    }
  };

  return (
    <AnimatePresence>
      {!isAtBottom && (
        <motion.div
          className="fixed bottom-6 left-1/2 z-[999]"
          initial={{ y: 100, x: "-50%", opacity: 0 }}
          animate={{ y: 0, x: "-50%", opacity: 1 }}
          exit={{ y: 100, x: "-50%", opacity: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
      <div className="flex items-center gap-2 rounded-2xl bg-neutral-900/80 px-3 py-2 shadow-2xl ring-1 ring-white/10 backdrop-blur-xl sm:gap-3 sm:rounded-3xl sm:px-4 sm:py-3">
        {/* Logo */}
        <Link
          href="/"
          className="group relative grid h-10 w-10 place-items-center rounded-xl ring-1 ring-white/10 bg-gradient-to-b from-neutral-800/60 to-neutral-900/70 backdrop-blur-xl shadow-lg transition-all duration-200 hover:-translate-y-1 hover:scale-105 sm:h-12 sm:w-12"
          aria-label="Home"
        >
          <Image
            src={siteConfig.images.logoDark}
            alt={siteConfig.name}
            width={24}
            height={24}
            className="h-5 w-5 object-contain sm:h-6 sm:w-6"
          />
          <span className="pointer-events-none absolute -top-8 rounded-md bg-neutral-800 px-2 py-1 text-[10px] text-white/80 opacity-0 transition-opacity group-hover:opacity-100 whitespace-nowrap">
            {siteConfig.name}
          </span>
        </Link>

        {/* Separator */}
        <span className="mx-1 h-6 w-px bg-white/10" aria-hidden="true" />

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.name;
          const isLink = item.hash.startsWith("/");

          return isLink ? (
            <Link
              key={item.name}
              href={item.hash}
              className={cn(
                "group relative grid h-10 w-10 place-items-center rounded-xl ring-1 ring-white/10 bg-gradient-to-b from-neutral-800/60 to-neutral-900/70 backdrop-blur-xl shadow-lg transition-all duration-200 hover:-translate-y-1 hover:scale-105 sm:h-12 sm:w-12",
                isActive && "ring-indigo-500/50 from-indigo-900/40 to-neutral-900/70"
              )}
              aria-label={item.name}
            >
              <Icon
                className={cn(
                  "h-4 w-4 transition-all duration-200 group-hover:scale-110 sm:h-5 sm:w-5",
                  isActive ? "text-indigo-400" : "text-white/70 group-hover:text-white/90"
                )}
                strokeWidth={2}
              />
              <span className="pointer-events-none absolute -top-8 rounded-md bg-neutral-800 px-2 py-1 text-[10px] text-white/80 opacity-0 transition-opacity group-hover:opacity-100 whitespace-nowrap">
                {item.name}
              </span>
            </Link>
          ) : (
            <button
              key={item.name}
              onClick={() => handleSectionClick(item)}
              className={cn(
                "group relative grid h-10 w-10 place-items-center rounded-xl ring-1 ring-white/10 bg-gradient-to-b from-neutral-800/60 to-neutral-900/70 backdrop-blur-xl shadow-lg transition-all duration-200 hover:-translate-y-1 hover:scale-105 sm:h-12 sm:w-12",
                isActive && "ring-indigo-500/50 from-indigo-900/40 to-neutral-900/70"
              )}
              aria-label={item.name}
            >
              <Icon
                className={cn(
                  "h-4 w-4 transition-all duration-200 group-hover:scale-110 sm:h-5 sm:w-5",
                  isActive ? "text-indigo-400" : "text-white/70 group-hover:text-white/90"
                )}
                strokeWidth={2}
              />
              <span className="pointer-events-none absolute -top-8 rounded-md bg-neutral-800 px-2 py-1 text-[10px] text-white/80 opacity-0 transition-opacity group-hover:opacity-100 whitespace-nowrap">
                {item.name}
              </span>
            </button>
          );
        })}

      </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
