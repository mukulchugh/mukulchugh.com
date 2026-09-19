"use client";

import { IconArrowRight, IconRefresh } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { BrandBar } from "@/components/bento/brand-bar";
import { Button, buttonVariants } from "@/components/ui/button";

export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <main className="bento-page pb-5">
      <BrandBar />
      <div className="grid gap-3 md:grid-cols-[56fr_44fr] md:gap-[1cqw]">
        <section className="bento-surface flex flex-col items-start p-6 md:min-h-[51cqw] md:p-[3cqw]">
          <p className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground md:mt-[1cqw] md:text-[0.95cqw]">
            <span aria-hidden="true" className="h-px w-6 bg-current" />
            Something went wrong
          </p>
          <h1 className="my-8 text-[clamp(36px,6cqw,84px)] font-black leading-[0.9] tracking-[-0.065em] md:mb-[2.6cqw] md:mt-[4.5cqw]">
            Let’s try
            <br />
            that again.
          </h1>
          <p className="text-lg leading-tight text-foreground/80 md:text-[2.05cqw]">
            Something interrupted this page.
            <br />
            You can retry, or head back home.
          </p>
          <div className="mt-7 flex flex-wrap gap-3 md:mt-[3.2cqw] md:gap-[1cqw]">
            <Button
              className="h-12 gap-5 rounded-[4px] px-6 text-base font-semibold md:h-[5.6cqw] md:px-[2.7cqw] md:text-[1.8cqw] [&_svg]:size-6"
              onClick={retry}
            >
              Try again <IconRefresh aria-hidden="true" />
            </Button>
            <Link
              className={buttonVariants({
                className:
                  "h-12 gap-5 rounded-[4px] border-foreground px-6 text-base font-semibold md:h-[5.6cqw] md:px-[2.5cqw] md:text-[1.8cqw] [&_svg]:size-6",
                variant: "outline",
              })}
              href="/"
            >
              Back home <IconArrowRight aria-hidden="true" />
            </Link>
          </div>
          <p className="mt-6 text-sm text-muted-foreground md:mt-[2.2cqw] md:text-[1.35cqw]">
            If the problem continues, please try again later.
          </p>
          {error.digest && (
            <p className="mt-3 break-all font-mono text-xs text-muted-foreground">
              Error ID: {error.digest}
            </p>
          )}
        </section>
        <div
          aria-hidden="true"
          className="relative min-h-80 overflow-hidden rounded-[4px] bg-[#101010] md:min-h-0"
        >
          <Image
            alt=""
            className="object-cover"
            fill
            preload
            sizes="(min-width: 768px) 42vw, 95vw"
            src="/design/error-reference.png"
          />
          <span className="absolute left-6 top-6 font-mono text-xs uppercase leading-snug tracking-[0.15em] text-white md:left-[2.8cqw] md:top-[2.8cqw] md:text-[0.95cqw]">
            A small
            <br />
            setback
            <br />
            Still
            <br />
            forward
          </span>
        </div>
      </div>
    </main>
  );
}
