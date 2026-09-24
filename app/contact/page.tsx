import { ContactSection } from "@/components/contact/contact-section";
import { PageJsonLd } from "@/components/page-json-ld";
import { PageShell } from "@/components/page-shell";
import { contactContent } from "@/lib/data";
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
        <section className="bento-surface mt-6 space-y-4 p-6 sm:p-10">
          <h2 className="text-xl font-semibold tracking-tight">
            Start with the idea.
          </h2>
          {contactContent.paragraphs.map((paragraph) => (
            <p
              className="max-w-[70ch] text-base leading-8 text-muted-foreground"
              key={paragraph}
            >
              {paragraph}
            </p>
          ))}
        </section>
      </main>
    </PageShell>
  );
}
