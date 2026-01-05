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

    // Company Keywords - Quivly
    "Quivly",
    "Quivly.ai",
    "Quivly Engineer",
    "Quivly Founding Engineer",
    "Quivly AI",
    "Quivly Product Engineer",

    // Company Keywords - Swiggy (from website research)
    "Swiggy",
    "Swiggy Engineer",
    "Swiggy Developer",
    "Swiggy SDE",
    "Swiggy Software Engineer",
    "Swiggy Mobile Engineer",
    "Swiggy React Native",
    "Swiggy App Developer",
    "Swiggy India",
    "Swiggy Bengaluru",
    "Food Delivery",
    "Food Delivery App",
    "Online Food Ordering",
    "Hyperlocal Delivery",
    // Swiggy Instamart
    "Swiggy Instamart",
    "Instamart",
    "Instamart Engineer",
    "Quick Commerce",
    "Q-commerce",
    "Grocery Delivery",
    "10-minute Delivery",
    "Dark Store",
    "Instant Delivery",
    // Swiggy Pyng
    "Pyng",
    "Pyng by Swiggy",
    "Pyng Engineer",
    "Pyng Developer",
    "AI Expert Services",
    "Professional Services Platform",
    "LLM Integration",
    "AI-powered Platform",
    // Swiggy Crew
    "Swiggy Crew",
    "Crew App",
    "Concierge App",
    "Travel Planning App",
    "Lifestyle App",
    // Swiggy Tech Stack
    "Swiggy One",
    "Route Optimization",
    "Logistics Optimization",
    "Demand Forecasting",
    "Real-time Tracking",

    // Company Keywords - Zenduty & xurrent (from website research)
    "Zenduty",
    "Zenduty Engineer",
    "Zenduty Developer",
    "Zenduty SDE",
    "Zenduty Software Engineer",
    "Zenduty Acquired",
    "Zenduty xurrent",
    // xurrent
    "xurrent",
    "xurrent Zenduty",
    "xurrent Engineer",
    "xurrent Developer",
    "xurrent Software Engineer",
    "xurrent Acquisition",
    // xurrent/Zenduty Product Keywords
    "Incident Management Platform",
    "Incident Management Software",
    "Incident Response",
    "On-call Management",
    "On-call Scheduling",
    "Alert Management",
    "Alert Routing",
    "Alert Correlation",
    "DevOps Alerting",
    "IT Service Management",
    "ITSM",
    "IT Operations Management",
    "ITOM",
    "Enterprise Service Management",
    "ESM",
    "AI Service Desk",
    "Workflow Automation",
    "Knowledge Management",
    "ChatOps",
    "MTTR",
    "Mean Time To Resolution",
    "MTTA",
    "Root Cause Analysis",
    "RCA",
    "Postmortem",
    "Escalation Policies",
    "SLA Monitoring",
    "Status Pages",
    "Slack Integration",
    "Microsoft Teams Integration",
    "Jira Integration",
    "Datadog Integration",
    "PagerDuty Alternative",
    "SOC 2",
    "ISO 27001",

    // Company Keywords - Microsoft (from website research)
    "Microsoft",
    "Microsoft Student Ambassador",
    "Microsoft Learn Student Ambassador",
    "MLSA",
    "Microsoft India",
    "Azure",
    "Azure Credits",
    "Visual Studio",
    "Microsoft MVP",
    "Cloud Advocates",
    "Tech Community",
    "Community Leader",
    "Workshop Organizer",
    "Tech Evangelist",
    "Microsoft Learn",

    // Company Keywords - HeroApp
    "HeroApp",
    "HeroApp Co-Founder",
    "HeroApp Engineer",

    // Company Keywords - Instahomes
    "Instahomes",
    "Instahomes PH",
    "Instahomes Philippines",
    "Instahomes Engineer",

    // Company Keywords - Guby Rogers
    "Guby Rogers",
    "Guby Rogers Developer",

    // Company Keywords - Digital Moshai
    "Digital Moshai Developer",
    "Digital Moshai Freelance",

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

    // ============================================
    // DEEP RESEARCH KEYWORDS (2025)
    // ============================================

    // Developer Tools & Platforms
    "Vercel",
    "Netlify",
    "GitHub",
    "GitHub Actions",
    "GitHub Copilot",
    "GitHub Pages",
    "Supabase",
    "Prisma",
    "Prisma ORM",
    "Vite",
    "Storybook",
    "Figma Dev Mode",
    "Design System",
    "Component Library",
    "UI Component Library",

    // AI & Coding Assistants
    "AI Coding Assistant",
    "GitHub Copilot",
    "Claude Code",
    "LLM",
    "Large Language Model",
    "AI Pair Programming",
    "Agentic AI",
    "AI Automation",
    "Generative AI",
    "OpenAI",
    "Claude",
    "GPT",

    // Career & Leadership Keywords
    "Staff Engineer",
    "Staff Plus Engineer",
    "Principal Engineer",
    "Distinguished Engineer",
    "Tech Lead",
    "Engineering Manager",
    "CTO",
    "Chief Technology Officer",
    "VP Engineering",
    "Technical Leadership",
    "Engineering Leadership",
    "Force Multiplier",
    "Technical Strategy",
    "Architecture Decision",
    "Career Growth",
    "Senior Engineer",
    "Lead Developer",

    // System Design & Architecture
    "System Design",
    "Software Architecture",
    "Microservices",
    "Microservices Architecture",
    "Event-Driven Architecture",
    "Service Mesh",
    "API Gateway",
    "Distributed Systems",
    "High Availability",
    "Fault Tolerance",
    "Load Balancing",
    "Caching Strategy",
    "Database Optimization",
    "Horizontal Scaling",
    "Vertical Scaling",
    "Cloud Architecture",
    "Serverless Architecture",
    "Cloud-Native",
    "Kubernetes",
    "Docker",
    "Container Orchestration",

    // DevOps & CI/CD
    "DevOps",
    "CI/CD",
    "Continuous Integration",
    "Continuous Deployment",
    "Continuous Delivery",
    "Pipeline Automation",
    "GitOps",
    "Infrastructure as Code",
    "IaC",
    "Terraform",
    "ArgoCD",
    "Jenkins",
    "CircleCI",
    "DevSecOps",
    "Shift-Left Security",
    "Blue-Green Deployment",
    "Canary Release",
    "Feature Flags",
    "Zero Downtime Deployment",
    "Rollback Strategy",

    // API Design
    "API Design",
    "REST API",
    "RESTful API",
    "GraphQL",
    "gRPC",
    "API Gateway",
    "API Documentation",
    "OpenAPI",
    "Swagger",
    "API Security",
    "OAuth 2.0",
    "JWT",
    "API Rate Limiting",

    // Frontend & Performance
    "React Performance",
    "React Optimization",
    "React Native Performance",
    "Hermes Engine",
    "JSI",
    "Fabric",
    "TurboModules",
    "New Architecture",
    "Lazy Loading",
    "Code Splitting",
    "Bundle Optimization",
    "Web Vitals",
    "Core Web Vitals",
    "LCP",
    "FID",
    "CLS",
    "Performance Optimization",
    "FlatList Optimization",
    "Memoization",
    "useCallback",
    "useMemo",
    "Virtual DOM",

    // Startup & Product
    "Startup Engineer",
    "MVP Development",
    "Minimum Viable Product",
    "SaaS Development",
    "SaaS Product",
    "Product-Market Fit",
    "Rapid Prototyping",
    "Lean Startup",
    "Agile Development",
    "Scrum",
    "Sprint Planning",
    "Product Roadmap",
    "Technical Debt",
    "Code Review",
    "Pair Programming",

    // T-Shaped & Product Engineer
    "T-Shaped Engineer",
    "T-Shaped Developer",
    "Product Engineer",
    "Product-Minded Engineer",
    "Full Stack Product Engineer",
    "End-to-End Engineer",
    "Generalist Engineer",
    "Cross-Functional",
    "Product Thinking",
    "User Empathy",
    "Business Acumen",

    // Portfolio & Personal Brand
    "Developer Portfolio",
    "Engineer Portfolio",
    "Personal Brand",
    "Tech Portfolio",
    "Portfolio Website",
    "Personal Website",
    "Developer Blog",
    "Tech Blog",
    "Technical Writing",
    "Content Creator",
    "Tech Influencer",

    // Modern Tech Stack (2025)
    "Next.js 14",
    "Next.js 15",
    "React 19",
    "TypeScript 5",
    "Tailwind CSS",
    "Shadcn UI",
    "Radix UI",
    "Framer Motion",
    "Zustand",
    "React Query",
    "TanStack Query",
    "tRPC",
    "Drizzle ORM",
    "Turso",
    "PlanetScale",
    "Neon",
    "Upstash",
    "Resend",
    "Clerk",
    "Auth.js",
    "NextAuth",

    // Observability & Monitoring
    "Observability",
    "Monitoring",
    "Logging",
    "Tracing",
    "APM",
    "Application Performance Monitoring",
    "Sentry",
    "Datadog",
    "New Relic",
    "LogRocket",
    "Grafana",
    "Prometheus",
    "OpenTelemetry",

    // Security
    "Application Security",
    "OWASP",
    "Zero Trust",
    "Authentication",
    "Authorization",
    "RBAC",
    "Security Best Practices",
    "Penetration Testing",
    "Vulnerability Assessment",
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
