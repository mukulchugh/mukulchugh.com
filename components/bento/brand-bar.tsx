"use client";

import { IconMenu2 } from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";
import { ThemeLogo } from "@/components/theme-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Popover } from "@/components/ui/popover";
import { links, siteConfig } from "@/lib/data";

export function BrandBar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="bento-brand-bar">
      <Link
        aria-label="Mukul Chugh, home"
        className="flex min-h-11 shrink-0 items-center gap-3"
        href="/"
      >
        <ThemeLogo alt="" height={32} priority width={32} />
        <span className="font-semibold">
          {siteConfig.name}
          <span className="block text-[11px] font-normal text-muted-foreground md:hidden">
            Engineer turned generalist.
          </span>
        </span>
      </Link>
      <span className="bento-brand-description">
        Engineer turned generalist.
      </span>
      <nav
        aria-label="Header navigation"
        className="ml-auto hidden items-center md:flex"
      >
        {links
          .filter((link) => link.name !== "About")
          .map((link) => (
            <Link
              className="flex min-h-11 items-center px-2 text-muted-foreground transition-colors hover:text-foreground"
              href={link.hash}
              key={link.name}
            >
              {link.name === "Blog" ? "Writing" : link.name}
            </Link>
          ))}
      </nav>
      <ThemeToggle className="hidden shrink-0 md:flex" />
      <Popover.Root onOpenChange={setOpen} open={open}>
        <Popover.Trigger
          aria-label="Open header navigation"
          className="ml-auto md:hidden"
          render={<Button size="icon" variant="ghost" />}
        >
          <IconMenu2 aria-hidden="true" />
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Positioner
            align="end"
            className="z-50 md:hidden"
            sideOffset={8}
          >
            <Popover.Popup
              aria-label="Header navigation"
              className="w-64 max-w-[calc(100vw-24px)] border border-border bg-background p-2 shadow-lg"
            >
              <nav aria-label="Mobile header navigation">
                {links.map((link) => (
                  <Link
                    className="flex min-h-11 items-center px-3 text-sm hover:bg-muted"
                    href={link.hash}
                    key={link.name}
                    onNavigate={() => setOpen(false)}
                  >
                    {link.name === "Blog" ? "Writing" : link.name}
                  </Link>
                ))}
              </nav>
              <div className="flex items-center justify-between border-t border-border px-3 pt-2 text-sm">
                Theme <ThemeToggle />
              </div>
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>
      <span aria-hidden="true" className="bento-marginalia hidden md:block">
        Build
        <br />
        Learn
        <br />
        Ship
      </span>
    </header>
  );
}
