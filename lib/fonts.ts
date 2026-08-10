import { Geist, Syne } from "next/font/google";

// next/font loaders must only run in Server Components (e.g. app/layout).
// Client code should use the Tailwind `font-syne` / `font-sans` classes instead.
export const syne = Syne({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-syne",
});

export const geist = Geist({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-geist",
});
