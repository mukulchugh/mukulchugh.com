import { GA_ID } from "./analytics-config";

export const siteConfig = {
  // Analytics
  analytics: {
    googleAnalyticsId: GA_ID,
  },

  // Contact
  email: {
    display: "contact@mukulchugh.com",
    recipient: "contact@mukulchugh.com",
  },

  firstName: "Mukul",

  // Images
  images: {
    favicon: "/favicon.png",
    logoDark: "/design/brand/logo-white.webp",
    logoLight: "/design/brand/logo-black.webp",
    ogImage: "/og/home.png",
    profileImage: "/design/brand/mukul-original.webp",
  },

  lastName: "Chugh",
  location: "India",
  locationFull: "India",
  // Personal Info
  name: "Mukul Chugh",
  siteDescription:
    "Engineer by craft. Builder by design. Founding Engineer at Quivly.ai, working across mobile, full-stack, product, and design. Previously at Swiggy and Zenduty (acquired).",
  siteTitle: "Mukul Chugh | Creating digital experiences for humans",

  // SEO & Meta
  siteUrl: "https://mukulchugh.com",

  // Social Links
  social: {
    blog: "https://mukulchugh.com/blog",
    github: "https://github.com/mukulchugh",
    linkedin: "https://linkedin.com/in/mukulchugh",
    twitter: "https://twitter.com/themukulchugh",
  },
  tagline: "Engineer by craft. Builder by design.",
  title: "Product Engineer",
} as const;

export const links = [
  {
    hash: "/",
    name: "Home",
  },
  {
    hash: "/about",
    name: "About",
  },
  {
    hash: "/projects",
    name: "Projects",
  },
  {
    hash: "/blog",
    name: "Blog",
  },
  {
    hash: "/experience",
    name: "Experience",
  },
  {
    hash: "/contact",
    name: "Contact",
  },
] as const;
