import { Img } from "@react-email/components";
import React from "react";

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
    title: "Software Engineer",
    description: [
      "Collaborated with a team to build internal tools for incident monitoring and diagnosis, resulting in improved response times and decreased downtime.",
      "Developed frontend for data analysis using Prometheus, ElasticSearch, and GraphQL with ChartJS and NextJS.",
      "Built landing pages for company products and tools, resulting in increased engagement and visibility.",
      "Contributed to the development of flagship platform Zenduty with improved features and user experience.",
    ],
    company: "Zenduty",
    date: "2021-Present",
    location: "Bengaluru, India",
    icon: React.createElement(Img, {
      src: "https://ik.imagekit.io/kooxhdceru/portfolio/zenduty.webp",
      alt: "Zenduty",
    }),
  },
  {
    title: "Co-Founder & Engineer",
    description: [
      "Designed and built frontend of mobile application using React Native.",
      "As part of founding team, managed technology initiatives, product design, and development.",
      "Led development team to deliver high-quality products on time and within budget.",
      "Utilized agile methodologies to manage and prioritize tasks efficiently.",
    ],
    company: "HeroApp",
    date: "January 2022 - June 2022",
    location: "Gururgram, India",
    icon: React.createElement(Img, {
      src: "https://ik.imagekit.io/kooxhdceru/portfolio/heroapp.webp",
      alt: "HeroApp",
    }),
  },
  {
    title: "Software Engineer Intern",
    description: [
      "Collaborated with CTO and CIO to improve frontend of the web application.",
      "Worked with UI designer to implement design changes and improve app performance.",
      "Developed innovative solutions to complex front-end challenges.",
      "Delivered high-quality work on time and within budget.",
      "Demonstrated strong communication and collaboration skills with cross-functional teams.",
    ],
    company: "Instahomes PH",
    date: "April 2022 - June 2022",
    location: "Manila, Philippines",
    icon: React.createElement(Img, {
      src: "https://ik.imagekit.io/kooxhdceru/portfolio/instahomes.webp",
      alt: "Instahomes PH",
    }),
  },
  {
    title: "Web Developer",
    description: [
      "Built registration portal with ReactJS, WordPress, and Razorpay API, facilitating registration for 200+ attendees at Career Expo 2020.",
      "Led a team of designers to revamp the brand's social media presence, increasing engagement and brand awareness.",
      "Built landing pages for events and workshops, resulting in increased attendance and engagement.",
      "Developed product strategy to guide development efforts, improving products and customer satisfaction.",
      "Demonstrated strong project management skills to deliver high-quality work on time and within budget.",
    ],
    company: "Guby Rogers",
    date: "September 2020 - Febuary 2021",
    location: "Gurugram, India (Remote)",
    icon: React.createElement(Img, {
      src: "https://ik.imagekit.io/kooxhdceru/portfolio/guby-rogers.webp",
      alt: "Guby Rogers",
    }),
  },
  {
    title: "Freelance Web Developer",
    description: [
      "Built customized web solutions for small businesses and individuals, resulting in improved online presence and increased brand recognition.",
      "Designed branding collateral, including website and social media graphics, to establish cohesive brand image.",
      "Developed and maintained websites for clients on a contract basis, ensuring optimal performance and user experience.",
      "Demonstrated strong communication and project management skills to deliver high-quality work on time and within budget.",
      "Leveraged technical expertise to provide innovative solutions to complex challenges.",
      "Built strong relationships with clients, resulting in repeat business and positive referrals.",
    ],
    date: "October 2020 - June 2022",
    location: "India",
    icon: React.createElement(Img, {
      src: "https://ik.imagekit.io/kooxhdceru/portfolio/digital-moshai.webp",
      alt: "Digital Moshai",
    }),
    company: "Digital Moshai",
  },
  {
    title: "Community Lead & Student Ambassador",
    description: [
      "Proactively took on the responsibility of leading community initiatives for Microsoft at my Campus.",
      "Successfully raised awareness about Microsoft's technology and services by organizing a range of events and activities.",
      "Leveraged my leadership skills to build and nurture a community of learners with a shared passion for technology.",
      "Organized study groups, technical events, competitions, and workshops to help learners enhance their skills and stay up-to-date with the latest advancements in the tech industry.",
      "Fostered a supportive learning environment that encouraged collaboration, innovation, and personal growth.",
      "Collaborated with Microsoft teams to align community initiatives with company goals and objectives, driving success and mutual benefit for both the community and Microsoft.",
    ],
    company: "Microsoft",
    date: "September 2019 - July 2020",
    location: "Gurugram, India",
    icon: React.createElement(Img, {
      src: "https://ik.imagekit.io/kooxhdceru/portfolio/microsoft.webp",
      alt: "Microsoft",
    }),
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
    tags: ["React", "NextJS", "TailwindCSS", "GraphQL", "Apollo"],
    description:
      "Inspired by Uber Eats, built a food delivery application keeping in mind simplicity, to order food and have a clean experience. Built with React Native, Firebase, Google Cloud, Firestore, Stripe, etc",
  },
  {
    title: "Cryptomedia - Cryptocurrency Tracker",
    github: "https://github.com/mukulchugh/CryptoMedia",
    tags: "https://cryptomedia.netlify.app",
    skills: [
      "React",
      "ChartJS",
      "HTML",
      "CSS",
      "Javascript",
      "MUI",
      "Firebase",
    ],
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
    tags: ["React", "NextJS", "TailwindCSS", "GraphQL", "Apollo"],
    description:
      "A Notion like a Kanban board using ReactJS, and React Beautiful DND.",
  },
] as const;

export const skillsData = [
  "HTML",
  "CSS",
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Git",
  "Tailwind",
  "MongoDB",
  "GraphQL",
  "Express",
  "Python",
  "Django",
  "Framer Motion",
] as const;
