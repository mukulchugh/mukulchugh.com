"use client";

import { IconArrowRight, IconRotateClockwise } from "@tabler/icons-react";
import { motion } from "motion/react";
import Image from "next/image";
import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { FluorescentShader } from "@/components/ui/fluorescent-shader";
import { siteConfig } from "@/lib/data";
import { useSectionInView } from "@/lib/hooks";
import { premiumSpring } from "@/lib/motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import styles from "./profile-tile.module.css";

export function ProfileTile() {
  const { ref } = useSectionInView("Home", 0.5);
  return (
    <section className={`bento-surface ${styles.profile}`} id="home" ref={ref}>
      <FluorescentShader active className={styles.shader} />
      <h1 className={styles.headline}>
        <span>Creating</span> <span>digital</span> <span>experiences</span>{" "}
        <span>for humans.</span>
      </h1>
      <div className={styles.introduction}>
        <Image
          alt="Illustrated portrait of Mukul Chugh"
          className={styles.portrait}
          height={112}
          preload
          sizes="(max-width: 767px) 72px, 112px"
          src={siteConfig.images.profileImage}
          width={112}
        />
        <p className={styles.intro}>
          I’m Mukul, a founding engineer at Quivly. I build useful products
          across mobile, full-stack, and AI.
        </p>
      </div>
      <a className={styles.workLink} href="#projects">
        View work <IconArrowRight aria-hidden="true" />
      </a>
    </section>
  );
}

export function HeroArtwork() {
  const reduce = useReducedMotion();
  const [angle, setAngle] = useState(0);
  const controlId = useId();

  return (
    <section
      aria-label="Interactive motion study"
      className="bento-hero-art craft-study tile-glass"
    >
      <div className="absolute inset-x-0 bottom-14 top-0 overflow-hidden">
        <motion.div
          animate={{ rotate: angle, x: angle / 2 }}
          className="absolute inset-0"
          initial={false}
          transition={reduce ? { duration: 0 } : premiumSpring}
        >
          <Image
            alt="A chrome ribbon balanced around a lime sphere"
            className="pointer-events-none select-none object-contain"
            draggable={false}
            fill
            preload
            sizes="(min-width: 768px) 44vw, 100vw"
            src="/design/chrome-ribbon.webp"
            unoptimized
          />
        </motion.div>
      </div>
      <div className="absolute inset-x-0 bottom-0 z-10 flex min-h-14 items-center gap-3 border-t border-white/15 bg-[#141414] px-4">
        <label className="ui-label shrink-0 text-white/80" htmlFor={controlId}>
          Turn
        </label>
        <input
          aria-valuetext={
            angle === 0
              ? "Centered"
              : `${Math.abs(angle)} ${Math.abs(angle) === 1 ? "degree" : "degrees"} ${angle < 0 ? "left" : "right"}`
          }
          className="craft-study-control min-w-0 flex-1"
          id={controlId}
          max={8}
          min={-8}
          onChange={(event) => setAngle(Number(event.currentTarget.value))}
          step={1}
          type="range"
          value={angle}
        />
        <Button
          aria-label="Reset motion study"
          className="shrink-0 text-white/80 hover:bg-white/10 hover:text-white focus-visible:ring-white disabled:opacity-40"
          disabled={angle === 0}
          onClick={() => setAngle(0)}
          size="icon"
          variant="ghost"
        >
          <IconRotateClockwise aria-hidden="true" size={16} />
        </Button>
      </div>
    </section>
  );
}
