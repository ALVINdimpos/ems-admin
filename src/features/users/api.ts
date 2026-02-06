import apiClient from "@/lib/api/client";
import type { User } from "@/app/dashboard/users/user-types";

export const usersApi = {
  // Fetch all users
  list(token: string) {
    return apiClient.get<User[]>("/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Fetch single user by id
  getById(id: string, token: string) {
    return apiClient.get<User>(`/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Update user
  update(id: string, data: Partial<User>, token: string) {
    return apiClient.put<User>(`/users/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

