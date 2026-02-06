/**
 * CMS Validation Schemas using Zod
 * Field validations based on Prisma schema constraints
 */

import { z } from "zod/v4";

// Content type enum
export const contentTypeSchema = z.enum([
  "BANNER",
  "HERO",
  "PROMOTION",
  "ANNOUNCEMENT",
  "BLOG",
  "TESTIMONIAL",
  "FAQ",
  "FEATURE",
]);

// Content status enum
export const contentStatusSchema = z.enum([
  "DRAFT",
  "PUBLISHED",
  "ARCHIVED",
  "SCHEDULED",
]);

// Hex color pattern
const hexColorPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

// Schema for datetime-local inputs — accepts "YYYY-MM-DDTHH:mm" and converts to ISO
const datetimeLocalSchema = z
  .string()
  .refine((val) => !val || !isNaN(Date.parse(val)), "Invalid date")
  .transform((val) => (val ? new Date(val).toISOString() : undefined));

// Image media schema
const imageMediaSchema = z.object({
  url: z.string().min(1, "URL is required"),
  altText: z.string(),
  order: z.number().int().min(0),
});

// Video media schema
const videoMediaSchema = z.object({
  url: z.string().min(1, "URL is required"),
  title: z.string(),
  order: z.number().int().min(0),
});

// Link schema
const linkSchema = z.object({
  url: z.string().min(1, "URL is required"),
  label: z.string(),
});

// Content metadata schema
export const contentMetadataSchema = z.object({
  seoTitle: z.string().max(70).optional(),
  seoDescription: z.string().max(160).optional(),
  keywords: z.array(z.string()).optional(),
  openGraphImage: z.url().optional(),
  customFields: z.record(z.string(), z.unknown()).optional(),
  sponsor: z.string().optional(),
});

// Content Category schemas
export const createCategorySchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters"),
  description: z
    .string()
    .max(500, "Description must not exceed 500 characters")
    .optional(),
  isActive: z.boolean().default(true),
  parentId: z.string().uuid().optional(),
});

export const updateCategorySchema = createCategorySchema.partial().extend({
  id: z.string().uuid(),
});

// Content Tag schemas
export const createTagSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters"),
  color: z
    .string()
    .regex(hexColorPattern, "Must be a valid hex color (e.g., #FF5733)"),
});

export const updateTagSchema = createTagSchema.partial().extend({
  id: z.string().uuid(),
});

// Marketing Content schemas
export const createContentSchema = z
  .object({
    type: contentTypeSchema,
    title: z
      .string()
      .min(3, "Title must be at least 3 characters")
      .max(200, "Title must not exceed 200 characters"),
    subtitle: z
      .string()
      .max(500, "Subtitle must not exceed 500 characters")
      .optional(),
    content: z.string().min(1, "Content is required"),
    summary: z
      .string()
      .max(500, "Summary must not exceed 500 characters")
      .optional(),
    images: z.array(imageMediaSchema).default([]),
    videos: z.array(videoMediaSchema).default([]),
    links: z.array(linkSchema).default([]),
    metadata: contentMetadataSchema.optional(),
    isActive: z.boolean().default(true),
    order: z.number().int().min(0).default(0),
    startDate: datetimeLocalSchema.optional(),
    endDate: datetimeLocalSchema.optional(),
    categoryId: z.string().optional(),
    tagIds: z.array(z.string()).optional(),
  })
  .refine(
    (data) => {
      // endDate must be after startDate if both are provided
      if (data.startDate && data.endDate) {
        return new Date(data.endDate) > new Date(data.startDate);
      }
      return true;
    },
    {
      message: "End date must be after start date",
      path: ["endDate"],
    }
  );

export const updateContentSchema = z.object({
  type: contentTypeSchema.optional(),
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must not exceed 200 characters")
    .optional(),
  subtitle: z
    .string()
    .max(500, "Subtitle must not exceed 500 characters")
    .optional(),
  content: z.string().min(1, "Content is required").optional(),
  summary: z
    .string()
    .max(500, "Summary must not exceed 500 characters")
    .optional(),
  images: z.array(imageMediaSchema).optional(),
  videos: z.array(videoMediaSchema).optional(),
  links: z.array(linkSchema).optional(),
  metadata: contentMetadataSchema.optional(),
  isActive: z.boolean().optional(),
  order: z.number().int().min(0).optional(),
  startDate: datetimeLocalSchema.optional(),
  endDate: datetimeLocalSchema.optional(),
  categoryId: z.string().optional(),
  tagIds: z.array(z.string()).optional(),
});

// Filter schemas
export const contentFiltersSchema = z.object({
  type: contentTypeSchema.optional(),
  status: contentStatusSchema.optional(),
  categoryId: z.string().uuid().optional(),
  tagIds: z.array(z.string().uuid()).optional(),
  isActive: z.boolean().optional(),
  search: z.string().optional(),
  dateFrom: z.iso.datetime().optional(),
  dateTo: z.iso.datetime().optional(),
  authorId: z.string().uuid().optional(),
});

// Bulk action schema
export const bulkActionSchema = z.object({
  ids: z.array(z.string().uuid()).min(1, "Select at least one item"),
  action: z.enum(["publish", "archive", "delete", "activate", "deactivate"]),
});

// Type exports from schemas
export type CreateCategoryFormData = z.infer<typeof createCategorySchema>;
export type UpdateCategoryFormData = z.infer<typeof updateCategorySchema>;
export type CreateTagFormData = z.infer<typeof createTagSchema>;
export type UpdateTagFormData = z.infer<typeof updateTagSchema>;
export type CreateContentFormData = z.infer<typeof createContentSchema>;
export type UpdateContentFormData = z.infer<typeof updateContentSchema>;
export type ContentFiltersFormData = z.infer<typeof contentFiltersSchema>;
export type BulkActionFormData = z.infer<typeof bulkActionSchema>;
