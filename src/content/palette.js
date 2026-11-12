export const paletteTokens = [
  {
    key: "canvas",
    label: "Page background",
    value: "#171719",
    group: "Core",
  },
  {
    key: "text",
    label: "Light text",
    value: "#f6f2ed",
    group: "Core",
  },
  {
    key: "paper",
    label: "Project surface",
    value: "#efebe6",
    group: "Core",
  },
  {
    key: "surface",
    label: "Dark panels",
    value: "#202023",
    group: "Core",
  },
  {
    key: "about",
    label: "About surface",
    value: "#e2ddd7",
    group: "Core",
  },
  {
    key: "accent",
    label: "Accent",
    value: "#ff9a62",
    group: "Core",
  },
  {
    key: "accent-dark",
    label: "Accent on light",
    value: "#a2441d",
    group: "Core",
  },
  {
    key: "accent-hover",
    label: "Accent hover",
    value: "#ffb68d",
    group: "Core",
  },
  {
    key: "muted",
    label: "Muted light text",
    value: "#bdb7b1",
    group: "Text",
  },
  {
    key: "body-dark",
    label: "Text on light",
    value: "#605750",
    group: "Text",
  },
  {
    key: "body-deep",
    label: "Dark paragraph text",
    value: "#584c43",
    group: "Text",
  },
  {
    key: "ink-warm",
    label: "Warm dark text",
    value: "#24170f",
    group: "Text",
  },
  {
    key: "accent-deep",
    label: "Deep accent text",
    value: "#8c3814",
    group: "Text",
  },
  {
    key: "instrument-label",
    label: "Instrument labels",
    value: "#cec3ba",
    group: "Text",
  },
  {
    key: "diagram-label",
    label: "Diagram labels",
    value: "#c8bbb0",
    group: "Text",
  },
  {
    key: "route-index",
    label: "Route numbers",
    value: "#d4c5b9",
    group: "Text",
  },
  {
    key: "panel-copy",
    label: "Panel paragraphs",
    value: "#cbbfb6",
    group: "Text",
  },
  {
    key: "panel-note",
    label: "Panel footnotes",
    value: "#bfb0a5",
    group: "Text",
  },
  {
    key: "line",
    label: "Page borders",
    value: "#4b4643",
    group: "Lines",
  },
  {
    key: "paper-line",
    label: "Project borders",
    value: "#bab0a7",
    group: "Lines",
  },
  {
    key: "about-line",
    label: "About borders",
    value: "#b3a597",
    group: "Lines",
  },
  {
    key: "input-line",
    label: "Input borders",
    value: "#968b83",
    group: "Lines",
  },
  {
    key: "control-line",
    label: "Control borders",
    value: "#8f8075",
    group: "Lines",
  },
  {
    key: "instrument-line",
    label: "Instrument borders",
    value: "#514842",
    group: "Lines",
  },
  {
    key: "panel-line",
    label: "Panel grid borders",
    value: "#66584e",
    group: "Lines",
  },
  {
    key: "media-line",
    label: "Video button borders",
    value: "#b08165",
    group: "Lines",
  },
  {
    key: "focus",
    label: "Keyboard focus",
    value: "#cf5c26",
    group: "Lines",
  },
  {
    key: "hero-light",
    label: "Hero gradient light",
    value: "#fff3e8",
    group: "Artwork",
  },
  {
    key: "hero-dark",
    label: "Hero gradient dark",
    value: "#68432f",
    group: "Artwork",
  },
  {
    key: "hero-grid",
    label: "Hero grid",
    value: "#b99b89",
    group: "Artwork",
  },
  {
    key: "signal-axis",
    label: "Signal axes",
    value: "#b98d72",
    group: "Artwork",
  },
  {
    key: "orbit-line",
    label: "Motion orbit",
    value: "#a3836d",
    group: "Artwork",
  },
  {
    key: "record",
    label: "Record grooves",
    value: "#443d39",
    group: "Artwork",
  },
  {
    key: "motion-surface",
    label: "Motion button",
    value: "#242225",
    group: "Artwork",
  },
  {
    key: "field-wash",
    label: "Field note wash",
    value: "#ff874808",
    group: "Artwork",
  },
  {
    key: "media-shadow",
    label: "Video shadow",
    value: "#00000055",
    group: "Utilities",
  },
  {
    key: "control-shadow",
    label: "Motion shadow",
    value: "#00000022",
    group: "Utilities",
  },
  {
    key: "white",
    label: "Certificate / print white",
    value: "#ffffff",
    group: "Utilities",
  },
  {
    key: "print-ink",
    label: "Print text",
    value: "#111111",
    group: "Utilities",
  },
];
export const originalPalette = Object.freeze(
  Object.fromEntries(paletteTokens.map((t) => [t.key, t.value])),
);
export const PALETTE_KEY = "adon-palette-v1";
export const SAVED_KEY = "adon-palettes-saved-v1";
export const paletteCSS =
  ":root{" +
  paletteTokens.map((t) => `--p-${t.key}:${t.value}`).join(";") +
  "}";
