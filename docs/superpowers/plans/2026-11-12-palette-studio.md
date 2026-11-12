# Palette studio

Owner explicitly requests a unified on-site colour editor, easy palette switching, preservation of ALL current colours, and production deployment.

Use one manifest of named colour tokens with original values. Render default variable declarations in server HTML so no-JS pages keep identical colours. Replace CSS/SVG theme literals with those tokens; TechText resolves tokens to actual canvas colours. Canvas compositing masks and immutable images/videos/PDFs are not theme colours.

Add a small Palette button away from the motion button. A native dialog contains common colours plus advanced colours, colour pickers, hex/alpha fields, deliberate preset selection, exact reset, named local saved combinations, JSON import/export. Panel UI has isolated fixed colours so it remains readable even with an unusable experiment. Experiments persist only in the current browser; no global edits or secret credentials.

Validation: compare original/computed colours across all 5 pages; verify picker/hex, invalid input, reset, save/load, JSON roundtrip/rejection, navigation/reload, blocked/corrupt storage, native Escape/focus, narrow layout and accessibility. Existing motion/playback/static routes must pass. Inspect default and open-panel screenshots; deploy through the unchanged build/browser gate.
