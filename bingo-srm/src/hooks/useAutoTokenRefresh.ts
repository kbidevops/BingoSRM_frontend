import { useEffect } from "react";
import { refreshAccessToken } from "@/src/lib/authRefresh";

export function useAutoTokenRefresh() {
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    function scheduleRefresh() {
      const expiresIn = Number(localStorage.getItem("expiresIn") || "3600");
      const tokenSetTime = Number(
        localStorage.getItem("tokenSetTime") || Date.now(),
      );
      // Refresh 1 minute before expiry
      const refreshTime = tokenSetTime + (expiresIn - 60) * 1000 - Date.now();
      if (interval) clearInterval(interval);
      interval = setInterval(
        async () => {
          await refreshAccessToken();
        },
        refreshTime > 0 ? refreshTime : 300000,
      ); // fallback: 5 min
    }

    scheduleRefresh();

    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);
}
