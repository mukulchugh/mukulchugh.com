import Link from "next/link";
import { siteConfig, footerContent, links, footerSocialLinks } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="py-10 sm:py-16 pb-24 sm:pb-28 min-h-fit sm:min-h-[360px]">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <Link
          href="/"
          aria-label="go home"
          className="mx-auto block size-fit"
        />

        {/* Nav links — touch targets via min-h + py */}
        <nav aria-label="Footer navigation">
          <div className="my-8 flex flex-wrap justify-center gap-2">
            {links.map((link, index) => (
              <Link
                key={index}
                href={link.hash}
                className="inline-flex items-center px-3 py-2.5 min-h-[44px] text-[14px]
                           text-zinc-400 [@media(hover:hover)]:hover:text-foreground
                           transition-colors duration-150"
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
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.ariaLabel}
              className="flex items-center justify-center w-11 h-11 rounded-xl
                         text-zinc-400 [@media(hover:hover)]:hover:text-foreground
                         [@media(hover:hover)]:hover:bg-black/[0.04]
                         transition-colors duration-150 active:bg-black/[0.06]"
            >
              <svg
                className="size-5"
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path fill="currentColor" d={link.path} />
              </svg>
            </Link>
          ))}
        </div>

        {/* Copyright — meta 12px */}
        <span className="text-zinc-400 block text-center text-[12px]">
          &copy; {new Date().getFullYear()} {siteConfig.name}.{" "}
          {footerContent.copyright}
        </span>
      </div>
    </footer>
  );
}
