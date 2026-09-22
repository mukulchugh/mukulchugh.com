import { Geist, Syne } from "next/font/google";

// next/font loaders must only run in Server Components (e.g. app/layout).
// Client code uses the Tailwind `font-sans` class.

export const geist = Geist({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-geist",
});

export const syne = Syne({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-syne",
});
