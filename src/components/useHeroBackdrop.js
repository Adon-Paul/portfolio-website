import { useCallback, useEffect, useRef, useState } from "react";

// Render only the existing local hero layers into the optical source texture.
// The actual DOM stays visible underneath; this canvas is sampled by the glass.
export default function useHeroBackdrop(host, colors) {
  const [revision, setRevision] = useState(0);
  const image = useRef(null);
  const canvas = useRef(null);
  useEffect(() => {
    const svg = host.current?.parentElement.querySelector(
      "svg.identity-graphic",
    );
    if (!svg) return undefined;
    let active = true;
    const css = getComputedStyle(document.documentElement);
    const source = new XMLSerializer()
      .serializeToString(svg)
      .replace(/var\((--[\w-]+)\)/g, (_, token) =>
        css.getPropertyValue(token).trim(),
      );
    const next = new Image();
    next.onload = () => {
      if (active) {
        image.current = next;
        setRevision((value) => value + 1);
      }
    };
    next.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(source)}`;
    return () => {
      active = false;
    };
  }, [host, colors]);
  return useCallback(() => {
    const node = host.current;
    if (!node) return null;
    const rect = node.getBoundingClientRect();
    const stage = node.parentElement;
    const surface = (canvas.current ??= document.createElement("canvas"));
    surface.dataset.heroBackdrop = String(revision);
    const ratio = Math.min(devicePixelRatio || 1, 2);
    const width = Math.max(1, Math.round(rect.width * ratio));
    const height = Math.max(1, Math.round(rect.height * ratio));
    if (surface.width !== width) surface.width = width;
    if (surface.height !== height) surface.height = height;
    const ctx = surface.getContext("2d");
    if (!ctx) return null;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    const css = getComputedStyle(document.documentElement);
    ctx.fillStyle = css.getPropertyValue("--p-canvas").trim();
    ctx.fillRect(0, 0, rect.width, rect.height);
    if (image.current) {
      ctx.globalAlpha = Number(
        getComputedStyle(stage.querySelector("svg.identity-graphic")).opacity,
      );
      ctx.drawImage(image.current, 0, 0, rect.width, rect.height);
      ctx.globalAlpha = 1;
    }
    const title = stage.querySelector(".tech-text-canvas");
    if (title && getComputedStyle(title.parentElement).display !== "none") {
      const box = title.getBoundingClientRect();
      ctx.drawImage(
        title,
        box.left - rect.left,
        box.top - rect.top,
        box.width,
        box.height,
      );
    } else {
      const fallback = stage.querySelector(".given-name");
      const box = fallback.getBoundingClientRect();
      const font = getComputedStyle(fallback);
      ctx.fillStyle = font.color;
      ctx.font = `${font.fontWeight} ${font.fontSize} ${font.fontFamily}`;
      ctx.letterSpacing = font.letterSpacing;
      ctx.textBaseline = "top";
      ctx.fillText("ADON", box.left - rect.left, box.top - rect.top);
    }
    const family = stage.querySelector(".family-name");
    const box = family.getBoundingClientRect();
    const font = getComputedStyle(family);
    ctx.fillStyle = font.color;
    ctx.font = `${font.fontWeight} ${font.fontSize} ${font.fontFamily}`;
    ctx.letterSpacing = font.letterSpacing;
    ctx.textBaseline = "top";
    ctx.fillText("PAUL TOMY", box.left - rect.left, box.top - rect.top);
    return surface;
    // A newly decoded SVG must repaint even when motion is paused.
  }, [host, revision]);
}
