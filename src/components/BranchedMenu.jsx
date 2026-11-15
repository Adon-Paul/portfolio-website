// React Bits BranchedMenu — David Haz. Original branch geometry, folding and line travel.
// License: docs/licenses/react-bits-TechText-LICENSE.txt
// Uses native navigation links; this text-only directory needs no icon dependency.
import { useLayoutEffect, useRef, useState } from "react";
import "./BranchedMenu.css";
const PAD = 6,
  MARK = 16;
export default function BranchedMenu({
  items,
  defaultOpen = 0,
  defaultActive = "",
  onSelect,
  rowHeight: minimumRowHeight = 32,
  indent = 28,
  trunk = 4,
  radius = 10,
  lineWidth = 1.5,
  drawDuration = 400,
  foldDuration = 300,
}) {
  const [open, setOpen] = useState(
    () =>
      new Set(
        Array.isArray(defaultOpen)
          ? defaultOpen
          : defaultOpen >= 0
            ? [defaultOpen]
            : [],
      ),
  );
  const [touch, setTouch] = useState(false);
  const [active, setActive] = useState(defaultActive);
  const navRef = useRef(null),
    heads = useRef([]),
    markerRef = useRef(null);
  const activeSection = items.findIndex((it) =>
    it.children.some((kid) => kid.value === active),
  );
  const shown = activeSection >= 0 && open.has(activeSection);
  useLayoutEffect(() => {
    const place = (glide) => {
      const marker = markerRef.current,
        head = heads.current[activeSection];
      if (!marker) return;
      if (!glide) marker.style.transition = "none";
      if (shown && head)
        marker.style.top = `${head.offsetTop + (head.offsetHeight - MARK) / 2}px`;
      marker.toggleAttribute("data-on", Boolean(shown && head));
      if (!glide) {
        void marker.offsetHeight;
        marker.style.transition = "";
      }
    };
    place(true);
    const observer = new ResizeObserver(() => {
      setTouch(window.matchMedia("(pointer: coarse)").matches);
      place(false);
    });
    observer.observe(navRef.current);
    return () => observer.disconnect();
  }, [activeSection, shown, items]);
  const handleKey = (event) => {
    const controls = [...navRef.current.querySelectorAll("button, a")].filter(
      (el) => !el.closest("[inert]"),
    );
    const index = controls.indexOf(event.target);
    if (index < 0) return;
    const section = event.target.closest(".branched-menu__section");
    const group = section
      ? [...navRef.current.querySelectorAll(".branched-menu__section")].indexOf(
          section,
        )
      : -1;
    let target;
    if (event.key === "ArrowDown")
      target = controls[Math.min(index + 1, controls.length - 1)];
    if (event.key === "ArrowUp") target = controls[Math.max(0, index - 1)];
    if (event.key === "Home") target = controls[0];
    if (event.key === "End") target = controls.at(-1);
    if (group >= 0 && event.key === "ArrowRight") {
      setOpen((prev) => new Set([...prev, group]));
      target = section.querySelector("a");
    }
    if (group >= 0 && event.key === "ArrowLeft") {
      setOpen((prev) => {
        const next = new Set(prev);
        next.delete(group);
        return next;
      });
      target = heads.current[group];
    }
    if (target) {
      event.preventDefault();
      requestAnimationFrame(() => target.focus());
    }
  };
  return (
    <nav
      ref={navRef}
      className="branched-menu"
      aria-label="All pages and locations"

      style={{
        "--bm-row": `${minimumRowHeight}px`,
        "--bm-indent": `${indent}px`,
        "--bm-line-w": lineWidth,
        "--bm-draw": `${drawDuration}ms`,
        "--bm-fold": `${foldDuration}ms`,
      }}
    >
      <button
        className="branched-menu__collapse"
        type="button"
        onClick={() => setOpen(new Set())}
      >
        Collapse all
      </button>
      <span
        ref={markerRef}
        className="branched-menu__marker"
        aria-hidden="true"
      />
      {items.map((item, i) => {
        const rowHeight = touch ? 44 : minimumRowHeight;
        const r = Math.min(radius, rowHeight / 2 - 2),
          endX = indent - 8;
        const rowY = (k) => PAD + k * rowHeight + rowHeight / 2;
        const branch = (k) =>
          `M ${trunk} ${rowY(k) - r} A ${r} ${r} 0 0 0 ${trunk + r} ${rowY(k)} H ${endX}`;
        const reach = (k) =>
          `M ${trunk} 0 V ${rowY(k) - r} A ${r} ${r} 0 0 0 ${trunk + r} ${rowY(k)} H ${endX}`;
        const length = (k) =>
          rowY(k) - r + (Math.PI * r) / 2 + endX - trunk - r;
        return (
          <div
            key={item.label}
            style={{ "--bm-row": `${rowHeight}px` }}
            className="branched-menu__section"
            data-open={open.has(i) ? "" : undefined}
          >
            <button
              ref={(el) => {
                heads.current[i] = el;
              }}
              type="button"
              className="branched-menu__head"
              onKeyDown={handleKey}
              aria-expanded={open.has(i)}
              onClick={() =>
                setOpen((prev) => {
                  const next = new Set(prev);
                  if (next.has(i)) next.delete(i);
                  else next.add(i);
                  return next;
                })
              }
            >
              <span aria-hidden="true" className="branched-menu__chevron">
                ›
              </span>
              {item.label}
            </button>
            <div
              className="branched-menu__body"
              inert={open.has(i) ? undefined : ""}
            >
              <div className="branched-menu__fold">
                <div
                  className="branched-menu__tree"
                  style={{ height: PAD * 2 + item.children.length * rowHeight }}
                >
                  <svg
                    className="branched-menu__lines"
                    width={indent}
                    height={PAD * 2 + item.children.length * rowHeight}
                    aria-hidden="true"
                  >
                    <path
                      className="branched-menu__base"
                      d={`M ${trunk} 0 V ${rowY(item.children.length - 1) - r}`}
                    />
                    {item.children.map((kid, k) => (
                      <path
                        key={kid.value}
                        className="branched-menu__base"
                        d={branch(k)}
                      />
                    ))}
                    {item.children.map((kid, k) => (
                      <path
                        key={kid.value}
                        className="branched-menu__reach"
                        d={reach(k)}
                        style={{
                          strokeDasharray: length(k),
                          strokeDashoffset:
                            kid.value === active ? 0 : length(k),
                        }}
                      />
                    ))}
                  </svg>
                  {item.children.map((kid) => (
                    <a
                      key={kid.value}
                      onKeyDown={handleKey}
                      href={kid.value}
                      title={kid.label}
                      className="branched-menu__item"
                      aria-current={
                        kid.value === active ? "location" : undefined
                      }
                      data-active={kid.value === active ? "" : undefined}
                      tabIndex={open.has(i) ? 0 : -1}
                      onClick={(event) => {
                        if (
                          !event.metaKey &&
                          !event.ctrlKey &&
                          !event.shiftKey &&
                          event.button === 0
                        ) {
                          setActive(kid.value);
                          onSelect?.();
                        }
                      }}
                    >
                      <span className="branched-menu__label">{kid.label}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </nav>
  );
}
