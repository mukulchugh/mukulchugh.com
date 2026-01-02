// ============================================
// CENTRALIZED TYPE DEFINITIONS
// ============================================

import { links } from "../data";

// Navigation & Section Types
export type SectionName = (typeof links)[number]["name"];

// Blog / Hashnode Types
export interface Post {
  id: string;
  title: string;
  slug: string;
  brief: string;
  content?: {
    html: string;
    markdown: string;
  };
  publishedAt: string;
  readTimeInMinutes: number;
  coverImage: {
    url: string;
  } | null;
  author?: {
    name: string;
    profilePicture: string;
  };
  tags: Array<{
    name: string;
    slug: string;
  }>;
  seo?: {
    title: string;
    description: string;
  };
}

export interface PageInfo {
  endCursor: string | null;
  hasNextPage: boolean;
}

export interface PostsResponse {
  posts: Post[];
  pageInfo: PageInfo;
}

// Experience Types
export interface Experience {
  title: string;
  description?: string[];
  company: string;
  date: string;
  location: string;
  icon: string;
}

// Project Types
export interface Project {
  title: string;
  description: string;
  tags: string[];
  imageUrl: string;
  link?: string;
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
export interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

export interface CardItem {
  icon: string;
  title: string;
  subtitle: string;
  date: string;
  location: string;
  description?: string[];
}

// Context Types
export interface ActiveSectionContextType {
  activeSection: SectionName;
  setActiveSection: React.Dispatch<React.SetStateAction<SectionName>>;
  timeOfLastClick: number;
  setTimeOfLastClick: React.Dispatch<React.SetStateAction<number>>;
}

// Props Types (commonly used)
export interface ChildrenProps {
  children: React.ReactNode;
}

export interface ClassNameProps {
  className?: string;
}

export interface BaseComponentProps extends ChildrenProps, ClassNameProps {}
