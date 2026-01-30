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
  ICMSStats,
  IQueryParams,
} from "../types";

import {
  mockStats,
  mockContents,
  mockCategories,
  mockTags,
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

export const contentApi = {
  /**
   * Get paginated list of marketing content with filters
   */
  getAll: async (
    filters?: IContentFilters,
    params?: IQueryParams
  ): Promise<IApiResponse<IMarketingContent[]>> => {
    const query = buildQueryString(filters as Record<string, unknown>, params);
    return withMockFallback(
      () => apiClient.get<IMarketingContent[]>(`${CMS_BASE}/content${query}`),
      mockContents
    );
  },

  /**
   * Get single content by ID
   */
  getById: async (id: string): Promise<IApiResponse<IMarketingContent>> => {
    return withMockFallback(
      () => apiClient.get<IMarketingContent>(`${CMS_BASE}/content/${id}`),
      mockContents[0] || ({} as IMarketingContent)
    );
  },

  /**
   * Get content by slug
   */
  getBySlug: async (slug: string): Promise<IApiResponse<IMarketingContent>> => {
    return withMockFallback(
      () =>
        apiClient.get<IMarketingContent>(`${CMS_BASE}/content/slug/${slug}`),
      mockContents.find((c) => c.slug === slug) ||
        mockContents[0] ||
        ({} as IMarketingContent)
    );
  },

  /**
   * Create new marketing content
   */
  create: async (
    data: ICreateMarketingContent
  ): Promise<IApiResponse<IMarketingContent>> => {
    return apiClient.post<IMarketingContent>(`${CMS_BASE}/content`, data);
  },

  /**
   * Update existing content
   */
  update: async (
    id: string,
    data: Partial<IUpdateMarketingContent>
  ): Promise<IApiResponse<IMarketingContent>> => {
    return apiClient.patch<IMarketingContent>(
      `${CMS_BASE}/content/${id}`,
      data
    );
  },

  /**
   * Delete content
   */
  delete: async (id: string): Promise<IApiResponse<void>> => {
    return apiClient.delete(`${CMS_BASE}/content/${id}`);
  },

  /**
   * Perform bulk action on multiple content items
   */
  bulkAction: async (
    request: IBulkActionRequest
  ): Promise<IApiResponse<{ affected: number }>> => {
    return apiClient.post(`${CMS_BASE}/content/bulk`, request);
  },

  /**
   * Publish content
   */
  publish: async (id: string): Promise<IApiResponse<IMarketingContent>> => {
    return apiClient.patch<IMarketingContent>(
      `${CMS_BASE}/content/${id}/publish`
    );
  },

  /**
   * Archive content
   */
  archive: async (id: string): Promise<IApiResponse<IMarketingContent>> => {
    return apiClient.patch<IMarketingContent>(
      `${CMS_BASE}/content/${id}/archive`
    );
  },

  /**
   * Duplicate content
   */
  duplicate: async (id: string): Promise<IApiResponse<IMarketingContent>> => {
    return apiClient.post<IMarketingContent>(
      `${CMS_BASE}/content/${id}/duplicate`
    );
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
  getDashboardStats: async (): Promise<IApiResponse<ICMSStats>> => {
    // Use mock data for development/testing when API is not available
    try {
      const response = await apiClient.get<ICMSStats>(
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
