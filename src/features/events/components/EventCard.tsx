/**
 * Event Card Component
 */

import type { IEvent } from "../types";

import { getEventStatusColor, getEventTypeLabel } from "../utils";

import { formatDate } from "@/lib/utils/format";

interface IEventCardProps {
  event: IEvent;
}

export default function EventCard({ event }: IEventCardProps) {
  return (
    <article className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
      <header className="mb-2">
        <h3 className="text-lg font-semibold text-gray-900">{event?.title}</h3>
        <p className="text-xs text-gray-500">
          {formatDate(event?.startDate)} - {formatDate(event?.endDate)}
        </p>
      </header>
      <div className="space-y-1 text-sm text-gray-600 mb-3">
        {event?.description && <p>{event.description}</p>}
        <p>Type: {getEventTypeLabel(event?.type)}</p>
        {event?.location && <p>Location: {event.location}</p>}
        <p>Organizer: {event?.organizer}</p>
      </div>
      <footer>
        <span
          className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${getEventStatusColor(event?.status)}`}
        >
          {event?.status}
        </span>
      </footer>
    </article>
  );
}
