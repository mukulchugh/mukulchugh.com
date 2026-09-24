"use client";

import { createContext, type ReactNode, useContext } from "react";
import { BrandBar } from "@/components/bento/brand-bar";
import { ContactSection } from "@/components/contact/contact-section";

export const PageWindowContext = createContext(false);

// Page chrome belongs to the standalone route, not inside a titled dock window.
export function PageOnly({ children }: { children: ReactNode }) {
  return useContext(PageWindowContext) ? null : children;
}

export function PageShell({
  children,
  contact = true,
}: {
  children: ReactNode;
  contact?: boolean;
}) {
  if (useContext(PageWindowContext)) {
    return <div data-window-page>{children}</div>;
  }
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
