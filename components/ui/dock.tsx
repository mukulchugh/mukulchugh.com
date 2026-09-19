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
import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { ThemeLogo } from "@/components/theme-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Popover } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useActiveSectionContext } from "@/context/active-section-context";
import { links } from "@/lib/data";
import { microSpring, softSpring } from "@/lib/motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/utils";

const MotionLink = motion.create(Link);
const navIcons = {
  About: IconUser,
  Blog: IconBook,
  Contact: IconMail,
  Experience: IconBriefcase,
  Home: IconHome,
  Projects: IconLayoutKanban,
};
const navItems = links.map(({ hash, name }) => ({
  href: hash,
  icon: navIcons[name],
  name,
}));

export function Dock() {
  const { activeSection, setActiveSection, setTimeOfLastClick } =
    useActiveSectionContext();
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [expanded, setExpanded] = useState(false);
  const activeId = useId();
  const navigating = useRef(false);
  const current = pathname.startsWith("/blog")
    ? "Blog"
    : pathname.startsWith("/projects")
      ? "Projects"
      : activeSection;

  useEffect(() => {
    setExpanded(false);
  }, [pathname]);

  useEffect(() => {
    if (!expanded) return;
    const desktop = window.matchMedia("(min-width: 640px)");
    const resize = () => {
      if (desktop.matches) setExpanded(false);
    };
    desktop.addEventListener("change", resize);
    return () => {
      desktop.removeEventListener("change", resize);
    };
  }, [expanded]);

  function navigate(name: (typeof navItems)[number]["name"]) {
    navigating.current = true;
    setActiveSection(name);
    setTimeOfLastClick(Date.now());
    setExpanded(false);
  }

  const itemClass =
    "relative flex h-11 min-w-11 items-center justify-center gap-2 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground sm:h-7 sm:min-w-6 sm:gap-1 sm:px-2";

  return (
    <TooltipProvider delay={150}>
      <nav
        aria-label="Primary"
        className="fixed bottom-5 left-1/2 z-40 -translate-x-1/2 sm:bottom-6"
      >
        <Popover.Root
          onOpenChange={(open) => {
            if (open) navigating.current = false;
            setExpanded(open);
          }}
          open={expanded}
        >
          <Popover.Portal>
            <Popover.Positioner
              className="z-40 sm:hidden"
              side="top"
              sideOffset={18}
            >
              <Popover.Popup
                aria-label="Navigation"
                className="dock-shell w-64 max-w-[calc(100vw-2rem)] origin-bottom rounded-xl p-2 transition-[opacity,scale] duration-150 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 motion-safe:data-[starting-style]:scale-95"
                finalFocus={() => !navigating.current}
              >
                {navItems.map(({ href, icon: Icon, name }) => (
                  <MotionLink
                    aria-current={current === name ? "location" : undefined}
                    className={cn(
                      "flex min-h-11 items-center gap-3 px-3 py-2 text-sm font-medium",
                      current === name
                        ? "bg-muted text-foreground"
                        : "text-muted-foreground hover:bg-muted/60"
                    )}
                    href={href}
                    key={name}
                    onNavigate={() => navigate(name)}
                    transition={microSpring}
                    whileTap={reduce ? undefined : { scale: 0.98 }}
                  >
                    <Icon aria-hidden="true" className="size-4" />
                    {name}
                  </MotionLink>
                ))}
                <Separator className="my-2" />
                <div className="flex items-center justify-between px-3">
                  <span className="text-sm text-muted-foreground">Theme</span>
                  <ThemeToggle />
                </div>
              </Popover.Popup>
            </Popover.Positioner>
          </Popover.Portal>

          <div className="dock-shell flex items-center gap-1 rounded-full px-2 py-1.5">
            <Link
              aria-label="Home"
              className={cn(itemClass, "sm:hidden")}
              href="/#home"
              onNavigate={() => navigate("Home")}
            >
              <ThemeLogo className="size-5 sm:size-6" height={24} width={24} />
            </Link>
            <Separator className="h-6 sm:hidden" orientation="vertical" />
            <Popover.Trigger
              aria-label={
                expanded ? "Close navigation menu" : "Open navigation menu"
              }
              className={cn(itemClass, "sm:hidden")}
              render={<Button size="icon" variant="ghost" />}
            >
              <motion.span
                animate={{ rotate: expanded && !reduce ? 90 : 0 }}
                transition={microSpring}
              >
                {expanded ? <IconX /> : <IconMenu2 />}
              </motion.span>
            </Popover.Trigger>
            <div className="hidden items-center gap-0.5 sm:flex">
              {navItems
                .filter(({ name }) => name !== "About")
                .map(({ href, icon: Icon, name }) => (
                  <Tooltip key={name}>
                    <TooltipTrigger
                      render={
                        <MotionLink
                          aria-current={
                            current === name ? "location" : undefined
                          }
                          aria-label={name}
                          className={itemClass}
                          href={href}
                          onNavigate={() => navigate(name)}
                          transition={microSpring}
                          whileHover={reduce ? undefined : { y: -3 }}
                          whileTap={reduce ? undefined : { scale: 0.94, y: 0 }}
                        />
                      }
                    >
                      {current === name && (
                        <motion.span
                          aria-hidden="true"
                          className="absolute inset-0 rounded-full bg-muted"
                          layoutId={reduce ? undefined : activeId}
                          transition={softSpring}
                        />
                      )}
                      <Icon aria-hidden="true" className="relative size-3" />
                      <span className="relative text-[9px] font-medium">
                        {name === "Blog" ? "Writing" : name}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent side="top">{name}</TooltipContent>
                  </Tooltip>
                ))}
            </div>
          </div>
        </Popover.Root>
      </nav>
    </TooltipProvider>
  );
}
