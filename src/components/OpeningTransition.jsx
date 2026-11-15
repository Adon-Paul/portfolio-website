import { useCallback, useEffect, useRef, useState } from "react";
import GradientASCII from "./GradientASCII";
import { readPalette } from "../content/palette";
import "./OpeningTransition.css";

export default function OpeningTransition() {
  const [opening, setOpening] = useState(null);
  const [leaving, setLeaving] = useState(false);
  const ready = useRef(() => {});
  const finish = useCallback(() => {
    document.documentElement.dataset.opening = "complete";
    setOpening(null);
  }, []);
  const reveal = useCallback(() => {
    ready.current();
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
    let active = true,
      artworkReady = false,
      playbackComplete = false,
      playbackTimer,
      fontsReady = false;
    const check = () => {
      if (
        active &&
        artworkReady &&
        playbackComplete &&
        fontsReady &&
        document.documentElement.dataset.heroReady
      )
        setLeaving(true);
    };
    ready.current = () => {
      if (artworkReady) return;
      artworkReady = true;
      playbackTimer = setTimeout(() => {
        playbackComplete = true;
        check();
      }, 2700);
      check();
    };
    Promise.resolve(document.fonts?.ready).then(() => {
      fontsReady = true;
      check();
    });
    const loading = new MutationObserver(check);
    loading.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-hero-ready"],
    });
    // A compilation failure must never strand an opaque opening screen.
    const deadline = setTimeout(() => setLeaving(true), 8000);
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
      active = false;
      loading.disconnect();
      ready.current = () => {};
      clearTimeout(deadline);
      clearTimeout(playbackTimer);
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
      <p className="opening-status" role="status">
        {leaving ? "Ready" : "Preparing the experience…"}
      </p>
      {!leaving && (
        <button className="opening-skip" onClick={finish}>
          Skip opening <span aria-hidden="true">↗</span>
        </button>
      )}
    </div>
  );
}
