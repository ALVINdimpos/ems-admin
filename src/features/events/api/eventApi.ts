/**
 * Events API functions
 */

import type { IEvent, IEventFilters } from "../types";

import { apiClient } from "@/lib/api/client";

export const eventApi = {
  getAll: async (filters?: IEventFilters) => {
    const params = new URLSearchParams();
    if (filters?.search) params.append("search", filters.search);
    if (filters?.type) params.append("type", filters.type);
    if (filters?.status) params.append("status", filters.status);
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());

    return apiClient.get<IEvent[]>(`/events?${params.toString()}`);
  },

  getById: async (id: string) => {
    return apiClient.get<IEvent>(`/events/${id}`);
  },

  create: async (data: Partial<IEvent>) => {
    return apiClient.post<IEvent>("/events", data);
  },

  update: async (id: string, data: Partial<IEvent>) => {
    return apiClient.put<IEvent>(`/events/${id}`, data);
  },

  delete: async (id: string) => {
    return apiClient.delete(`/events/${id}`);
  },
};
