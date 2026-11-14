# Shared PulseHeart likes

Owner requested React Bits PulseHeart and explicitly chose a count shared across visitors on November 13, 2026. GitHub Pages/domain remain unchanged. There is no local-only substitute and no invented example total.

## Current status

Frontend component/widget, REST client and PostgreSQL migration are implemented locally. **Supabase is not connected and no live project has been selected/provisioned.** `public/site-likes.json` deliberately has empty values. The widget shows an unavailable state with a disabled heart and no numeric count until a real backend responds. No website or backend deployment was performed.

## Files and behavior

- `PulseHeart.jsx`/CSS: supplied React Bits pulse/flip/rebound/pill beat and rolling count, Hugeicons glyphs and native toggle. Source: https://github.com/DavidHDev/react-bits/tree/main/src/content/Micro/PulseHeart . React Bits license is in `docs/licenses/react-bits-TechText-LICENSE.txt`; Hugeicons license is copied to `docs/licenses/hugeicons-LICENSE.md`.
- Source adaptations: SSR-safe layout effects, global pause/reduced-motion/hidden-tab settlement, cleanup, strong palette focus, and cancellation of stale animation after an outside controlled rollback. Keyboard activation follows upstream instant-state behavior.
- `SiteLikes.jsx`/CSS: homepage section after FolderFloat, before Footer. Reads the authoritative shared count and this visitor's liked state. Clicks animate optimistically while writes are serialized; failures restore the acknowledged state and offer retry. Focus and 45-second visible-widget refresh keep totals current without a websocket or full Supabase SDK.
- `src/likes/client.js`: public REST RPCs; anonymous authentication only on first write, persistent anonymous session/refresh, in-memory identity if storage is blocked, eight-second request timeouts and strict response validation. Secret project keys are rejected. There is no public write-to-count endpoint accepting arbitrary increments.
- `supabase/migrations/202611130001_portfolio_likes.sql`: private RLS-enabled table, one row per authenticated anonymous identity, public aggregate/state RPC, authenticated idempotent boolean set-like RPC, per-identity transaction lock. Raw identities are not exposed. Anonymous identity is not a guarantee of one vote per physical person: clearing storage/revoking a session can produce another identity.

## Account setup required

1. Install/connect Supabase in ChatGPT and select a suitable project (prefer a dedicated portfolio project). Inspect existing tables and Auth settings before modifying that project.
2. Apply the migration and enable anonymous sign-ins in the selected project's Auth settings. Keep the provider's authentication protections/rate limits enabled.
3. Put only the project URL and **publishable** client key into `public/site-likes.json`:
   ```json
   {"url":"https://PROJECT.supabase.co","publishableKey":"sb_publishable_PUBLIC_KEY"}
   ```
   Never put a service-role/secret key here. The file is public. Legacy `anon` JWT keys are accepted, private roles are rejected.
4. Verify anonymous read, authenticated like/unlike, two independent visitor identities, reload/refresh, failed-write rollback and actual browser CORS against the live project. Any setup-test votes must be removed before release.
5. Run project gates and the SQL check; publication remains a separate assigned release step.

Primary references: [anonymous sign-ins](https://supabase.com/docs/guides/auth/auth-anonymous), [sign-in API](https://supabase.com/docs/reference/javascript/auth-signinanonymously), [database functions and privilege rules](https://supabase.com/docs/guides/database/functions).

## Verification

`npm run check` includes component semantics and real-HTTP provider-contract client tests. `tests/likes.spec.js` intercepts a deterministic Supabase API fixture to check two independent browser contexts, shared reads/unlikes, persistence, rollback/retry, original pulse, palette, pause/reduced motion, 320px layout and axe. These fixtures are test-only and are **not** evidence of a provisioned Supabase service.

`npm run test:likes-db` starts a temporary isolated PostgreSQL 17 Docker container, supplies stand-ins for Supabase's Auth roles/UID function, and executes the actual migration. Checks cover private-row grants, public aggregate, authentication, duplicate likes/unlikes, two identities and concurrent retries. It stops/removes its own container after completion. Docker and the official `postgres:17-alpine` image are required. This tests SQL permissions/logic, not Supabase Auth configuration.

Original guide folders/effects are unchanged by removing their unreachable WebGL glass helper code. FolderFloat now imports only the Matter modules it uses, avoiding the library's unused renderer/input modules while retaining the same physics. Full regression checks cover both integrations. Published palette defaults, project videos, guides and PDFs remain unchanged.

November 14 release decision: hide the entire widget while public service configuration is missing. Supplying valid configuration enables the existing shared-service UI; configured service errors still provide retry feedback.
