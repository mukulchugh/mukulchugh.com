import Link from "next/link";
import {
  footerContent,
  footerSocialLinks,
  links,
  siteConfig,
} from "@/lib/data";

export default function Footer() {
  return (
    <footer className="py-10 sm:py-16 pb-24 sm:pb-28 min-h-fit sm:min-h-[360px]">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <Link
          aria-label="go home"
          className="mx-auto block size-fit"
          href="/"
        />

        {/* Nav links — touch targets via min-h + py */}
        <nav aria-label="Footer navigation">
          <div className="my-8 flex flex-wrap justify-center gap-2">
            {links.map((link, index) => (
              <Link
                className="inline-flex items-center px-3 py-2.5 min-h-[44px] text-[14px]
                           text-muted-foreground [@media(hover:hover)]:hover:text-foreground
                           transition-colors duration-150"
                href={link.hash}
                key={index}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </nav>

        {/* Social links — 44×44 touch targets */}
        <div className="my-6 flex flex-wrap justify-center gap-3">
          {footerSocialLinks.map((link) => (
            <Link
              aria-label={link.ariaLabel}
              className="flex items-center justify-center w-11 h-11 rounded-xl
                         text-muted-foreground [@media(hover:hover)]:hover:text-foreground
                         [@media(hover:hover)]:hover:bg-foreground/[0.05]
                         transition-colors duration-150 active:bg-foreground/[0.07]"
              href={link.href}
              key={link.name}
              rel="noopener noreferrer"
              target="_blank"
            >
              <svg
                aria-hidden="true"
                className="size-5"
                height="1em"
                viewBox="0 0 24 24"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d={link.path} fill="currentColor" />
              </svg>
            </Link>
          ))}
        </div>

        {/* Copyright — meta 12px */}
        <span className="text-muted-foreground block text-center text-[12px]">
          &copy; {new Date().getFullYear()} {siteConfig.name}.{" "}
          {footerContent.copyright}
        </span>
      </div>
    </footer>
  );
}
