export { links, siteConfig } from "./site-config";

// About Section Content
export const aboutContent = {
  heading: "The longer story.",
  paragraphs: [
    "Creating digital experiences for humans has been the thread through my work for years. Early on, that meant websites and visual design for freelance clients. I also co-founded HeroApp, working across product design and development. Engineering became my foundation, but I was interested in what people experienced as much as how it was built.",
    "At Zenduty, I grew from an intern into an engineering role, contributing across the mobile app, web experiences, and internal products. At Swiggy, I worked on Pyng’s seller onboarding, self-service tools, and mobile updates. Today, I’m a founding engineer at Quivly, working with the team on AI-powered products for post-sales teams. Each chapter has brought a different part of the product into view.",
    "AI gives me more room to take an idea further. I build with agents, and I build the tools around them: deciding how work is divided, how results are checked, and when a person needs to step in. Away from the day job, projects like OpenKVM and ctxr let me follow practical questions of my own, from making two Macs share a keyboard to making a video useful to an agent. I want a hand in the first question, the product decisions, and the details that make the result worth using.",
  ],
} as const;

// Intro/Hero Section Content
export const introContent = {
  ctaText: "Let's Talk",
  emoji: "👋",
  greeting: "Hi, I'm Mukul Chugh",
  passion: "shipping useful software with small, fast teams",
  role: "product engineer",
  specialty: "Mobile & Full-Stack Development",
  tagline: "I build products end to end: mobile, web, and everything between.",
} as const;

// Contact Section Content
export const contactContent = {
  description:
    "Bring the idea you keep coming back to. Let’s see where a conversation takes it.",
  heading: "What should we make next?",
  paragraphs: [
    "Get in touch about product engineering, mobile or web applications, and practical AI tools. This portfolio brings together my work across engineering, product and design. If a project or article connects with something you are building, include its name or link so we can start with the same context.",
    "A useful first message describes the problem, who it affects and what you would like to explore together. You do not need a finished brief. Email is a good place to share that context; the calendar offers a short introductory conversation. Please keep confidential information out of an initial message. You can read the privacy page for details about messages, booking and the services used on this site.",
  ],
} as const;

export const zendutyChapter = {
  acquisitionPeriod: "Jan–May 2025 · Four-month acquisition chapter",
  acquisitionStory:
    "Internal acquisition discussions began in January; the announcement followed in February. I stayed with Zenduty through May, then joined Swiggy.",
  company: "Zenduty",
  currentBrand: "IMR by Xurrent",
  date: "Jun 2022–May 2025",
  progression: "Intern → Software Engineer",
  team: "Founding team",
} as const;

