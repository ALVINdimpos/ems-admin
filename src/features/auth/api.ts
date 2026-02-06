import type { LoginFormData } from "@/lib/validators/authSchema";
import apiClient from "@/lib/api/client";

// This matches your backend envelope: { success, data: { accessToken }, message }
export type LoginData = {
  accessToken: string;
};

export const authApi = {
  login(data: LoginFormData) {
    return apiClient.post<LoginData>("/auth/login", data);
  },


};

