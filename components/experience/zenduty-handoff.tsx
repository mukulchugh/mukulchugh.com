"use client";

import { IconArrowRight } from "@tabler/icons-react";
import { useInView, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { zendutyChapter } from "@/lib/data";
import styles from "./experience-tile.module.css";

export function ZendutyHandoff({
  active,
  complete,
  onComplete,
}: {
  active: boolean;
  complete: boolean;
  onComplete: () => void;
}) {
  const reduced = useReducedMotion();
  const anchor = useRef<HTMLSpanElement>(null);
  const visible = useInView(anchor);
  const phase = complete ? "complete" : active ? "moving" : "idle";
  useEffect(() => {
    if (active && reduced) onComplete();
  }, [active, reduced, onComplete]);

  return (
    <>
      <span
        aria-hidden="true"
        className={`${styles.brandMark} ${styles.handoffAnchor}`}
        data-phase={phase}
        data-visible={visible}
        ref={anchor}
      >
        <span className={styles.handoffOldLogo}>
          <Image
            alt=""
            height={40}
            src="/design/brand/zenduty.webp"
            width={40}
          />
        </span>
        <span className={styles.handoffPendant}>
          <span className={styles.handoffThread} />
          <span
            className={styles.handoffLogo}
            onAnimationEnd={(event) => {
              if (active && event.target === event.currentTarget) onComplete();
            }}
          >
            <Image
              alt=""
              height={32}
              src="/design/brand/xurrent.png"
              width={32}
            />
          </span>
        </span>
      </span>
      <span className={styles.headline}>Connecting more of the product.</span>
      <IconArrowRight aria-hidden="true" className={styles.arrow} size={22} />
      <span className={styles.metadata}>
        <span data-phase={phase}>
          <span className="sr-only">
            Zenduty, now IMR by Xurrent. Founding team. Acquired by Xurrent in
            February 2025.
          </span>
          <span aria-hidden="true" className={styles.handoffName}>
            <span className={styles.handoffOldText}>
              <strong>{zendutyChapter.company}</strong> / {zendutyChapter.team}
            </span>
            <span className={styles.handoffNewText}>
              <strong>{zendutyChapter.currentBrand}</strong> /{" "}
              {zendutyChapter.team}
            </span>
          </span>
        </span>
        <span className={styles.date}>{zendutyChapter.date}</span>
      </span>
      <span className={styles.handoffFooter} data-phase={phase}>
        <span aria-hidden={!complete} className={styles.handoffNewText}>
          Zenduty roots. A new chapter with Xurrent.
        </span>
      </span>
    </>
  );
}
