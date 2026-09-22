import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContactSection } from "@/components/contact/contact-section";

export const metadata: Metadata = {
  robots: { follow: false, index: false },
  title: "Contact · isolated preview",
};

export default function Page() {
  if (process.env.NODE_ENV === "production") notFound();
  return (
    <main className="bento-page pb-36 pt-8 sm:pt-14">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">
          Contact, in isolation.
        </h1>
        <Link
          className="inline-flex min-h-11 items-center underline underline-offset-4"
          href="/#contact"
        >
          Back to portfolio
        </Link>
      </header>
      <div className="home-design [container-type:inline-size]">
        <ContactSection />
      </div>
    </main>
  );
}
