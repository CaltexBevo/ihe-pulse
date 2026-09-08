"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { getInnovationGrantPacificCalendarDate } from "@/lib/innovation-grants-shared";

/** Refresh date-only lifecycle labels when an overnight tab becomes active. */
export default function PortalDayRefresh({ asOfDate }: { asOfDate: string }) {
  const router = useRouter();
  const renderedDate = useRef(asOfDate);
  const requestedDate = useRef<string | null>(null);

  useEffect(() => {
    renderedDate.current = asOfDate;
    if (requestedDate.current === asOfDate) requestedDate.current = null;
  }, [asOfDate]);

  useEffect(() => {
    const refreshIfDateChanged = () => {
      if (document.visibilityState === "hidden") return;
      const currentDate = getInnovationGrantPacificCalendarDate(new Date());
      if (currentDate === renderedDate.current || requestedDate.current === currentDate) return;
      // Keep the rendered date unchanged until the server response arrives. A
      // stale response should not make the tab believe it has refreshed.
      requestedDate.current = currentDate;
      router.refresh();
      window.setTimeout(() => {
        if (renderedDate.current !== currentDate && requestedDate.current === currentDate) {
          requestedDate.current = null;
        }
      }, 5000);
    };

    refreshIfDateChanged();
    window.addEventListener("focus", refreshIfDateChanged);
    document.addEventListener("visibilitychange", refreshIfDateChanged);
    const timer = window.setInterval(refreshIfDateChanged, 60_000);
    return () => {
      window.removeEventListener("focus", refreshIfDateChanged);
      document.removeEventListener("visibilitychange", refreshIfDateChanged);
      window.clearInterval(timer);
    };
  }, [router, asOfDate]);

  return null;
}
