/**
 * Event-specific hooks
 */

import { useEffect, useState } from "react";

import { eventApi } from "../api/eventApi";
import type { IEvent, IEventFilters } from "../types";

export function useEvents(filters?: IEventFilters) {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      setError(null);

      const response = await eventApi.getAll(filters);

      if (response.success && response.data) {
        setEvents(response.data);
      } else {
        setError(response.error || "Failed to fetch events");
      }

      setIsLoading(false);
    };

    fetchEvents();
  }, [filters]);

  return { events, isLoading, error };
}
