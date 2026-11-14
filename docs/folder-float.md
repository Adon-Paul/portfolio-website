# FolderFloat homepage demo

Requested November 13, 2026; owner selected the four supplied design-feedback demo notes. The section follows Contact, before the shared footer, on the homepage only. It is explicitly a local interaction demo; selecting a note displays its text locally and sends nothing.

Source: https://github.com/DavidHDev/react-bits/tree/main/src/content/Micro/FolderFloat . Copyright David Haz; existing React Bits license is in `docs/licenses/react-bits-TechText-LICENSE.txt`. Dependency: matter-js; license copied to `docs/licenses/matter-js-LICENSE.txt`.

`FolderFloat.jsx` and CSS retain the supplied folder/flap/paper/pill appearance, spring reveal, collision physics and pointer dragging. Local adaptations:

- Physics runs only while the folder is open, in view, visible, and the site's motion state permits it. Reduced motion/site pause disable drift and transition motion. Physics cleanup releases the engine and animation frame.
- Mouse hover opens; touch and keyboard use the native trigger. Escape/selection closes and restores trigger focus. Focus outlines remain visible; note text and counts have readable contrast.
- Touch pointer entry does not pre-open the folder before its click toggle. A continuous hover bridge covers all four note rows.
- Effect-based measurement preserves static server rendering without layout-effect warnings. Missing observers degrade to static notes.
- `FolderDemo` sizes the cloud to the available width and reserves its expansion area; the wrapper clips excess decorative hit area. The demo is hidden without JavaScript; existing static portfolio content remains available.

Colours use shared palette tokens: Accent for folder back/tab, Dark panels for front, Project surface for paper/pills, Warm dark text for note text and Light text for flap text. Gradient highlights, focus and shadows also use palette values; edits update immediately through CSS variables. No published defaults changed.

`tests/folder.spec.js` checks keyboard selection/focus, touch at 320px, pause/reduced motion, palette edits, overflow/accessibility, dragging without selection and cleanup on close. Physical device and Safari checks are not performed.
