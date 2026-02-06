/**
 * Tag API
 * Handles content tag operations
 */

import type {
  IContentTag,
  ITagFilters,
  ICreateContentTag,
  IUpdateContentTag,
  IQueryParams,
} from "../types";

import { apiClient, buildQueryString } from "./helpers";

import type { IApiResponse } from "@/types";

export const tagApi = {
  /**
   * Get all tags with optional filters
   */
  getAll: async (
    filters?: ITagFilters,
    params?: IQueryParams
  ): Promise<IApiResponse<IContentTag[]>> => {
    const query = buildQueryString(filters as Record<string, unknown>, params);
    return apiClient.get<IContentTag[]>(`/marketing-tags${query}`);
  },

  /**
   * Get single tag by ID
   */
  getById: async (id: string): Promise<IApiResponse<IContentTag>> => {
    return apiClient.get<IContentTag>(`/marketing-tags/${id}`);
  },

  /**
   * Create new tag
   */
  create: async (
    data: ICreateContentTag
  ): Promise<IApiResponse<IContentTag>> => {
    return apiClient.post<IContentTag>(`/marketing-tags`, data);
  },

  /**
   * Update existing tag
   */
  update: async (
    id: string,
    data: Partial<IUpdateContentTag>
  ): Promise<IApiResponse<IContentTag>> => {
    return apiClient.patch<IContentTag>(`/marketing-tags/${id}`, data);
  },

  /**
   * Delete tag
   */
  delete: async (id: string): Promise<IApiResponse<void>> => {
    return apiClient.delete(`/marketing-tags/${id}`);
  },

  /**
   * Check if slug is unique
   */
  checkSlug: async (
    slug: string,
    excludeId?: string
  ): Promise<IApiResponse<{ available: boolean }>> => {
    const query = excludeId ? `?excludeId=${excludeId}` : "";
    return apiClient.get<{ available: boolean }>(
      `/marketing-tags/check-slug/${slug}${query}`
    );
  },
};

export default tagApi;
