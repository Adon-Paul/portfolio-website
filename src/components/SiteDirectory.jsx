import { useEffect, useRef, useState } from "react";
import "./SiteDirectory.css";
export default function SiteDirectory() {
  const root = useRef(null),
    search = useRef(null);
  const [open, setOpen] = useState(false),
    [catalog, setCatalog] = useState(null),
    [Menu, setMenu] = useState(null),
    [query, setQuery] = useState(""),
    [failed, setFailed] = useState(false);
  const close = (focus = false) => {
    if (root.current) {
      root.current.open = false;
      if (focus) root.current.querySelector("summary").focus();
    }
  };
  useEffect(() => {
    if (!open) return undefined;
    const controller = new AbortController();
    if (!catalog || !Menu) {
      setFailed(false);
      Promise.all([
        fetch("/site-directory.json", { signal: controller.signal }).then(
          (r) => {
            if (!r.ok) throw Error();
            return r.json();
          },
        ),
        import("./BranchedMenu"),
      ])
        .then(([data, module]) => {
          if (!controller.signal.aborted) {
            setCatalog(data);
            setMenu(() => module.default);
          }
        })
        .catch(() => {
          if (!controller.signal.aborted) setFailed(true);
        });
    }
    search.current?.focus();
    const outside = (e) => {
      if (!root.current?.contains(e.target)) close();
    };
    const escape = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close(true);
      }
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      controller.abort();
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [open, catalog, Menu]);
  const term = query.trim().toLowerCase();
  const items = catalog
    ?.map((group) => ({
      ...group,
      children: group.label.toLowerCase().includes(term)
        ? group.children
        : group.children.filter(
            (item) =>
              item.label.toLowerCase().includes(term) ||
              item.value.toLowerCase().includes(term),
          ),
    }))
    .filter((group) => group.children.length);
  const total = items?.reduce((n, group) => n + group.children.length, 0) || 0;
  const current =
    typeof location === "undefined"
      ? "/"
      : location.pathname +
        (/^#(?:top|main)$/.test(location.hash) ? "" : location.hash);
  const selected = items?.findIndex((group) =>
    group.children.some((item) => item.value === current),
  );
  return (
    <details
      ref={root}
      className="site-directory"
      onToggle={(e) => setOpen(e.currentTarget.open)}
    >
      <summary
        role="button"
        aria-label="Site directory"
        title="All pages and sections"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <path d="M5 3v13a4 4 0 0 0 4 4h10M5 8h14M5 14h14" />
          <circle cx="19" cy="8" r="2" />
          <circle cx="19" cy="14" r="2" />
          <circle cx="19" cy="20" r="2" />
        </svg>
      </summary>
      <div
        className="site-directory__panel"
        role="region"
        aria-label="Site directory"
      >
        <div className="site-directory__top">
          <div>
            <strong>Explore the site</strong>
            <p>Every page, section and guide topic.</p>
          </div>
          <button
            type="button"
            onClick={() => close(true)}
            aria-label="Close site directory"
            className="site-directory__close enhanced"
          >
            ×
          </button>
        </div>
        <label className="site-directory__search enhanced">
          Find a page or topic
          <input
            ref={search}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pages and sections"
          />
        </label>
        <div className="site-directory__results">
          {Menu && items ? (
            <>
              <p className="site-directory__count" role="status">
                {total} {total === 1 ? "destination" : "destinations"} ·{" "}
                {items.length} {items.length === 1 ? "group" : "groups"}
              </p>
              {items.length ? (
                <Menu
                  key={`${query}|${current}`}
                  items={items}
                  defaultOpen={
                    term ? items.map((_, i) => i) : Math.max(0, selected)
                  }
                  defaultActive={current}
                  onSelect={() => close(true)}
                />
              ) : (
                <p>No matching destinations. Try another topic.</p>
              )}
            </>
          ) : (
            <p>
              {failed
                ? "The directory could not load. Use the complete index below."
                : "The complete index is also available as a page."}
            </p>
          )}
        </div>
        <a className="site-directory__full" href="/directory/">
          Open the complete site index ↗
        </a>
      </div>
    </details>
  );
}
