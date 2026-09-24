import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Footer from "@/components/footer";
import { ThemeToggle } from "@/components/theme-toggle";
import styles from "./preview.module.css";

export const metadata: Metadata = {
  robots: { follow: false, index: false },
  title: "Footer · isolated preview",
};

export default function Page() {
  if (process.env.NODE_ENV === "production") notFound();
  return (
    <main className={styles.preview} data-footer-preview>
      <h1 className="sr-only">Compact index footer preview</h1>
      <div className={styles.controls}>
        <ThemeToggle />
      </div>
      <Footer />
    </main>
  );
}
