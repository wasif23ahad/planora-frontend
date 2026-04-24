import { useState, useEffect } from "react";
import planoraApi from "../lib/api";
import { useAuth } from "../context/AuthContext";

export function useNotifications() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [dismissedEventIds, setDismissedEventIds] = useState<string[]>([]);

  useEffect(() => {
    // Load dismissed events from localStorage
    const saved = localStorage.getItem("planora_dismissed_events");
    if (saved) setDismissedEventIds(JSON.parse(saved));

    const fetchNotificationData = async () => {
      if (user) {
        try {
          const { data } = await planoraApi.get("/notifications/stats");
          setStats(data);
        } catch (err) {
          console.error("Failed to fetch notification stats", err);
        }
      }
    };

    fetchNotificationData();
    const interval = setInterval(fetchNotificationData, 30000);

    return () => clearInterval(interval);
  }, [user]);

  const dismissUpcomingEvent = (eventId: string) => {
    const updated = [...dismissedEventIds, eventId];
    setDismissedEventIds(updated);
    localStorage.setItem("planora_dismissed_events", JSON.stringify(updated));
  };

  const markAsRead = async (id: string) => {
    try {
      await planoraApi.patch(`/notifications/${id}/read`);
      // Optimistic update
      if (stats) {
        setStats({
          ...stats,
          notifications: stats.notifications.filter((n: any) => n.id !== id),
          totalCount: stats.totalCount - 1
        });
      }
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  // Filter out dismissed events from stats
  const filteredStats = stats ? {
    ...stats,
    upcomingAttending: stats.upcomingAttending?.filter((ev: any) => !dismissedEventIds.includes(ev.id)),
    totalCount: (stats.pendingInvitationsCount || 0) + 
                (stats.pendingRequestsCount || 0) + 
                (stats.upcomingAttending?.filter((ev: any) => !dismissedEventIds.includes(ev.id)).length || 0) +
                (stats.notifications?.length || 0)
  } : null;

  return { 
    stats: filteredStats, 
    dismissUpcomingEvent,
    markAsRead
  };
}
