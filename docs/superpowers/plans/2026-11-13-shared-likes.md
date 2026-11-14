# Shared PulseHeart likes

Owner chose a count shared across visitors, superseding the initial proposed local-only default. Keep GitHub Pages/domain and all current unpublished work. Use real Supabase-backed shared state; do not display fabricated example totals or silently substitute a local count.

1. Integrate supplied PulseHeart JS/CSS with Hugeicons; shared palette, native toggle, original pulse/rolling-count effects, SSR-safe effects, global pause/reduced motion/visibility cleanup.
2. Add a compact homepage footer-area widget. Read authoritative count/liked state; optimistically animate each click, serialize writes and roll back failures. Unknown/unconfigured count must stay hidden and disabled with a truthful unavailable state.
3. Add a Supabase SQL migration with anonymous identity uniqueness, private likes table, narrow authenticated set-like RPC and read-only public aggregate RPC. Repeated writes of the same state must be idempotent. No private keys in the browser.
4. Use a small fetch-based REST client with persistent anonymous session/refresh, timeout/validation, and public project configuration. No full Supabase runtime SDK. Account connection/project selection is required before actual backend provisioning and live verification; continue independent work meanwhile.
5. Test component semantics/motion, service client contract and error rollback, shared two-visitor reads/writes, and SQL permissions/idempotence where a real database is available. Run repository gates; document exactly what is local/tested versus live. No website publication assigned.
