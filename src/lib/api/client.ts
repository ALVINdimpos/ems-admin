/**
 * API Client
 * Centralized HTTP client for making API requests
 */

import { STORAGE_KEYS } from "@/lib/constants";
import type { IApiResponse } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

interface IRequestOptions extends RequestInit {
  data?: any;
}

/**
 * Get auth token from localStorage (client-side only)
 */
function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
}

/**
 * Set auth token in localStorage
 */
export function setAuthToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
}

/**
 * Remove auth token from localStorage
 */
export function removeAuthToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T = any>(
    endpoint: string,
    options: IRequestOptions = {}
  ): Promise<IApiResponse<T>> {
    const { data, headers, ...restOptions } = options;

    // Get auth token and include in headers
    const token = getAuthToken();

    const isFormData =
      typeof FormData !== "undefined" && data instanceof FormData;

    const config: RequestInit = {
      ...restOptions,
      headers: {
        // Don't set Content-Type for FormData — browser sets it with boundary
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
    };

    if (data) {
      config.body = isFormData ? data : JSON.stringify(data);
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, config);
      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: result.message || result.error || "An error occurred",
        };
      }

      // Normalize backend response:
      // If the backend wraps in { data: ... }, extract it.
      // Otherwise use the raw result as-is.
      const payload = Object.hasOwn(result, "data") ? result.data : result;

      return {
        success: true,
        data: payload as T,
        // Preserve pagination meta if present at the top level
        ...(result.meta ? { meta: result.meta } : {}),
        ...(result.total !== undefined ? { total: result.total } : {}),
      };
    } catch (error) {
      console.error(
        "API request failed:",
        error instanceof Error ? error.message : error
      );
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Network request failed",
      };
    }
  }

  async get<T = any>(endpoint: string, options?: IRequestOptions) {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  async post<T = any>(endpoint: string, data?: any, options?: IRequestOptions) {
    return this.request<T>(endpoint, { ...options, method: "POST", data });
  }

  async put<T = any>(endpoint: string, data?: any, options?: IRequestOptions) {
    return this.request<T>(endpoint, { ...options, method: "PUT", data });
  }

  async patch<T = any>(
    endpoint: string,
    data?: any,
    options?: IRequestOptions
  ) {
    return this.request<T>(endpoint, { ...options, method: "PATCH", data });
  }

  async delete<T = any>(endpoint: string, options?: IRequestOptions) {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

export default apiClient;
