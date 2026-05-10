import { useEffect, useRef } from "react";
import { getAnalytics, isSupported, logEvent } from "firebase/analytics";
import { app } from "../firebase";

export default function Analytics({ pageName }) {
  const analyticsRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    const pagePath = pageName === "portfolio" ? "/" : `/${pageName}`;

    async function trackPageView() {
      if (typeof window === "undefined") return;

      const supported = await isSupported();
      if (!supported || cancelled) return;

      const analytics = analyticsRef.current || getAnalytics(app);
      analyticsRef.current = analytics;

      logEvent(analytics, "page_view", {
        page_title: document.title,
        page_location: `${window.location.origin}${pagePath}`,
        page_path: pagePath,
        portfolio_view: pageName,
      });
    }

    trackPageView().catch((error) => {
      if (import.meta.env.DEV) {
        console.warn("Analytics page view was not sent.", error);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [pageName]);

  return null;
}
