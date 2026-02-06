/**
 * Category API
 * Handles content category operations
 */

import type {
  IContentCategory,
  ICategoryFilters,
  ICreateContentCategory,
  IUpdateContentCategory,
  IQueryParams,
} from "../types";

import { apiClient, buildQueryString } from "./helpers";

import type { IApiResponse } from "@/types";

export const categoryApi = {
  /**
   * Get all categories with optional filters
   */
  getAll: async (
    filters?: ICategoryFilters,
    params?: IQueryParams
  ): Promise<IApiResponse<IContentCategory[]>> => {
    const query = buildQueryString(filters as Record<string, unknown>, params);
    return apiClient.get<IContentCategory[]>(`/marketing-categories${query}`);
  },

  /**
   * Get category tree structure
   */
  getTree: async (): Promise<IApiResponse<IContentCategory[]>> => {
    return apiClient.get<IContentCategory[]>(`/marketing-categories/tree`);
  },

  /**
   * Get single category by ID
   */
  getById: async (id: string): Promise<IApiResponse<IContentCategory>> => {
    return apiClient.get<IContentCategory>(`/marketing-categories/${id}`);
  },

  /**
   * Create new category
   */
  create: async (
    data: ICreateContentCategory
  ): Promise<IApiResponse<IContentCategory>> => {
    return apiClient.post<IContentCategory>(`/marketing-categories`, data);
  },

  /**
   * Update existing category
   */
  update: async (
    id: string,
    data: Partial<IUpdateContentCategory>
  ): Promise<IApiResponse<IContentCategory>> => {
    return apiClient.patch<IContentCategory>(
      `/marketing-categories/${id}`,
      data
    );
  },

  /**
   * Delete category
   */
  delete: async (id: string): Promise<IApiResponse<void>> => {
    return apiClient.delete(`/marketing-categories/${id}`);
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
      `/marketing-categories/check-slug/${slug}${query}`
    );
  },
};

export default categoryApi;
