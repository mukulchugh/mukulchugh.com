import "./globals.css";

import { AnalyticsWrapper } from "@/components/analytics-wrapper";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { HeroBackground } from "@/components/hero-background";
import { JsonLd } from "@/components/json-ld";
import { Dock } from "@/components/ui/dock";
import ActiveSectionContextProvider from "@/context/active-section-context";
import { siteConfig, skillsData } from "@/lib/data";
import { inter } from "@/lib/fonts";
import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: {
    default: siteConfig.siteTitle,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.siteDescription,
  keywords: [
    ...siteConfig.keywords,
    ...skillsData,
      "Mukul",
    "Chugh",
    // Additional SEO Keywords - Portfolio & Hiring
    "Portfolio",
    "Engineer Portfolio",
    "Developer Portfolio",
    "Tech Portfolio",
    "Hire React Native Developer",
    "Hire Mobile Developer",
    "Hire Full Stack Developer",
    "Hire Product Engineer",
    "Freelance Developer India",
    "React Native Expert",
    "Mobile App Expert",
    "Startup CTO",
    "Technical Co-Founder",
    "App Developer San Francisco",
    "Software Engineer Bay Area",
    "Indian Developer USA",
    "Remote Developer",
    "Contract Developer",
    "T-shaped Engineer",
    "Product Minded Engineer",
    "Design Engineer",

    // Blog Topics Keywords
    "React Tutorial",
    "JavaScript Tutorial",
    "Web Development Blog",
    "Mobile Development Blog",
    "Tech Blog",
    "Coding Blog",
    "React Best Practices",
    "React Native Tutorial",
    "Next.js Tutorial",
    "Frontend Development Blog",
    "Software Engineering Blog",

    // Long-tail Keywords
    "Best React Native Developer",
    "Top Mobile App Developer India",
    "Experienced Full Stack Developer",
    "Senior Product Engineer",
    "React Native Consultant",
    "Mobile App Development Services",
    "Web Application Development",
    "Custom App Development",
    "Startup Technical Advisor",
    "Product Development Consultant",
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
