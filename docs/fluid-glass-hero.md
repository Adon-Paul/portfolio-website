# FluidGlass hero — November 14, 2026

The original 44-ellipse IdentityGraphic remains intact behind the semantic ADON/PAUL TOMY heading. FluidGlass is an additional foreground layer at z-index 2. No content was removed.

Source: https://github.com/DavidHDev/react-bits/tree/main/src/content/Components/FluidGlass . Copyright David Haz; license retained in `docs/licenses/react-bits-TechText-LICENSE.txt`.

The owner rejected the earlier cube-only specialization and reduced rendering resolution. The full supplied renderer is restored: all seven shapes and morphing, text/image/video refraction, original interior ray tracing, reflection, dispersion, caustic shadows, supersampling, rotation, wobble and idle drift. Original 2× DPR cap and 5-million-pixel safety budget are preserved. Hero settings follow the supplied cube example, with clear glass (zero tint). Small screens adjust only the configured object size and resting position; shader quality remains unchanged.

The hero now supplies an opaque, palette-aware optical backdrop: the existing TechText canvas is copied live, with the original filament SVG and PAUL TOMY text at their actual screen positions. Reduced motion uses the static ADON lettering. The earlier faint substitute SVG with empty text was the remaining cause of subdued refraction. Existing native artwork remains visible underneath. The opt-in `overlay` prop clears content outside the glass while retaining shadow contributions; default component rendering remains upstream behavior. All original source functionality is retained.

`useHeroBackdrop.js` captures only these known local hero layers, rather than scraping arbitrary DOM or introducing an image service. `FluidGlass` accepts an optional `backdrop` callback and uploads its canvas as the source texture using the original media sampling pipeline. No shader optics, ray counts or rendering quality were changed. SVG decoding triggers a repaint even while paused.

Integration additions: first-draw readiness and static fallback, live site pause/reduced motion, hidden/offscreen suspension, circular hero pointer bounds, context-loss handling, and 4/8-digit palette hex support. The hero lazy-loads after the opening veil finishes. No project videos are loaded by this use of FluidGlass. Palette changes regenerate the artwork even while paused. Published palette defaults are unchanged.

Terser is a development-only Vite minifier, configured with two safe compression passes. It preserves renderer features and the existing strict aggregate JavaScript budget; no unsafe math compression or relaxed thresholds.

Browser coverage includes original artwork/foreground stacking, intro sequencing, mobile placement/pause/palette, no eager MP4 requests, no-WebGL/no-JavaScript fallback and a 2× DPR regression check. Chromium coverage does not establish Safari, physical-device or field performance.


November 14 motion follow-up: owner requested autonomous random bouncing instead of mouse following. Hero now selects the added `interaction="bounce"` mode and disables anchor idle drift. A random initial heading and varied speed after impacts drive reflected motion inside the circle intersected with the visible hero, inset for the cube's size. Pointer movement does not steer it. Original optics/spin/wobble remain, including a small impact response; site pause/reduced motion freezes travel. Other upstream interaction modes remain available. `glassBounce.js` isolates geometry; sustained-run tests cover clipped circular bounds and pause. Browser tests sample both mobile and desktop confinement and confirm motion/pause independently of cursor position.


November 14 prism addition: a second `HeroGlass shape="prism"` runs alongside the original cube in the same circle. Both reuse the full existing FluidGlass module and independent bounded bounce state. No shader, ray tracing, supersampling, DPR, source capability or existing cube setting was changed. Prism uses the supplied example/defaults: size 260 (same responsive sizing rule as cube), refraction 1, dispersion .35, reflection 1, shadow .5, elevation .4, smoothness .5, wobble .5 and spin .3. Shared palette-aware backdrop and pause/reduced-motion rules apply to each. Click morphing stays disabled to retain the two requested shapes. Each has its own correctly shaped static fallback. They bounce independently against the existing confines; object-to-object collision was not requested or added.


Latest November 14 follow-up removes the prism instance from the homepage. The full renderer still supports the original shapes, but only the bouncing cube is displayed. ADON TechText uses `interactiveCharacters="DO"`; excluded A/N remain filled and do not receive hover/drag/outline or propagated click impulses.
