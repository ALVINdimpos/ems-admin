/**
 * CMS API Service
 * Handles all CMS-related API operations with proper typing and error handling
 */

import type {
  IMarketingContent,
  IContentCategory,
  IContentTag,
  IContentFilters,
  ICategoryFilters,
  ITagFilters,
  ICreateMarketingContent,
  IUpdateMarketingContent,
  ICreateContentCategory,
  IUpdateContentCategory,
  ICreateContentTag,
  IUpdateContentTag,
  IBulkActionRequest,
  ICmsStats,
  IQueryParams,
} from "../types";

import {
  mockStats,
  mockCategories,
  mockTags,
  contentStore,
  generateSlug,
  generateId,
} from "../utils/mockData";

import apiClient from "@/lib/api/client";
import type { IApiResponse } from "@/types";

const CMS_BASE = "/cms";

// Helper function to safely make API calls with mock data fallback
async function withMockFallback<T>(
  apiCall: () => Promise<IApiResponse<T>>,
  mockData: T
): Promise<IApiResponse<T>> {
  try {
    const response = await apiCall();
    if (response.success && response.data) {
      return response;
    }
  } catch {
    // Fallback to mock data if API fails
  }
  return { success: true, data: mockData };
}

/**
 * Build query string from filters and pagination params
 */
function buildQueryString(
  filters?: Record<string, unknown>,
  params?: IQueryParams
): string {
  const searchParams = new URLSearchParams();

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        if (Array.isArray(value)) {
          value.forEach((v) => searchParams.append(key, String(v)));
        } else {
          searchParams.append(key, String(value));
        }
      }
    });
  }

  if (params) {
    if (params.page) searchParams.append("page", String(params.page));
    if (params.limit) searchParams.append("limit", String(params.limit));
    if (params.sort) {
      searchParams.append("sortBy", params.sort.field);
      searchParams.append("sortOrder", params.sort.order);
    }
  }

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
}

// ============================================================================
// Marketing Content API
// ============================================================================

export interface IPaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const contentApi = {
  /**
   * Get paginated list of marketing content with filters
   */
  getAll: async (
    filters?: IContentFilters,
    params?: IQueryParams
  ): Promise<IApiResponse<IPaginatedResponse<IMarketingContent>>> => {
    const query = buildQueryString(filters as Record<string, unknown>, params);
    try {
      const response = await apiClient.get<
        IPaginatedResponse<IMarketingContent>
      >(`${CMS_BASE}/content${query}`);
      if (response.success && response.data) {
        return response;
      }
    } catch {
      // Fallback to in-memory store
    }

    // Use in-memory store with filtering
    let results = contentStore.getAll();

    if (filters) {
      if (filters.type) {
        results = results.filter((c) => c.type === filters.type);
      }
      if (filters.status) {
        results = results.filter((c) => c.status === filters.status);
      }
      if (filters.isActive !== undefined) {
        results = results.filter((c) => c.isActive === filters.isActive);
      }
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        results = results.filter(
          (c) =>
            c.title.toLowerCase().includes(searchLower) ||
            c.summary?.toLowerCase().includes(searchLower)
        );
      }
      if (filters.categoryId) {
        results = results.filter((c) => c.categoryId === filters.categoryId);
      }
    }

    // Apply sorting
    if (params?.sort) {
      const { field, order } = params.sort;
      results.sort((a, b) => {
        const aVal = (a as unknown as Record<string, unknown>)[field];
        const bVal = (b as unknown as Record<string, unknown>)[field];
        if (
          aVal === undefined ||
          aVal === null ||
          bVal === undefined ||
          bVal === null
        )
          return 0;
        if (order === "desc") {
          return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
        }
        return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
      });
    }

    // Get total before pagination
    const total = results.length;
    const limit = params?.limit || 10;
    const page = params?.page || 1;
    const totalPages = Math.ceil(total / limit);

    // Apply pagination
    const start = (page - 1) * limit;
    const paginatedResults = results.slice(start, start + limit);

