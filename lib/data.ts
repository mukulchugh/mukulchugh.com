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
    // Brand Keywords
    "Mukul",
    "Chugh",
    "Mukul Chugh",
    "Digital Mukul",
    "Digital Moshai",
    "Nerd Engineer",
    "themukulchugh",

    // Role Keywords
    "Product Engineer",
    "Founding Engineer",
    "Software Development Engineer",
    "SDE",
    "Full Stack Developer",
    "Mobile Engineer",
    "Front-end Developer",
    "Back-end Developer",
    "React Native Developer",
    "Mobile App Developer",
    "iOS Developer",
    "Android Developer",
    "Cross-platform Developer",
    "Web Developer",
    "Startup Engineer",
    "Tech Generalist",
    "Product Generalist",
    "Co-Founder Engineer",
    "AI Engineer",
    "Graphic Designer",
    "Content Creator",
    "Tech Lead",
    "Team Lead",
    "Interaction Designer",
    "Creative Technologist",

    // Skills & Technologies - Frontend
    "React Native",
    "React",
    "ReactJS",
    "TypeScript",
    "JavaScript",
    "Next.js",
    "NextJS",
    "TailwindCSS",
    "Tailwind CSS",
    "Styled Components",
    "Material UI",
    "MUI",
    "Framer Motion",
    "GatsbyJS",
    "Gatsby",
    "HTML5",
    "CSS3",
    "Redux",

    // Skills & Technologies - Backend
    "Node.js",
    "Python",
    "Django",
    "GraphQL",
    "REST API",
    "Apollo GraphQL",
    "Apollo Client",

    // Skills & Technologies - Database
    "Firebase",
    "MongoDB",
    "MySQL",
    "PostgreSQL",
    "Redis",
    "SQL",

    // Skills & Technologies - DevOps & Cloud
    "AWS",
    "Docker",
    "Kubernetes",
    "Cloud Computing",
    "Grafana",
    "Prometheus",
    "ElasticSearch",
    "Celery",

    // Skills & Technologies - Tools
    "Git",
    "GitHub",
    "Figma",
    "VS Code",
    "Vite",
    "Netlify",
    "Vercel",

    // Skills & Technologies - Other
    "Golang",
    "Blockchain",
    "Ethereum",
    "WordPress",
    "Headless CMS",
    "JAMstack",
    "MapBox API",
    "Chart.js",
    "ChartJS",
    "CoinGecko API",

    // Domain Keywords - Design
    "Digital Experiences",
    "Human-Centric Design",
    "Product Design",
    "UI Design",
    "UX Design",
    "UI UX Designer",
    "UX Research",
    "Prototyping",
    "Mobile-First Design",
    "Responsive Design",
    "Web Design",
    "Animation",
    "Interaction Design",

    // Domain Keywords - Development
    "Mobile App Development",
    "Software Engineering",
    "Mobile Engineering",
    "End-to-End Development",
    "Full Stack Development",
    "Custom Software Development",
    "React Component Library",
    "React Performance",
    "JavaScript Debugging",
    "Error Handling",
    "Font Optimization",
    "Building for Scale",
    "Scalability",

    // Domain Keywords - Other
    "Digital Marketing",
    "Coding",
    "Tech",
    "Programming",
    "Computer Science",
    "AI-powered Products",
    "OTA Updates",
    "Incident Monitoring",
    "SDK Development",
    "Developer Relations",
    "Agile Development",
    "Growth Hacking",
    "Freelancing",
    "Developer Roadmap",

    // Company Keywords
    "Quivly.ai",
    "Swiggy Engineer",
    "Swiggy",
    "Zenduty",
    "Microsoft Student Ambassador",
    "Microsoft",
    "HeroApp",

    // Location Keywords
    "San Francisco Engineer",
    "Bay Area Developer",
    "India Developer",
    "Bengaluru Engineer",
    "Indian Developer",
    "Developer India",

    // Certification Keywords
    "Google UX Design",
    "Google UX Design Certificate",
    "Web Development Bootcamp",
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
    "I'm a T-shaped engineer with deep expertise in mobile and full-stack development, combined with a strong foundation in product thinking and human-centric design. Engineering is my backbone, but I thrive at the intersection of technology and product.",
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
  ctaText: "Let's Talk",
  resumeButtonText: "View Resume",
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
  {
    title: "Freelance Web Developer",
    description: [
      "Designed and developed responsive websites for small businesses and startups.",
      "Collaborated with clients to understand requirements and deliver tailored solutions.",
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
    title: "RCA Tool - Grafana Plugin",
    github: "",
    demo: "",
    tags: ["React", "Grafana", "TypeScript", "Golang"],
    description:
      "Developed a Grafana plugin for Root Cause Analysis, designed to identify anomalies and service disruptions. This tool aids engineers in swiftly tracing and resolving issues, leveraging insightful data for expedited problem-solving.",
  },
  {
    title: "Zendash - Global Admin Dashboard",
    github: "",
    demo: "",
    tags: ["React", "NextJS", "TailwindCSS", "GraphQL", "Apollo"],
    description:
      "Built a Global Admin Dashboard during my internship at Zenduty. This tool assists the Engineering, Customer Success and Marketing Team by providing easy access to insights via their dashboard. Additionally, it aids in the identification and efficient resolution of user issues on the platform.",
  },
  {
    title: "Devcord",
    github: "https://github.com/mukulchugh/devcord",
    demo: "https://mukulchugh.pythonanywhere.com",
    tags: ["Django", "Python", "SQLite", "HTML", "CSS", "Javascript"],
    description:
      "A full stack django application for developers to build community and collaborate together on projects or discuss on various topics and make study groups.",
  },
  {
    title: "ZepEats",
    github: "https://github.com/mukulchugh/ZepEats",
    demo: "https://expo.dev/@mukulchugh/zepeats",
    tags: ["React Native", "Firebase", "Google Cloud", "Stripe"],
    description:
      "Inspired by Uber Eats, built a food delivery application keeping in mind simplicity, to order food and have a clean experience. Built with React Native, Firebase, Google Cloud, Firestore, Stripe, etc",
  },
  {
    title: "Cryptomedia - Cryptocurrency Tracker",
    github: "https://github.com/mukulchugh/CryptoMedia",
    demo: "https://cryptomedia.netlify.app",
    tags: ["React", "ChartJS", "MUI", "Firebase", "CoinGecko API"],
    description:
      "A React-based CryptoCurrencies tracker, with ranking and coin information, uses a CoinGecko API to fetch data, designed using Material UI. Used Firebase to provide authentication functionality and a database for maintaining the Watchlist for users.",
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
      "Designed a concept app as part of my Google UX Design course.",
  },
  {
    title: "Kanboard - Kanban Board",
    github: "https://github.com/mukulchugh/kanboard-notion-kanban-react",
    demo: "https://notion-kanboard-mukul.netlify.app",
    tags: ["React", "React Beautiful DND", "TailwindCSS"],
    description:
      "A Notion like a Kanban board using ReactJS, and React Beautiful DND.",
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
