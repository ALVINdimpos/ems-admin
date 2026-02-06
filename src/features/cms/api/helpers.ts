/**
 * CMS API Helpers
 * Shared utilities for CMS API operations
 */

import type { IQueryParams } from "../types";

import apiClient from "@/lib/api/client";

/**
 * Build query string from filters and pagination params
 */
export function buildQueryString(
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

/**
 * Paginated response interface
 */
export interface IPaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export { apiClient };
