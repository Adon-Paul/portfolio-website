// React Bits Folder — David Haz. License: docs/licenses/react-bits-TechText-LICENSE.txt
"use client";

import {
  Children,
  isValidElement,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import "./Folder.css";

const TAU = Math.PI * 2;
const STEP = 1 / 240;
const MAX_ITEMS = 6;
const DEFAULT_ITEMS = [
  { title: "Brand guidelines" },
  { title: "Launch plan" },
  { title: "Moodboard" },
];

const PILE_TURN = [0.5, -1.1, 1.5, -0.7, 1.2, -1.6];
const BOOK_REST = [
  { x: 0.14, y: -0.004, r: 1.4 },
  { x: 0.115, y: 0.008, r: -1.1 },
  { x: 0.09, y: 0, r: 0.6 },
];
const BOOK_PEEK = [
  { x: 0.27, y: -0.016, r: 4.5 },
  { x: 0.2, y: 0.014, r: 1.2 },
  { x: 0.14, y: 0, r: -1.2 },
];
const FLAP_REST = [
  { x: 0.16, rise: 0, r: 3 },
  { x: -0.17, rise: 0.05, r: -3.5 },
  { x: 0, rise: 0.1, r: 0.5 },
  { x: 0.25, rise: 0.08, r: 5 },
  { x: -0.25, rise: 0.09, r: -5.5 },
  { x: 0.08, rise: 0.12, r: 1.5 },
];
const SPREAD_TURN = [4, -5, 3, -6, 5, -3];
const SPREAD_DROP = [0.03, -0.04, 0.05, -0.02, 0.04, -0.05];
const DROP_TURN = [-6, 4, -3, 7, -5, 3];
const BOOK_ANGLES = { open: -180, receive: -24, peek: -13, rest: 0 };
const FLAP_ANGLES = { open: -64, receive: -30, peek: -15, rest: 0 };
const LAYERS = { out: 50, drag: 80, focus: 90 };

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const parseColor = (() => {
  let context = null;
  const cache = new Map();
  return (value) => {
    const key = String(value);
    if (cache.has(key)) return cache.get(key);
    if (/^#(?:[0-9a-f]{6}|[0-9a-f]{8})$/i.test(key)) {
      const rgb = [1, 3, 5].map((start) =>
        parseInt(key.slice(start, start + 2), 16),
      );
      cache.set(key, rgb);
      return rgb;
    }
    let rgb = [61, 139, 255];
    if (typeof document !== "undefined") {
      context ??= document
        .createElement("canvas")
        .getContext("2d", { willReadFrequently: true });
      if (context) {
        context.clearRect(0, 0, 1, 1);
        context.fillStyle = "#3d8bff";
        context.fillStyle = key;
        context.fillRect(0, 0, 1, 1);
        rgb = Array.from(context.getImageData(0, 0, 1, 1).data.slice(0, 3));
      }
    }
    cache.set(key, rgb);
    return rgb;
  };
})();

const mixRgb = (rgb, target, amount) =>
  rgb.map((channel, i) => Math.round(channel + (target[i] - channel) * amount));
const rgbString = (rgb) => `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
const luma = (rgb) =>
  (0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]) / 255;

const multiply = (a, b) => {
  const out = new Array(16);
  for (let col = 0; col < 4; col++) {
    for (let row = 0; row < 4; row++) {
      out[col * 4 + row] =
        a[row] * b[col * 4] +
        a[4 + row] * b[col * 4 + 1] +
        a[8 + row] * b[col * 4 + 2] +
        a[12 + row] * b[col * 4 + 3];
    }
  }
  return out;
};

const chain = (...list) => list.reduce(multiply);
const move = (x, y, z = 0) => [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1];
const stretch = (x, y) => [x, 0, 0, 0, 0, y, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

const turnX = (degrees) => {
  const r = (degrees * Math.PI) / 180;
  const c = Math.cos(r);
  const s = Math.sin(r);
  return [1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1];
};

const turnY = (degrees) => {
  const r = (degrees * Math.PI) / 180;
  const c = Math.cos(r);
  const s = Math.sin(r);
  return [c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1];
};

const turnZ = (degrees) => {
  const r = (degrees * Math.PI) / 180;
  const c = Math.cos(r);
  const s = Math.sin(r);
  return [c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
};

const toCss = (m) =>
  `matrix3d(${m.map((v) => (Math.abs(v) < 1e-7 ? 0 : Number(v.toFixed(6)))).join(", ")})`;

const measureFolder = (book, scale, labelWidth, hasLabel, tabPosition) => {
  const w = (book ? 180 : 224) * scale;
  const h = (book ? 232 : 176) * scale;
  const tabH = 20 * scale;
  const r = 12 * scale;
  const shoulder = tabH * 0.75;
  const frontTop = book ? tabH : tabH + h * 0.3;
  const corners = book ? [0, r, r, 0] : [r, r, r, r];
  const maxTab = w - corners[0] - corners[1] - shoulder * 2 - 10 * scale;
  const tabW = clamp(
    hasLabel ? labelWidth + 14 * scale + shoulder : w * 0.34,
    Math.min(w * 0.3, maxTab),
    maxTab,
  );
  const tabX =
    tabPosition === "left"
      ? corners[0] + 5 * scale + shoulder
      : tabPosition === "center"
        ? (w - tabW) / 2
        : w - corners[1] - 5 * scale - shoulder - tabW;
  const docW = book ? w * 0.8 : w * 0.54;
  return {
    book,
    scale,
    w,
    h,
    tabH,
    r,
    shoulder,
    corners,
    tabW,
    tabX,
    frontTop,
    frontH: tabH + h - frontTop,
    docW,
    docH: docW * (book ? 1.28 : 1.22),
  };
};

const backPath = (g) => {
  const { w, h, tabX, tabW, tabH, shoulder } = g;
  const [tl, tr, br, bl] = g.corners;
  const top = tabH;
  const bottom = tabH + h;
  return [
    `M 0 ${top + tl}`,
    `Q 0 ${top} ${tl} ${top}`,
    `L ${tabX - shoulder} ${top}`,
    `C ${tabX} ${top} ${tabX} 0 ${tabX + shoulder} 0`,
    `L ${tabX + tabW - shoulder} 0`,
    `C ${tabX + tabW} 0 ${tabX + tabW} ${top} ${tabX + tabW + shoulder} ${top}`,
    `L ${w - tr} ${top}`,
    `Q ${w} ${top} ${w} ${top + tr}`,
    `L ${w} ${bottom - br}`,
    `Q ${w} ${bottom} ${w - br} ${bottom}`,
    `L ${bl} ${bottom}`,
    `Q 0 ${bottom} 0 ${bottom - bl}`,
    "Z",
  ].join(" ");
};

// The portfolio uses CSS-rendered solid folders. Other materials retain
// the upstream CSS fallback; no unused WebGL compositor is shipped.

const DocumentCard = ({ title, description }) => (
  <div className="folder-doc">
    {title ? (
      <span className="folder-doc-title">{title}</span>
    ) : (
      <span className="folder-doc-heading" />
    )}
    {description && <span className="folder-doc-text">{description}</span>}
    <span className="folder-doc-line" style={{ width: "92%" }} />
    <span className="folder-doc-line" style={{ width: "84%" }} />
    <span className="folder-doc-line" style={{ width: "88%" }} />
    <span className="folder-doc-block" />
    <span className="folder-doc-line" style={{ width: "80%" }} />
    <span className="folder-doc-line" style={{ width: "62%" }} />
  </div>
);

const renderItem = (item) => {
  if (isValidElement(item)) return item;
  if (typeof item === "string" || typeof item === "number")
    return <DocumentCard title={String(item)} />;
  if (item && typeof item === "object") {
    if (item.image) {
      return (
        <div className="folder-photo">
          <img
            src={item.image}
            alt={item.alt ?? item.title ?? ""}
            draggable={false}
          />
        </div>
      );
    }
    if (item.content) return item.content;
    return <DocumentCard title={item.title} description={item.description} />;
  }
  return <DocumentCard />;
};

const placeBook = (rank, count, phase, layout, g) => {
  const pileX = g.w / 2;
  const pileY = g.frontTop + g.frontH / 2;
  if (phase === "open") {
    if (layout === "row") {
      const gap = 10 * g.scale;
      const fit = Math.min(
        0.8,
        (g.w * 1.86 - gap * (count - 1)) / (count * g.docW),
      );
      const step = g.docW * fit + gap;
      return {
        x: g.w / 2 + (rank - (count - 1) / 2) * step,
        y: pileY,
        z: 0,
        r: 0,
        ry: 0,
        s: fit,
      };
    }
    if (layout === "stack") {
      const fit = 0.74;
      const strip = Math.min(
        26 * g.scale,
        (g.h * 0.36) / Math.max(1, count - 1),
      );
      const top = g.frontTop + 14 * g.scale + (count - 1) * strip;
      return {
        x: g.w,
        y: top + (g.docH * fit) / 2 - rank * strip,
        z: 0,
        r: 0,
        ry: 0,
        s: fit,
      };
    }
    const fit = count > 4 ? 0.58 : count > 3 ? 0.64 : 0.72;
    const span =
      count === 2 ? g.w : Math.min(g.w * 1.3, g.w * 0.6 * (count - 1));
    const x = count > 1 ? span / 2 - (rank * span) / (count - 1) : g.w * 0.5;
    return {
      x: g.w / 2 + x,
      y: pileY + SPREAD_DROP[rank] * g.h,
      z: 0,
      r: SPREAD_TURN[rank],
      ry: 0,
      s: fit,
    };
  }
  const offsets = phase === "rest" ? BOOK_REST : BOOK_PEEK;
  const offset = offsets[rank] ?? { x: 0.06, y: 0, r: PILE_TURN[rank] ?? 0 };
  return {
    x: pileX + offset.x * g.w,
    y: pileY + offset.y * g.h + rank * 0.8 * g.scale,
    z: 0,
    r: offset.r,
    ry: 0,
    s: 1,
  };
};

const placeFlap = (rank, count, phase, layout, g, pointer) => {
  const rest = FLAP_REST[rank] ?? FLAP_REST[FLAP_REST.length - 1];
  const floor = g.tabH + g.h - 5 * g.scale - g.docH / 2;
  const mid = (count - 1) / 2;
  if (phase === "open") {
    const lift = g.tabH - g.h * 0.02;
    if (layout === "stack") {
      const strip = Math.min(
        30 * g.scale,
        (g.h * 0.62) / Math.max(1, count - 1),
      );
      const fit = 1.04 - rank * 0.05;
      return {
        x: g.w / 2,
        y: g.tabH + g.h * 0.1 - rank * strip - (g.docH * (1.04 - fit)) / 2,
        z: -rank * 18 * g.scale,
        r: 0,
        ry: 0,
        s: fit,
      };
    }
    const gap = 12 * g.scale;
    const fit = Math.min(
      0.94,
      (g.w * 2.3 - gap * (count - 1)) / (count * g.docW),
    );
    const step = g.docW * fit + gap;
    const tidy = layout === "row";
    return {
      x: g.w / 2 + (rank - mid) * step,
      y: lift + (tidy ? 0 : SPREAD_DROP[rank] * g.h * 0.7),
      z: 0,
      r: tidy ? 0 : SPREAD_TURN[rank] * 0.55,
      ry: 0,
      s: fit,
    };
  }
  const part = phase === "receive" ? 1.7 : phase === "peek" ? 1.3 : 1;
  const x = g.w / 2 + rest.x * g.w * part;
  if (phase === "rest")
    return { x, y: floor - rest.rise * g.h, z: 0, r: rest.r, ry: 0, s: 1 };
  const near =
    phase === "peek" && pointer != null
      ? Math.max(0, 1 - Math.abs(pointer - x) / (g.w * 0.32))
      : 0;
  const rise = rest.rise + (phase === "receive" ? 0.03 : 0.1);
  return {
    x,
    y: floor - rise * g.h - near * near * g.h * 0.09,
    z: 0,
    r: rest.r * 1.6,
    ry: 0,
    s: 1,
  };
};

const Folder = ({
  items,
  label,
  motion = true,
  controlsId,
  mode = "flap",
  variant = "solid",
  color = "#3d8bff",
  paperColor = "#ffffff",
  tabPosition = "right",
  layout = "spread",
  size = 1,
  openOn = "click",
  open,
  defaultOpen = false,
  onOpenChange,
  onItemClick,
  onItemDrop,
  draggable = true,
  zoomOnClick = true,
  peek = true,
  intro = true,
  tilt = 0.5,
  bounce = 0.4,
  speed = 1,
  frost = 0.25,
  closeOnOutsideClick = true,
  theme = "dark",
  className = "",
  style,
  children,
}) => {
  const rootRef = useRef(null);
  const backRef = useRef(null);
  const frontRef = useRef(null);
  const groundRef = useRef(null);
  const castRef = useRef(null);
  const shadeRef = useRef(null);
  const itemRefs = useRef([]);
  const measureRef = useRef(null);
  const engineRef = useRef(null);
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const [labelWidth, setLabelWidth] = useState(0);
  const [outside, setOutside] = useState([]);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? Boolean(open) : internalOpen;
  const book = mode === "book";

  const entries = useMemo(() => {
    const custom = Children.toArray(children).filter(isValidElement);
    const source = custom.length
      ? custom
      : items?.length
        ? items
        : DEFAULT_ITEMS;
    return source.slice(0, MAX_ITEMS);
  }, [children, items]);
  const count = entries.length;

  const scale = Math.max(0.3, Number(size) || 1);
  const g = measureFolder(book, scale, labelWidth, Boolean(label), tabPosition);
  const total = g.tabH + g.h;
  const view = book
    ? {
        x: -0.75 * g.w,
        y: -0.25 * total,
        width: 2.5 * g.w,
        height: 1.5 * total,
      }
    : {
        x: -0.25 * g.w,
        y: -0.1 * total,
        width: 1.5 * g.w,
        height: 1.3 * total,
      };

  useIsomorphicLayoutEffect(() => {
    const node = measureRef.current;
    if (!node) return undefined;
    let active = true;
    const measure = () => {
      if (active) setLabelWidth(node.offsetWidth);
    };
    measure();
    document.fonts?.ready.then(measure);
    return () => {
      active = false;
    };
  }, [label, scale]);

  const setOpen = useCallback(
    (next) => {
      const value = typeof next === "function" ? next(isOpen) : next;
      if (!isControlled) setInternalOpen(value);
      if (value !== isOpen) onOpenChange?.(value);
    },
    [isControlled, isOpen, onOpenChange],
  );

  const setOpenRef = useRef(setOpen);
  setOpenRef.current = setOpen;

  const rgb = parseColor(color);
  const paper = parseColor(paperColor);
  const backTone = mixRgb(rgb, [0, 0, 0], 0.16);
  const insideTop = rgbString(mixRgb(rgb, [0, 0, 0], 0.08));
  const insideBottom = rgbString(backTone);

  const settingsRef = useRef(null);
  settingsRef.current = {
    open: isOpen,
    motion,
    layout,
    openOn,
    peek,
    intro,
    draggable,
    zoomOnClick,
    closeOnOutsideClick,
    onItemClick,
    onItemDrop,
    tilt: clamp(tilt, 0, 1.5),
    bounce: clamp(bounce, 0, 1),
    speed: clamp(speed, 0.2, 3),
    frost: clamp(frost, 0, 1),
    count,
    entries,
    light: theme === "light",
    tint: rgb,
    insideTop,
    insideBottom,
    insideTone: [
      mixRgb(rgb, [0, 0, 0], 0.08).map((v) => v / 255),
      backTone.map((v) => v / 255),
    ],
    content: `${mode}|${scale}|${paperColor}|${color}|${g.tabX}|${g.tabW}`,
    depth: Math.round(Math.max(g.w, g.h) * 5),
    view,
    g,
  };

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const preference = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    let reduce = Boolean(preference?.matches || !settingsRef.current.motion);
    let active = true;
    let inView = typeof IntersectionObserver === "undefined";

    const spring = (value) => ({ value, velocity: 0 });
    const state = {
      raf: 0,
      last: 0,
      ready: false,
      hovered: false,
      pressed: false,
      pointerX: 0,
      pointerY: 0,
      deskX: 0,
      deskY: 0,
      hoveredItem: -1,
      phase: "rest",
      previous: "rest",
      changedAt: 0,
      front: spring(0),
      rx: spring(0),
      ry: spring(0),
      lift: spring(0),
      squash: spring(1),
      items: [],
      focus: -1,
      drag: null,
      receiving: false,
      receiveUntil: 0,
      suppressClick: false,
      dropCount: 0,
      intro: { phase: "done", start: 0, opening: false },
      anchor: spring(0),
      appear: 1,
      content: { key: "", entries: null, renderer: null },
    };

    const ensureItems = (n) => {
      while (state.items.length < n) {
        state.items.push({
          x: spring(0),
          y: spring(0),
          z: spring(0),
          r: spring(0),
          ry: spring(0),
          s: spring(1),
          hover: spring(0),
          mx: spring(0),
          my: spring(0),
          alpha: spring(1),
          place: "inside",
          rank: 0,
          layer: "inside",
          elevated: false,
          insertUntil: 0,
          insertFrom: null,
          outX: 0,
          outY: 0,
          outR: 0,
          outS: 1,
          outOrder: 0,
          localX: 0,
          localY: 0,
          fresh: true,
        });
      }
      if (state.items.length > n) {
        state.items.length = n;
        if (state.focus >= n) state.focus = -1;
        syncOutside();
      }
    };

    const syncOutside = () => {
      const list = [];
      state.items.forEach((item, index) => {
        if (item.place === "out") list.push(index);
      });
      setOutside((previous) =>
        previous.length === list.length &&
        previous.every((value, i) => value === list[i])
          ? previous
          : list,
      );
    };

    const integrate = (item, target, omega, zeta, dt) => {
      if (reduce) {
        item.value = target;
        item.velocity = 0;
        return false;
      }
      const k = omega * omega;
      const d = 2 * zeta * omega;
      const steps = Math.max(1, Math.ceil(dt / STEP));
      const step = dt / steps;
      for (let i = 0; i < steps; i++) {
        item.velocity += (k * (target - item.value) - d * item.velocity) * step;
        item.value += item.velocity * step;
      }
      return (
        Math.abs(target - item.value) > 0.01 || Math.abs(item.velocity) > 0.01
      );
    };

    const snap = (item, value) => {
      item.value = value;
      item.velocity = 0;
    };

    const shiftOf = () => {
      const { g: geometry } = settingsRef.current;
      return geometry.book
        ? (geometry.w / 2) * clamp(-state.front.value / 180, 0, 1)
        : 0;
    };

    const toDesk = (clientX, clientY) => {
      const box = root.getBoundingClientRect();
      const kx = root.offsetWidth / (box.width || 1);
      const ky = root.offsetHeight / (box.height || 1);
      return [(clientX - box.left) * kx, (clientY - box.top) * ky];
    };

    const clipBounds = () => {
      const box = root.getBoundingClientRect();
      let left = 0;
      let top = 0;
      let right = window.innerWidth;
      let bottom = window.innerHeight;
      for (
        let node = root.parentElement;
        node && node !== document.body;
        node = node.parentElement
      ) {
        const computed = getComputedStyle(node);
        if (
          /(hidden|clip|auto|scroll)/.test(
            `${computed.overflowX} ${computed.overflowY}`,
          )
        ) {
          const rect = node.getBoundingClientRect();
          left = Math.max(left, rect.left);
          top = Math.max(top, rect.top);
          right = Math.min(right, rect.right);
          bottom = Math.min(bottom, rect.bottom);
          break;
        }
      }
      const kx = root.offsetWidth / (box.width || 1);
      const ky = root.offsetHeight / (box.height || 1);
      return {
        left: (left - box.left) * kx,
        top: (top - box.top) * ky,
        right: (right - box.left) * kx,
        bottom: (bottom - box.top) * ky,
      };
    };

    const overFolder = (x, y) => {
      const { g: geometry } = settingsRef.current;
      const shift = shiftOf();
      if (geometry.book) {
        const left = state.front.value < -90 ? shift - geometry.w : shift;
        return (
          x >= left &&
          x <= shift + geometry.w &&
          y >= geometry.tabH * 0.5 &&
          y <= geometry.tabH + geometry.h
        );
      }
      return (
        x >= 0 && x <= geometry.w && y >= 0 && y <= geometry.tabH + geometry.h
      );
    };

    const inPocket = (item) => {
      const { g: geometry } = settingsRef.current;
      const halfW = (geometry.docW * item.s.value) / 2;
      const halfH = (geometry.docH * item.s.value) / 2;
      if (geometry.book) {
        if (state.front.value < -60) return false;
        const shift = shiftOf();
        return (
          item.x.value - halfW < shift + geometry.w &&
          item.x.value + halfW > shift &&
          item.y.value + halfH > geometry.tabH &&
          item.y.value - halfH < geometry.tabH + geometry.h
        );
      }
      if (state.front.value < -45) return false;
      return (
        item.y.value + halfH > geometry.frontTop + 4 * geometry.scale &&
        item.x.value + halfW > 0 &&
        item.x.value - halfW < geometry.w
      );
    };

    const velocityOf = (samples) => {
      if (samples.length < 2) return [0, 0];
      const first = samples[0];
      const last = samples[samples.length - 1];
      const span = Math.max(0.016, (last[0] - first[0]) / 1000);
      return [(last[1] - first[1]) / span, (last[2] - first[2]) / span];
    };

    const phaseOf = (s, time) => {
      if (s.open) return "open";
      if (state.receiving || time < state.receiveUntil) return "receive";
      if (s.peek && state.hovered && !state.drag?.active) return "peek";
      return "rest";
    };

    const place = (rank, inside, phase, s) => {
      if (s.g.book) return placeBook(rank, inside, phase, s.layout, s.g);
      const pointer = state.hovered ? ((state.pointerX + 1) / 2) * s.g.w : null;
      return placeFlap(rank, inside, phase, s.layout, s.g, pointer);
    };

    const approach = (item, slot, s) => {
      const { g: geometry } = s;
      if (item.insertFrom === "side") {
        return {
          ...slot,
          x: Math.max(slot.x, geometry.w + geometry.docW * 0.54 * slot.s),
        };
      }
      return {
        ...slot,
        y: Math.min(
          slot.y,
          geometry.frontTop - geometry.docH * 0.5 * slot.s - 8 * geometry.scale,
        ),
      };
    };

    const frame = (now) => {
      state.raf = 0;
      if (!active || (!inView && state.ready) || document.hidden) return;
      reduce = Boolean(preference?.matches || !settingsRef.current.motion);
      if (reduce) state.intro.phase = "done";
      const s = settingsRef.current;
      const { g: geometry } = s;
      ensureItems(s.count);
      const time = now / 1000;
      const dt = state.last
        ? Math.min(0.05, (now - state.last) / 1000)
        : 1 / 60;
      state.last = now;
      const zeta = reduce ? 1 : 1 - 0.72 * s.bounce;
      const frontOmega = TAU * (geometry.book ? 1.55 : 2) * s.speed;
      const itemOmega = TAU * 2.1 * s.speed;
      const soft = TAU * 1.6 * s.speed;
      const phase = phaseOf(s, time);
      if (phase !== state.phase) {
        state.previous = state.phase;
        state.phase = phase;
        state.changedAt = now;
      }
      const elapsed = (now - state.changedAt) / 1000;
      let busy = time < state.receiveUntil;

      const ranks = [];
      state.items.forEach((item, index) => {
        if (item.place === "inside") ranks.push(index);
      });
      const inside = ranks.length;
      ranks.forEach((index, rank) => {
        state.items[index].rank = rank;
      });
      if (
        state.focus >= 0 &&
        phase !== "open" &&
        state.items[state.focus]?.place === "inside"
      )
        state.focus = -1;

      const intro = state.intro;
      if (!state.ready) intro.opening = s.open;
      if (
        intro.phase === "run" &&
        !intro.opening &&
        (s.open || state.drag?.active)
      )
        intro.phase = "done";
      const introTime = intro.phase === "run" ? time - intro.start : 0;
      const staged = intro.phase !== "done" && !intro.opening;
      const closeAt = (0.16 + inside * 0.085 + 0.3) / s.speed;
      const holding = staged && introTime < closeAt;
      const dropAt = (rank) => (0.16 + (inside - 1 - rank) * 0.085) / s.speed;
      const introPose = (item, slot) =>
        geometry.book
          ? { ...slot, r: slot.r + (item.rank % 2 ? 7 : -6), s: slot.s * 1.12 }
          : {
              ...slot,
              y: slot.y - (geometry.h * 0.8 + geometry.docH * 0.5),
              r: slot.r + (item.rank % 2 ? 9 : -7),
            };
      if (intro.phase === "run") {
        busy = true;
        if (introTime > (intro.opening ? 1.4 : closeAt + 1) / s.speed)
          intro.phase = "done";
      }
      const appear =
        intro.phase === "wait"
          ? 0
          : intro.phase === "run"
            ? clamp(introTime / (0.34 / s.speed), 0, 1)
            : 1;
      state.appear = 1 - (1 - appear) ** 3;

      const closing = state.previous === "open" && phase !== "open";
      const frontDelay =
        closing && !reduce
          ? ((geometry.book ? 0.1 : 0.06) + 0.035 * inside) / s.speed
          : 0;
      const frontPhase = elapsed < frontDelay ? state.previous : phase;
      const frontTarget = holding
        ? geometry.book
          ? -150
          : -42
        : (geometry.book ? BOOK_ANGLES : FLAP_ANGLES)[frontPhase];

      if (!state.ready) {
        state.ready = true;
        const opening = intro.phase !== "done" && intro.opening;
        if (opening) {
          state.phase = "rest";
          state.previous = "rest";
        }
        snap(state.front, opening ? 0 : frontTarget);
        snap(state.anchor, staged ? 1 : 0);
        state.items.forEach((item) => {
          const slot = place(item.rank, inside, opening ? "rest" : phase, s);
          const target = staged ? introPose(item, slot) : slot;
          snap(item.x, target.x);
          snap(item.y, target.y);
          snap(item.z, target.z);
          snap(item.r, target.r);
          snap(item.ry, target.ry);
          snap(item.s, target.s);
          snap(item.alpha, staged ? 0 : 1);
          snap(item.hover, staged && geometry.book ? 3 : 0);
          item.fresh = false;
        });
      }

      if (intro.phase === "wait") {
        write();
        state.last = 0;
        return;
      }

      busy = integrate(state.front, frontTarget, frontOmega, zeta, dt) || busy;
      const restitution = 0.2 + 0.35 * s.bounce;
      if (geometry.book && state.front.value < -180) {
        state.front.value = -360 - state.front.value;
        state.front.velocity = -state.front.velocity * restitution;
      } else if (state.front.value > 0) {
        state.front.value = -state.front.value;
        state.front.velocity = -state.front.velocity * restitution;
      }
      if (elapsed < frontDelay) busy = true;
      busy = integrate(state.anchor, staged ? 1 : 0, frontOmega, 1, dt) || busy;

      const engaged = state.hovered && !reduce;
      busy =
        integrate(
          state.rx,
          engaged ? -state.pointerY * 8 * s.tilt : 0,
          soft,
          1,
          dt,
        ) || busy;
      busy =
        integrate(
          state.ry,
          engaged ? state.pointerX * 10 * s.tilt : 0,
          soft,
          1,
          dt,
        ) || busy;
      busy =
        integrate(
          state.lift,
          state.hovered && s.tilt > 0 && phase !== "open" ? 1 : 0,
          soft,
          1,
          dt,
        ) || busy;
      busy =
        integrate(
          state.squash,
          state.pressed ? 0.975 : 1,
          TAU * 3.2,
          0.6,
          dt,
        ) || busy;

      const opening = phase === "open" && state.previous !== "open";
      const drag = state.drag?.active ? state.drag : null;
      const hover = state.hoveredItem;
      const hovering =
        !drag && hover >= 0 && state.items[hover] ? state.items[hover] : null;
      const lead =
        hovering && hovering.place === "inside" && phase === "open"
          ? place(hovering.rank, inside, "open", s)
          : null;
      const focusScale = clamp(
        ((geometry.tabH + geometry.h) * 1.18) / geometry.docH,
        1.2,
        2.2,
      );
      const focusY = geometry.book
        ? geometry.tabH + geometry.h / 2
        : geometry.tabH + geometry.h * 0.36;

      state.items.forEach((item, index) => {
        if (item.fresh) {
          const start = place(item.rank, inside, "rest", s);
          snap(item.x, start.x);
          snap(item.y, start.y);
          snap(item.r, start.r);
          item.fresh = false;
        }
        let target;
        let omega = itemOmega;
        let damping = zeta;
        let lift = 0;
        let fade = 1;
        let magnet = false;
        if (state.focus === index) {
          target = {
            x: geometry.w / 2,
            y: focusY,
            z: 0,
            r: 0,
            ry: 0,
            s: focusScale,
          };
          lift = 2.4;
          item.layer = "focus";
        } else if (drag && drag.index === index) {
          const [vx] = velocityOf(drag.samples);
          target = {
            x: state.deskX + drag.grabX,
            y: state.deskY + drag.grabY,
            z: 0,
            r: clamp(vx * 0.012, -14, 14),
            ry: 0,
            s: drag.scale * 1.05,
          };
          omega = TAU * 5;
          damping = 0.78;
          lift = 1.4;
          if (!item.elevated && !inPocket(item)) item.elevated = true;
          item.layer = item.elevated ? "drag" : "inside";
        } else if (item.place === "out") {
          target = {
            x: item.outX,
            y: item.outY,
            z: 0,
            r: item.outR,
            ry: 0,
            s: item.outS,
          };
          lift = hover === index ? 1 : 0.15;
          magnet = hover === index;
          item.layer = "out";
        } else {
          const order = opening
            ? geometry.book
              ? inside - 1 - item.rank
              : item.rank
            : item.rank;
          const delay = reduce
            ? 0
            : opening
              ? ((geometry.book ? 0.16 : 0.05) +
                  order * (geometry.book ? 0.055 : 0.045)) /
                s.speed
              : (order * 0.03) / s.speed;
          const active = elapsed >= delay ? phase : state.previous;
          target = place(item.rank, inside, active, s);
          if (elapsed < delay) busy = true;
          if (staged && introTime < dropAt(item.rank)) {
            target = introPose(item, target);
            fade = 0;
            lift = geometry.book ? 3 : 0;
            item.layer = "inside";
          } else if (item.insertUntil > time) {
            busy = true;
            target = approach(item, target, s);
            item.layer = "drag";
            lift = 0.6;
          } else {
            item.insertUntil = 0;
            item.elevated = false;
            item.layer = "inside";
            if (lead && active === "open") {
              if (hover === index) {
                target = {
                  ...target,
                  y: target.y - 6 * geometry.scale,
                  r: target.r * 0.2,
                  ry: 0,
                  s: target.s * 1.05,
                };
                lift = 1;
                magnet = true;
              } else {
                const distance = target.x - lead.x;
                target = {
                  ...target,
                  x:
                    target.x +
                    Math.sign(distance) *
                      12 *
                      geometry.scale *
                      Math.max(0, 1 - Math.abs(distance) / (geometry.w * 1.1)),
                };
                lift = 0.2;
              }
            } else if (active === "open") {
              lift = 0.2;
            }
          }
        }
        busy = integrate(item.x, target.x, omega, damping, dt) || busy;
        busy = integrate(item.y, target.y, omega, damping, dt) || busy;
        if (!geometry.book && item.layer === "inside") {
          const tilt = (item.r.value * Math.PI) / 180;
          const reach =
            ((geometry.docW * Math.abs(Math.sin(tilt)) +
              geometry.docH * Math.abs(Math.cos(tilt))) *
              item.s.value) /
            2;
          const floor = geometry.tabH + geometry.h - 2 * geometry.scale - reach;
          if (item.y.value > floor) {
            item.y.value = floor;
            if (item.y.velocity > 0) item.y.velocity *= -0.25;
          }
        }
        busy = integrate(item.z, target.z, itemOmega, zeta, dt) || busy;
        busy = integrate(item.r, target.r, omega, damping, dt) || busy;
        busy = integrate(item.ry, target.ry, itemOmega, zeta, dt) || busy;
        busy = integrate(item.s, target.s, itemOmega, zeta, dt) || busy;
        busy = integrate(item.hover, lift, itemOmega, zeta, dt) || busy;
        busy = integrate(item.alpha, fade, TAU * 3 * s.speed, 1, dt) || busy;
        busy =
          integrate(
            item.mx,
            magnet ? item.localX * 7 * geometry.scale : 0,
            soft,
            0.85,
            dt,
          ) || busy;
        busy =
          integrate(
            item.my,
            magnet ? item.localY * 7 * geometry.scale : 0,
            soft,
            0.85,
            dt,
          ) || busy;
      });

      write();
      if (busy || drag) state.raf = requestAnimationFrame(frame);
      else state.last = 0;
    };

    const write = () => {
      const s = settingsRef.current;
      const {
        w,
        h,
        tabH,
        frontTop,
        frontH,
        docW,
        docH,
        scale,
        book: isBook,
      } = s.g;
      const pivotX = w / 2;
      const pivotY = tabH + h / 2;
      const theta = state.front.value;
      const angle = (theta * Math.PI) / 180;
      const unfold = isBook ? clamp(-theta / 180, 0, 1) : 0;
      const shift = (w / 2) * unfold * (1 - state.anchor.value);
      const zoom =
        (1 + state.lift.value * 0.012) *
        state.squash.value *
        (0.94 + 0.06 * state.appear);
      root.style.opacity = state.appear < 0.999 ? state.appear.toFixed(3) : "";
      const desk = chain(
        move(pivotX, pivotY),
        turnX(state.rx.value),
        turnY(state.ry.value),
        stretch(zoom, zoom),
        move(-pivotX, -pivotY),
      );
      const folder = multiply(desk, move(shift, 0));
      const flipped = isBook && theta < -90;
      const frontZ = flipped ? "3" : "40";

      if (backRef.current) {
        backRef.current.style.transform = toCss(folder);
        backRef.current.style.setProperty("--folder-gutter", unfold.toFixed(3));
        backRef.current.style.setProperty(
          "--folder-label",
          (isBook ? 1 : 1 - clamp((-theta - 18) / 26, 0, 1)).toFixed(3),
        );
      }

      const frontMatrix = isBook
        ? chain(
            folder,
            move(0, frontTop, 2 * scale * (1 - unfold)),
            turnY(theta),
          )
        : chain(
            folder,
            move(0, tabH + h, 2 * scale),
            turnX(theta),
            move(0, -frontH),
          );
      const facing = isBook
        ? Math.sin(angle) * -0.42 + Math.cos(angle) * 0.9
        : Math.sin(angle) * 0.5 + Math.cos(angle) * 0.86;
      const light = (flipped ? -facing : facing) / (isBook ? 0.9 : 0.86);
      const glint = clamp((light - 1) * 0.9, 0, 0.18);
      const dim = clamp((1 - light) * (isBook ? 0.5 : 0.22), 0, 0.5);

      const front = frontRef.current;
      if (front) {
        front.style.transform = toCss(frontMatrix);
        front.style.zIndex = frontZ;
        front.dataset.face = flipped ? "inner" : "outer";
        front.style.setProperty("--folder-glint", glint.toFixed(3));
        front.style.setProperty("--folder-dim", dim.toFixed(3));
      }

      const rise = isBook ? Math.max(0, Math.sin(-angle)) : 0;
      if (groundRef.current) {
        groundRef.current.style.transform = toCss(
          multiply(folder, move(0, isBook ? tabH : tabH + h)),
        );
        groundRef.current.style.opacity = (
          0.75 +
          state.lift.value * 0.25
        ).toFixed(3);
      }
      if (castRef.current) {
        castRef.current.style.transform = toCss(
          chain(
            folder,
            move(w * rise * 0.12, frontTop + h * rise * 0.04),
            stretch(Math.cos(angle), 1),
          ),
        );
        castRef.current.style.opacity = (flipped ? 1 - rise * 0.7 : 0).toFixed(
          3,
        );
      }
      if (shadeRef.current) {
        const edge = w * Math.cos(angle) + w * rise * 0.36;
        shadeRef.current.style.transform = toCss(
          chain(
            folder,
            move(0, frontTop + h * rise * 0.03),
            stretch(edge / w, 1),
          ),
        );
        shadeRef.current.style.zIndex = edge > 0 ? "39" : "2";
        shadeRef.current.style.opacity = (
          clamp(rise * 4, 0, 1) *
          (1 - rise * 0.45)
        ).toFixed(3);
      }

      const outs = state.items
        .map((item, index) => [item, index])
        .filter(([item]) => item.layer === "out")
        .sort((a, b) => a[0].outOrder - b[0].outOrder)
        .map(([, index]) => index);
      const matrices = [];
      state.items.forEach((item, index) => {
        const node = itemRefs.current[index];
        const z = 3 * scale + item.z.value + item.hover.value * 26 * scale;
        const matrix = chain(
          desk,
          move(item.x.value + item.mx.value, item.y.value + item.my.value, z),
          turnY(item.ry.value),
          turnZ(item.r.value),
          stretch(item.s.value, item.s.value),
          move(-docW / 2, -docH / 2),
        );
        let layer = 10 + s.count - item.rank;
        if (
          item.layer === "inside" &&
          state.phase === "open" &&
          state.hoveredItem === index
        )
          layer = 30;
        if (item.layer === "out") layer = LAYERS.out + outs.indexOf(index);
        if (item.layer === "drag") layer = LAYERS.drag;
        if (item.layer === "focus") layer = LAYERS.focus;
        matrices.push({
          index,
          matrix,
          layer,
          alpha: clamp(item.alpha.value, 0, 1),
          inside: item.layer === "inside",
        });
        if (!node) return;
        node.style.transform = toCss(matrix);
        node.style.zIndex = String(layer);
        node.style.setProperty(
          "--folder-lift",
          clamp(item.hover.value, 0, 2.4).toFixed(3),
        );
        node.style.opacity =
          item.alpha.value < 0.995
            ? Math.max(0, item.alpha.value).toFixed(3)
            : "";
      });
    };

    const wake = () => {
      if (active && inView && !document.hidden && !state.raf)
        state.raf = requestAnimationFrame(frame);
    };

    const beginIntro = () => {
      if (state.intro.phase !== "wait") return;
      state.intro.phase = "run";
      state.intro.start = performance.now() / 1000;
      wake();
    };

    const invalidate = () => {
      wake();
    };

    const updateReceiving = () => {
      const drag = state.drag;
      const item = drag ? state.items[drag.index] : null;
      state.receiving = Boolean(
        drag?.active &&
        item &&
        (item.place === "out" || item.elevated) &&
        overFolder(state.deskX, state.deskY),
      );
    };

    const startDrag = (drag) => {
      const item = state.items[drag.index];
      if (!item) return;
      drag.active = true;
      drag.grabX = item.x.value - drag.downX;
      drag.grabY = item.y.value - drag.downY;
      drag.scale = item.place === "out" ? item.outS : item.s.value;
      drag.clip = clipBounds();
      state.suppressClick = true;
      if (state.focus === drag.index) state.focus = -1;
      item.elevated = item.place === "out" || !inPocket(item);
      root.dataset.dragging = "";
    };

    const drop = (drag, cancelled) => {
      const s = settingsRef.current;
      const item = state.items[drag.index];
      state.receiving = false;
      delete root.dataset.dragging;
      if (!item) return;
      const time = performance.now() / 1000;
      const [vx, vy] = cancelled ? [0, 0] : velocityOf(drag.samples);
      if (overFolder(state.deskX, state.deskY)) {
        const entering = item.place === "out" || item.elevated;
        item.place = "inside";
        if (entering && !reduce) {
          item.insertUntil = time + 0.24 / s.speed;
          item.insertFrom = s.g.book
            ? state.front.value < -90
              ? null
              : "side"
            : "top";
          if (!item.insertFrom) item.insertUntil = 0;
          state.receiveUntil = item.insertUntil
            ? item.insertUntil + 0.14 / s.speed
            : 0;
        }
        item.elevated = false;
        syncOutside();
        s.onItemDrop?.(s.entries[drag.index], drag.index, true);
        return;
      }
      const clip = drag.clip ?? clipBounds();
      const halfW = (s.g.docW * drag.scale) / 2;
      const halfH = (s.g.docH * drag.scale) / 2;
      const x = state.deskX + drag.grabX + clamp(vx, -2400, 2400) * 0.09;
      const y = state.deskY + drag.grabY + clamp(vy, -2400, 2400) * 0.09;
      item.place = "out";
      item.elevated = true;
      const margin = 8 * s.g.scale;
      const reachX = halfW * 1.08 + margin;
      const reachY = halfH * 1.08 + margin;
      item.outX = clamp(
        x,
        clip.left + reachX,
        Math.max(clip.left + reachX, clip.right - reachX),
      );
      item.outY = clamp(
        y,
        clip.top + reachY,
        Math.max(clip.top + reachY, clip.bottom - reachY),
      );
      item.outR = clamp(
        item.r.value * 0.5 +
          clamp(vx, -2400, 2400) * 0.003 +
          DROP_TURN[drag.index % 6] * 0.6,
        -12,
        12,
      );
      item.outS = drag.scale;
      state.dropCount += 1;
      item.outOrder = state.dropCount;
      syncOutside();
      s.onItemDrop?.(s.entries[drag.index], drag.index, false);
    };

    const onMove = (event) => {
      const drag = state.drag;
      if (drag && event.pointerId === drag.id) {
        const [x, y] = toDesk(event.clientX, event.clientY);
        state.deskX = x;
        state.deskY = y;
        const now = performance.now();
        drag.samples.push([now, x, y]);
        while (drag.samples.length > 2 && now - drag.samples[0][0] > 100)
          drag.samples.shift();
        if (!drag.active) {
          const threshold = event.pointerType === "touch" ? 8 : 4;
          if (
            Math.hypot(
              event.clientX - drag.clientX,
              event.clientY - drag.clientY,
            ) > threshold
          )
            startDrag(drag);
        }
        if (drag.active) updateReceiving();
        wake();
      }
      if (event.pointerType === "touch") return;
      const box = root.getBoundingClientRect();
      state.pointerX = clamp(
        ((event.clientX - box.left) / box.width) * 2 - 1,
        -1.5,
        1.5,
      );
      state.pointerY = clamp(
        ((event.clientY - box.top) / box.height) * 2 - 1,
        -1.5,
        1.5,
      );
      const target = event.target.closest?.("[data-folder-item]");
      const index =
        target && root.contains(target)
          ? Number(target.getAttribute("data-folder-item"))
          : -1;
      state.hoveredItem = index;
      if (target && index >= 0 && !state.drag?.active) {
        const rect = target.getBoundingClientRect();
        const item = state.items[index];
        if (item) {
          item.localX = clamp(
            ((event.clientX - rect.left) / rect.width) * 2 - 1,
            -1,
            1,
          );
          item.localY = clamp(
            ((event.clientY - rect.top) / rect.height) * 2 - 1,
            -1,
            1,
          );
        }
      }
      if (!state.hovered) {
        state.hovered = true;
        if (settingsRef.current.openOn === "hover") setOpenRef.current(true);
      }
      wake();
    };

    const onLeave = (event) => {
      if (event.pointerType === "touch" || state.drag?.active) return;
      state.hovered = false;
      state.pressed = false;
      state.hoveredItem = -1;
      if (settingsRef.current.openOn === "hover") setOpenRef.current(false);
      wake();
    };

    const onDown = (event) => {
      if (event.button > 0) return;
      state.suppressClick = false;
      const target = event.target.closest?.("[data-folder-item]");
      if (target && root.contains(target) && settingsRef.current.draggable) {
        const [x, y] = toDesk(event.clientX, event.clientY);
        state.deskX = x;
        state.deskY = y;
        state.drag = {
          index: Number(target.getAttribute("data-folder-item")),
          id: event.pointerId,
          clientX: event.clientX,
          clientY: event.clientY,
          downX: x,
          downY: y,
          grabX: 0,
          grabY: 0,
          scale: 1,
          clip: null,
          active: false,
          samples: [[performance.now(), x, y]],
        };
        try {
          target.setPointerCapture(event.pointerId);
        } catch {
          state.drag.id = event.pointerId;
        }
      } else {
        state.pressed = true;
      }
      wake();
    };

    const onUp = (event) => {
      state.pressed = false;
      const drag = state.drag;
      if (drag && event.pointerId === drag.id) {
        state.drag = null;
        if (drag.active) drop(drag, event.type === "pointercancel");
      }
      wake();
    };

    const onDocumentDown = (event) => {
      if (root.contains(event.target)) return;
      const s = settingsRef.current;
      if (state.focus >= 0) {
        state.focus = -1;
        wake();
      }
      if (s.open && s.closeOnOutsideClick) setOpenRef.current(false);
    };

    const onKey = (event) => {
      if (event.key !== "Escape") return;
      if (state.focus >= 0) {
        state.focus = -1;
        wake();
        return;
      }
      const s = settingsRef.current;
      if (s.open && s.closeOnOutsideClick) setOpenRef.current(false);
    };

    const syncVisibility = () => {
      cancelAnimationFrame(state.raf);
      state.raf = 0;
      state.last = 0;
      if (preference?.matches || !settingsRef.current.motion)
        state.intro.phase = "done";
      wake();
    };
    const visibilityObserver =
      typeof IntersectionObserver === "undefined"
        ? null
        : new IntersectionObserver((entries) => {
            inView = entries.some((entry) => entry.isIntersecting);
            syncVisibility();
          });
    visibilityObserver?.observe(root);
    document.addEventListener("visibilitychange", syncVisibility);
    preference?.addEventListener("change", syncVisibility);
    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerleave", onLeave);
    root.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    document.addEventListener("pointerdown", onDocumentDown);
    document.addEventListener("keydown", onKey);
    document.fonts?.ready.then(invalidate);

    let observer = null;
    if (settingsRef.current.intro && !reduce) {
      state.intro.phase = "wait";
      root.style.opacity = "0";
      if (typeof IntersectionObserver === "undefined") {
        beginIntro();
      } else {
        observer = new IntersectionObserver(
          (entries) => {
            if (!entries.some((entry) => entry.isIntersecting)) return;
            observer?.disconnect();
            beginIntro();
          },
          { threshold: 0.2 },
        );
        observer.observe(root);
      }
    }

    engineRef.current = {
      wake,
      invalidate,
      consumeClick: () => {
        if (!state.suppressClick) return false;
        state.suppressClick = false;
        return true;
      },
      interactive: (index) =>
        settingsRef.current.open ||
        state.items[index]?.place === "out" ||
        state.focus === index,
      select: (index) => {
        const s = settingsRef.current;
        if (s.zoomOnClick) state.focus = state.focus === index ? -1 : index;
        s.onItemClick?.(s.entries[index], index);
        wake();
      },
      blur: () => {
        if (state.focus < 0) return false;
        state.focus = -1;
        wake();
        return true;
      },
    };
    // Establish the resting pose once before suspending an offscreen folder.
    frame(performance.now());
    wake();

    return () => {
      active = false;
      visibilityObserver?.disconnect();
      document.removeEventListener("visibilitychange", syncVisibility);
      preference?.removeEventListener("change", syncVisibility);
      cancelAnimationFrame(state.raf);
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
      root.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      document.removeEventListener("pointerdown", onDocumentDown);
      document.removeEventListener("keydown", onKey);
      observer?.disconnect();
      engineRef.current = null;
    };
  }, []);

  useEffect(() => {
    engineRef.current?.wake();
  });

  const toggle = () => {
    if (engineRef.current?.blur()) return;
    if (openOn === "hover") return;
    setOpen(!isOpen);
  };

  const onItemActivate = (event, index) => {
    const engine = engineRef.current;
    if (!engine) return;
    if (engine.consumeClick()) {
      event.stopPropagation();
      return;
    }
    if (!engine.interactive(index)) {
      event.preventDefault();
      setOpen(true);
      return;
    }
    event.stopPropagation();
    engine.select(index);
  };

  const vars = {
    "--folder-rgb": rgb.join(", "),
    "--folder-base": rgbString(rgb),
    "--folder-front-top": rgbString(mixRgb(rgb, [255, 255, 255], 0.12)),
    "--folder-front-bottom": rgbString(mixRgb(rgb, [0, 0, 0], 0.06)),
    "--folder-inside-top": insideTop,
    "--folder-inside-bottom": insideBottom,
    "--folder-tab-ink":
      luma(backTone) > 0.6
        ? "rgba(0, 0, 0, 0.72)"
        : "rgba(255, 255, 255, 0.92)",
    "--folder-paper": rgbString(paper),
    "--folder-paper-ink": rgbString(mixRgb(paper, [0, 0, 0], 0.11)),
    "--folder-paper-ink-strong": rgbString(mixRgb(paper, [0, 0, 0], 0.28)),
    "--folder-paper-text": rgbString(mixRgb(paper, [0, 0, 0], 0.72)),
    "--folder-w": `${g.w}px`,
    "--folder-h": `${g.h}px`,
    "--folder-tab-h": `${g.tabH}px`,
    "--folder-front-y": `${g.frontTop}px`,
    "--folder-front-h": `${g.frontH}px`,
    "--folder-r": `${g.r}px`,
    "--folder-front-radius": book ? `0 ${g.r}px ${g.r}px 0` : `${g.r}px`,
    "--folder-doc-w": `${g.docW}px`,
    "--folder-doc-h": `${g.docH}px`,
    "--folder-frost": `${(1.5 + clamp(frost, 0, 1) * 10) * scale}px`,
    "--folder-depth": `${settingsRef.current.depth}px`,
    "--folder-scale": scale,
    ...style,
  };

  const shape = backPath(g);

  return (
    <div
      ref={rootRef}
      className={`folder-root${className ? ` ${className}` : ""}`}
      data-mode={book ? "book" : "flap"}
      data-variant={variant}
      data-theme={theme === "light" ? "light" : "dark"}
      data-open={isOpen ? "" : undefined}
      data-draggable={draggable ? "" : undefined}
      style={vars}
    >
      <div className="folder-stage" id={controlsId}>
        <button
          type="button"
          className="folder-toggle"
          aria-label={label ? `${label} guides folder` : "Guides folder"}
          aria-expanded={isOpen}
          aria-controls={controlsId}
          onClick={toggle}
        />
        <span
          ref={groundRef}
          className="folder-layer folder-ground"
          aria-hidden="true"
        />
        {book && (
          <span
            ref={castRef}
            className="folder-layer folder-cast"
            aria-hidden="true"
          />
        )}

        <div
          ref={backRef}
          className="folder-layer folder-back"
          aria-hidden="true"
        >
          <div
            className="folder-back-fill"
            style={{ clipPath: `path('${shape}')` }}
          >
            {book && <span className="folder-gutter" />}
          </div>
          <svg
            className="folder-back-rim"
            width={g.w}
            height={total}
            viewBox={`0 0 ${g.w} ${total}`}
          >
            <path className="folder-focus" d={shape} />
          </svg>
          {label && (
            <span
              className="folder-tab-text"
              style={{ left: g.tabX, width: g.tabW }}
            >
              {label}
            </span>
          )}
        </div>

        {entries.map((item, index) => {
          const interactive = isOpen || outside.includes(index);
          const ItemTag = item?.href ? "a" : "div";
          return (
            <ItemTag
              href={item?.href}
              aria-label={item?.content ? undefined : item?.title}
              aria-hidden={!interactive}
              key={isValidElement(item) && item.key != null ? item.key : index}
              ref={(node) => {
                itemRefs.current[index] = node;
              }}
              className="folder-layer folder-item"
              data-folder-item={index}
              role={!item?.href && interactive ? "button" : undefined}
              tabIndex={interactive ? 0 : -1}
              onClick={(event) => onItemActivate(event, index)}
              onKeyDown={(event) => {
                if (item?.href) return;
                if (
                  !interactive ||
                  (event.key !== "Enter" && event.key !== " ")
                )
                  return;
                event.preventDefault();
                event.stopPropagation();
                engineRef.current?.select(index);
              }}
            >
              {renderItem(item)}
            </ItemTag>
          );
        })}

        {book && (
          <span
            ref={shadeRef}
            className="folder-layer folder-shade"
            aria-hidden="true"
          />
        )}

        <div
          ref={frontRef}
          className="folder-layer folder-front"
          data-face="outer"
          aria-hidden="true"
        >
          <div className="folder-face folder-face-outer" />
          {book && (
            <div className="folder-face folder-face-inner">
              <span className="folder-inner-gutter" />
            </div>
          )}
        </div>
      </div>

      {label && (
        <span
          ref={measureRef}
          className="folder-tab-text folder-measure"
          aria-hidden="true"
        >
          {label}
        </span>
      )}
    </div>
  );
};

export default Folder;
