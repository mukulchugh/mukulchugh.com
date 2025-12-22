import "./globals.css";

import ActiveSectionContextProvider from "@/context/active-section-context";
import Footer from "@/components/footer";

import ThemeContextProvider from "@/context/theme-context";
import React from "react";
import { GoogleAnalytics } from "@next/third-parties/google";
import { inter } from "@/lib/fonts";
import Header from "@/components/header";
import { siteConfig } from "@/lib/data";

export const metadata = {
  title: siteConfig.siteTitle,
  description: siteConfig.siteDescription,
};

const Blob = React.memo(() => {
  return (
    <React.Fragment>
      <div className="bg-[#fb757a] absolute top-[-6rem] -z-10 right-[11rem] h-[31.25rem] w-[31.25rem] rounded-full blur-[10rem] sm:w-[68.75rem] dark:bg-[#4a2c2d]"></div>
      <div className="bg-[#9384ff] absolute top-[-1rem] -z-10 left-[-35rem] h-[31.25rem] w-[50rem] rounded-full blur-[10rem] sm:w-[68.75rem] md:left-[-33rem] lg:left-[-28rem] xl:left-[-15rem] 2xl:left-[-5rem] dark:bg-[#2d2a3d]"></div>
    </React.Fragment>
  );
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="!scroll-smooth">
      <head>
        <meta name="robots" content="follow, index" />
        <link rel="icon" href={siteConfig.images.favicon} type="image/x-icon" />
        <meta property="og:url" content={siteConfig.siteUrl} />
        <link rel="canonical" href={siteConfig.siteUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={siteConfig.name} />
        <meta property="og:description" content={siteConfig.siteDescription} />
        <meta property="og:title" content={siteConfig.siteTitle} />
        <meta property="og:image" content={siteConfig.images.ogImage} />
        <meta property="og:image:alt" content={siteConfig.name} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@themukulchugh" />
        <meta name="twitter:title" content={siteConfig.siteTitle} />
        <meta name="twitter:description" content={siteConfig.siteDescription} />
        <meta name="twitter:image" content={siteConfig.images.ogImage} />
        <meta name="google-adsense-account" content={siteConfig.analytics.googleAdsenseId} />
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
