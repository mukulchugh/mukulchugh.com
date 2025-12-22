import "./globals.css";

import ActiveSectionContextProvider from "@/context/active-section-context";
import Footer from "@/components/footer";

import ThemeContextProvider from "@/context/theme-context";
import React from "react";
import { GoogleAnalytics } from "@next/third-parties/google";
import { inter } from "@/lib/fonts";
import Header from "@/components/header";
import { siteConfig, skillsData } from "@/lib/data";
import { JsonLd } from "@/components/json-ld";
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
};

const Blob = React.memo(() => {
  return (
    <React.Fragment>
      <div className="bg-[#fb757a] absolute top-[-6rem] -z-10 right-[11rem] h-[31.25rem] w-[31.25rem] rounded-full blur-[10rem] sm:w-[68.75rem] dark:bg-[#4a2c2d]"></div>
      <div className="bg-[#9384ff] absolute top-[-1rem] -z-10 left-[-35rem] h-[31.25rem] w-[50rem] rounded-full blur-[10rem] sm:w-[68.75rem] md:left-[-33rem] lg:left-[-28rem] xl:left-[-15rem] 2xl:left-[-5rem] dark:bg-[#2d2a3d]"></div>
    </React.Fragment>
  );
});

Blob.displayName = "Blob";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="!scroll-smooth">
      <head>
        <JsonLd />
      </head>
      <body
        className={`${inter.className} bg-gray-50 text-gray-950 relative pt-28 sm:pt-36 dark:bg-black dark:text-gray-50 dark:text-opacity-90`}
      >
        <Blob />
        <ThemeContextProvider>
          <ActiveSectionContextProvider>
            <Header />
            {children}
            <Footer />
          </ActiveSectionContextProvider>
        </ThemeContextProvider>
        <GoogleAnalytics gaId={siteConfig.analytics.googleAnalyticsId} />
      </body>
    </html>
  );
}