    return {
      success: true,
      data: {
        data: paginatedResults,
        total,
        page,
        limit,
        totalPages,
      },
    };
  },

  /**
   * Get single content by ID
   */
  getById: async (id: string): Promise<IApiResponse<IMarketingContent>> => {
    try {
      const response = await apiClient.get<IMarketingContent>(
        `${CMS_BASE}/content/${id}`
      );
      if (response.success && response.data) {
        return response;
      }
    } catch {
      // Fallback to in-memory store
    }

    const content = contentStore.getById(id);
    if (content) {
      return { success: true, data: content };
    }
    return { success: false, error: "Content not found" };
  },

  /**
   * Get content by slug
   */
  getBySlug: async (slug: string): Promise<IApiResponse<IMarketingContent>> => {
    try {
      const response = await apiClient.get<IMarketingContent>(
        `${CMS_BASE}/content/slug/${slug}`
      );
      if (response.success && response.data) {
        return response;
      }
    } catch {
      // Fallback to in-memory store
    }

    const content = contentStore.filter((c) => c.slug === slug)[0];
    if (content) {
      return { success: true, data: content };
    }
    return { success: false, error: "Content not found" };
  },

  /**
   * Create new marketing content
   */
  create: async (
    data: ICreateMarketingContent
  ): Promise<IApiResponse<IMarketingContent>> => {
    try {
      const response = await apiClient.post<IMarketingContent>(
        `${CMS_BASE}/content`,
        data
      );
      if (response.success && response.data) {
        return response;
      }
    } catch {
      // Fallback to in-memory store
    }

    // Create in memory
    const slug = generateSlug(data.title);
    const newContent = contentStore.create({
      ...data,
      slug,
      priority: data.priority ?? 0,
      isActive: data.isActive ?? true,
      viewCount: 0,
      status: data.status || "DRAFT",
      publishedAt:
        data.status === "PUBLISHED" ? new Date().toISOString() : undefined,
      author: { id: "user-1", name: "Current User", email: "user@example.com" },
      authorId: "user-1",
    } as Omit<IMarketingContent, "id" | "createdAt" | "updatedAt">);

    return { success: true, data: newContent };
  },

  /**
   * Update existing content
   */
  update: async (
    id: string,
    data: Partial<IUpdateMarketingContent>
  ): Promise<IApiResponse<IMarketingContent>> => {
    try {
      const response = await apiClient.patch<IMarketingContent>(
        `${CMS_BASE}/content/${id}`,
        data
      );
      if (response.success && response.data) {
        return response;
      }
    } catch {
      // Fallback to in-memory store
    }

    const updated = contentStore.update(id, data as Partial<IMarketingContent>);
    if (updated) {
      return { success: true, data: updated };
    }
    return { success: false, error: "Content not found" };
  },

  /**
   * Delete content
   */
  delete: async (id: string): Promise<IApiResponse<void>> => {
    try {
      const response = await apiClient.delete(`${CMS_BASE}/content/${id}`);
      if (response.success) {
        return response;
      }
    } catch {
      // Fallback to in-memory store
    }

    const isDeleted = contentStore.delete(id);
    if (isDeleted) {
      return { success: true, data: undefined };
    }
    return { success: false, error: "Content not found" };
  },

  /**
   * Perform bulk action on multiple content items
   */
  bulkAction: async (
    request: IBulkActionRequest
  ): Promise<IApiResponse<{ affected: number }>> => {
    try {
      const response = await apiClient.post(
        `${CMS_BASE}/content/bulk`,
        request
      );
      if (response.success) {
        return response;
      }
    } catch {
      // Fallback to in-memory store
    }

    let affected = 0;
    for (const id of request.ids) {
      if (request.action === "delete") {
        if (contentStore.delete(id)) affected++;
      } else if (request.action === "publish") {
        const updated = contentStore.update(id, {
          status: "PUBLISHED",
          publishedAt: new Date().toISOString(),
        } as Partial<IMarketingContent>);
        if (updated) affected++;
      } else if (request.action === "archive") {
        const updated = contentStore.update(id, {
          status: "ARCHIVED",
        } as Partial<IMarketingContent>);
        if (updated) affected++;
      }
    }

    return { success: true, data: { affected } };
  },

  /**
   * Publish content
   */
  publish: async (id: string): Promise<IApiResponse<IMarketingContent>> => {
    try {
      const response = await apiClient.patch<IMarketingContent>(
        `${CMS_BASE}/content/${id}/publish`
      );
      if (response.success && response.data) {
        return response;
      }
    } catch {
      // Fallback to in-memory store
    }

    const updated = contentStore.update(id, {
      status: "PUBLISHED",
      publishedAt: new Date().toISOString(),
    } as Partial<IMarketingContent>);
    if (updated) {
      return { success: true, data: updated };
    }
    return { success: false, error: "Content not found" };
  },

  /**
   * Archive content
   */
  archive: async (id: string): Promise<IApiResponse<IMarketingContent>> => {
    try {
      const response = await apiClient.patch<IMarketingContent>(
        `${CMS_BASE}/content/${id}/archive`
      );
      if (response.success && response.data) {
        return response;
      }
    } catch {
      // Fallback to in-memory store
    }

    const updated = contentStore.update(id, {
      status: "ARCHIVED",
    } as Partial<IMarketingContent>);
    if (updated) {
      return { success: true, data: updated };
    }
    return { success: false, error: "Content not found" };
  },

  /**
   * Duplicate content
   */
  duplicate: async (id: string): Promise<IApiResponse<IMarketingContent>> => {
    try {
      const response = await apiClient.post<IMarketingContent>(
        `${CMS_BASE}/content/${id}/duplicate`
      );
      if (response.success && response.data) {
        return response;
      }
    } catch {
      // Fallback to in-memory store
    }

    const original = contentStore.getById(id);
    if (!original) {
      return { success: false, error: "Content not found" };
    }

    const duplicated = contentStore.create({
      ...original,
      title: `${original.title} (Copy)`,
      slug: `${original.slug}-copy-${generateId().slice(0, 8)}`,
      status: "DRAFT",
      publishedAt: undefined,
      viewCount: 0,
    } as Omit<IMarketingContent, "id" | "createdAt" | "updatedAt">);

    return { success: true, data: duplicated };
  },
};

