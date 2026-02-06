/**
 * Content API
 * Handles marketing content operations against the real backend
 */

import type {
  IMarketingContent,
  IContentFilters,
  IContentTag,
  ICreateMarketingContent,
  IUpdateMarketingContent,
  IBulkActionRequest,
  IQueryParams,
  ContentStatus,
} from "../types";
import {
  buildContentFormData,
  type ProgressCallback,
} from "../utils/chunkedUpload";

import {
  apiClient,
  buildQueryString,
  type IPaginatedResponse,
} from "./helpers";

import type { IApiResponse } from "@/types";

/**
 * Raw tag shape returned by the backend (junction table format).
 */
interface IRawTagJunction {
  contentId: string;
  tagId: string;
  createdAt: string;
  tag: IContentTag;
}

/**
 * Normalize a single content item from the backend shape to the frontend shape.
 *
 * - Derives `status` from `isActive` (backend has no `status` enum).
 * - Flattens junction-table tags `{ tag: {...} }[]` → `IContentTag[]`.
 */
function normalizeContent(raw: Record<string, unknown>): IMarketingContent {
  // Derive status from isActive boolean
  const isActive = raw.isActive as boolean | undefined;
  const status: ContentStatus = isActive ? "PUBLISHED" : "DRAFT";

  // Flatten junction-table tags if needed
  const rawTags = (raw.tags ?? []) as (IRawTagJunction | IContentTag)[];
  const tags: IContentTag[] = rawTags.map((t) => {
    if ("tag" in t && t.tag && typeof t.tag === "object") {
      return t.tag as IContentTag;
    }
    return t as IContentTag;
  });

  return { ...(raw as unknown as IMarketingContent), status, tags };
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
    const response = await apiClient.get<Record<string, unknown>[]>(
      `/marketing-contents${query}`
    );

    if (!response.success) {
      return { success: false, error: response.error };
    }

    // The API client extracts `result.data` → an array of items.
    // Pagination meta may come as response.meta or response.total.
    const rawItems = Array.isArray(response.data) ? response.data : [];
    const items = rawItems.map(normalizeContent);
    const total =
      response.total ?? (response.meta?.total as number) ?? items.length;
    const page = (response.meta?.page as number) ?? params?.page ?? 1;
    const limit = (response.meta?.limit as number) ?? params?.limit ?? 10;
    const totalPages =
      (response.meta?.totalPages as number) ?? Math.ceil(total / limit);

    return {
      success: true,
      data: { data: items, total, page, limit, totalPages },
    };
  },

  /**
   * Get single content by ID
   */
  getById: async (id: string): Promise<IApiResponse<IMarketingContent>> => {
    const response = await apiClient.get<Record<string, unknown>>(
      `/marketing-contents/${id}`
    );
    if (response.success && response.data) {
      return { ...response, data: normalizeContent(response.data) };
    }
    return response as unknown as IApiResponse<IMarketingContent>;
  },

  /**
   * Create new marketing content.
   *
   * When `imageFiles` are provided the request is sent as multipart/form-data
   * with images chunked client-side for reliability. Otherwise a plain JSON
   * POST is used.
   */
  create: async (
    data: ICreateMarketingContent,
    imageFiles?: File[],
    onUploadProgress?: ProgressCallback
  ): Promise<IApiResponse<IMarketingContent>> => {
    // If no image files, send a simple JSON payload
    if (!imageFiles || imageFiles.length === 0) {
      return apiClient.post<IMarketingContent>(`/marketing-contents`, data);
    }

    // Build FormData with chunked images on the same endpoint
    const formData = await buildContentFormData(
      data as unknown as Record<string, unknown>,
      imageFiles,
      onUploadProgress
    );

    return apiClient.post<IMarketingContent>(`/marketing-contents`, formData);
  },

  /**
   * Update existing content.
   *
   * Supports optional image file uploads via chunked FormData, just like
   * `create`.
   */
  update: async (
    id: string,
    data: Partial<IUpdateMarketingContent>,
    imageFiles?: File[],
    onUploadProgress?: ProgressCallback
  ): Promise<IApiResponse<IMarketingContent>> => {
    if (!imageFiles || imageFiles.length === 0) {
      return apiClient.patch<IMarketingContent>(
        `/marketing-contents/${id}`,
        data
      );
    }

    const formData = await buildContentFormData(
      data as unknown as Record<string, unknown>,
      imageFiles,
      onUploadProgress
    );

    return apiClient.patch<IMarketingContent>(
      `/marketing-contents/${id}`,
      formData
    );
  },

  /**
   * Delete content
   */
  delete: async (id: string): Promise<IApiResponse<void>> => {
    return apiClient.delete(`/marketing-contents/${id}`);
  },

  /**
   * Perform bulk action on multiple content items
   */
  bulkAction: async (
    request: IBulkActionRequest
  ): Promise<IApiResponse<{ affected: number }>> => {
    return apiClient.post(`/marketing-contents/bulk`, request);
  },

  /**
   * Archive content (deactivate)
   */
  archive: async (id: string): Promise<IApiResponse<IMarketingContent>> => {
    return apiClient.patch<IMarketingContent>(
      `/marketing-contents/${id}/deactivate`
    );
  },

  /**
   * Duplicate content
   */
  duplicate: async (id: string): Promise<IApiResponse<IMarketingContent>> => {
    return apiClient.post<IMarketingContent>(
      `/marketing-contents/${id}/duplicate`
    );
  },
};

export default contentApi;
