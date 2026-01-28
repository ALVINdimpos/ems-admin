/**
 * API-related types
 */

export interface IApiError {
  message: string;
  code?: string;
  status?: number;
}

export interface IApiRequestConfig {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  headers?: Record<string, string>;
  body?: any;
  params?: Record<string, string>;
}
