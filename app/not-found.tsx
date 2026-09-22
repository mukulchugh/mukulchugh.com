import { IconArrowRight } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <PageShell>
      <main className="page-content">
        <div className="grid gap-3 md:grid-cols-2 md:gap-[1cqw]">
          <section className="bento-surface flex flex-col items-start p-6 md:min-h-[47.6cqw] md:p-[3cqw]">
            <p className="ui-label text-muted-foreground">404 / NOT FOUND</p>
            <h1 className="my-8 text-balance font-sans text-[clamp(2rem,4.5cqw,3.5rem)] font-semibold leading-[1.12] tracking-[-0.025em] md:mb-[2.5cqw] md:mt-[5.5cqw]">
              Page not found.
            </h1>
            <p className="max-w-[26ch] text-lg leading-snug text-muted-foreground md:text-[1.8cqw]">
              This page may have moved, or the link may be incorrect.
            </p>
            <Link
              className={buttonVariants({
                className: "mt-7 h-12 gap-6 px-6 md:mt-[2.5cqw]",
              })}
              href="/"
            >
              Back home <IconArrowRight aria-hidden="true" />
            </Link>
          </section>
          <div
            aria-hidden="true"
            className="relative min-h-72 overflow-hidden rounded-[14px] bg-[#101010] md:min-h-0"
          >
            <Image
              alt=""
              className="object-contain"
              fill
              preload
              sizes="(min-width: 768px) 48vw, 95vw"
              src="/design/chrome-ribbon.webp"
              unoptimized
            />
          </div>
        </div>
      </main>
    </PageShell>
  );
}
