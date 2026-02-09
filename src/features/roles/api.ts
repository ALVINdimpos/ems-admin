import apiClient from "@/lib/api/client";

export type Role = {
  id: string;
  name: string;
  description: string | null;
  organizationId: string | null;
  branchId: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  usersCount?: number;
};

/**
 * GET /roles?page=1&limit=10&search=...
 * Returns { success, data: Role[] } (pagination may be in raw response)
 */
export const rolesApi = {
  list(
    {
      page = 1,
      limit = 100,
      search = "",
    }: { page?: number; limit?: number; search?: string } = {},
    token: string,
  ) {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      search: search ?? "",
    });
    return apiClient.get<Role[]>(`/roles?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};
