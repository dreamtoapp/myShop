> tag: onProgress | reviewLater
## Pusher Realtime — PRD

### 1) Purpose
Ensure reliable realtime capabilities with clear admin diagnostics: configuration validation, credential correctness, cluster alignment, and end‑to‑end event delivery verification with latency.

### 2) Current Implementation
- Server client: `lib/pusherServer.ts` creates a Pusher server instance using envs and throws if any are missing (fail‑fast).
- Client helper: `lib/pusherClient.ts` lazy‑loads `pusher-js` and instantiates a browser client with public envs.
- Health check action: `app/dashboard/management-maintinance/actions/pusherHealthCheck.ts` (admin‑only) checks presence of env keys and returns a `missing[]` list; it does not perform a credentialed event test.
- Maintenance UI: Admin dashboard includes a “Realtime (Pusher) Status” card that consumes `pusherHealthCheck` and lists missing keys.

### 3) Gaps / Risks
- No credential verification (server `trigger`) → keys could be wrong while check still passes.
- No cluster mismatch detection (e.g., wrong `NEXT_PUBLIC_PUSHER_CLUSTER`).
- No end‑to‑end emit/receive test; no latency visibility.
- No clear user‑facing error taxonomy (Unauthorized, Cluster mismatch, Network).

### 4) Goals
1. Validate credentials by performing a safe server `trigger` to a non‑sensitive channel.
2. Verify client subscription and measure end‑to‑end latency.
3. Provide actionable diagnostics in the admin UI with Arabic copy and soft colors.

### 5) Functional Requirements
- Server Actions (admin‑only)
  - `validateCredentials()`
    - Uses `pusherServer.trigger('maintenance-health', 'health-ping', { ts: Date.now() })`.
    - Returns `{ ok: true }` on success; otherwise `{ ok: false, errorCode: 'UNAUTHORIZED'|'CLUSTER_MISMATCH'|'NETWORK'|'UNKNOWN', message }`.
  - Existing `pusherHealthCheck()` remains for env presence; surface `missing[]` keys.

- Client (Maintenance Page)
  - Subscribe to `maintenance-health` channel on demand; when the card’s “Run live test” is clicked:
    1) Start timer; call `validateCredentials()`.
    2) When event received, compute `latencyMs = now - payload.ts` and display it.
    3) Handle timeouts (e.g., 10s) with a friendly error.
  - Show three states: `Not configured` (missing keys), `Configured` (envs present), `Verified` (live test passed with latency).

### 6) Non‑Functional Requirements
- Security: No secrets in the client. Admin‑only server actions via `auth()` role check.
- UX: RTL Arabic text; subdued success/error colors; accessible status text.
- Reliability: Debounce button; cleanup subscriptions after test; handle reconnect.

### 7) Acceptance Criteria
- With correct keys and cluster:
  - Env check: `configured = true`, `missing = []`.
  - Live test: receives event and shows latency (usually < 1000ms locally).
- With incorrect secret or app id:
  - Live test returns `{ ok: false, errorCode: 'UNAUTHORIZED' }` and the UI shows a clear message.
- With cluster mismatch in public/client env:
  - Live test fails within timeout; UI suggests verifying `NEXT_PUBLIC_PUSHER_CLUSTER`.

### 8) Test Plan
- Manual E2E (Admin user):
  1) Open Maintenance page → run “Env check” → verify configured/keys missing list.
  2) Click “Run live test” → expect success and latency ms.
  3) Break a key in local env → expect `UNAUTHORIZED`.
  4) Change `NEXT_PUBLIC_PUSHER_CLUSTER` → expect timeout/mismatch hint.
- DevTools: Observe subscribed channel and network POST for server action.

### 9) Rollout
- Phase A: Add `validateCredentials` action and UI subscribe/test.
- Phase B: Persist last test result (timestamp/latency) in local storage to show historical last‑seen health.

### 10) Notes
- Keep channels public for the health test to avoid auth routes; production features can move to private/presence channels if needed.


