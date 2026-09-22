import type { Metadata } from "next";
import { BrandBar } from "@/components/bento/brand-bar";
import { ContactSection } from "@/components/contact/contact-section";

export const metadata: Metadata = {
  alternates: { canonical: "/contact" },
  description:
    "Start a conversation with Mukul Chugh. Book a short call or get in touch by email.",
  title: "Contact",
};

export default function ContactPage() {
  return (
    <div className="bento-page">
      <BrandBar />
      <main className="home-design py-8 pb-36 sm:py-12 sm:pb-36">
        <h1 className="sr-only">Contact Mukul Chugh</h1>
        <ContactSection />
      </main>
    </div>
  );
}
