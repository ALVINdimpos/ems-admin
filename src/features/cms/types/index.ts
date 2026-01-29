/**
 * CMS Types based on Prisma Schema
 * These types mirror the backend Prisma models for type-safe frontend operations
 */

// Enums matching Prisma schema
export type ContentType =
  | "BANNER"
  | "HERO"
  | "PROMOTION"
  | "ANNOUNCEMENT"
  | "BLOG"
  | "TESTIMONIAL"
  | "FAQ"
  | "FEATURE";

export type ContentStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED" | "SCHEDULED";

export type UserRole = "ADMIN" | "EDITOR" | "VIEWER";

// Base entity interface
export interface IBaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// Content Category
export interface IContentCategory extends IBaseEntity {
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  parentId?: string;
  parent?: IContentCategory;
  children?: IContentCategory[];
  _count?: {
    contents: number;
  };
}

// Content Tag
export interface IContentTag extends IBaseEntity {
  name: string;
  slug: string;
  color: string;
  isActive: boolean;
  _count?: {
    contents: number;
  };
}

// Marketing Content Metadata
export interface IContentMetadata {
  seoTitle?: string;
  seoDescription?: string;
  keywords?: string[];
  openGraphImage?: string;
  customFields?: Record<string, unknown>;
}

// Marketing Content
export interface IMarketingContent extends IBaseEntity {
  title: string;
  slug: string;
  type: ContentType;
  status: ContentStatus;
  summary?: string;
  content: string;
  featuredImage?: string;
  mediaUrls?: string[];
  metadata?: IContentMetadata;
  publishedAt?: string;
  scheduledAt?: string;
  expiresAt?: string;
  priority: number;
  isActive: boolean;
  viewCount: number;
  categoryId?: string;
  category?: IContentCategory;
  tags?: IContentTag[];
  authorId: string;
  author?: {
    id: string;
    name: string;
    email: string;
  };
}

// Form data types for CRUD operations
export interface ICreateContentCategory {
  name: string;
  description?: string;
  isActive?: boolean;
  parentId?: string;
}

export interface IUpdateContentCategory extends Partial<ICreateContentCategory> {
  id: string;
}

export interface ICreateContentTag {
  name: string;
  color: string;
  isActive?: boolean;
}

export interface IUpdateContentTag extends Partial<ICreateContentTag> {
  id: string;
}

export interface ICreateMarketingContent {
  title: string;
  type: ContentType;
  status?: ContentStatus;
  summary?: string;
  content: string;
  featuredImage?: string;
  mediaUrls?: string[];
  metadata?: IContentMetadata;
  scheduledAt?: string;
  expiresAt?: string;
  priority?: number;
  isActive?: boolean;
  categoryId?: string;
  tagIds?: string[];
}

export interface IUpdateMarketingContent extends Partial<ICreateMarketingContent> {
  id: string;
}

// Filter and query types
export interface IContentFilters {
  [key: string]:
    | ContentType
    | ContentStatus
    | string
    | string[]
    | boolean
    | undefined;
  type?: ContentType;
  status?: ContentStatus;
  categoryId?: string;
  tagIds?: string[];
  isActive?: boolean;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  authorId?: string;
}

export interface ICategoryFilters {
  [key: string]: boolean | string | undefined;
  isActive?: boolean;
  search?: string;
  parentId?: string;
}

export interface ITagFilters {
  [key: string]: boolean | string | undefined;
  isActive?: boolean;
  search?: string;
}

export interface ISortOptions {
  field: string;
  order: "asc" | "desc";
}

export interface IQueryParams {
  page?: number;
  limit?: number;
  sort?: ISortOptions;
}

// Bulk action types
export type BulkAction =
  | "publish"
  | "archive"
  | "delete"
  | "activate"
  | "deactivate";

export interface IBulkActionRequest {
  ids: string[];
  action: BulkAction;
}

// Dashboard statistics
export interface ICmsStats {
  totalContent: number;
  contentByType: Record<ContentType, number>;
  contentByStatus: Record<ContentStatus, number>;
  activeCategories: number;
  totalCategories: number;
  activeTags: number;
  totalTags: number;
  recentContent: IMarketingContent[];
  popularContent: IMarketingContent[];
}

// Permission check helper type
export interface IPermissions {
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canPublish: boolean;
  canArchive: boolean;
  canBulkAction: boolean;
}

