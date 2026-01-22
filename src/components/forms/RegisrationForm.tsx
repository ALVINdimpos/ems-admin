"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useForm } from "react-hook-form";

import { RegisterFormData } from "@/lib/validators/authSchema";
import { registerSchema } from "@/lib/validators/authSchema";

export default function RegistrationForm() {
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
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label className="text-black text-xs font-medium mb-1.5 block ml-1">
          Title
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-60">
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
            className="w-full h-11 pl-11 pr-4 rounded-lg bg-[#007DC514] border border-white/10 text-black text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
          {errors.title && (
            <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-black text-xs font-medium mb-1.5 block ml-1">
            Start Date
          </label>
          <input
            type="date"
            {...register("startDate")}
            className="w-full h-11 px-4 rounded-lg bg-[#007DC514] border border-white/10 text-black text-sm focus:ring-2 focus:ring-blue-500 outline-none color-scheme-dark"
          />
          {errors.startDate && (
            <p className="text-red-500 text-xs mt-1">
              {errors.startDate.message}
            </p>
          )}
        </div>
        <div>
          <label className="text-black text-xs font-medium mb-1.5 block ml-1">
            End Date
          </label>
          <input
            type="date"
            {...register("endDate")}
            className="w-full h-11 px-4 rounded-lg bg-[#007DC514] border border-white/10 text-black text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
          {errors.endDate && (
            <p className="text-red-500 text-xs mt-1">
              {errors.endDate.message}
            </p>
          )}
        </div>
      </div>
      <div>
        <label className="text-black text-xs font-medium mb-1.5 block ml-1">
          Venue
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-60">
            <Image src="/location-icon.png" alt="icon" width={16} height={16} />
          </span>
          <input
            type="text"
            placeholder="Event Venue"
            {...register("venue")}
            className="w-full h-11 pl-11 pr-4 rounded-lg bg-[#007DC514] border border-white/10 text-black text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
          {errors.venue && (
            <p className="text-red-500 text-xs mt-1">{errors.venue.message}</p>
          )}
        </div>
      </div>
      <div>
        <label className="text-black text-xs font-medium mb-1.5 block ml-1">
          Expected NUmber of Attandees
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-60">
            <Image src="/attandee-icon.png" alt="icon" width={16} height={16} />
          </span>
          <input
            type="tnumberext"
            placeholder="0"
            {...register("expectedAttendees", { valueAsNumber: true })}
            className="w-full h-11 pl-11 pr-4 rounded-lg bg-[#007DC514] border border-white/10 text-black text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
          {errors.expectedAttendees && (
            <p className="text-red-500 text-xs mt-1">
              {errors.expectedAttendees.message}
            </p>
          )}
        </div>
      </div>
      <div>
        <label className="text-black text-xs font-medium mb-1.5 block ml-1">
          Description
        </label>
        <textarea
          rows={4}
          placeholder="Event Description"
          {...register("description")}
          className="w-full p-4 rounded-lg bg-[#007DC514] border border-white/10 text-black text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
        />
        {errors.description && (
          <p className="text-red-500 text-xs mt-1">
            {errors.description.message}
          </p>
        )}
      </div>
      <div>
        <label className="text-black text-xs font-medium mb-1.5 block ml-1">
          Supporting Documents
        </label>
        <div className="group relative border-2 border-dashed bg-[#007DC514] hover:border-blue-500/50 rounded-xl p-6 transition-all bg-[#007DC514] flex flex-col items-center justify-center cursor-pointer">
          <input
            type="file"
            className="absolute inset-0 opacity-0 cursor-pointer"
            multiple
          />
          <div className="bg-blue-500/20 p-3 rounded-full mb-3 group-hover:scale-110 transition-transform">
            <svg
              className="w-6 h-6 text-blue-400"
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
          <p className="text-black text-sm">
            Drag your file(s) or{" "}
            <span className="text-blue-400 font-semibold">browse</span>
          </p>
          <p className="text-black text-[10px] mt-1">
            Max 10 MB files are allowed
          </p>
        </div>
      </div>
      <button
        type="submit"
        className="w-full h-12 mt-4 bg-[#1298E5] hover:bg-blue-600 active:scale-[0.99] transition-all rounded-lg text-black font-bold text-sm uppercase tracking-wider shadow-lg shadow-blue-500/20"
      >
        Register
      </button>
    </form>
  );
}
