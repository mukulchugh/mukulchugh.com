import { ContactSection } from "@/components/contact/contact-section";
import { PageJsonLd } from "@/components/page-json-ld";
import { PageShell } from "@/components/page-shell";
import { publicPages, staticMetadata } from "@/lib/seo";

export const metadata = staticMetadata("/contact");

export default function ContactPage() {
  return (
    <PageShell contact={false}>
      <main className="page-content">
        <PageJsonLd
          description={publicPages["/contact"].description}
          path="/contact"
          title={publicPages["/contact"].title}
          type="ContactPage"
        />
        <h1 className="sr-only">Contact Mukul Chugh</h1>
        <ContactSection defaultBooking />
      </main>
    </PageShell>
  );
}
