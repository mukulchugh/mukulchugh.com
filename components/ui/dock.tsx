"use client";

import {
  IconBook,
  IconBriefcase,
  IconHome,
  IconLayoutKanban,
  IconMail,
  IconMenu2,
  IconUser,
  IconX,
} from "@tabler/icons-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useRef, useState } from "react";
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
import { softSpring } from "@/lib/motion";
import { cn } from "@/lib/utils";

const navItems = [
  { hash: "#home", icon: IconHome, name: "Home" },
  { hash: "#about", icon: IconUser, name: "About" },
  { hash: "#projects", icon: IconLayoutKanban, name: "Projects" },
  { hash: "/blog", icon: IconBook, name: "Blog" },
  { hash: "#experience", icon: IconBriefcase, name: "Experience" },
  { hash: "#contact", icon: IconMail, name: "Contact" },
] as const;

const MOBILE_MENU_ID = "dock-mobile-menu";

export function Dock() {
  const { activeSection, setActiveSection, setTimeOfLastClick } =
    useActiveSectionContext();
  const pathname = usePathname();
  const router = useRouter();
  const isHomePage = pathname === "/";
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const menuRef = useRef<HTMLDivElement | null>(null);
  const toggleRef = useRef<HTMLButtonElement | null>(null);

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
      // The dock (and any open mobile menu) unmounts when it hides near the
      // bottom of the page. Without this, scrolling back up would silently
      // re-open the menu since isExpanded survives the unmount.
      if (isNearBottom) {
        setIsExpanded(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Check initial position

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close the mobile menu on Escape, click-outside, or route/section change,
  // and return focus to the toggle button so keyboard users don't lose their
  // place. Only wired up while the menu is actually open.
  useEffect(() => {
    if (!isExpanded) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsExpanded(false);
        toggleRef.current?.focus();
      }
    };

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (
        menuRef.current?.contains(target) ||
        toggleRef.current?.contains(target)
      ) {
        return;
      }
      setIsExpanded(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);

    // Move focus to the first menu item so keyboard/screen-reader users land
    // inside the freshly-opened menu instead of on the now-stale toggle.
    const firstItem = menuRef.current?.querySelector<HTMLElement>(
      "a[href], button:not([disabled])"
    );
    firstItem?.focus();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isExpanded]);

  const closeMenu = () => setIsExpanded(false);

  const handleSectionClick = (
    item: (typeof navItems)[number],
    event: React.MouseEvent
  ) => {
    setActiveSection(item.name);
    setTimeOfLastClick(event.timeStamp);
    closeMenu();

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
      "group relative grid place-items-center rounded-none",
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
      "h-4 w-4 sm:h-5 sm:w-5 transition-[color,transform] duration-300 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]",
      "[@media(hover:hover)]:group-hover:scale-[1.12]",
      isActive
        ? "text-foreground"
        : "text-muted-foreground [@media(hover:hover)]:group-hover:text-foreground"
    );

  // Full-width row classes for the mobile expanded menu — icon + label,
  // no tooltip needed since there's a visible label right there.
  const mobileItemClasses = (isActive: boolean) =>
    cn(
      "flex w-full items-center gap-3 rounded-none px-3 py-2.5 min-h-[44px]",
      "text-sm font-medium transition-colors duration-200",
      "active:scale-[0.98] active:duration-100",
      isActive
        ? "bg-muted text-foreground shadow-[0_0_0_1px_hsl(var(--foreground)/0.1)]"
        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
    );

  const menuTransition = shouldReduceMotion ? { duration: 0.12 } : softSpring;

  return (
    <TooltipProvider delay={200}>
      <AnimatePresence>
        {!isAtBottom && (
          <motion.div
            animate={{ opacity: 1, x: "-50%", y: 0 }}
            aria-label="Primary"
            className="fixed bottom-5 sm:bottom-6 left-1/2 z-[999]"
            exit={{ opacity: 0, x: "-50%", y: 100 }}
            initial={{ opacity: 0, x: "-50%", y: 100 }}
            role="navigation"
            transition={{ damping: 20, stiffness: 200, type: "spring" }}
          >
            {/* Mobile expanded menu — pops up above the resting dock.
                Only reachable below sm: (the toggle that opens it is
                sm:hidden), and this wrapper is also sm:hidden so a resize
                from mobile to desktop while open can't leave it stranded. */}
            <div className="sm:hidden">
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    animate={
                      shouldReduceMotion
                        ? { opacity: 1, x: "-50%" }
                        : { opacity: 1, scale: 1, x: "-50%", y: 0 }
                    }
                    aria-label="Site navigation"
                    className="dock-shell absolute bottom-full left-1/2 mb-3 flex w-64
                               flex-col gap-1 rounded-none p-2"
                    exit={
                      shouldReduceMotion
                        ? { opacity: 0, x: "-50%" }
                        : { opacity: 0, scale: 0.94, x: "-50%", y: 10 }
                    }
                    id={MOBILE_MENU_ID}
                    initial={
                      shouldReduceMotion
                        ? { opacity: 0, x: "-50%" }
                        : { opacity: 0, scale: 0.94, x: "-50%", y: 10 }
                    }
                    ref={menuRef}
                    role="menu"
                    transition={menuTransition}
                  >
                    {navItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeSection === item.name;
                      const isLink = item.hash.startsWith("/");

                      return isLink ? (
                        <Link
                          aria-current={isActive ? "page" : undefined}
                          className={mobileItemClasses(isActive)}
                          href={item.hash}
                          key={item.name}
                          onClick={closeMenu}
                          role="menuitem"
                        >
                          <Icon className={iconClasses(isActive)} stroke={2} />
                          {item.name}
                        </Link>
                      ) : (
                        <Button
                          aria-pressed={isActive}
                          className={cn(
                            mobileItemClasses(isActive),
                            "justify-start hover:bg-muted/60"
                          )}
                          key={item.name}
                          onClick={(event) => handleSectionClick(item, event)}
                          role="menuitem"
                          variant="ghost"
                        >
                          <Icon className={iconClasses(isActive)} stroke={2} />
                          {item.name}
                        </Button>
                      );
                    })}

                    <Separator className="my-1" orientation="horizontal" />

                    <div className="flex items-center justify-between gap-3 rounded-none px-3 py-1.5">
                      <span className="text-sm font-medium text-muted-foreground">
                        Theme
                      </span>
                      <ThemeToggle
                        className="h-9 w-9 rounded-none"
                        iconClassName="h-4 w-4"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div
              className="dock-shell flex items-center gap-1.5 sm:gap-2 rounded-none
                            px-2 py-1.5 sm:px-3 sm:py-2"
            >
              {/* Mobile resting row: logo + menu toggle only. No tooltips —
                  there's no hover on touch devices. */}
              <div className="flex items-center gap-1.5 sm:hidden">
                <Link aria-label="Home" className={itemClasses(false)} href="/">
                  <ThemeLogo className="h-5 w-5" height={20} width={20} />
                </Link>

                <Separator className="mx-0.5 h-6" orientation="vertical" />

                <Button
                  aria-controls={MOBILE_MENU_ID}
                  aria-expanded={isExpanded}
                  aria-label={
                    isExpanded
                      ? "Close navigation menu"
                      : "Open navigation menu"
                  }
                  className={itemClasses(isExpanded)}
                  onClick={() => setIsExpanded((prev) => !prev)}
                  ref={toggleRef}
                  size="icon"
                  variant="ghost"
                >
                  {isExpanded ? (
                    <IconX className={iconClasses(true)} stroke={2} />
                  ) : (
                    <IconMenu2 className={iconClasses(false)} stroke={2} />
                  )}
                </Button>
              </div>

              {/* Desktop row — unchanged always-expanded single row. */}
              <div className="hidden sm:flex sm:items-center sm:gap-2">
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </TooltipProvider>
  );
}