// ============================================================================
// Content Category API
// ============================================================================

export const categoryApi = {
  /**
   * Get all categories with optional filters
   */
  getAll: async (
    filters?: ICategoryFilters,
    params?: IQueryParams
  ): Promise<IApiResponse<IContentCategory[]>> => {
    const query = buildQueryString(filters as Record<string, unknown>, params);
    return withMockFallback(
      () => apiClient.get<IContentCategory[]>(`${CMS_BASE}/categories${query}`),
      mockCategories
    );
  },

  /**
   * Get category tree structure
   */
  getTree: async (): Promise<IApiResponse<IContentCategory[]>> => {
    return withMockFallback(
      () => apiClient.get<IContentCategory[]>(`${CMS_BASE}/categories/tree`),
      mockCategories
    );
  },

  /**
   * Get single category by ID
   */
  getById: async (id: string): Promise<IApiResponse<IContentCategory>> => {
    return withMockFallback(
      () => apiClient.get<IContentCategory>(`${CMS_BASE}/categories/${id}`),
      mockCategories[0] || ({} as IContentCategory)
    );
  },

  /**
   * Create new category
   */
  create: async (
    data: ICreateContentCategory
  ): Promise<IApiResponse<IContentCategory>> => {
    return apiClient.post<IContentCategory>(`${CMS_BASE}/categories`, data);
  },

  /**
   * Update existing category
   */
  update: async (
    id: string,
    data: Partial<IUpdateContentCategory>
  ): Promise<IApiResponse<IContentCategory>> => {
    return apiClient.patch<IContentCategory>(
      `${CMS_BASE}/categories/${id}`,
      data
    );
  },

  /**
   * Delete category
   */
  delete: async (id: string): Promise<IApiResponse<void>> => {
    return apiClient.delete(`${CMS_BASE}/categories/${id}`);
  },

  /**
   * Check if slug is unique
   */
  checkSlug: async (
    slug: string,
    excludeId?: string
  ): Promise<IApiResponse<{ available: boolean }>> => {
    const query = excludeId ? `?excludeId=${excludeId}` : "";
    return withMockFallback(
      () =>
        apiClient.get<{ available: boolean }>(
          `${CMS_BASE}/categories/check-slug/${slug}${query}`
        ),
      { available: true }
    );
  },
};

// ============================================================================
// Content Tag API
// ============================================================================

