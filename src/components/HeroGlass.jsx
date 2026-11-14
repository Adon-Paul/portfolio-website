import { useEffect, useRef, useState } from "react";
import { normalizeColor, originalPalette } from "../content/palette";
import "./HeroGlass.css";
import useHeroBackdrop from "./useHeroBackdrop";
const keys = ["accent", "hero-grid", "hero-light", "hero-dark"];

export default function HeroGlass({ shape = "cube" }) {
  const prism = shape === "prism";
  const [colors, setColors] = useState(originalPalette);
  const [width, setWidth] = useState(700);
  const [Glass, setGlass] = useState(null);
  const [ready, setReady] = useState(false);
  const host = useRef(null);
  const backdrop = useHeroBackdrop(host, colors);
  useEffect(() => {
    let active = true,
      visible = false,
      requested = false,
      armed = false;
    const load = () => {
      if (
        !active ||
        !armed ||
        !visible ||
        requested ||
        document.documentElement.dataset.opening === "active"
      )
        return;
      requested = true;
      import("./FluidGlass")
        .then((module) => {
          if (active) setGlass(() => module.default);
        })
        .catch(() => {});
    };
    const readColors = () => {
      const css = getComputedStyle(document.documentElement);
      setColors(
        Object.fromEntries(
          keys.map((key) => [
            key,
            normalizeColor(css.getPropertyValue(`--p-${key}`).trim()) ||
              originalPalette[key],
          ]),
        ),
      );
    };
    const changes = new MutationObserver((records) => {
      if (records.some((record) => record.attributeName === "style"))
        readColors();
      load();
    });
    changes.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["style", "data-opening"],
    });
    readColors();
    const sizing =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    if (host.current) sizing?.observe(host.current);
    const observer =
      typeof IntersectionObserver === "undefined"
        ? null
        : new IntersectionObserver((entries) => {
            visible = entries.some((entry) => entry.isIntersecting);
            load();
          });
    if (host.current) observer?.observe(host.current);
    const frame = requestAnimationFrame(() => {
      armed = true;
      if (!observer) {
        const rect = host.current?.getBoundingClientRect();
        visible = Boolean(rect && rect.bottom > 0 && rect.top < innerHeight);
      }
      load();
    });
    return () => {
      active = false;
      cancelAnimationFrame(frame);
      changes.disconnect();
      observer?.disconnect();
      sizing?.disconnect();
    };
  }, []);
  return (
    <div
      ref={host}
      className="identity-graphic hero-glass"
      aria-hidden="true"
      data-shape={shape}
      data-ready={String(ready)}
      data-accent={colors.accent}
    >
      <div className="hero-glass-fallback">
        <svg viewBox="0 0 700 700" fill="none">
          <path
            transform="translate(35 -105)"
            d={
              prism
                ? "M265 410L350 230L435 410ZM350 230L395 260L480 440L435 410M265 410L310 440H480"
                : "M350 220L463 285V415L350 480L237 415V285ZM237 285L350 350L463 285M350 350V480"
            }
            stroke={colors["hero-light"]}
            strokeWidth="1.5"
            strokeOpacity=".65"
          />
        </svg>
      </div>
      {Glass && (
        <Glass
          text=""
          backdrop={backdrop}
          shape={shape}
          size={width <= 400 ? width * 0.4 : 260}
          interaction="bounce"
          idle={false}
          position={
            prism ? [0.65, 0.42] : width <= 400 ? [0.45, 0.4] : [0.55, 0.35]
          }
          refraction={prism ? 1 : 1.45}
          dispersion={prism ? 0.35 : 0.5}
          reflection={prism ? 1 : 0.95}
          shadow={prism ? 0.5 : 0.25}
          elevation={prism ? 0.4 : 0.95}
          smoothness={prism ? 0.5 : 0.65}
          wobble={prism ? 0.5 : 1}
          spin={prism ? 0.3 : 0.85}
          morphOnClick={false}
          maxDevicePixelRatio={2}
          overlay
          color={colors.accent}
          tint={0}
          onReady={() => setReady(true)}
          onUnavailable={() => setReady(false)}
        />
      )}
    </div>
  );
}
