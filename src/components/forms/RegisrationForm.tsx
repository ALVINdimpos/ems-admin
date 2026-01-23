"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import Button from "../ui/Button";

import { RegisterFormData } from "@/lib/validators/authSchema";
import { registerSchema } from "@/lib/validators/authSchema";

export default function RegistrationForm() {
  const t = useTranslations("auth.registrationForm");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      title: "",
      startDate: "",
      endDate: "",
      venue: "",
      expectedAttendees: 0,
      description: "",
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    console.log("Form submitted:", data);
  };

  return (
    <form
      className="space-y-4 sm:space-y-5 md:space-y-6"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div>
        <label className="text-black text-xs sm:text-sm md:text-base font-medium mb-1.5 block ml-1">
          {t("title")}
        </label>
        <div className="relative">
          <span className="absolute left-3 sm:left-4 md:left-5 top-1/2 -translate-y-1/2 opacity-60">
            <Image
              src="/event-title-icon.png"
              alt="icon"
              width={16}
              height={16}
            />
          </span>
          <input
            type="text"
            placeholder="Event title"
            {...register("title")}
            className="w-full h-11 sm:h-12 md:h-14 pl-10 sm:pl-11 md:pl-12 pr-4 rounded-lg bg-[#007DC514] border border-white/10 text-black text-sm sm:text-base md:text-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
          {errors.title && (
            <p className="text-red-500 text-xs sm:text-sm mt-1">
              {errors.title.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
        <div>
          <label className="text-black text-xs sm:text-sm md:text-base font-medium mb-1.5 block ml-1">
            {t("startDate")}
          </label>
          <input
            type="date"
            {...register("startDate")}
            className="w-full h-11 sm:h-12 md:h-14 px-4 rounded-lg bg-[#007DC514] border border-white/10 text-black text-sm sm:text-base md:text-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
          {errors.startDate && (
            <p className="text-red-500 text-xs sm:text-sm mt-1">
              {errors.startDate.message}
            </p>
          )}
        </div>
        <div>
          <label className="text-black text-xs sm:text-sm md:text-base font-medium mb-1.5 block ml-1">
            {t("endDate")}
          </label>
          <input
            type="date"
            {...register("endDate")}
            className="w-full h-11 sm:h-12 md:h-14 px-4 rounded-lg bg-[#007DC514] border border-white/10 text-black text-sm sm:text-base md:text-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
          {errors.endDate && (
            <p className="text-red-500 text-xs sm:text-sm mt-1">
              {errors.endDate.message}
            </p>
          )}
        </div>
      </div>
      <div>
        <label className="text-black text-xs sm:text-sm md:text-base font-medium mb-1.5 block ml-1">
          {t("venue")}
        </label>
        <div className="relative">
          <span className="absolute left-3 sm:left-4 md:left-5 top-1/2 -translate-y-1/2 opacity-60">
            <Image src="/location-icon.png" alt="icon" width={16} height={16} />
          </span>
          <input
            type="text"
            placeholder={t("venuePlaceholder")}
            {...register("venue")}
            className="w-full h-11 sm:h-12 md:h-14 pl-10 sm:pl-11 md:pl-12 pr-4 rounded-lg bg-[#007DC514] border border-white/10 text-black text-sm sm:text-base md:text-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
          {errors.venue && (
            <p className="text-red-500 text-xs sm:text-sm mt-1">
              {errors.venue.message}
            </p>
          )}
        </div>
      </div>
      <div>
        <label className="text-black text-xs sm:text-sm md:text-base font-medium mb-1.5 block ml-1">
          {t("expectedAttendees")}
        </label>
        <div className="relative">
          <span className="absolute left-3 sm:left-4 md:left-5 top-1/2 -translate-y-1/2 opacity-60">
            <Image src="/attandee-icon.png" alt="icon" width={16} height={16} />
          </span>
          <input
            type="number"
            placeholder="0"
            {...register("expectedAttendees", { valueAsNumber: true })}
            className="w-full h-11 sm:h-12 md:h-14 pl-10 sm:pl-11 md:pl-12 pr-4 rounded-lg bg-[#007DC514] border border-white/10 text-black text-sm sm:text-base md:text-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
          {errors.expectedAttendees && (
            <p className="text-red-500 text-xs sm:text-sm mt-1">
              {errors.expectedAttendees.message}
            </p>
          )}
        </div>
      </div>
      <div>
        <label className="text-black text-xs sm:text-sm md:text-base font-medium mb-1.5 block ml-1">
          {t("description")}
        </label>
        <textarea
          rows={4}
          placeholder={t("descriptionPlaceholder")}
          {...register("description")}
          className="w-full p-3 sm:p-4 md:p-5 rounded-lg bg-[#007DC514] border border-white/10 text-black text-sm sm:text-base md:text-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
        />
        {errors.description && (
          <p className="text-red-500 text-xs sm:text-sm mt-1">
            {errors.description.message}
          </p>
        )}
      </div>
      <div>
        <label className="text-black text-xs sm:text-sm md:text-base font-medium mb-2 block ml-1">
          {t("supportingDocuments")}
        </label>
        <div className="group relative border-2 border-dashed border-blue-500/50 bg-[#007DC514] hover:border-blue-500/50 rounded-xl p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center cursor-pointer gap-2 transition-all">
          <input
            type="file"
            className="absolute inset-0 opacity-0 cursor-pointer"
            multiple
          />
          <div className="w-14 h-8 sm:w-16 sm:h-10 md:w-20 md:h-12 overflow-visible scale-x-150">
            <svg
              className="w-full h-full text-blue-400 transition-transform group-hover:scale-110"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>
          <p className="text-black text-sm sm:text-base text-center">
            {t("dragOrBrowse")}
            <span className="text-blue-400 font-semibold">browse</span>
          </p>
          <p className="text-black text-[10px] sm:text-xs text-center">
            {t("maxFileSize")}
          </p>
        </div>
      </div>
      <Button className="w-full h-12 sm:h-14 md:h-16 mt-4 bg-gradient-to-r from-[#1298E5] to-[#1298E5] hover:from-blue-500 hover:to-blue-600 active:scale-[0.99] transition-all rounded-lg text-white font-bold text-sm sm:text-base md:text-lg uppercase tracking-wider shadow-lg shadow-blue-500/20">
        {t("submitButton")}
      </Button>
      {/* <button
        type="submit"
        className="w-full h-12 sm:h-14 md:h-16 mt-4 bg-gradient-to-r from-[#1298E5] to-[#1298E5] hover:from-blue-500 hover:to-blue-600 active:scale-[0.99] transition-all rounded-lg text-white font-bold text-sm sm:text-base md:text-lg uppercase tracking-wider shadow-lg shadow-blue-500/20"
      >
        Register
      </button> */}
    </form>
  );
}
