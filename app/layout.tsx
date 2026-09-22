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
import { siteConfig, skillsData } from "@/lib/data";
import { geist, syne } from "@/lib/fonts";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: siteConfig.name,
  },
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name, url: siteConfig.siteUrl }],
  category: "Technology",
  creator: siteConfig.name,
  description: siteConfig.siteDescription,
  formatDetection: {
    telephone: false, // Prevent auto-linking phone numbers
  },
  icons: {
    icon: siteConfig.images.favicon,
  },
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

    // Organization Long-tail Keywords
    "Ex Swiggy Engineer",
    "Former Swiggy Developer",
    "Ex Zenduty Engineer",
    "Former Zenduty Developer",
    "xurrent Former Employee",
    "Quivly Founding Team",
    "Microsoft Ambassador Alumni",
    "Swiggy Mobile Team",
    "Zenduty Core Team",
    "xurrent Zenduty Team",
  ],
  metadataBase: new URL(siteConfig.siteUrl),
  openGraph: {
    description: siteConfig.siteDescription,
    images: [
      {
        alt: siteConfig.name,
        height: 630,
        url: siteConfig.images.ogImage,
        width: 1200,
      },
    ],
    locale: "en_US",
    siteName: siteConfig.name,
    title: siteConfig.siteTitle,
    type: "website",
    url: siteConfig.siteUrl,
  },
  other: {
    "msapplication-TileColor": "#000000",
  },
  publisher: siteConfig.name,
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
  title: {
    default: siteConfig.siteTitle,
    template: `%s | ${siteConfig.name}`,
  },
  twitter: {
    card: "summary_large_image",
    creator: "@themukulchugh",
    description: siteConfig.siteDescription,
    images: [siteConfig.images.ogImage],
    site: "@themukulchugh",
    title: siteConfig.siteTitle,
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
          <AnalyticsWrapper gaId={siteConfig.analytics.googleAnalyticsId} />
        </ThemeProvider>
      </body>
    </html>
  );
}
