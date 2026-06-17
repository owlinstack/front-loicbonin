export interface Article {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  category: string
  tags: string[]
  publishedAt: string
  readingTime: number // in minutes
  featured?: boolean
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
  longDescription?: string
  techStack: string[]
  liveUrl?: string
  repoUrl?: string
  featured?: boolean
}

export interface CodeFile {
  name: string
  path: string
  language: string
  content: string
  linkedArticleSlug?: string
  linkedArticleTitle?: string
}

export interface CodeFolder {
  name: string
  path: string
  children: (CodeFile | CodeFolder)[]
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
  timeline: ProfileTimeline[]
  education: ProfileEducation[]
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
