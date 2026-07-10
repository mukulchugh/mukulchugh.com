"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useActiveSectionContext } from "@/context/active-section-context";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/data";
import {
  IconHome,
  IconUser,
  IconLayoutKanban,
  IconBook,
  IconBriefcase,
  IconMail,
} from "@tabler/icons-react";
import { motion, AnimatePresence } from "motion/react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const navItems = [
  { name: "Home", hash: "#home", icon: IconHome },
  { name: "About", hash: "#about", icon: IconUser },
  { name: "Projects", hash: "#projects", icon: IconLayoutKanban },
  { name: "Blog", hash: "/blog", icon: IconBook },
  { name: "Experience", hash: "#experience", icon: IconBriefcase },
  { name: "Contact", hash: "#contact", icon: IconMail },
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

  // Dock item base classes — 44×44 touch target on mobile, grows on sm+
  const itemClasses = (isActive: boolean) =>
    cn(
      "group relative grid place-items-center rounded-xl",
      "ring-1 ring-black/[0.08] bg-gradient-to-b from-white/80 to-gray-50/90 backdrop-blur-xl shadow-sm",
      "transition-all duration-200 active:scale-[0.93]",
      // Touch target: 44×44 on mobile, bigger on larger screens
      "h-11 w-11 xs:h-11 xs:w-11 sm:h-12 sm:w-12",
      "[@media(hover:hover)]:hover:-translate-y-1 [@media(hover:hover)]:hover:scale-105 [@media(hover:hover)]:hover:shadow-md",
      isActive && "ring-zinc-900/30 from-zinc-50/90 to-zinc-100/70"
    );

  const iconClasses = (isActive: boolean) =>
    cn(
      "h-4 w-4 sm:h-5 sm:w-5 transition-all duration-200",
      "[@media(hover:hover)]:group-hover:scale-110",
      isActive ? "text-zinc-900" : "text-zinc-500 [@media(hover:hover)]:group-hover:text-zinc-900"
    );

  return (
    <TooltipProvider delayDuration={200}>
      <AnimatePresence>
        {!isAtBottom && (
          <motion.div
            className="fixed bottom-5 sm:bottom-6 left-1/2 z-[999]"
            initial={{ y: 100, x: "-50%", opacity: 0 }}
            animate={{ y: 0, x: "-50%", opacity: 1 }}
            exit={{ y: 100, x: "-50%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <div className="flex items-center gap-1.5 sm:gap-2 rounded-2xl bg-white/80 px-2 py-1.5 sm:px-3 sm:py-2
                            shadow-[0_4px_24px_rgba(20,20,40,0.10)] ring-1 ring-black/[0.07] backdrop-blur-xl
                            sm:rounded-3xl sm:px-4 sm:py-2.5">
              {/* Logo */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="/"
                    className={itemClasses(false)}
                    aria-label="Home"
                  >
                    <Image
                      src={siteConfig.images.logoLight}
                      alt={siteConfig.name}
                      width={24}
                      height={24}
                      className="h-5 w-5 sm:h-6 sm:w-6 object-contain"
                    />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="top">
                  {siteConfig.name}
                </TooltipContent>
              </Tooltip>

              {/* Separator */}
              <Separator orientation="vertical" className="mx-0.5 h-6" />

              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.name;
                const isLink = item.hash.startsWith("/");

                return (
                  <Tooltip key={item.name}>
                    <TooltipTrigger asChild>
                      {isLink ? (
                        <Link
                          href={item.hash}
                          className={itemClasses(isActive)}
                          aria-label={item.name}
                          aria-current={isActive ? "page" : undefined}
                        >
                          <Icon className={iconClasses(isActive)} stroke={2} />
                        </Link>
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleSectionClick(item)}
                          className={cn(itemClasses(isActive), "hover:bg-transparent")}
                          aria-label={item.name}
                          aria-pressed={isActive}
                        >
                          <Icon className={iconClasses(isActive)} stroke={2} />
                        </Button>
                      )}
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      {item.name}
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </TooltipProvider>
  );
}
