"use client";

import Link from "next/link";
import { ThemeLogo } from "@/components/theme-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { siteConfig } from "@/lib/site-config";
import styles from "./brand-bar.module.css";

export function BrandBar() {
  return (
    <header className={`bento-brand-bar bento-surface ${styles.tile}`}>
      <Link
        aria-label="Mukul Chugh, home"
        className={styles.identity}
        href="/"
        prefetch={false}
      >
        <ThemeLogo alt="" height={32} priority width={32} />
        <span aria-hidden="true" className={styles.name}>
          {siteConfig.name}
        </span>
      </Link>
      <p className={styles.tagline}>{siteConfig.tagline}</p>
      <ThemeToggle className={styles.theme} />
    </header>
  );
}
