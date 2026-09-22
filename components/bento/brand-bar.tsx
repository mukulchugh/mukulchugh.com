"use client";

import { IconMenu2 } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ThemeLogo } from "@/components/theme-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Popover } from "@/components/ui/popover";
import { links, siteConfig } from "@/lib/data";

export function BrandBar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const active = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);
  const tagline = siteConfig.tagline;
  return (
    <header className="bento-brand-bar">
      <Link
        aria-label="Mukul Chugh, home"
        className="flex min-h-11 shrink-0 items-center gap-3"
        href="/"
      >
        <ThemeLogo alt="" height={32} priority width={32} />
      </Link>
      <span className="max-w-[23ch] text-balance text-[11px] text-muted-foreground md:hidden">
        {tagline}
      </span>
      <span className="bento-brand-description">{tagline}</span>
      <nav
        aria-label="Header navigation"
        className="ml-auto hidden items-center md:flex"
      >
        {links
          .filter((link) => link.name !== "About")
          .map((link) => (
            <Link
              aria-current={active(link.hash) ? "page" : undefined}
              className="ui-label flex min-h-11 items-center px-2 text-muted-foreground transition-colors hover:text-foreground"
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
                    aria-current={active(link.hash) ? "page" : undefined}
                    className="ui-label flex min-h-11 items-center px-3 hover:bg-muted"
                    href={link.hash}
                    key={link.name}
                    onNavigate={() => setOpen(false)}
                  >
                    {link.name === "Blog" ? "Writing" : link.name}
                  </Link>
                ))}
              </nav>
              <div className="ui-label flex items-center justify-between border-t border-border px-3 pt-2">
                Theme <ThemeToggle />
              </div>
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>
    </header>
  );
}
