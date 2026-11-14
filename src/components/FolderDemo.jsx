import { useEffect, useRef, useState } from "react";
import FolderFloat from "./FolderFloat";
import "./FolderDemo.css";

const notes = [
  "Try a warmer palette",
  "Tighten the spacing",
  "Logo feels small",
  "Love the new hero",
];

export default function FolderDemo() {
  const [selected, setSelected] = useState("");
  const [spread, setSpread] = useState(180);
  const stage = useRef(null);
  useEffect(() => {
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(([entry]) => {
      setSpread(Math.min(180, Math.max(96, entry.contentRect.width / 2 - 24)));
    });
    if (stage.current) observer.observe(stage.current);
    return () => observer.disconnect();
  }, []);
  return (
    <section
      className="folder-demo wrap enhanced"
      aria-labelledby="folder-demo-title"
    >
      <div className="section-label">
        <span>ONE LAST INTERACTION</span>
        <span>PLAY A LITTLE</span>
      </div>
      <h2 id="folder-demo-title">A few floating thoughts.</h2>
      <p className="folder-demo-intro">
        A design-feedback demo. Open the folder, pick a note, or drag one
        around.
      </p>
      <div className="folder-demo-stage" ref={stage}>
        <FolderFloat
          items={notes}
          label="Design feedback"
          sublabel="4 notes"
          spread={spread}
          trigger="hover"
          closeOnSelect
          physics
          drift={0.5}
          onSelect={setSelected}
          folderColor="var(--p-accent)"
          frontColor="var(--p-surface)"
          paperColor="var(--p-paper)"
          itemColor="var(--p-paper)"
          itemTextColor="var(--p-ink-warm)"
          labelColor="var(--p-text)"
        />
      </div>
      <p className="folder-demo-selection" aria-live="polite">
        {selected
          ? `Selected: ${selected}`
          : "Demo only — selections stay on this page."}
      </p>
    </section>
  );
}
