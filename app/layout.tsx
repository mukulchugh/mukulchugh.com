import Header from "@/components/header";
import "./globals.css";
import { Inter } from "next/font/google";
import ActiveSectionContextProvider from "@/context/active-section-context";
import Footer from "@/components/footer";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import ThemeContextProvider from "@/context/theme-context";
import { Toaster } from "react-hot-toast";
import React from "react";
import { GoogleAnalytics } from "@next/third-parties/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Mukul Chugh - Creating Digital Experiences for Humans",
  description:
    "Engineer, Designer & Product Generalist, passionate about building products that solve real world problems. Freelancing, Open Source, and writing about tech.",
};

const Blob = React.memo(() => {
  return (
    <React.Fragment>
      <div className="bg-[#fb757a] absolute top-[-6rem] -z-10 right-[11rem] h-[31.25rem] w-[31.25rem] rounded-full blur-[10rem] sm:w-[68.75rem] dark:bg-[#ae4b4d]"></div>
      <div className="bg-[#9384ff] absolute top-[-1rem] -z-10 left-[-35rem] h-[31.25rem] w-[50rem] rounded-full blur-[10rem] sm:w-[68.75rem] md:left-[-33rem] lg:left-[-28rem] xl:left-[-15rem] 2xl:left-[-5rem] dark:bg-[#6658c4]"></div>
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
        <link rel="icon" href="/favicon.png" type="image/x-icon" />
        <meta property="og:url" content="https://mukulchugh.com" />
        <link rel="canonical" href="https://mukulchugh.com" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Mukul Chugh" />
        <meta
          property="og:description"
          content="Engineer, Designer & Product Generalist, passionate about building products that solve real world problems. Freelancing, Open Source, and writing about tech."
        />
        <meta
          property="og:title"
          content="Mukul Chugh - Creating Digital Experiences for Humans"
        />
        <meta property="og:image" content="/Thumbnail.webp" />
        <meta property="og:image:alt" content="Mukul Chugh" />
        <meta
          name="twitter:card"
          content="Engineer, Designer & Product Generalist, passionate about building products that solve real world problems. Freelancing, Open Source, and writing about tech."
        />
        <meta name="twitter:site" content="@themukulchugh" />
        <meta
          name="twitter:title"
          content="Mukul Chugh - Creating Digital Experiences for Humans"
        />
        <meta
          name="twitter:description"
          content="Engineer, Designer & Product Generalist, passionate about building products that solve real world problems. Freelancing, Open Source, and writing about tech."
        />
        <meta name="twitter:image" content="/Thumbnail.webp" />
      </head>
      <body
        className={`${inter.className} bg-gray-50 text-gray-950 relative pt-28 sm:pt-36 dark:bg-gray-900 dark:text-gray-50 dark:text-opacity-90`}
      >
        <Blob />
        <ThemeContextProvider>
          <ActiveSectionContextProvider>
            <Header />
            {children}
            <Footer />
            <Toaster position="top-right" />
          </ActiveSectionContextProvider>
        </ThemeContextProvider>
        <GoogleAnalytics gaId="G-VTWNXFFM1L" />
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
