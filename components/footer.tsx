import Link from "next/link";
import { siteConfig, footerContent, links, footerSocialLinks } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="py-16 pb-28 min-h-[400px]">
      <div className="mx-auto max-w-4xl px-6">
        <Link
          href="/"
          aria-label="go home"
          className="mx-auto block size-fit"
        />

        <div className="my-8 flex flex-wrap justify-center gap-6">
          {links.map((link, index) => (
            <Link
              key={index}
              href={link.hash}
              className="text-muted-foreground hover:text-primary block duration-150"
            >
              <span>{link.name}</span>
            </Link>
          ))}
        </div>

        <div className="my-8 flex flex-wrap justify-center gap-6 text-sm">
          {footerSocialLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.ariaLabel}
              className="text-muted-foreground hover:text-primary block"
            >
              <svg
                className="size-6"
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
              >
                <path fill="currentColor" d={link.path} />
              </svg>
            </Link>
          ))}
        </div>

        <span className="text-muted-foreground block text-center text-sm">
          &copy; {new Date().getFullYear()} {siteConfig.name}.{" "}
          {footerContent.copyright}
        </span>
      </div>
    </footer>
  );
}
