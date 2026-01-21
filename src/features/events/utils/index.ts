/**
 * Event utility functions
 */

import type { IEvent } from "../types";

export function getEventStatusColor(status: IEvent["status"]): string {
  switch (status) {
    case "upcoming":
      return "text-blue-600 bg-blue-100";
    case "ongoing":
      return "text-green-600 bg-green-100";
    case "completed":
      return "text-gray-600 bg-gray-100";
    case "cancelled":
      return "text-red-600 bg-red-100";
    default:
      return "text-gray-600 bg-gray-100";
  }
}

export function isEventUpcoming(event: IEvent): boolean {
  return event?.status === "upcoming";
}

export function getEventTypeLabel(type: IEvent["type"]): string {
  const labels: Record<IEvent["type"], string> = {
    meeting: "Meeting",
    conference: "Conference",
    workshop: "Workshop",
    webinar: "Webinar",
    other: "Other",
  };
  return labels[type] || type;
}
