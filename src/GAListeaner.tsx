// GAListener.tsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export default function GAListener() {
  const location = useLocation();

  useEffect(() => {
    if (typeof window.gtag !== "undefined") {
      window.gtag("config", "G-3L1YB7PBFT", {
        page_path: location.pathname + location.search,
      });
    }
  }, [location]);

  return null;
}
