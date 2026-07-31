import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Route-level scroll restoration.
 * Every pathname change resets the viewport to the top before paint,
 * except when an explicit hash anchor is present.
 */
export const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useLayoutEffect(() => {
    if (hash) return;
    if (typeof window === "undefined") return;
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
