/**
 * Media API
 * Handles media upload and management operations
 */

import { apiClient } from "./helpers";

import type { IApiResponse } from "@/types";

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

    return apiClient.post<{ url: string; filename: string }>(
      `/media/upload`,
      formData
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

    return apiClient.post<{ urls: string[] }>(
      `/media/upload-multiple`,
      formData
    );
  },

  /**
   * Delete media file
   */
  delete: async (url: string): Promise<IApiResponse<void>> => {
    return apiClient.delete(`/media`, {
      body: JSON.stringify({ url }),
    });
  },
};

export default mediaApi;
