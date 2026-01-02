import "./globals.css";

import ActiveSectionContextProvider from "@/context/active-section-context";
import Footer from "@/components/footer";
import React from "react";
import { AnalyticsWrapper } from "@/components/analytics-wrapper";
import { inter } from "@/lib/fonts";
import Header from "@/components/header";
import { Dock } from "@/components/ui/dock";
import { siteConfig, skillsData } from "@/lib/data";
import { JsonLd } from "@/components/json-ld";
import { HeroBackground } from "@/components/hero-background";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: siteConfig.siteTitle,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.siteDescription,
  keywords: [
    ...siteConfig.keywords,
    ...skillsData,
    "Mukul Chugh",
    "Portfolio",
    "Swiggy Engineer",
    "Zenduty",
    "India",
  ],
  authors: [{ name: siteConfig.name, url: siteConfig.siteUrl }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  metadataBase: new URL(siteConfig.siteUrl),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.siteUrl,
    siteName: siteConfig.name,
    title: siteConfig.siteTitle,
    description: siteConfig.siteDescription,
    images: [
      {
        url: siteConfig.images.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@themukulchugh",
    creator: "@themukulchugh",
    title: siteConfig.siteTitle,
    description: siteConfig.siteDescription,
    images: [siteConfig.images.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: siteConfig.images.favicon,
  },
  verification: {
    google: siteConfig.analytics.googleAdsenseId,
  },
  applicationName: siteConfig.name,
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: siteConfig.name,
  },
  formatDetection: {
    telephone: false, // Prevent auto-linking phone numbers
  },
  category: "Technology",
  other: {
    "msapplication-TileColor": "#000000",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="!scroll-smooth dark">
      <head>
        <link rel="preconnect" href="https://ik.imagekit.io" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cdn.hashnode.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://gql.hashnode.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://analytics.google.com" />
        <link
          rel="alternate"
          type="application/rss+xml"
          title={`${siteConfig.name} Blog RSS Feed`}
          href="/blog/rss.xml"
        />
        <JsonLd />
      </head>
      <body
        className={`${inter.className} bg-black text-gray-50 text-opacity-90 relative`}
      >
        <HeroBackground />
        <ActiveSectionContextProvider>
          <Header />
          {children}
          <Footer />
          <Dock />
        </ActiveSectionContextProvider>
        <AnalyticsWrapper gaId={siteConfig.analytics.googleAnalyticsId} />
      </body>
    </html>
  );
}
