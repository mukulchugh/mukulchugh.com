import {
  IconBook,
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandX,
} from "@tabler/icons-react";
import Link from "next/link";
import { footerSocialLinks, siteConfig } from "@/lib/data";

const FOOTER_ICONS: Record<string, typeof IconBrandX> = {
  Blog: IconBook,
  GitHub: IconBrandGithub,
  LinkedIn: IconBrandLinkedin,
  Twitter: IconBrandX,
};

export default function Footer() {
  return (
    <footer className="dock-safe-bottom mx-auto flex w-[95.5%] max-w-[1400px] flex-wrap items-center justify-between gap-4 px-3 pt-4 md:pt-3">
      <Link
        className="flex min-h-11 flex-col justify-center text-xs leading-snug md:min-h-8"
        href="/"
      >
        <span className="font-semibold">{siteConfig.name}</span>
        <span className="text-muted-foreground">{siteConfig.tagline}</span>
      </Link>
      <div className="flex flex-wrap items-center gap-1 sm:gap-2">
        {footerSocialLinks.map((link) => {
          const Icon = FOOTER_ICONS[link.name];
          return (
            <Link
              aria-label={link.ariaLabel}
              className="flex size-11 items-center justify-center text-foreground transition-colors hover:bg-muted md:size-8"
              href={link.href}
              key={link.name}
              rel="noopener noreferrer"
              target="_blank"
            >
              <Icon aria-hidden="true" className="size-4" />
            </Link>
          );
        })}
        <p className="border-l border-border pl-3 font-mono text-[10px] leading-relaxed text-muted-foreground">
          © {new Date().getFullYear()} {siteConfig.name}.<br />
          Still building.
        </p>
      </div>
    </footer>
  );
}