export const experiencesData = [
  {
    company: "Quivly.ai",
    date: "November 2025 - Present",
    description: [
      "First engineering hire; building the Quivly platform end-to-end from day one.",
      "Work directly with the CTO on architecture decisions, product direction, and full-stack implementation.",
      "Develop across the full stack: frontend, backend, and AI/ML integrations.",
      "Shape product design and engineering culture as a core founding team member.",
    ],
    icon: "/design/brand/quivly-icon.ico",
    location: "San Francisco, CA (Hybrid)",
    title: "Founding Engineer",
  },
  {
    company: "Swiggy",
    date: "May 2025 - November 2025",
    description: [
      "Implemented an over-the-air (OTA) updates pipeline for the React Native app to ship fixes and features without full app-store releases; enabled staged rollouts, instant rollback, and version management.",
      "Designed and shipped the end-to-end seller onboarding flow for Pyng by Swiggy (AI-based expert services platform), covering identity/KYC capture, verification, and guided setup.",
      "Built an AI-based QC & moderation engine to automate compliance and quality checks across forms, media, and profile signals, reducing manual review effort and accelerating approvals.",
      "Delivered self-serve capabilities for sellers (catalog/profile management, pricing & availability, slot scheduling, and policy workflows) to improve activation and retention.",
      "Developed internal tools for product and category managers to monitor funnels, SLAs, and quality metrics.",
      "Profiled with Flipper, Metro, and platform-native tools; cut bundle size and resolved memory bottlenecks.",
    ],
    icon: "/design/brand/swiggy.webp",
    location: "Bengaluru, Karnataka, India",
    title: "Software Development Engineer",
  },
  {
    company: zendutyChapter.company,
    date: "June 2022 - May 2025",
    description: [
      "Part of the core team that scaled the platform until acquisition, contributing across mobile, web, and internal tooling.",
      "Re-architected the React Native mobile app from ground up, building an in-house UI library and shipping multiple releases to Google Play and App Store.",
      "Enhanced incident monitoring tools, reducing response times by 25% and minimizing downtime by 20%.",
      "Built REST API services, internal automation tools, and SDKs.",
      "Developed a data analysis app using Prometheus, ElasticSearch, GraphQL, ChartJS, and NextJS.",
      "Set up Customer Data Platform (CDP) and user analytics; owned product docs, blog, and landing pages.",
      "Represented Zenduty at KubeCon India and Grayscale AI Week, contributing to developer relations and community engagement.",
    ],
    icon: "/design/brand/zenduty.webp",
    location: "Bengaluru, Karnataka, India",
    title: `${zendutyChapter.team} · ${zendutyChapter.progression}`,
  },
  {
    company: "HeroApp",
    date: "December 2021 - June 2022",
    description: [
      "Designed and developed a React Native-based mobile app.",
      "Owned product design, technology decisions, and development end-to-end as a co-founder.",
      "Ran agile sprints and led development from spec to ship, improving team delivery speed by 30%.",
    ],
    icon: "/design/brand/heroapp.webp",
    location: "Gurugram, Haryana, India",
    title: "Co-founder & CTO",
  },
  {
    company: "Instahomes PH",
    date: "April 2022 - June 2022",
    description: [
      "Worked with the CTO and CIO to overhaul the web app; improvements lifted user experience scores by 20%.",
      "Optimized app performance and increased user engagement by 15%.",
      "Shipped all deliverables on time and within budget.",
      "Improved cross-team communication and handoffs, raising overall team productivity.",
    ],
    icon: "/design/brand/instahomes.webp",
    location: "Manila, NCR Region, Philippines",
    title: "Software Engineer Associate",
  },
  {
    company: "Guby Rogers",
    date: "September 2020 - February 2022",
    description: [
      "Built an online portal for Career Expo 2020, facilitating registration for 200+ attendees per session.",
      "Led a small team to revamp the brand's social media presence, increasing engagement and brand awareness by 30%.",
      "Developed event and workshop platform, leading to a 25% increase in attendance.",
    ],
    icon: "/design/brand/guby-rogers.webp",
    location: "Gurugram, Haryana, India",
    title: "Web Developer & Product Generalist",
  },
  {
    company: "Digital Moshai",
    date: "October 2020 - June 2022",
    description: [
      "Designed and developed responsive websites for small businesses and startups.",
      "Translated client requirements into clean, functional websites.",
      "Implemented SEO best practices to improve client website visibility.",
    ],
    icon: "/design/brand/digital-moshai.webp",
    location: "New Delhi, India",
    title: "Freelance Web Developer",
  },
  {
    company: "Microsoft",
    date: "September 2019 - July 2020",
    description: [
      "Led a community of 500+ students, organizing workshops and hackathons.",
      "Mentored students in web development and cloud technologies.",
      "Represented Microsoft at campus events and tech conferences.",
    ],
    icon: "/design/brand/microsoft.webp",
    location: "New Delhi, India",
    title: "Community Lead & Student Ambassador",
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
    href: "https://linkedin.com/in/mukulchugh",
    icon: "IconBrandLinkedin",
    name: "LinkedIn",
  },
  {
    href: "https://github.com/mukulchugh",
    icon: "IconBrandGithub",
    name: "GitHub",
  },
  {
    href: "https://twitter.com/themukulchugh",
    icon: "IconBrandX",
    name: "Twitter",
  },
] as const;

// Social links for footer (with SVG paths)
export const footerSocialLinks = [
  {
    ariaLabel: "Follow on Twitter/X",
    href: "https://twitter.com/themukulchugh",
    name: "Twitter",
    path: "M10.488 14.651L15.25 21h7l-7.858-10.478L20.93 3h-2.65l-5.117 5.886L8.75 3h-7l7.51 10.015L2.32 21h2.65zM16.25 19L5.75 5h2l10.5 14z",
  },
  {
    ariaLabel: "Connect on LinkedIn",
    href: "https://linkedin.com/in/mukulchugh",
    name: "LinkedIn",
    path: "M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93zM6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37z",
  },
  {
    ariaLabel: "View GitHub profile",
    href: "https://github.com/mukulchugh",
    name: "GitHub",
    path: "M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2",
  },
  {
    ariaLabel: "Read my writing",
    href: "https://mukulchugh.com/blog",
    name: "Blog",
    path: "M19 5v14H5V5zm0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2m-5 14H7v-2h7zm3-4H7v-2h10zm0-4H7V7h10z",
  },
] as const;
