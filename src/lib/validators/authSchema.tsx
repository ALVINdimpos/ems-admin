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
