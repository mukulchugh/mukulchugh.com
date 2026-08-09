"use client";

import {
  IconBook,
  IconBriefcase,
  IconHome,
  IconLayoutKanban,
  IconMail,
  IconUser,
} from "@tabler/icons-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";
import { ThemeLogo } from "@/components/theme-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useActiveSectionContext } from "@/context/active-section-context";
import { siteConfig } from "@/lib/data";
import { cn } from "@/lib/utils";

const navItems = [
  { hash: "#home", icon: IconHome, name: "Home" },
  { hash: "#about", icon: IconUser, name: "About" },
  { hash: "#projects", icon: IconLayoutKanban, name: "Projects" },
  { hash: "/blog", icon: IconBook, name: "Blog" },
  { hash: "#experience", icon: IconBriefcase, name: "Experience" },
  { hash: "#contact", icon: IconMail, name: "Contact" },
] as const;

export function Dock() {
  const { activeSection, setActiveSection, setTimeOfLastClick } =
    useActiveSectionContext();
  const pathname = usePathname();
  const router = useRouter();
  const isHomePage = pathname === "/";
  const [isAtBottom, setIsAtBottom] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Hide dock when within 150px of the bottom
      const threshold = 150;
      const isNearBottom =
        scrollTop + windowHeight >= documentHeight - threshold;

      setIsAtBottom(isNearBottom);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Check initial position

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSectionClick = (
    item: (typeof navItems)[number],
    event: React.MouseEvent
  ) => {
    setActiveSection(item.name);
    setTimeOfLastClick(event.timeStamp);

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
      "bg-gradient-to-b from-card to-muted/60",
      "transition-transform duration-300 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]",
      "active:scale-[0.92] active:duration-100",
      // Touch target: 44×44 on mobile, bigger on larger screens
      "h-11 w-11 xs:h-11 xs:w-11 sm:h-12 sm:w-12",
      "[@media(hover:hover)]:hover:-translate-y-1 [@media(hover:hover)]:hover:scale-[1.08]",
      isActive
        ? "shadow-[0_0_0_1px_hsl(var(--foreground)/0.14),0_2px_6px_hsl(var(--foreground)/0.08)] bg-gradient-to-b from-muted to-muted/80"
        : "shadow-[0_0_0_1px_hsl(var(--foreground)/0.08),0_1px_3px_hsl(var(--foreground)/0.05)] [@media(hover:hover)]:hover:shadow-[0_0_0_1px_hsl(var(--foreground)/0.12),0_4px_12px_hsl(var(--foreground)/0.10)]"
    );

  const iconClasses = (isActive: boolean) =>
    cn(
      "h-4 w-4 sm:h-5 sm:w-5 transition-all duration-300 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]",
      "[@media(hover:hover)]:group-hover:scale-[1.12]",
      isActive
        ? "text-foreground"
        : "text-muted-foreground [@media(hover:hover)]:group-hover:text-foreground"
    );

  return (
    <TooltipProvider delay={200}>
      <AnimatePresence>
        {!isAtBottom && (
          <motion.div
            animate={{ opacity: 1, x: "-50%", y: 0 }}
            className="fixed bottom-5 sm:bottom-6 left-1/2 z-[999]"
            exit={{ opacity: 0, x: "-50%", y: 100 }}
            initial={{ opacity: 0, x: "-50%", y: 100 }}
            transition={{ damping: 20, stiffness: 200, type: "spring" }}
          >
            <div
              className="dock-shell flex items-center gap-1.5 sm:gap-2 rounded-2xl sm:rounded-[1.25rem]
                            px-2 py-1.5 sm:px-3 sm:py-2"
            >
              {/* Logo */}
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Link
                      aria-label="Home"
                      className={itemClasses(false)}
                      href="/"
                    />
                  }
                >
                  <ThemeLogo
                    className="h-5 w-5 sm:h-6 sm:w-6"
                    height={24}
                    width={24}
                  />
                </TooltipTrigger>
                <TooltipContent side="top">{siteConfig.name}</TooltipContent>
              </Tooltip>

              {/* Separator */}
              <Separator className="mx-0.5 h-6" orientation="vertical" />

              {/* Nav items with stagger on first appear */}
              {navItems.map((item, i) => {
                const Icon = item.icon;
                const isActive = activeSection === item.name;
                const isLink = item.hash.startsWith("/");

                return (
                  <motion.div
                    animate={
                      shouldReduceMotion
                        ? undefined
                        : { opacity: 1, scale: 1, y: 0 }
                    }
                    initial={
                      shouldReduceMotion
                        ? false
                        : { opacity: 0, scale: 0.88, y: 8 }
                    }
                    key={item.name}
                    transition={
                      shouldReduceMotion
                        ? undefined
                        : {
                            damping: 22,
                            delay: 0.05 + i * 0.04,
                            stiffness: 260,
                            type: "spring",
                          }
                    }
                  >
                    <Tooltip>
                      <TooltipTrigger
                        render={
                          isLink ? (
                            <Link
                              aria-current={isActive ? "page" : undefined}
                              aria-label={item.name}
                              className={itemClasses(isActive)}
                              href={item.hash}
                            />
                          ) : (
                            <Button
                              aria-label={item.name}
                              aria-pressed={isActive}
                              className={cn(
                                itemClasses(isActive),
                                "hover:bg-transparent"
                              )}
                              onClick={(event) =>
                                handleSectionClick(item, event)
                              }
                              size="icon"
                              variant="ghost"
                            />
                          )
                        }
                      >
                        <Icon className={iconClasses(isActive)} stroke={2} />
                      </TooltipTrigger>
                      <TooltipContent side="top">{item.name}</TooltipContent>
                    </Tooltip>
                  </motion.div>
                );
              })}

              <Separator className="mx-0.5 h-6" orientation="vertical" />

              <ThemeToggle
                className={itemClasses(false)}
                iconClassName={iconClasses(false)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </TooltipProvider>
  );
}
