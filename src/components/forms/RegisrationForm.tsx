"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Building2,
  Calendar,
  Mail,
  MapPin,
  Phone,
  Upload,
  Users,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import {Button} from "../ui/Button";

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
      companyName: "",
      title: "",
      startDate: "",
      endDate: "",
      venue: "",
      expectedAttendees: 0,
      email: "",
      phoneNumber: "",
      registrationType: "management",
      description: "",
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    console.log("=== Registration Form Data ===");
    console.log("Company Name:", data.companyName);
    console.log("Event Title:", data.title);
    console.log("Start Date:", data.startDate);
    console.log("End Date:", data.endDate);
    console.log("Venue:", data.venue);
    console.log("Expected Attendees:", data.expectedAttendees);
    console.log("Email:", data.email);
    console.log("Phone Number:", data.phoneNumber);
    console.log("Registration Type:", data.registrationType);
    console.log("Description:", data.description);
    console.log("Full Data Object:", data);
  };

  return (
    <div className="flex flex-col h-full">
      <form
        className="space-y-2.5 sm:space-y-3 flex-1 overflow-y-auto pb-3 "
        onSubmit={handleSubmit(onSubmit)}
        id="registration-form"
      >
        <div className="m-3">
          <div>
            <label className="text-gray-800 text-xs sm:text-sm font-semibold mb-1 block">
              {t("companyName")}
            </label>
            <div className="relative">
              <span className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </span>
              <input
                type="text"
                placeholder={t("companyNamePlaceholder")}
                {...register("companyName")}
                className="w-full h-9 sm:h-10 pl-8 sm:pl-9 pr-3 rounded-md bg-[#007DC514] border border-gray-200 text-gray-900 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400"
              />
              {errors.companyName && (
                <p className="text-red-500 text-[10px] sm:text-xs mt-0.5">
                  {errors.companyName.message}
                </p>
              )}
            </div>
          </div>
          <div>
            <label className="text-gray-800 text-xs sm:text-sm font-semibold mb-1 block">
              {t("title")}
            </label>
            <div className="relative">
              <span className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </span>
              <input
                type="text"
                placeholder={t("titlePlaceholder")}
                {...register("title")}
                className="w-full h-9 sm:h-10 pl-8 sm:pl-9 pr-3 rounded-md bg-[#007DC514] border border-gray-200 text-gray-900 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400"
              />
              {errors.title && (
                <p className="text-red-500 text-[10px] sm:text-xs mt-0.5">
                  {errors.title.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <div>
              <label className="text-gray-800 text-xs sm:text-sm font-semibold mb-1 block">
                {t("startDate")}
              </label>
              <div className="relative">
                <span className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </span>
                <input
                  type="date"
                  {...register("startDate")}
                  className="w-full h-9 sm:h-10 pl-8 sm:pl-9 pr-2.5 sm:pr-3 rounded-md bg-[#007DC514] border border-gray-200 text-gray-900 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none placeholder:text-gray-400"
                />
              </div>
              {errors.startDate && (
                <p className="text-red-500 text-[10px] sm:text-xs mt-0.5">
                  {errors.startDate.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-gray-800 text-xs sm:text-sm font-semibold mb-1 block">
                {t("endDate")}
              </label>
              <div className="relative">
                <span className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </span>
                <input
                  type="date"
                  {...register("endDate")}
                  className="w-full h-9 sm:h-10 pl-8 sm:pl-9 pr-2.5 sm:pr-3 rounded-md bg-[#007DC514] border border-gray-200 text-gray-900 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none placeholder:text-gray-400"
                />
              </div>
              {errors.endDate && (
                <p className="text-red-500 text-[10px] sm:text-xs mt-0.5">
                  {errors.endDate.message}
                </p>
              )}
            </div>
          </div>
          <div>
            <label className="text-gray-800 text-xs sm:text-sm font-semibold mb-1 block">
              {t("venue")}
            </label>
            <div className="relative">
              <span className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </span>
              <input
                type="text"
                placeholder={t("venuePlaceholder")}
                {...register("venue")}
                className="w-full h-9 sm:h-10 pl-8 sm:pl-9 pr-3 rounded-md bg-[#007DC514] border border-gray-200 text-gray-900 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400"
              />
              {errors.venue && (
                <p className="text-red-500 text-[10px] sm:text-xs mt-0.5">
                  {errors.venue.message}
                </p>
              )}
            </div>
          </div>
          <div>
            <label className="text-gray-800 text-xs sm:text-sm font-semibold mb-1 block">
              {t("expectedAttendees")}
            </label>
            <div className="relative">
              <span className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </span>
              <input
                type="number"
                placeholder={t("expectedAttendeesPlaceholder")}
                {...register("expectedAttendees", { valueAsNumber: true })}
                className="w-full h-9 sm:h-10 pl-8 sm:pl-9 pr-3 rounded-md bg-[#007DC514] border border-gray-200 text-gray-900 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400"
              />
              {errors.expectedAttendees && (
                <p className="text-red-500 text-[10px] sm:text-xs mt-0.5">
                  {errors.expectedAttendees.message}
                </p>
              )}
            </div>
          </div>
          <div>
            <label className="text-gray-800 text-xs sm:text-sm font-semibold mb-1 block">
              {t("email")}
            </label>
            <div className="relative">
              <span className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </span>
              <input
                type="email"
                placeholder={t("emailPlaceholder")}
                {...register("email")}
                className="w-full h-9 sm:h-10 pl-8 sm:pl-9 pr-3 rounded-md bg-[#007DC514] border border-gray-200 text-gray-900 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400"
              />
              {errors.email && (
                <p className="text-red-500 text-[10px] sm:text-xs mt-0.5">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>
          <div>
            <label className="text-gray-800 text-xs sm:text-sm font-semibold mb-1 block">
              {t("phoneNumber")}
            </label>
            <div className="relative">
              <span className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </span>
              <input
                type="tel"
                placeholder={t("phoneNumberPlaceholder")}
                {...register("phoneNumber")}
                className="w-full h-9 sm:h-10 pl-8 sm:pl-9 pr-3 rounded-md bg-[#007DC514] border border-gray-200 text-gray-900 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400"
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-[10px] sm:text-xs mt-0.5">
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-gray-800 text-xs sm:text-sm">
            <span className="font-semibold">{t("registrationType")}</span>
            <label className="inline-flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                value="registration"
                {...register("registrationType")}
                className="accent-blue-500 w-3.5 h-3.5"
              />
              <span>{t("registrationTypeRegistration")}</span>
            </label>
            <label className="inline-flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                value="management"
                {...register("registrationType")}
                className="accent-blue-500 w-3.5 h-3.5"
              />
              <span>{t("registrationTypeManagement")}</span>
            </label>
          </div>
          {errors.registrationType && (
            <p className="text-red-500 text-[10px] sm:text-xs mt-0.5">
              {errors.registrationType.message}
            </p>
          )}
          <div>
            <label className="text-gray-800 text-xs sm:text-sm font-semibold mb-1 block">
              {t("description")}
            </label>
            <textarea
              rows={2}
              placeholder={t("descriptionPlaceholder")}
              {...register("description")}
              className="w-full p-2.5 sm:p-3 rounded-md bg-[#007DC514] border border-gray-200 text-gray-900 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none placeholder:text-gray-400"
            />
            {errors.description && (
              <p className="text-red-500 text-[10px] sm:text-xs mt-0.5">
                {errors.description.message}
              </p>
            )}
          </div>
          <div>
            <label className="text-gray-800 text-xs sm:text-sm font-semibold mb-1 block">
              {t("supportingDocuments")}
            </label>
            <div className="group relative border-2 border-dashed border-blue-400/50 bg-[#007DC514] hover:border-blue-500 rounded-lg p-3 sm:p-4 flex flex-col items-center justify-center cursor-pointer gap-1.5 transition-all">
              <input
                type="file"
                className="absolute inset-0 opacity-0 cursor-pointer"
                multiple
                aria-label="Upload supporting documents"
              />
              <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400 transition-transform group-hover:scale-110" />
              <p className="text-gray-600 text-xs sm:text-sm text-center">
                {t("dragOrBrowse")}
              </p>
              <p className="text-gray-400 text-[10px] sm:text-xs text-center">
                {t("maxFileSize")}
              </p>
            </div>
          </div>
        </div>
      </form>
      <div className="sticky bottom-0 bg-white pt-2.5 sm:pt-3 pb-1 border-t border-gray-100">
        <Button
          type="submit"
          form="registration-form"
          className="w-full h-10 sm:h-11 bg-[#1298E5] hover:bg-blue-600 active:scale-[0.99] transition-all rounded-md text-white font-semibold text-xs sm:text-sm uppercase tracking-wide"
        >
          {t("submitButton")}
        </Button>
      </div>
    </div>
  );
}
