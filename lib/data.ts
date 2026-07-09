// ============================================
// SITE CONFIGURATION - All content in one place
// ============================================

export const siteConfig = {
  // Personal Info
  name: "Mukul Chugh",
  firstName: "Mukul",
  lastName: "Chugh",
  title: "Product Engineer",
  tagline: "Engineer turned generalist. Building products end to end.",
  location: "San Francisco, CA",
  locationFull: "San Francisco, California, USA",

  // SEO & Meta
  siteUrl: "https://mukulchugh.com",
  siteTitle:
    "Mukul Chugh | Product Engineer · Mobile, Full-Stack & AI",
  siteDescription:
    "Founding Engineer at Quivly.ai, building AI-powered products. An engineer turned generalist spanning mobile, full-stack, product, and design. Previously at Swiggy and Zenduty (acquired).",

  // Keywords for SEO (used in JSON-LD)
  keywords: [
    "Mukul Chugh",
    "themukulchugh",
    "Mukul Chugh portfolio",
    "engineer turned generalist",
    "product engineer",
    "founding engineer",
    "full stack engineer",
    "mobile engineer",
    "React",
    "React Native",
    "TypeScript",
    "Next.js",
    "Swift",
    "Golang",
    "Quivly",
    "Swiggy",
    "Zenduty",
    "OpenKVM",
    "Brik",
    "human-centric design",
    "digital experiences for humans",
    "San Francisco engineer",
    "software developer India",
  ],

  // Social Links
  social: {
    github: "https://github.com/mukulchugh",
    linkedin: "https://linkedin.com/in/mukulchugh",
    twitter: "https://twitter.com/themukulchugh",
    blog: "https://mukulchugh.com/blog",
  },

  // Contact
  email: {
    display: "contact@mukulchugh.com",
    recipient: "mukulchughofficial@gmail.com",
  },

  // Analytics & Ads
  analytics: {
    googleAnalyticsId: "G-VTWNXFFM1L",
    googleAdsenseId: "ca-pub-6940897897449652",
  },

  // Images
  images: {
    profileImage:
      "https://ik.imagekit.io/kooxhdceru/portfolio/mukul.webp?updatedAt=1682213515842",
    logoLight: "https://ik.imagekit.io/kooxhdceru/portfolio/logo-black.webp",
    logoDark: "https://ik.imagekit.io/kooxhdceru/portfolio/logo-white.webp",
    ogImage: "/Thumbnail.webp",
    favicon: "/favicon.png",
  },

  // Files
  files: {
    cv: "/MukulChughCV.pdf",
  },
} as const;

// About Section Content
export const aboutContent = {
  heading: "About me",
  paragraphs: [
    "Hey, I'm Mukul — an engineer who gradually absorbed product and design until the job title stopped making sense.",
    "Mobile and full-stack development are my core, but I've spent years working close enough to product and design that the lines blur. I write code, shape features, and push pixels when needed — usually all in the same week.",
    "Right now I'm a Founding Engineer at Quivly.ai in San Francisco, building AI-powered products from scratch alongside the CTO. Before that, I was at Swiggy building mobile products at scale, and at Zenduty where I shipped across mobile, web, and internal tooling until the company was acquired.",
    "I've also co-founded a startup (HeroApp) and done enough freelance work to know what I don't want. What I do want: hard problems, small fast teams, and software that earns its keep by being genuinely useful.",
    "Building something interesting? I'd like to hear about it.",
  ],
} as const;

// Intro/Hero Section Content
export const introContent = {
  greeting: "Hi, I'm Mukul Chugh",
  tagline: "I build products end to end — mobile, web, and everything between.",
  role: "product engineer",
  specialty: "Mobile & Full-Stack Development",
  passion: "shipping useful software with small, fast teams",
  ctaText: "Let's Talk",
  resumeButtonText: "View Resume",
  emoji: "👋",
} as const;

