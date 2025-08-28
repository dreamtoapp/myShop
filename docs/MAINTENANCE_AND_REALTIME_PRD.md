## Maintenance, Caching, Uploads, and Realtime (Pusher) — PRD

### 1) Purpose
Provide admins with reliable maintenance tools and predictable data freshness across the app, while ensuring image uploads invalidate caches correctly and realtime health is visible and testable.

### 2) Current State (as implemented)
- Maintenance Page: `app/dashboard/management-maintinance/page.tsx` renders `AdminMaintenanceDashboard`.
- Cache Revalidation:
  - Server action `refreshAllCaches` at `app/dashboard/management/settings/actions/refreshCaches.ts` revalidates tags: `products`, `company`, `categories`, `promotions`; paths: `/`, `/dashboard`, `/dashboard/management-dashboard`.
  - Image upload API `app/api/images/route.ts` revalidates tag and `/` based on `table` after updating DB.
- Database Health:
  - `app/dashboard/management-maintinance/actions/dbHealthCheck.ts` does a minimal query, returns `latencyMs`, parsed `dbName`, `host`, and `plan` from env.
  - Atlas Info: `app/dashboard/management-maintinance/actions/getAtlasClusterInfo.ts` fetches `instanceSizeName`, `providerName`, `stateName` via Atlas Admin API.
- Realtime (Pusher):
  - Server health: `app/dashboard/management-maintinance/actions/pusherHealthCheck.ts` verifies presence of required env keys and lists missing.
  - Server client: `lib/pusherServer.ts` instantiates Pusher (throws if env missing).
  - Optional client helper: `lib/pusherClient.ts` lazy loads `pusher-js` with public keys.
- Upload UX: `components/AddImage.tsx` shows determinate progress, cancel/retry, and triggers cache revalidation via API.
- Dashboard Footer: `app/dashboard/components/DashboardFooter.tsx` shows version via `AppVersion` in a clean row layout.

### 3) Problems / Gaps
- Realtime: Only env-presence check; no end-to-end emit/receive validation or latency measurement.
- Revalidation: No bulk tag/path helpers, no operation logs, and limited visibility of results.
- DB Health: Shows latency and names but no optional stats toggle; no explicit error codes surfaced.
- Observability: No lightweight diagnostics bundle (non-secret) for support.

### 4) Goals (This PRD)
1. Realtime (Pusher) card provides full check: config presence, credential check (server trigger), client subscribe/receive test with latency ms.
2. Revalidation section adds bulk actions and visible progress + last 5 logs.
3. DB Health exposes clear states and error messages; keeps current safe scope (no heavy stats by default).
4. Diagnostics export: JSON file with versions, feature flags, and last check results (no secrets).

### 5) Functional Requirements
- Realtime Health
  - Server action `actions/pusher/validateCredentials` attempts a safe `trigger` to channel `maintenance-health` with event `health-ping` and payload `{ ts }`. Returns `{ ok, errorCode? }`.
  - Client subscribes (public) to `maintenance-health` and measures RTT: `latencyMs = now - ts`. Display result and color state.
  - If `NEXT_PUBLIC_*` or server keys missing, show missing list and disable test button.
- Revalidation Tools
  - New server actions:
    - `revalidateTags(tags: string[])`
    - `revalidatePaths(paths: string[])`
  - UI shows a determinate bar with steps and a small log of the last 5 operations (timestamp, actor, items, duration, result).
- DB Health
  - Keep current minimal query; show `latencyMs`, `dbName` badge, optional `plan/atlas plan`.
  - Show explicit error labels: `UNAUTHORIZED`, `DB_ERROR`.
- Diagnostics Export
  - Client button produces a JSON blob: app version, Next.js version, feature toggles, last health results, and configuration booleans (without values), then downloads `diagnostics.json`.

### 6) Non‑Functional Requirements
- Admin‑only for all server actions.
- No secrets in client or logs.
- Resilient UI states: loading, success, error; RTL Arabic copy preserved; soft colors.

### 7) Acceptance Criteria
- Pusher card:
  - Shows keys presence and which are missing.
  - “Run Live Test” subscribes and displays “received in X ms” on success; shows actionable error on failure (401/403/cluster mismatch).
- Revalidation card:
  - Bulk tag/path revalidation works; full refresh calls both. Progress and final state are visible; logs record the last 5 runs.
- DB card:
  - “Check” displays latency and db name badge; Atlas plan/provider shown when envs configured; errors don’t crash UI.
- Diagnostics export:
  - Downloads JSON without secrets and includes recent results.

### 8) Test Plan
- Unit-ish (actions):
  - Mock env missing → `pusherHealthCheck` returns `missing` as expected.
  - With keys, `validateCredentials` returns `{ ok: true }` or proper error code.
- E2E manual:
  1) Open Maintenance page as ADMIN.
  2) Pusher: run test → expect "received in < 1s"; break a key → expect clear error.
  3) Revalidation: run tags and paths separately → verify home and dashboard reflect changes after an image upload.
  4) DB: verify latency and db badge; with Atlas envs set, see plan/provider.
  5) Diagnostics: download JSON; verify no secrets included.

### 9) Rollout
- Phase A: Pusher live test + bulk revalidation + logs.
- Phase B: Diagnostics export.

### 10) Risks & Mitigation
- Misconfigured Pusher clusters → explicit mismatch error; disable test until fixed.
- Over‑revalidation causing load → keep bulk actions admin‑only and throttle button while running.


