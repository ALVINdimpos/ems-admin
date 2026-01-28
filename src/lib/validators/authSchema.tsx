<<<<<<< HEAD
import { z } from "zod";

import validators from "@/lib/validators";

const { isNotEmpty, isValidLength, isEmail } = validators;

export const registerSchema = z.object({
  companyName: z
    .string()
    .nonempty("Company name is required")
    .refine((val) => isValidLength(val, 2, 100), {
      message: "Company name must be 2-100 characters",
    }),
  title: z
    .string()
    .nonempty("Title is required")
    .refine((val) => isValidLength(val, 3, 50), {
      message: "Title must be 3-50 characters",
    }),
  startDate: z.string().refine(isNotEmpty, {
    message: "Start date is required",
  }),
  endDate: z.string().refine(isNotEmpty, {
    message: "End date is required",
  }),
  venue: z.string().refine((val) => isValidLength(val, 1, 50), {
    message: "Venue must be 1-50 characters",
  }),
  expectedAttendees: z
    .number("Expected number of attendees is required")
    .min(1, "Must be at least 1"),
  email: z
    .string()
    .nonempty("Email is required")
    .refine(isEmail, { message: "Invalid email address" }),
  phoneNumber: z
    .string()
    .nonempty("Phone number is required")
    .refine((val) => /^[0-9+()\-\s]{7,20}$/.test(val), {
      message: "Enter a valid phone number",
    }),
  registrationType: z
    .enum(["registration", "management"])
    .refine((val) => val !== undefined, {
      message: "Please select a registration type",
    }),
  description: z
    .string()
    .refine(isNotEmpty, {
      message: "Description is required",
    })
    .max(200, "Description must be under 200 characters"),
});

export const loginSchema = z.object({
  email: z.string().nonempty("Email is required").refine(isEmail, {
    message: "Invalid email address",
  }),
  password: z.string().refine(isNotEmpty, {
    message: "Password is required",
  }),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export type RegisterFormData = z.infer<typeof registerSchema>;
=======
import { z } from "zod";

import validators from "@/lib/validators";

const { isNotEmpty, isValidLength, isEmail } = validators;

export const registerSchema = z.object({
  title: z
    .string()
    .nonempty("Title is required")
    .refine((val) => isValidLength(val, 3, 50), {
      message: "Title must be 3-50 characters",
    }),
  startDate: z.string().refine(isNotEmpty, {
    message: "Start date is required",
  }),
  endDate: z.string().refine(isNotEmpty, {
    message: "End date is required",
  }),
  venue: z.string().refine((val) => isValidLength(val, 1, 50), {
    message: "Venue must be 1-50 characters",
  }),
  expectedAttendees: z
    .number("Expected number of attendees is required")
    .min(1, "Must be at least 1"),
  description: z
    .string()
    .refine(isNotEmpty, {
      message: "Description is required",
    })
    .max(200, "Description must be under 200 characters"),
});

export const loginSchema = z.object({
  email: z.string().nonempty("Email is required").refine(isEmail, {
    message: "Invalid email address",
  }),
  password: z.string().refine(isNotEmpty, {
    message: "Password is required",
  }),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export type RegisterFormData = z.infer<typeof registerSchema>;
>>>>>>> d291ab2 (ft: Initial commit)
