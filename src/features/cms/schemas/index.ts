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

// Content metadata schema
export const contentMetadataSchema = z.object({
  seoTitle: z.string().max(70).optional(),
  seoDescription: z.string().max(160).optional(),
  keywords: z.array(z.string()).optional(),
  openGraphImage: z.url().optional(),
  customFields: z.record(z.string(), z.unknown()).optional(),
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
  isActive: z.boolean().default(true),
});

export const updateTagSchema = createTagSchema.partial().extend({
  id: z.string().uuid(),
});

// Marketing Content schemas
export const createContentSchema = z
  .object({
    title: z
      .string()
      .min(3, "Title must be at least 3 characters")
      .max(200, "Title must not exceed 200 characters"),
    type: contentTypeSchema,
    status: contentStatusSchema,
    summary: z
      .string()
      .max(500, "Summary must not exceed 500 characters")
      .optional(),
    content: z.string().min(1, "Content is required"),
    featuredImage: z
      .string()
      .url("Must be a valid URL")
      .optional()
      .or(z.literal("")),
    mediaUrls: z.array(z.string().url()).optional(),
    metadata: contentMetadataSchema.optional(),
    scheduledAt: z.string().datetime().optional(),
    expiresAt: z.string().datetime().optional(),
    priority: z.number().int().min(0).max(100),
    isActive: z.boolean(),
    categoryId: z.string().optional(),
    tagIds: z.array(z.string()).optional(),
  })
  .refine(
    (data) => {
      // If status is SCHEDULED, scheduledAt must be provided
      if (data.status === "SCHEDULED" && !data.scheduledAt) {
        return false;
      }
      return true;
    },
    {
      message: "Scheduled date is required when status is SCHEDULED",
      path: ["scheduledAt"],
    }
  )
  .refine(
    (data) => {
      // expiresAt must be after scheduledAt or publishedAt
      if (data.expiresAt && data.scheduledAt) {
        return new Date(data.expiresAt) > new Date(data.scheduledAt);
      }
      return true;
    },
    {
      message: "Expiration date must be after the scheduled date",
      path: ["expiresAt"],
    }
  );

export const updateContentSchema = z.object({
  id: z.string().uuid(),
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must not exceed 200 characters")
    .optional(),
  type: contentTypeSchema.optional(),
  status: contentStatusSchema.optional(),
  summary: z
    .string()
    .max(500, "Summary must not exceed 500 characters")
    .optional(),
  content: z.string().min(1, "Content is required").optional(),
  featuredImage: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  mediaUrls: z.array(z.string().url()).optional(),
  metadata: contentMetadataSchema.optional(),
  scheduledAt: z.string().datetime().optional(),
  expiresAt: z.string().datetime().optional(),
  priority: z.number().int().min(0).max(100).optional(),
  isActive: z.boolean().optional(),
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
