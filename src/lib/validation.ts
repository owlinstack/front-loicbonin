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
  longDescription: z.string().optional().nullable(),
  techStack: z.array(z.string()),
  liveUrl: z.string().optional().nullable(),
  repoUrl: z.string().optional().nullable(),
  featured: z.boolean().optional().nullable(),
  year: z.string().optional().nullable(),
});

export const CodeProjectSchema = z.object({
  id: ULIDSchema,
  name: z.string(),
  slug: z.string(),
  description: z.string().optional().nullable(),
});

export const CodeFileSchema = z.object({
  name: z.string(),
  path: z.string(),
  language: z.string(),
  content: z.string(),
  linkedArticleSlug: z.string().optional().nullable(),
  linkedArticleTitle: z.string().optional().nullable(),
  projectSlug: z.string().optional().nullable(),
});

// Recursive schema for folder validation using z.lazy
export const CodeFolderSchema: z.ZodType<CodeFolder> = z.object({
  name: z.string(),
  path: z.string(),
  children: z.array(
    z.lazy(() => z.union([CodeFileSchema, CodeFolderSchema]))
  ),
  projectSlug: z.string().optional().nullable(),
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
  showTimeline: z.boolean().optional().nullable(),
  timeline: z.array(ProfileTimelineSchema).nullable(),
  showEducation: z.boolean().optional().nullable(),
  education: z.array(ProfileEducationSchema).nullable(),
  cvUrl: z.string().optional().nullable(),
  avatarUrl: z.string().optional().nullable(),
});

export const ArticleSchema = z.object({
  id: ULIDSchema,
  slug: z.string(),
  title: z.string(),
  excerpt: z.string(),
  content: z.string(),
  category: z.string(),
  categories: z.array(z.string()).optional(),
  tags: z.array(z.string()),
  publishedAt: DateStringSchema.nullable(),
  readingTime: z.number().nonnegative(),
  featured: z.boolean().optional().nullable(),
  codeFile: CodeFileSchema.optional().nullable(),
  codeFolder: z.lazy(() => CodeFolderSchema).optional().nullable(),
  codeProject: CodeProjectSchema.optional().nullable(),
});

export const PaginatedArticlesSchema = z.object({
  articles: z.array(ArticleSchema),
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
});


