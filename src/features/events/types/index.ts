/**
 * Events feature types
 */

export interface IEvent {
  id: string;
  title: string;
  description?: string;
  type: "meeting" | "conference" | "workshop" | "webinar" | "other";
  startDate: string;
  endDate: string;
  location?: string;
  organizer: string;
  attendees?: string[];
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

export interface IEventFormData {
  title: string;
  description?: string;
  type: IEvent["type"];
  startDate: string;
  endDate: string;
  location?: string;
}

export interface IEventFilters {
  search?: string;
  type?: string;
  status?: string;
  page?: number;
  limit?: number;
}
