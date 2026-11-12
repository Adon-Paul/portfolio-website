import { useEffect, useState } from "react";

export default function MotionFrame({ children }) {
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const preference = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReduced(Boolean(preference?.matches));
    const updateVisibility = () => setHidden(document.hidden);
    try {
      setPaused(sessionStorage.getItem("portfolio-motion") === "paused");
    } catch {
      /* Storage is optional. */
    }
    updatePreference();
    updateVisibility();
    setReady(true);
    preference?.addEventListener("change", updatePreference);
    document.addEventListener("visibilitychange", updateVisibility);
    return () => {
      preference?.removeEventListener("change", updatePreference);
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, []);
  function toggle() {
    const next = !paused;
    setPaused(next);
    try {
      sessionStorage.setItem("portfolio-motion", next ? "paused" : "running");
    } catch {
      /* Keep the control usable when storage is blocked. */
    }
  }
  const running = ready && !paused && !reduced && !hidden;
  return (
    <div id="top" data-motion={running ? "running" : "paused"}>
      {children}
      <button
        className="motion-control enhanced"
        onClick={toggle}
        disabled={reduced}
      >
        <span className="motion-emblem" aria-hidden="true">
          <span />
        </span>
        <span>
          {reduced
            ? "Motion reduced by system preference"
            : paused
              ? "Resume motion"
              : "Pause motion"}
        </span>
      </button>
    </div>
  );
}
