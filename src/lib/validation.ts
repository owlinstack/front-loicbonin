import { z } from "zod";
import type { CodeFolder } from "./types";

// Schema for 26-character ULID validation matching the Laravel backend specification
export const ULIDSchema = z
  .string()
  .regex(/^[0-9A-HJKMNP-TV-Z]{26}$/i, "Invalid ULID format");

// Schema for YYYY-MM-DD date format
export const DateStringSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)");

export const ArticleSchema = z.object({
  id: ULIDSchema,
  slug: z.string(),
  title: z.string(),
  excerpt: z.string(),
  content: z.string(),
  category: z.string(),
  tags: z.array(z.string()),
  publishedAt: DateStringSchema,
  readingTime: z.number().nonnegative(),
  featured: z.boolean().optional(),
});

export const CategorySchema = z.object({
  slug: z.string(),
  label: z.string(),
  count: z.number().int().nonnegative(),
});

export const ProjectSchema = z.object({
  id: ULIDSchema,
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  longDescription: z.string().optional(),
  techStack: z.array(z.string()),
  liveUrl: z.string().optional(),
  repoUrl: z.string().optional(),
  featured: z.boolean().optional(),
});

export const CodeFileSchema = z.object({
  name: z.string(),
  path: z.string(),
  language: z.string(),
  content: z.string(),
  linkedArticleSlug: z.string().optional(),
  linkedArticleTitle: z.string().optional(),
});

// Recursive schema for folder validation using z.lazy
export const CodeFolderSchema: z.ZodType<CodeFolder> = z.object({
  name: z.string(),
  path: z.string(),
  children: z.array(
    z.lazy(() => z.union([CodeFileSchema, CodeFolderSchema]))
  ),
});

export const CodeTreeSchema = z.array(
  z.union([CodeFileSchema, CodeFolderSchema])
);

export const ProfileTimelineSchema = z.object({
  date: z.string(),
  title: z.string(),
  description: z.string(),
});

export const ProfileEducationSchema = z.object({
  date: z.string(),
  title: z.string(),
  description: z.string(),
});

export const ProfileSchema = z.object({
  name: z.string(),
  bio: z.string(),
  skills: z.array(
    z.object({
      term: z.string(),
      description: z.string(),
    })
  ),
  timeline: z.array(ProfileTimelineSchema),
  education: z.array(ProfileEducationSchema),
  cvUrl: z.string().optional(),
  avatarUrl: z.string().optional().nullable(),
});

export const PaginatedArticlesSchema = z.object({
  articles: z.array(ArticleSchema),
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
});
