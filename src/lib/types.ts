export interface Article {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  category?: string | null
  categories?: string[]
  tags: string[]
  publishedAt: string | null
  readingTime: number // in minutes
  featured?: boolean | null
  is_pinned?: boolean | null
  codeFile?: CodeFile | null
  codeFolder?: CodeFolder | null
  codeProject?: CodeProject | null
}

export interface Category {
  slug: string
  label: string
  count: number
}

export interface Project {
  id: string
  slug: string
  title: string
  description: string
  longDescription?: string | null
  techStack: string[]
  liveUrl?: string | null
  repoUrl?: string | null
  featured?: boolean | null
  year?: string | null
}

export interface CodeFile {
  name: string
  path: string
  language: string
  content: string
  linkedArticleSlug?: string | null
  linkedArticleTitle?: string | null
  projectSlug?: string | null
}

export interface CodeFolder {
  name: string
  path: string
  children: (CodeFile | CodeFolder)[]
  projectSlug?: string | null
}

export type CodeTree = (CodeFile | CodeFolder)[]

export interface ProfileTimeline {
  date: string
  title: string
  description: string
}

export interface ProfileEducation {
  date: string
  title: string
  description: string
}

export interface Profile {
  name: string
  bio: string
  skills: { term: string; description: string }[]
  showTimeline?: boolean | null
  timeline: ProfileTimeline[] | null
  showEducation?: boolean | null
  education: ProfileEducation[] | null
  cvUrl?: string | null
  avatarUrl?: string | null
}

export interface PaginatedArticles {
  articles: Article[]
  total: number
  page: number
  pageSize: number
}

export type Tag = string

export interface CodeProject {
  id: string
  name: string
  slug: string
  description?: string | null
}

