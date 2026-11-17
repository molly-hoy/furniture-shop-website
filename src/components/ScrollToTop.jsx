// ScrollToTop
// In a single-page app the browser doesn't reload between pages, so it
// also doesn't jump back to the top. This tiny component watches the
// current path and scrolls up whenever it changes. It renders nothing.
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
