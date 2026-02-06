/**
 * Stats API
 * Handles CMS statistics and analytics operations
 */

import type { ICmsStats } from "../types";

import { apiClient } from "./helpers";

import type { IApiResponse } from "@/types";

export const statsApi = {
  /**
   * Get CMS dashboard statistics
   */
  getDashboardStats: async (): Promise<IApiResponse<ICmsStats>> => {
    return apiClient.get<ICmsStats>(`/stats/dashboard`);
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
      `/stats/analytics?dateFrom=${dateFrom}&dateTo=${dateTo}`
    );
  },
};

export default statsApi;
