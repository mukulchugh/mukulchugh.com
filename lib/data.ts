// ============================================
// SITE CONFIGURATION - All content in one place
// ============================================

export const siteConfig = {
  // Personal Info
  name: "Mukul Chugh",
  firstName: "Mukul",
  lastName: "Chugh",
  title: "Product Engineer",
  tagline: "Creating Digital Experiences for Humans",
  location: "San Francisco, CA",
  locationFull: "San Francisco, California, USA",

  // SEO & Meta
  siteUrl: "https://mukulchugh.com",
  siteTitle:
    "Mukul Chugh | Product Engineer - Creating Digital Experiences for Humans",
  siteDescription:
    "Founding Engineer at Quivly.ai, building AI-powered products. T-shaped product engineer specializing in mobile and full-stack development. Previously at Swiggy and Zenduty (acquired). Passionate about human-centric design and creating intuitive digital experiences.",

  // Keywords for SEO (used in JSON-LD)
  keywords: [
    "Software Engineer",
    "Mobile Engineer",
    "React Native Developer",
    "Product Engineer",
    "TypeScript",
    "Next.js",
    "JavaScript",
    "Mobile App Development",
    "Human-Centric Design",
    "Full Stack Developer",
    "Swiggy Engineer",
  ],

  // Social Links
  social: {
    github: "https://github.com/mukulchugh",
    linkedin: "https://linkedin.com/in/mukulchugh",
    twitter: "https://twitter.com/themukulchugh",
    blog: "https://blog.mukulchugh.com/",
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
    "Hey there, I'm Mukul — a product engineer.",
    "I'm a T-shaped engineer with deep expertise in mobile and full-stack development, combined with a strong foundation in product thinking and human-centric design. Engineering is my backbone, but I thrive at the intersection of technology and user experience.",
    "Currently a Founding Engineer at Quivly.ai, where I work directly with the CTO on building AI-powered products from the ground up. Before this, I was at Swiggy building mobile products used by millions, and at Zenduty where I helped scale the platform until its acquisition.",
    "I've worn many hats: founding engineer, co-founder, and product generalist. What drives me is creating digital experiences that feel intuitive and genuinely serve the humans using them.",
    "Would you like to work together or just chat? Feel free to reach out.",
  ],
} as const;

// Intro/Hero Section Content
export const introContent = {
  greeting: "Hi, I'm Mukul Chugh",
  tagline: "Creating Digital Experiences for Humans",
  role: "product engineer",
  specialty: "Mobile & Full-Stack Development",
  passion: "building human-centric digital products",
  ctaText: "Contact me here",
  downloadCvText: "Download CV",
  emoji: "👋",
} as const;

// Contact Section Content
export const contactContent = {
  heading: "Contact me",
  description:
    "Feel free to reach out to me directly via email or connect with me on social media.",
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
      "Building AI-powered products and features for the Quivly platform as the first engineer.",
      "Working directly with the CTO on product strategy, technical architecture, and full-stack development.",
      "Developing across the entire stack using modern web technologies and AI/ML integrations.",
      "Contributing to product design and engineering decisions as a core founding team member.",
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
      "Profiling with Flipper, Metro, and Android/iOS tools; resolved performance issues; optimized bundle size and memory.",
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
      "Worked on the REST API Service, built internal automation tools and SDKs.",
      "Developed a data analysis app using Prometheus, ElasticSearch, GraphQL, ChartJS, and NextJS.",
      "Led marketing initiatives, setting up Customer Data Platform (CDP) and User Analytics, managing Product Docs, Blog, and Landing Pages.",
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
      "Managed technology initiatives, product design, and development as a founding team member.",
      "Led development efforts, ensuring timely delivery of high-quality products within budget constraints, and implemented agile methodologies resulting in a 30% efficiency gain.",
    ],
    company: "HeroApp",
    date: "December 2021 - June 2022",
    location: "Gurugram, Haryana, India",
    icon: "https://ik.imagekit.io/kooxhdceru/portfolio/heroapp.webp",
  },
  {
    title: "Software Engineer Associate",
    description: [
      "Collaborated with the CTO and CIO to enhance the web app, resulting in a 20% improvement in user experience.",
      "Optimized app performance and increased user engagement by 15%.",
      "Delivered high-quality work within project timelines and budget constraints.",
      "Fostered effective cross-functional team communication and collaboration, boosting productivity.",
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
] as const;

export const projectsData = [
  {
    title: "RCA Tool - Grafana Plugin",
    github: "",
    demo: "",
    tags: ["React", "Grafana", "TypeScript", "Golang"],
    description:
      "Developed a Grafana plugin for Root Cause Analysis, enabling rapid detection of anomalies and service failures. This tool significantly accelerated issue resolution, reducing the average resolution time by 30% through data-driven insights.",
  },
  {
    title: "HostVille - Full Stack Booking Platform",
    github: "https://github.com/mukulchugh",
    demo: "",
    tags: ["GraphQL", "JavaScript", "NextJS", "ExpressJS", "MapBox"],
    description:
      "A travel booking app connecting travelers with experiences worldwide, with a user-friendly interface and location-based search via MapBox API. Also built an admin dashboard for global administration utilizing a GraphQL API and React Frontend.",
  },
  {
    title: "ZenDash - Internal Tool",
    github: "",
    demo: "",
    tags: ["JavaScript", "ReactJS", "Django", "GraphQL"],
    description:
      "A comprehensive global admin dashboard during my time at Zenduty. Built an efficient and user-friendly platform for managing administrative tasks and data analysis.",
  },
  {
    title: "Zepeats - Food Delivery App",
    github: "https://github.com/mukulchugh/ZepEats",
    demo: "https://expo.dev/@mukulchugh/zepeats",
    tags: ["React Native", "Firebase", "Google Cloud", "Stripe"],
    description:
      "A food delivery application which provides a seamless and efficient ordering experience for users. Built with React Native, Firebase, Google Cloud, and Stripe integration.",
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
