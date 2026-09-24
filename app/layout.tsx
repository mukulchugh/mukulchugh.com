import "./globals.css";

import type { Metadata } from "next";
import type React from "react";
import { AnalyticsWrapper } from "@/components/analytics-wrapper";
import Footer from "@/components/footer";
import { JsonLd } from "@/components/json-ld";
import { ThemeProvider } from "@/components/theme-provider";
import { Dock } from "@/components/ui/dock";
import { RouteTransition } from "@/components/ui/route-transition";
import ActiveSectionContextProvider from "@/context/active-section-context";
import { siteConfig } from "@/lib/data";
import { geist, syne } from "@/lib/fonts";

import { staticMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...staticMetadata("/"),
  authors: [{ name: siteConfig.name, url: `${siteConfig.siteUrl}/about` }],
  creator: siteConfig.name,
  formatDetection: { telephone: false },
  icons: { icon: siteConfig.images.favicon },
  metadataBase: new URL(siteConfig.siteUrl),
  robots: {
    follow: true,
    googleBot: {
      follow: true,
      index: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
    index: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      className={`${geist.variable} ${syne.variable} motion-safe:scroll-smooth`}
      data-scroll-behavior="smooth"
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <link
          crossOrigin="anonymous"
          href="https://ik.imagekit.io"
          rel="preconnect"
        />
        <link href="https://www.googletagmanager.com" rel="dns-prefetch" />
        <link href="https://analytics.google.com" rel="dns-prefetch" />
        <link
          href="/blog/rss.xml"
          rel="alternate"
          title={`${siteConfig.name} Blog RSS Feed`}
          type="application/rss+xml"
        />
        <JsonLd />
      </head>
      <body className="font-sans bg-background text-foreground relative transition-colors duration-300 ease-out">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ActiveSectionContextProvider>
            <RouteTransition>{children}</RouteTransition>
            <Footer />
            <Dock />
          </ActiveSectionContextProvider>
          <AnalyticsWrapper />
        </ThemeProvider>
      </body>
    </html>
  );
}
