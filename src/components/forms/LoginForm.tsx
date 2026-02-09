import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { LoginFormData, loginSchema } from "@/lib/validators/authSchema";
import { STORAGE_KEYS } from "@/lib/constants";
import { authApi } from "@/features/auth/api";
import { usersApi } from "@/features/users/api";

type DecodedToken = {
  sub?: string;
  user_id?: string;
  [key: string]: unknown;
};

function decodeJwt(token: string): DecodedToken | null {
  try {
    const [, payload] = token.split(".");
    if (!payload) return null;

    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded =
      typeof window !== "undefined"
        ? window.atob(base64)
        : Buffer.from(base64, "base64").toString("binary");

    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

export default function LoginForm() {
  const [canShowPassword, setCanShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const t = useTranslations("auth.login");
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoading(true);
      setApiError(null);

      const response = await authApi.login(data);

      if (!response.success || !response.data?.accessToken) {
        setApiError(response.error || "Invalid email or password.");
        return;
      }

      const accessToken = response.data.accessToken;

      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, accessToken);
      }

      // Decode JWT to get user id
      const decoded = decodeJwt(accessToken);
      const userId = decoded?.user_id || decoded?.sub;

      if (userId) {
        const userResponse = await usersApi.getById(userId, accessToken);

        if (userResponse.success && userResponse.data) {
          if (typeof window !== "undefined") {
            localStorage.setItem(
              STORAGE_KEYS.USER,
              JSON.stringify(userResponse.data),
            );
          }
        }
      }

      router.push("/dashboard/users");
    } catch (error) {
      console.error("Login failed:", error);
      setApiError("Something went wrong while logging in. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label className="text-white text-xs mb-1.5 block ml-1">
          {t("email")}
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-80">
            <MailIcon width={16} height={16} className="text-white/40" />
          </span>
          <input
            type="text"
            placeholder={t("emailPlaceholder")}
            {...register("email")}
            className="w-full h-[40px] pl-11 pr-4 rounded-lg bg-white/10 border border-white/20 text-white text-sm placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
        {errors.email && (
          <p className="text-red-500 text-xs mt-1 ml-1">
            {errors.email.message}
          </p>
        )}
      </div>
      <div>
        <label className="text-white text-xs mb-1.5 block ml-1">
          {t("password")}
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-80">
            <LockIcon width={16} height={16} className="text-white/40" />
          </span>
          <input
            type={canShowPassword ? "text" : "password"}
            placeholder={t("passwordPlaceholder")}
            {...register("password")}
            className="w-full h-[40px] pl-11 pr-10 rounded-lg bg-white/10 border border-white/20 text-white text-sm placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          <span
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 cursor-pointer hover:text-white"
            onClick={() => setCanShowPassword(!canShowPassword)}
          >
            {canShowPassword ? (
              <EyeIcon width={16} height={16} className="text-white/40" />
            ) : (
              <EyeOffIcon width={16} height={16} className="text-white/40" />
            )}
          </span>
        </div>
        {errors.password && (
          <p className="text-red-500 text-xs mt-1 ml-1">
            {errors.password.message}
          </p>
        )}
      </div>
      {apiError && (
        <p className="text-red-400 text-xs mt-1 text-center">{apiError}</p>
      )}
      <div className="flex items-center justify-between text-xs py-1">
        <label className="flex items-center gap-2 text-white/70 cursor-pointer">
          <input type="checkbox" className="accent-blue-500 w-3 h-3" />
          {t("rememberMe")}
        </label>
        <a href="#" className="text-blue-400 hover:underline">
          {t("forgotPassword")}
        </a>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full h-[44px] mt-2 bg-[#1298E5] hover:bg-blue-600 disabled:bg-[#1298E5]/60 disabled:cursor-not-allowed active:scale-[0.98] transition-all rounded-lg text-white font-semibold text-sm shadow-lg"
      >
        {loading ? "Signing in..." : t("submitButton")}
      </button>
    </form>
  );
}