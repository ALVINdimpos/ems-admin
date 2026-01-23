import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";

import emailIcon from "../../../public/email-icon.png";

import passwordIcon from "../../../public/password-icon.png";

import { LoginFormData } from "@/lib/validators/authSchema";
import { loginSchema } from "@/lib/validators/authSchema";

export default function LoginForm() {
  const [canShowPassword, setCanShowPassword] = useState(false);
  const t = useTranslations("auth.login");
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
  const onSubmit = (data: LoginFormData) => {
    console.log("Form submitted:", data);
  };
  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label className="text-white text-xs mb-1.5 block ml-1">
          {t("email")}
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-80">
            <Image src={emailIcon} alt="email" width={16} height={16} />
          </span>
          <input
            type="text"
            placeholder={t("emailPlaceholder")}
            {...register("email")}
            className="w-full h-[40px] pl-11 pr-4 rounded-lg bg-white/10 border border-white/20 text-white text-sm placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>
      </div>
      <div>
        <label className="text-white text-xs mb-1.5 block ml-1">
          {t("password")}
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-80">
            <Image src={passwordIcon} alt="password" width={16} height={16} />
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
            👁
          </span>
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">
              {errors.password.message}
            </p>
          )}
        </div>
      </div>
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
        className="w-full h-[44px] mt-2 bg-[#1298E5] hover:bg-blue-600 active:scale-[0.98] transition-all rounded-lg text-white font-semibold text-sm shadow-lg"
      >
        {t("submitButton")}
      </button>
    </form>
  );
}
