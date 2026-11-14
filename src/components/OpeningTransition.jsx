import { useCallback, useEffect, useRef, useState } from "react";
import GradientASCII from "./GradientASCII";
import { readPalette } from "../content/palette";
import "./OpeningTransition.css";

export default function OpeningTransition() {
  const [opening, setOpening] = useState(null);
  const [leaving, setLeaving] = useState(false);
  const timer = useRef(null);
  const finish = useCallback(() => {
    document.documentElement.dataset.opening = "complete";
    setOpening(null);
  }, []);
  const reveal = useCallback(() => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setLeaving(true), 2700);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.opening = "complete";
    if (!window.matchMedia) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let paused = false;
    try {
      paused = sessionStorage.getItem("portfolio-motion") === "paused";
    } catch {
      /* Optional storage. */
    }
    if (media.matches || paused || window.location.hash) return;
    document.documentElement.dataset.opening = "active";
    setOpening(readPalette());
    // A compilation failure must never strand an opaque opening screen.
    const deadline = setTimeout(finish, 5500);
    const escape = (event) => {
      if (event.key === "Escape" || event.key === "Tab") finish();
    };
    const preference = () => {
      if (media.matches) finish();
    };
    const visibility = () => {
      if (document.hidden) finish();
    };
    const motion = new MutationObserver(() => {
      if (document.getElementById("top")?.dataset.motion === "paused") finish();
    });
    const frame = document.getElementById("top");
    if (frame)
      motion.observe(frame, {
        attributes: true,
        attributeFilter: ["data-motion"],
      });
    window.addEventListener("keydown", escape);
    document.addEventListener("visibilitychange", visibility);
    media.addEventListener("change", preference);
    return () => {
      clearTimeout(deadline);
      clearTimeout(timer.current);
      motion.disconnect();
      window.removeEventListener("keydown", escape);
      document.removeEventListener("visibilitychange", visibility);
      media.removeEventListener("change", preference);
    };
  }, [finish]);

  useEffect(() => {
    if (!leaving) return;
    const timeout = setTimeout(finish, 1100);
    return () => clearTimeout(timeout);
  }, [leaving, finish]);

  if (!opening) return null;
  return (
    <div className={`opening-transition${leaving ? " is-leaving" : ""}`}>
      <div aria-hidden="true" className="opening-art">
        <GradientASCII
          colors={[
            opening["accent-dark"],
            opening.accent,
            opening["accent-hover"],
            opening.text,
          ]}
          shape="horizon"
          cellSize={18}
          density={0.8}
          mouseInteraction={false}
          clickEffect="none"
          dpr={1.5}
          onReady={reveal}
          onUnavailable={finish}
        />
      </div>
      {!leaving && (
        <button className="opening-skip" onClick={finish}>
          Skip opening <span aria-hidden="true">↗</span>
        </button>
      )}
    </div>
  );
}
