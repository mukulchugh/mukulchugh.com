import type { Metadata } from "next";
import { ContactSection } from "@/components/contact/contact-section";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  alternates: { canonical: "/contact" },
  description:
    "Start a conversation with Mukul Chugh. Book a short call or get in touch by email.",
  title: "Contact",
};

export default function ContactPage() {
  return (
    <PageShell contact={false}>
      <main className="page-content">
        <h1 className="sr-only">Contact Mukul Chugh</h1>
        <ContactSection />
      </main>
    </PageShell>
  );
}
