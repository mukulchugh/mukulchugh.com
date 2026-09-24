import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BrandBar } from "@/components/bento/brand-bar";
import styles from "./preview.module.css";

export const metadata: Metadata = {
  robots: { follow: false, index: false },
  title: "Header · isolated preview",
};

export default function Page() {
  if (process.env.NODE_ENV === "production") notFound();
  return (
    <main className={`bento-page ${styles.preview}`} data-header-preview>
      <h1 className="sr-only">Header preview</h1>
      <BrandBar />
    </main>
  );
}