// Contact Section Content
export const contactContent = {
  heading: "Contact me",
  description:
    "Drop me an email or find me on social — I'm always up for talking about interesting problems.",
} as const;

// Footer Content
export const footerContent = {
  copyright: "All rights reserved.",
} as const;

export const links = [
  {
    name: "Home",
    hash: "#home",
  },
  {
    name: "About",
    hash: "#about",
  },
  {
    name: "Projects",
    hash: "#projects",
  },
  {
    name: "Blog",
    hash: "/blog",
  },
  {
    name: "Experience",
    hash: "#experience",
  },
  {
    name: "Contact",
    hash: "#contact",
  },
] as const;

export const experiencesData = [
  {
    title: "Founding Engineer",
    description: [
      "First engineering hire; building the Quivly platform end-to-end from day one.",
      "Work directly with the CTO on architecture decisions, product direction, and full-stack implementation.",
      "Develop across the full stack — frontend, backend, and AI/ML integrations.",
      "Shape product design and engineering culture as a core founding team member.",
    ],
    company: "Quivly.ai",
    date: "November 2025 - Present",
    location: "San Francisco, CA (Hybrid)",
    icon: "https://ik.imagekit.io/kooxhdceru/portfolio/quivly.webp",
  },
  {
    title: "Software Development Engineer",
    description: [
      "Implemented an over-the-air (OTA) updates pipeline for the React Native app to ship fixes and features without full app-store releases; enabled staged rollouts, instant rollback, and version management.",
      "Designed and shipped the end-to-end seller onboarding flow for Pyng by Swiggy (AI-based expert services platform), covering identity/KYC capture, verification, and guided setup.",
      "Built an AI-based QC & moderation engine to automate compliance and quality checks across forms, media, and profile signals, reducing manual review effort and accelerating approvals.",
      "Delivered self-serve capabilities for sellers (catalog/profile management, pricing & availability, slot scheduling, and policy workflows) to improve activation and retention.",
      "Developed internal tools for product and category managers to monitor funnels, SLAs, and quality metrics.",
      "Profiled with Flipper, Metro, and platform-native tools; cut bundle size and resolved memory bottlenecks.",
    ],
    company: "Swiggy",
    date: "May 2025 - November 2025",
    location: "Bengaluru, Karnataka, India",
    icon: "https://ik.imagekit.io/kooxhdceru/portfolio/swiggy.webp",
  },
  {
    title: "Software Development Engineer",
    description: [
      "Part of the core team that scaled the platform until acquisition — contributed across mobile, web, and internal tooling.",
      "Re-architected the React Native mobile app from ground up, building an in-house UI library and shipping multiple releases to Google Play and App Store.",
      "Enhanced incident monitoring tools, reducing response times by 25% and minimizing downtime by 20%.",
      "Built REST API services, internal automation tools, and SDKs.",
      "Developed a data analysis app using Prometheus, ElasticSearch, GraphQL, ChartJS, and NextJS.",
      "Set up Customer Data Platform (CDP) and user analytics; owned product docs, blog, and landing pages.",
      "Represented Zenduty at KubeCon India and Grayscale AI Week, contributing to developer relations and community engagement.",
    ],
    company: "Zenduty (Acquired)",
    date: "June 2022 - May 2025",
    location: "Bengaluru, Karnataka, India",
    icon: "https://ik.imagekit.io/kooxhdceru/portfolio/zenduty.webp",
  },
  {
    title: "Co-Founder & Engineer",
    description: [
      "Designed and developed a React Native-based mobile app.",
      "Owned product design, technology decisions, and development end-to-end as a co-founder.",
      "Ran agile sprints and led development from spec to ship, improving team delivery speed by 30%.",
    ],
    company: "HeroApp",
    date: "December 2021 - June 2022",
    location: "Gurugram, Haryana, India",
    icon: "https://ik.imagekit.io/kooxhdceru/portfolio/heroapp.webp",
  },
  {
    title: "Software Engineer Associate",
    description: [
      "Worked with the CTO and CIO to overhaul the web app; improvements lifted user experience scores by 20%.",
      "Optimized app performance and increased user engagement by 15%.",
      "Shipped all deliverables on time and within budget.",
      "Improved cross-team communication and handoffs, raising overall team productivity.",
    ],
    company: "Instahomes PH",
    date: "April 2022 - June 2022",
    location: "Manila, NCR Region, Philippines",
    icon: "https://ik.imagekit.io/kooxhdceru/portfolio/instahomes.webp",
  },
  {
    title: "Web Developer & Product Generalist",
    description: [
      "Built an online portal for Career Expo 2020, facilitating registration for 200+ attendees per session.",
      "Led a small team to revamp the brand's social media presence, increasing engagement and brand awareness by 30%.",
      "Developed event and workshop platform, leading to a 25% increase in attendance.",
    ],
    company: "Guby Rogers",
    date: "September 2020 - February 2022",
    location: "Gurugram, Haryana, India",
    icon: "https://ik.imagekit.io/kooxhdceru/portfolio/guby-rogers.webp",
  },
  {
    title: "Freelance Web Developer",
    description: [
      "Designed and developed responsive websites for small businesses and startups.",
      "Translated client requirements into clean, functional websites.",
      "Implemented SEO best practices to improve client website visibility.",
    ],
    company: "Digital Moshai",
    date: "October 2020 - June 2022",
    location: "New Delhi, India",
    icon: "https://ik.imagekit.io/kooxhdceru/portfolio/digital-moshai.webp",
  },
  {
    title: "Community Lead & Student Ambassador",
    description: [
      "Led a community of 500+ students, organizing workshops and hackathons.",
      "Mentored students in web development and cloud technologies.",
      "Represented Microsoft at campus events and tech conferences.",
    ],
    company: "Microsoft",
    date: "September 2019 - July 2020",
    location: "New Delhi, India",
    icon: "https://ik.imagekit.io/kooxhdceru/portfolio/microsoft.webp",
  },
] as const;

