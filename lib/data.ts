// ============================================
// SITE CONFIGURATION - All content in one place
// ============================================

export const siteConfig = {
  // Personal Info
  name: "Mukul Chugh",
  firstName: "Mukul",
  lastName: "Chugh",
  title: "Software Engineer",
  location: "India",

  // SEO & Meta
  siteUrl: "https://mukulchugh.com",
  siteTitle: "Mukul Chugh - Creating Digital Experiences for Humans",
  siteDescription:
    "Engineer, Designer & Product Generalist, passionate about building products that solve real world problems. Freelancing, Open Source, and writing about tech.",

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
    "Hey there, I'm Mukul Chugh, a software engineer based in India.",
    "I'm all about creating digital experiences that put humans first. Whether it's a slick UI or a cutting-edge app, I'm always on the lookout for ways to make technology more accessible and intuitive.",
    "My goal is always to create digital experiences that feel intuitive, human-centric, and just plain awesome. I've been working professionally for a few years now, and I've had the chance to work on a wide range of projects. Some of my favorite work has been in the realm of Frontend Development - there's something incredibly satisfying about creating a seamless, user-friendly interface that just clicks.",
    "Would you like to work together or just chat? Feel free to reach out to me.",
  ],
} as const;

// Intro/Hero Section Content
export const introContent = {
  greeting: "Hi, I'm Mukul Chugh",
  role: "software engineer",
  specialty: "Web and Mobile Development",
  passion: "transforming ideas into impactful products",
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
    name: "Skills",
    hash: "#skills",
  },
  {
    name: "Blog",
    hash: "https://blog.mukulchugh.com/",
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
      "Building AI-powered products and features for the Quivly.ai platform.",
      "Developing full-stack applications using modern web technologies and AI/ML integrations.",
      "Contributing to product strategy and technical architecture as an early team member.",
    ],
    company: "Quivly.ai",
    date: "November 2025 - Present",
    location: "Remote",
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
      "Enhanced incident monitoring tools, reducing response times by 25% and minimizing downtime by 20%.",
      "Worked on the REST API Service, built internal automation tools and SDKs.",
      "Developed a data analysis app using Prometheus, ElasticSearch, GraphQL, ChartJS, and NextJS.",
      "Created product landing pages, boosting engagement by 15%.",
      "Contributed to Zenduty's flagship platform, improving user experience and adding new features.",
      "Shipped multiple releases to Google Play and App Store; build/signing and staged rollouts.",
      "Re-architected the React Native mobile app, enhancing performance, developing new features, and creating an in-house UI library to support a complete redesign from the ground up.",
      "Led marketing initiatives, including setting up a Customer Data Platform (CDP) and User Analytics, and managing secondary web platforms such as Product Docs, Blog, and Landing Pages.",
      "Contributed to developer relations efforts by representing Zenduty at events like KubeCon India and Grayscale AI Week, giving talks and engaging with the developer community.",
    ],
    company: "Zenduty",
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
] as const;
