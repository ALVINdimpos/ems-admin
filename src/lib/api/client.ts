/**
 * API Client
 * Centralized HTTP client for making API requests
 */

import type { IApiResponse } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api/v1";

interface IRequestOptions extends RequestInit {
  data?: any;
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

    const config: RequestInit = {
      ...restOptions,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    };

    if (data) {
      config.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, config);
      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: result.error || "An error occurred",
        };
      }

      return {
        success: true,
        data: result.data || result,
      };
    } catch (error) {
      console.log(
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