export const projectsData = [
  {
    title: "OpenKVM",
    github: "https://github.com/mukulchugh/OpenKVM",
    demo: "https://github.com/mukulchugh/OpenKVM/releases/latest",
    tags: ["Swift", "macOS", "IOKit", "Bonjour", "Networking"],
    description:
      "An open-source macOS menu bar app that shares one keyboard and mouse between two Macs over the local network. Captures HID input on one Mac and replays it on another via TCP/UDP with Bonjour discovery — a hotkey-driven alternative to Universal Control that works across different Apple IDs.",
  },
  {
    title: "Brik",
    github: "https://github.com/mukulchugh/brik",
    demo: "https://www.npmjs.com/package/@brik/react-native",
    tags: ["React Native", "TypeScript", "SwiftUI", "Jetpack Compose", "Expo"],
    description:
      "A framework to build native iOS and Android widgets, Live Activities, and Dynamic Island from a single React codebase. Compiles JSX/TSX to SwiftUI (WidgetKit) and Jetpack Compose (Glance) — no Swift or Kotlin required.",
  },
  {
    title: "RCA Tool - Grafana Plugin",
    github: "",
    demo: "",
    tags: ["React", "Grafana", "TypeScript", "Golang"],
    description:
      "A Grafana plugin for root cause analysis — flags anomalies and service disruptions, then surfaces the relevant telemetry so engineers can trace and resolve incidents faster.",
  },
  {
    title: "Zendash - Global Admin Dashboard",
    github: "",
    demo: "",
    tags: ["React", "NextJS", "TailwindCSS", "GraphQL", "Apollo"],
    description:
      "A global admin dashboard built at Zenduty, giving Engineering, Customer Success, and Marketing teams a single view into platform health, user activity, and issue resolution.",
  },
  {
    title: "Devcord",
    github: "https://github.com/mukulchugh/devcord",
    demo: "https://mukulchugh.pythonanywhere.com",
    tags: ["Django", "Python", "SQLite", "HTML", "CSS", "Javascript"],
    description:
      "A Django-based community platform for developers to collaborate on projects, discuss topics, and form study groups.",
  },
  {
    title: "ZepEats",
    github: "https://github.com/mukulchugh/ZepEats",
    demo: "https://expo.dev/@mukulchugh/zepeats",
    tags: ["React Native", "Firebase", "Google Cloud", "Stripe"],
    description:
      "A food delivery app built with React Native, Firebase, and Stripe — clean ordering flow, real-time updates, and payment processing end-to-end.",
  },
  {
    title: "Cryptomedia - Cryptocurrency Tracker",
    github: "https://github.com/mukulchugh/CryptoMedia",
    demo: "https://cryptomedia.netlify.app",
    tags: ["React", "ChartJS", "MUI", "Firebase", "CoinGecko API"],
    description:
      "A cryptocurrency tracker in React — pulls live data from CoinGecko, lets users build a personal watchlist backed by Firebase auth and Firestore.",
  },
  {
    title: "Mereko App Concept Design",
    github: "",
    demo: "https://www.figma.com/file/16zU20FINHLiu1k4Irw9bl/Mockup--Design---Mereko?node-id=44%3A56",
    tags: [
      "Figma",
      "UX Research",
      "Usability Study",
      "UI Design",
      "Prototyping",
    ],
    description:
      "A concept app designed during the Google UX Design course — covers UX research, usability testing, and a high-fidelity Figma prototype.",
  },
  {
    title: "Kanboard - Kanban Board",
    github: "https://github.com/mukulchugh/kanboard-notion-kanban-react",
    demo: "https://notion-kanboard-mukul.netlify.app",
    tags: ["React", "React Beautiful DND", "TailwindCSS"],
    description:
      "A Notion-style Kanban board built with React and React Beautiful DND — drag-and-drop cards across columns.",
  },
] as const;

