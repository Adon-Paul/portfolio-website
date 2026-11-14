import { useEffect, useRef, useState } from "react";
import Folder from "./Folder";
import { guides, guidePath } from "../content/guides";
import { originalPalette } from "../content/palette";
import "./GuideFolders.css";

const collections = [
  {
    id: "linux-foundations",
    label: "Linux foundations",
    slugs: ["linux-filesystem", "linux-permissions", "linux-pipelines"],
  },
  {
    id: "linux-systems",
    label: "Linux systems",
    slugs: ["linux-processes", "linux-networking", "linux-logs-cron"],
  },
  {
    id: "bandit",
    label: "Bandit lessons",
    slugs: ["bandit-files", "bandit-text", "bandit-formats-and-access"],
  },
  {
    id: "references",
    label: "Labs & references",
    slugs: ["sakura", "nmap", "osint-workflow"],
  },
].map((collection) => ({
  ...collection,
  guides: collection.slugs.map((slug) =>
    guides.find((guide) => guide.slug === slug),
  ),
}));

const paperTitles = {
  "linux-filesystem": "Filesystem",
  "linux-permissions": "Permissions",
  "linux-pipelines": "Pipelines",
  "linux-processes": "Processes",
  "linux-networking": "Networking",
  "linux-logs-cron": "Logs & cron",
  "bandit-files": "Files & search",
  "bandit-text": "Text & encodings",
  "bandit-formats-and-access": "Keys & services",
  sakura: "Sakura",
  nmap: "Nmap",
  "osint-workflow": "OSINT workflow",
};

function initialMotion() {
  if (typeof window === "undefined") return false;
  const allowed =
    !window.matchMedia?.("(prefers-reduced-motion: reduce)").matches &&
    !document.hidden;
  try {
    return allowed && sessionStorage.getItem("portfolio-motion") !== "paused";
  } catch {
    return allowed;
  }
}

function GuideCollection({ collection, palette, motion }) {
  const [expanded, setExpanded] = useState(false);
  const [presentation, setPresentation] = useState({
    size: 1,
    layout: "stack",
  });
  const [selected, setSelected] = useState(null);
  const root = useRef(null);
  const visual = useRef(null);
  const titleId = `guide-folder-${collection.id}-title`;
  const listId = `guide-folder-${collection.id}-links`;
  const items = collection.guides.map((guide) => ({
    title: guide.title,
    content: (
      <div className="guide-paper">
        <span className="guide-paper-eyebrow" aria-hidden="true">
          FIELD GUIDE
        </span>
        <strong className="guide-paper-title">{paperTitles[guide.slug]}</strong>
        <span className="guide-paper-category" aria-hidden="true">
          {guide.category}
        </span>
        <span className="guide-paper-action" aria-hidden="true">
          Open preview
        </span>
      </div>
    ),
  }));
  useEffect(() => {
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width;
      const stacked = width < 440;
      setPresentation({
        size: Math.min(
          stacked ? 1.05 : 1.25,
          Math.max(0.8, (width - 24) / (stacked ? 224 : 390)),
        ),
        layout: stacked ? "stack" : "spread",
      });
    });
    if (visual.current) observer.observe(visual.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!expanded) return;
    const escape = (event) => {
      if (
        event.key === "Escape" &&
        root.current?.contains(document.activeElement)
      ) {
        setExpanded(false);
        setSelected(null);
        root.current.querySelector(".folder-toggle")?.focus();
      }
    };
    document.addEventListener("keydown", escape);
    return () => document.removeEventListener("keydown", escape);
  }, [expanded]);
  return (
    <article
      ref={root}
      className="guide-folder-collection"
      aria-labelledby={titleId}
    >
      <h4 id={titleId}>{collection.label}</h4>
      <p className="guide-folder-count">
        {collection.guides.length} published guides
      </p>
      <div ref={visual} className="guide-folder-visual enhanced">
        <Folder
          label={collection.label}
          items={items}
          open={expanded}
          onOpenChange={(next) => {
            setExpanded(next);
            if (!next) setSelected(null);
          }}
          onItemClick={(_, index) => setSelected(collection.guides[index])}
          mode="flap"
          variant="solid"
          layout={presentation.layout}
          openOn="click"
          size={presentation.size}
          color={palette.accent}
          paperColor={palette.paper}
          controlsId={`${listId}-papers`}
          draggable
          zoomOnClick
          peek
          tilt={0.5}
          intro
          closeOnOutsideClick={false}
          motion={motion}
        />
      </div>
      {selected && (
        <div className="guide-folder-selection" aria-live="polite">
          <strong>{selected.title}</strong>
          <p>{selected.description}</p>
          <a
            href={guidePath(selected)}
            aria-label={`Read guide: ${selected.title}`}
          >
            Read guide <span aria-hidden="true">↗</span>
          </a>
        </div>
      )}
      <details>
        <summary>All {collection.guides.length} guides in this folder</summary>
        <ul className="guide-folder-links" id={listId}>
          {collection.guides.map((guide) => (
            <li key={guide.slug}>
              <a href={guidePath(guide)}>
                {guide.title}
                <span aria-hidden="true">↗</span>
              </a>
            </li>
          ))}
        </ul>
      </details>
    </article>
  );
}

export default function GuideFolders() {
  const [palette, setPalette] = useState(originalPalette);
  const [motion, setMotion] = useState(initialMotion);
  const root = useRef(null);
  useEffect(() => {
    const readColors = () => {
      const css = getComputedStyle(document.documentElement);
      setPalette({
        accent:
          css.getPropertyValue("--p-accent").trim() || originalPalette.accent,
        paper:
          css.getPropertyValue("--p-paper").trim() || originalPalette.paper,
      });
    };
    const colors = new MutationObserver(readColors);
    colors.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["style"],
    });
    readColors();
    const frame = root.current?.closest("[data-motion]");
    const readMotion = () => setMotion(frame?.dataset.motion === "running");
    const observer = new MutationObserver(readMotion);
    if (frame)
      observer.observe(frame, {
        attributes: true,
        attributeFilter: ["data-motion"],
      });
    queueMicrotask(readMotion);
    return () => {
      colors.disconnect();
      observer.disconnect();
    };
  }, []);
  return (
    <div id="guide-folders" ref={root} className="guide-folders">
      <p className="eyebrow">OPEN A FOLDER / KEEP EXPLORING</p>
      <p className="guide-folders-intro">
        Open a folder. Pull out a paper, click to bring it closer, then follow
        the guide. Every folder holds three connected notes.
      </p>
      <div className="guide-folders-grid">
        {collections.map((collection) => (
          <GuideCollection
            key={collection.id}
            collection={collection}
            palette={palette}
            motion={motion}
          />
        ))}
      </div>
    </div>
  );
}
