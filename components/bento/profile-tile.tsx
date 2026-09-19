"use client";

import { IconArrowRight } from "@tabler/icons-react";
import { motion } from "motion/react";
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/lib/data";
import { useSectionInView } from "@/lib/hooks";
import { premiumSpring } from "@/lib/motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/utils";

export function ProfileTile() {
  const { ref } = useSectionInView("Home", 0.5);
  return (
    <section className="bento-profile bento-surface" id="home" ref={ref}>
      <p className="bento-label">01 / About</p>
      <h1 className="bento-headline font-syne">
        <span>Creating</span>{" "}
        <span className="bento-headline-middle">
          <span>digital</span> <span>experiences</span>
        </span>{" "}
        <span>for humans.</span>
      </h1>
      <div className="bento-introduction">
        <Image
          alt="Illustrated portrait of Mukul Chugh"
          className="bento-portrait"
          height={112}
          preload
          sizes="(max-width: 767px) 72px, 112px"
          src={siteConfig.images.profileImage}
          width={112}
        />
        <p className="bento-intro">
          I’m Mukul, a founding engineer at Quivly, building end-to-end across
          mobile, full-stack, and AI. I care about useful products, thoughtful
          design, and the people who use them.
        </p>
      </div>
      <div className="mt-auto flex items-end justify-between gap-4">
        <a className={cn(buttonVariants(), "bento-work-link")} href="#projects">
          View work <IconArrowRight aria-hidden="true" />
        </a>
        <p aria-hidden="true" className="bento-marginalia">
          Product
          <br />
          Code
          <br />
          People
          <br />
          Runtime
        </p>
      </div>
    </section>
  );
}

export function HeroArtwork() {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className="bento-hero-art"
      initial={false}
      transition={premiumSpring}
      whileHover={reduce ? undefined : { scale: 0.992 }}
    >
      <Image
        alt=""
        className="object-cover"
        fill
        preload
        sizes="(min-width: 768px) 44vw, 100vw"
        src="/design/chrome-ribbon.png"
      />
      <p className="bento-label relative">02 / Human × machine</p>
      <p
        aria-hidden="true"
        className="bento-marginalia absolute right-[4%] top-[6%]"
      >
        Better
        <br />
        Tools
        <br />
        Brighter
        <br />
        People
      </p>
      <p className="bento-art-caption">
        Ideas
        <br />
        into
        <br />
        useful
        <br />
        things.
      </p>
    </motion.div>
  );
}
