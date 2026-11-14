import { useEffect, useRef, useState } from "react";
import PulseHeart from "./PulseHeart";
import { createLikesClient } from "../likes/client";
import "./SiteLikes.css";

export default function SiteLikes() {
  const [state, setState] = useState({
    count: null,
    liked: false,
    pending: false,
    error: null,
  });
  const [configured, setConfigured] = useState(false);
  const current = useRef(state);
  current.current = state;
  const actions = useRef({});
  const root = useRef(null);
  useEffect(() => {
    let active = true,
      client = null,
      writing = false,
      refreshing = false,
      generation = 0;
    async function refresh() {
      if (writing || refreshing) return;
      refreshing = true;
      const version = ++generation;
      try {
        if (!client) {
          const response = await fetch("/site-likes.json", {
            cache: "no-store",
            signal: AbortSignal.timeout(8000),
          });
          if (!response.ok) throw new Error("Configuration unavailable");
          const config = await response.json();
          if (!config.url || !config.publishableKey) return;
          client = createLikesClient(config);
          if (active) setConfigured(true);
        }
        const result = await client.read();
        if (active && version === generation && !writing)
          setState({ ...result, pending: false, error: null });
      } catch {
        if (active && version === generation && !writing)
          setState((previous) => ({ ...previous, error: "read" }));
      } finally {
        refreshing = false;
      }
    }
    async function vote(liked) {
      if (!client || writing || current.current.count === null) return;
      writing = true;
      ++generation;
      const previous = current.current;
      setState({
        ...previous,
        liked,
        count: Math.max(0, previous.count + (liked ? 1 : -1)),
        pending: true,
        error: null,
      });
      try {
        const result = await client.setLiked(liked);
        if (active) setState({ ...result, pending: false, error: null });
      } catch {
        if (active) setState({ ...previous, pending: false, error: "write" });
      } finally {
        writing = false;
      }
    }
    actions.current = { refresh, vote };
    refresh();
    const resume = () => {
      const bounds = root.current?.getBoundingClientRect();
      if (
        bounds &&
        bounds.bottom > 0 &&
        bounds.top < window.innerHeight &&
        !document.hidden
      )
        refresh();
    };
    window.addEventListener("focus", resume);
    document.addEventListener("visibilitychange", resume);
    const interval = setInterval(resume, 45000);
    return () => {
      active = false;
      ++generation;
      clearInterval(interval);
      window.removeEventListener("focus", resume);
      document.removeEventListener("visibilitychange", resume);
      actions.current = {};
    };
  }, []);
  const message = state.pending
    ? "Saving your like…"
    : state.error === "write"
      ? "Your like wasn’t saved. Try again."
      : state.error
        ? "Likes are unavailable right now."
        : state.count === null
          ? "Loading likes…"
          : state.liked
            ? "Thanks for the love."
            : "Leave a little appreciation.";
  if (!configured) return null;
  return (
    <section
      id="portfolio-likes"
      ref={root}
      className="site-likes wrap enhanced"
      aria-labelledby="site-likes-title"
    >
      <div>
        <h2 id="site-likes-title">Like what you saw?</h2>
        <p className="site-likes-message" aria-live="polite">
          {message}
        </p>
        {state.error && (
          <button
            className="site-likes-retry"
            onClick={() => actions.current.refresh?.()}
          >
            Retry likes
          </button>
        )}
      </div>
      <PulseHeart
        liked={state.liked}
        count={state.count ?? 0}
        showCount={state.count !== null}
        onChange={(liked) => actions.current.vote?.(liked)}
        disabled={state.pending || state.count === null}
        label="Like this portfolio"
        size={40}
        likedColor="var(--p-accent)"
        idleColor="var(--p-muted)"
        pillColor="var(--p-surface)"
        textColor="var(--p-text)"
      />
    </section>
  );
}
