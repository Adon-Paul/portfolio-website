# Approved sidebar and release plan

Owner approved a full-height left overlay sidebar, existing search/branches, mobile sizing, keyboard close/focus and motion preferences; hide likes until configured. Preserve all other current local features and publish after checks.

1. Update SiteDirectory CSS to edge-attached responsive sidebar; preserve native disclosure and static index fallback, return focus on navigation.
2. Gate SiteLikes rendering on valid public service configuration. Keep configured-service tests and update unconfigured expectation.
3. Check mobile sidebar geometry, existing navigation/accessibility and full regression suite; run npm run check and npm run test:e2e.
4. Record results, commit current authorized local work, push main and confirm Pages deployment.
