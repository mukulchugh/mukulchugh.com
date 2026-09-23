import type { ReactNode } from "react";
import { BrandBar } from "@/components/bento/brand-bar";
import { ContactSection } from "@/components/contact/contact-section";

export function PageShell({
  children,
  contact = true,
}: {
  children: ReactNode;
  contact?: boolean;
}) {
  return (
    <div className="bento-page">
      <BrandBar />
      {children}
      {contact && (
        <div className="my-6 sm:my-8">
          <ContactSection />
        </div>
      )}
    </div>
  );
}
