import { IconArrowRight } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { ThemeLogo } from "@/components/theme-logo";
import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/lib/data";

export default function NotFound() {
  return (
    <main className="bento-page py-8 md:pb-10 md:pt-[7cqw]">
      <header className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-1 md:mb-[2cqw]">
        <Link
          className="flex min-h-11 items-center gap-3 text-lg font-bold md:text-[1.6cqw]"
          href="/"
        >
          <ThemeLogo alt="" height={32} width={32} />
          {siteConfig.name}
        </Link>
        <span className="border-l border-border pl-4 text-sm text-muted-foreground md:text-[1.25cqw]">
          Engineer turned generalist.
        </span>
      </header>
      <div className="grid gap-3 md:grid-cols-2 md:gap-[1cqw]">
        <section className="bento-surface flex flex-col items-start p-6 md:min-h-[47.6cqw] md:p-[3cqw]">
          <p className="font-mono text-xs tracking-wide text-muted-foreground md:text-[1.1cqw]">
            404 / NOT FOUND
          </p>
          <h1 className="my-8 text-[clamp(40px,6.5cqw,90px)] font-black leading-[0.9] tracking-[-0.065em] md:mb-[2.5cqw] md:mt-[5.5cqw]">
            Lost in
            <br />
            the grid.
          </h1>
          <p className="max-w-[26ch] text-lg leading-snug text-muted-foreground md:text-[1.8cqw]">
            This page may have moved, or the link may be incorrect.
          </p>
          <Link
            className={buttonVariants({
              className:
                "mt-7 h-12 gap-6 rounded-[4px] px-6 text-base font-semibold md:mt-[2.5cqw] md:h-[5.5cqw] md:px-[2.2cqw] md:text-[1.8cqw] [&_svg]:size-6",
            })}
            href="/"
          >
            Back home <IconArrowRight aria-hidden="true" />
          </Link>
        </section>
        <div
          aria-hidden="true"
          className="relative min-h-72 overflow-hidden rounded-[4px] bg-[#101010] md:min-h-0"
        >
          <Image
            alt=""
            className="object-contain"
            fill
            preload
            sizes="(min-width: 768px) 48vw, 95vw"
            src="/design/chrome-ribbon.png"
          />
        </div>
      </div>
    </main>
  );
}