export const skillsData = [
  "JavaScript",
  "TypeScript",
  "Python",
  "React",
  "React Native",
  "Next.js",
  "Node.js",
  "TailwindCSS",
  "GraphQL",
  "Redux",
  "Firebase",
  "Django",
  "Docker",
  "AWS",
  "MongoDB",
  "MySQL",
  "Redis",
  "Git",
  "Fastlane",
  "Kubernetes",
  "Figma",
  "Human-Centric Design",
] as const;

// Social links for intro section (with Tabler icon names)
export const introSocialLinks = [
  {
    name: "LinkedIn",
    href: "https://linkedin.com/in/mukulchugh",
    icon: "IconBrandLinkedin",
  },
  {
    name: "GitHub",
    href: "https://github.com/mukulchugh",
    icon: "IconBrandGithub",
  },
  {
    name: "Twitter",
    href: "https://twitter.com/themukulchugh",
    icon: "IconBrandX",
  },
] as const;

// Social links for footer (with SVG paths)
export const footerSocialLinks = [
  {
    name: "Twitter",
    href: "https://twitter.com/themukulchugh",
    ariaLabel: "Follow on Twitter/X",
    path: "M10.488 14.651L15.25 21h7l-7.858-10.478L20.93 3h-2.65l-5.117 5.886L8.75 3h-7l7.51 10.015L2.32 21h2.65zM16.25 19L5.75 5h2l10.5 14z",
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/in/mukulchugh",
    ariaLabel: "Connect on LinkedIn",
    path: "M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93zM6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37z",
  },
  {
    name: "GitHub",
    href: "https://github.com/mukulchugh",
    ariaLabel: "View GitHub profile",
    path: "M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2",
  },
  {
    name: "Blog",
    href: "https://mukulchugh.com/blog",
    ariaLabel: "Read my blog",
    path: "M19 5v14H5V5zm0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2m-5 14H7v-2h7zm3-4H7v-2h10zm0-4H7V7h10z",
  },
] as const;
