# FluidGlass beside ADON

Owner supplied React Bits FluidGlass and requested it inside the hero circle next to ADON, replacing the spinning filament there. Preserve the existing wordmark/layout, palette, opening, folders, videos, guides and pending shared-like work.

- Integrate supplied JS/CSS FluidGlass without new dependencies. Cube, local follow, spin/wobble, original refraction; no image/video demo content or cursor follower outside this circle.
- Keep original circle/grid as palette-aware SVG content drawn behind the refracting cube. Provide static SVG fallback for no JS/WebGL failures. Main semantic heading stays untouched.
- Lazy-load on visible hero after the opening veil clears, so two expensive WebGL effects do not compete on startup. Cap DPR. Pause immediately for site controls/reduced motion/hidden tab/offscreen state; clean up and support context loss/recovery.
- Verify actual draw, placement, pause, palette, fallback, mobile reflow and no eager videos, then run repository check/full browser gates. No publication assigned. Shared likes still need a Supabase account/project connection.
