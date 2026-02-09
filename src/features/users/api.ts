import apiClient from "@/lib/api/client";

export type ApiUser = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phone: string | null;
  status: "ACTIVE" | "INACTIVE";
  isVerified: boolean;
  createdAt: string;
};

export type UsersListData = {
  users: ApiUser[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

/** Payload for POST /users (create) */
export type CreateUserPayload = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  roleId: string;
  userType: string;
};

/** Payload for PATCH /users/:id (update) */
export type UpdateUserPayload = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  roleId?: string;
  userType?: string;
};

export const USER_TYPES = [
  "SUPER_ADMIN",
  "ADMIN",
  "OPERATOR",
  "EMPLOYEE",
] as const;

export const usersApi = {
  list(
    {
      page,
      limit,
      search,
    }: {
      page: number;
      limit: number;
      search?: string;
    },
    token: string,
  ) {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      search: search ?? "",
    });

    return apiClient.get<UsersListData>(`/users?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  getById(id: string, token: string) {
    return apiClient.get<ApiUser>(`/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  create(data: CreateUserPayload, token: string) {
    return apiClient.post<ApiUser>("/users", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  update(id: string, data: UpdateUserPayload, token: string) {
    return apiClient.patch<ApiUser>(`/users/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