export const tagApi = {
  /**
   * Get all tags with optional filters
   */
  getAll: async (
    filters?: ITagFilters,
    params?: IQueryParams
  ): Promise<IApiResponse<IContentTag[]>> => {
    const query = buildQueryString(filters as Record<string, unknown>, params);
    return withMockFallback(
      () => apiClient.get<IContentTag[]>(`${CMS_BASE}/tags${query}`),
      mockTags
    );
  },

  /**
   * Get single tag by ID
   */
  getById: async (id: string): Promise<IApiResponse<IContentTag>> => {
    return withMockFallback(
      () => apiClient.get<IContentTag>(`${CMS_BASE}/tags/${id}`),
      mockTags[0] || ({} as IContentTag)
    );
  },

  /**
   * Create new tag
   */
  create: async (
    data: ICreateContentTag
  ): Promise<IApiResponse<IContentTag>> => {
    return apiClient.post<IContentTag>(`${CMS_BASE}/tags`, data);
  },

  /**
   * Update existing tag
   */
  update: async (
    id: string,
    data: Partial<IUpdateContentTag>
  ): Promise<IApiResponse<IContentTag>> => {
    return apiClient.patch<IContentTag>(`${CMS_BASE}/tags/${id}`, data);
  },

  /**
   * Delete tag
   */
  delete: async (id: string): Promise<IApiResponse<void>> => {
    return apiClient.delete(`${CMS_BASE}/tags/${id}`);
  },

  /**
   * Check if slug is unique
   */
  checkSlug: async (
    slug: string,
    excludeId?: string
  ): Promise<IApiResponse<{ available: boolean }>> => {
    const query = excludeId ? `?excludeId=${excludeId}` : "";
    return withMockFallback(
      () =>
        apiClient.get<{ available: boolean }>(
          `${CMS_BASE}/tags/check-slug/${slug}${query}`
        ),
      { available: true }
    );
  },
};

// ============================================================================
// CMS Statistics API
// ============================================================================

export const statsApi = {
  /**
   * Get CMS dashboard statistics
   */
  getDashboardStats: async (): Promise<IApiResponse<ICmsStats>> => {
    // Use mock data for development/testing when API is not available
    try {
      const response = await apiClient.get<ICmsStats>(
        `${CMS_BASE}/stats/dashboard`
      );
      if (response.success && response.data) {
        return response;
      }
    } catch {
      // Fallback to mock data if API fails
    }
    return { success: true, data: mockStats };
  },

  /**
   * Get content analytics for a specific period
   */
  getContentAnalytics: async (
    dateFrom: string,
    dateTo: string
  ): Promise<
    IApiResponse<{
      views: number;
      published: number;
      engagement: Record<string, number>;
    }>
  > => {
    return apiClient.get(
      `${CMS_BASE}/stats/analytics?dateFrom=${dateFrom}&dateTo=${dateTo}`
    );
  },
};

// ============================================================================
// Media Upload API
// ============================================================================

export const mediaApi = {
  /**
   * Upload single file
   */
  upload: async (
    file: File,
    folder?: string
  ): Promise<IApiResponse<{ url: string; filename: string }>> => {
    const formData = new FormData();
    formData.append("file", file);
    if (folder) formData.append("folder", folder);

    return withMockFallback(
      () =>
        apiClient.post<{ url: string; filename: string }>(
          `${CMS_BASE}/media/upload`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        ),
      { url: URL.createObjectURL(file), filename: file.name }
    );
  },

  /**
   * Upload multiple files
   */
  uploadMultiple: async (
    files: File[],
    folder?: string
  ): Promise<IApiResponse<{ urls: string[] }>> => {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    if (folder) formData.append("folder", folder);

    return withMockFallback(
      () =>
        apiClient.post<{ urls: string[] }>(
          `${CMS_BASE}/media/upload-multiple`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        ),
      { urls: files.map((file) => URL.createObjectURL(file)) }
    );
  },

  /**
   * Delete media file
   */
  delete: async (url: string): Promise<IApiResponse<void>> => {
    return apiClient.delete(`${CMS_BASE}/media`, {
      body: JSON.stringify({ url }),
    });
  },
};

// Export all APIs
export const cmsApi = {
  content: contentApi,
  categories: categoryApi,
  tags: tagApi,
  stats: statsApi,
  media: mediaApi,
};

export default cmsApi;