export function normalizeColor(value) {
  if (
    typeof value !== "string" ||
    !/^#(?:[0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(value)
  )
    return null;
  const raw = value.slice(1).toLowerCase();
  return "#" + (raw.length < 5 ? [...raw].map((c) => c + c).join("") : raw);
}
export function validatePalette(data) {
  if (
    !data ||
    data.version !== 1 ||
    !data.colors ||
    typeof data.colors !== "object" ||
    Array.isArray(data.colors)
  )
    return null;
  const keys = Object.keys(data.colors);
  if (
    keys.length !== paletteTokens.length ||
    keys.some((k) => !Object.hasOwn(originalPalette, k))
  )
    return null;
  const next = {};
  for (const { key } of paletteTokens) {
    const color = normalizeColor(data.colors[key]);
    if (!color) return null;
    next[key] = color;
  }
  return next;
}
export function readPalette() {
  try {
    return (
      validatePalette(JSON.parse(localStorage.getItem(PALETTE_KEY))) || {
        ...originalPalette,
      }
    );
  } catch {
    return { ...originalPalette };
  }
}
export function applyPalette(colors) {
  const icon = document.querySelector('link[rel="icon"]');
  if (icon)
    icon.setAttribute(
      "href",
      colors.surface === originalPalette.surface &&
        colors.accent === originalPalette.accent
        ? "/favicon.svg"
        : "data:image/svg+xml," + encodeURIComponent(paletteFavicon(colors)),
    );
  for (const { key } of paletteTokens)
    document.documentElement.style.setProperty(`--p-${key}`, colors[key]);
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", colors.canvas);
}
export const presets = {
  original: { name: "Original — current colours", colors: originalPalette },
  cobalt: {
    name: "Cobalt study",
    colors: {
      ...originalPalette,
      accent: "#8bb7ff",
      "accent-dark": "#2455a4",
      "accent-hover": "#bdd3ff",
      "accent-deep": "#214277",
      "hero-light": "#edf4ff",
      "hero-dark": "#354b75",
      "hero-grid": "#8c9fbe",
      "signal-axis": "#7d9cc4",
      "orbit-line": "#819fc3",
      "field-wash": "#5599ff08",
    },
  },
  rose: {
    name: "Rose study",
    colors: {
      ...originalPalette,
      accent: "#f6a6c5",
      "accent-dark": "#9c355c",
      "accent-hover": "#ffd0e2",
      "accent-deep": "#7d2848",
      "hero-light": "#fff0f6",
      "hero-dark": "#734154",
      "hero-grid": "#bd91a3",
      "signal-axis": "#bb839b",
      "orbit-line": "#b68c9e",
      "field-wash": "#ff559908",
    },
  },
};

export function paletteFavicon(colors) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="${colors.surface}"/><path d="M14 48L29 15h7l15 33H39l-3-8H27l-3 8Zm16-17h3l-1.5-5Z" fill="${colors.accent}"/></svg>`;
}
