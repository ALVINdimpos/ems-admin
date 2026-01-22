"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

import logo from "../../../../public/qt-global-logo.png";

import LoginForm from "@/components/forms/LoginForm";

export default function LoginPage() {
  const t = useTranslations("auth.login");

  return (
    <main
      className="relative h-screen w-full bg-cover bg-center flex items-center justify-center px-4"
      style={{ backgroundImage: "url('/login-background-image.png')" }}
    >
      <div className="absolute inset-0 bg-black/60" />
      <section className="relative z-10 w-full max-w-[370px] max-h-[95vh] overflow-y-auto rounded-2xl border border-white/20 bg-white/10 backdrop-blur-[10px] shadow-xl px-6 py-6 sm:px-8 sm:py-8">
        <div className="flex justify-center mb-4">
          <Image
            src={logo}
            alt="Company Logo"
            width={140}
            height={80}
            className="h-[50px] sm:h-[70px] w-auto object-contain"
          />
        </div>
        <div className="text-center mb-5">
          <h1 className="text-xl sm:text-[22px] font-bold text-white mb-1">
            Welcome Back
          </h1>
          <p className="text-white/70 text-xs sm:text-sm">
            Sign in to continue to your account
          </p>
        </div>

        <LoginForm />

        <div className="mt-5">
          <p className="text-center text-white/60 text-sm">
            {t("noAccount")}{" "}
            <a href="#" className="text-blue-400 hover:underline">
              Register
            </a>
          </p>
          <p className="text-center text-white/40 text-xs mt-3">Contact us</p>
        </div>
      </section>
    </main>
  );
}
