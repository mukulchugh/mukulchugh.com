// ============================================
// CENTRALIZED TYPE DEFINITIONS
// ============================================

import type { links } from "../data";

// Navigation & Section Types
export type SectionName = (typeof links)[number]["name"];

// Blog / Hashnode Types
export interface PostHeading {
  id: string;
  level: 2 | 3;
  text: string;
}

export interface Post {
  author?: {
    name: string;
    profilePicture: string;
  };
  brief: string;
  content?: {
    markdown: string;
  };
  coverImage: {
    url: string;
  } | null;
  headings?: PostHeading[];
  id: string;
  publishedAt: string;
  readTimeInMinutes: number;
  seo?: {
    title: string;
    description: string;
  };
  slug: string;
  tags: Array<{
    name: string;
    slug: string;
  }>;
  title: string;
}

export interface PageInfo {
  endCursor: string | null;
  hasNextPage: boolean;
}

export interface PostsResponse {
  pageInfo: PageInfo;
  posts: Post[];
}

// Experience Types
export interface Experience {
  company: string;
  date: string;
  description?: string[];
  icon: string;
  location: string;
  title: string;
}

// Project Types
export interface Project {
  description: string;
  imageUrl: string;
  link?: string;
  tags: string[];
  title: string;
}

// Skill Types
export type SkillCategory =
  | "languages"
  | "frameworks"
  | "tools"
  | "databases"
  | "cloud";

export interface SkillSet {
  category: SkillCategory;
  items: string[];
}

// UI Component Types
export interface CardItem {
  date: string;
  description?: string[];
  icon: string;
  location: string;
  subtitle: string;
  title: string;
}

// Context Types
export interface ActiveSectionContextType {
  activeSection: SectionName;
  setActiveSection: React.Dispatch<React.SetStateAction<SectionName>>;
  setTimeOfLastClick: React.Dispatch<React.SetStateAction<number>>;
  timeOfLastClick: number;
}

// Props Types (commonly used)
export interface ChildrenProps {
  children: React.ReactNode;
}

export interface ClassNameProps {
  className?: string;
}

export interface BaseComponentProps extends ChildrenProps, ClassNameProps {}
