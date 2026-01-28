/**
 * Application constants
 */

export const APP_NAME = "EMS";
export const APP_DESCRIPTION = "Event Management System";

export const ROUTES = {
  HOME: "/",
  ABOUT: "/about",
  CONTACT: "/contact",
  // Auth routes
  LOGIN: "/login",
  REGISTER: "/register",
  // Dashboard routes
  DASHBOARD: {
    EVENTS: "/events",
  },
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

export const DATE_FORMATS = {
  SHORT: "short",
  LONG: "long",
  FULL: "full",
  TIME: "time",
} as const;

export const EVENT_TYPES = {
  MEETING: "meeting",
  CONFERENCE: "conference",
  WORKSHOP: "workshop",
  WEBINAR: "webinar",
  OTHER: "other",
} as const;

export const EVENT_STATUS = {
  UPCOMING: "upcoming",
  ONGOING: "ongoing",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;
