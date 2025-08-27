## Maintenance Page – Action Plan (Admin‑only)

### Goals
- Provide a dedicated, discoverable page for platform maintenance instead of a modal.
- Centralize safe, admin‑only tools: cache refresh with progress, health checks, and service validations.
- Avoid manual Vercel cache purges by using programmatic revalidation per Next.js best practices.

### Location and Access
- Route: `/dashboard/management-maintinance` (new page)
- Nav: Enable the existing commented menu entry under “المزيد → الصيانة” or add under “الإعدادات”.
- Gate: ADMIN or SUPER_ADMIN via `auth()` on server.

### MVP Features (Phase 1)
1) Cache and Revalidation (with progress)
   - Buttons:
     - Refresh Homepage + Core: calls server action to `revalidatePath('/')` and `revalidatePath('/dashboard')`.
     - Refresh Tags: `products`, `company`, `categories`, `promotions` via `revalidateTag()`.
     - One‑click “Full Refresh”: calls both of the above (uses existing `refreshAllCaches`).
   - Progress UX:
     - Determinate bar while awaiting action (simulate 0→90%), success snap to 100% with checkmark and timestamp.
     - Logs area (last 5 operations: what, who, when, duration).

2) Database Health Check
   - Server action `dbHealthCheck()` that performs minimal query (e.g., `db.user.count({ take: 1 })` or equivalent) and reports latency/status.

3) Cloudinary Status Check
   - Call existing `/api/cloudinary/credentials` (already referenced in `CloudinarySettingsForm`) to confirm configured/valid.
   - Show cloud name, folder preset summary, and last upload success (read from recent logs if available).

4) Pusher Connectivity Check
   - Client: reuse `usePusherConnectionStatus` hook to display current connection state.
   - Server: add a lightweight server ping action to ensure server credentials are set (no event emission in prod by default).

5) Email/SMTP Test (optional if configured)
   - Server action that sends a test email to the company admin address using `lib/email` (if present) or nodemailer.
   - Guarded by confirmation dialog, logs success/error only (no sensitive output).

6) Service Worker/PWA (dev‐only helper)
   - Button to prompt unregister in dev (since PWA is disabled in dev by config) and force reload. Hidden in production.

### Nice to Have (Phase 2)
- WhatsApp API test (if tokens present) – send a self test message to admin number; guard behind explicit confirmation.
- Background jobs (cron) visibility – show last run times if any.
- Cache presets – quick presets for only home, only products, etc.
- Export diagnostics bundle (JSON) for support (versions, flags, recent errors counters) without secrets.

### UI/UX Specification
- Use a full page (not dialog), with cards:
  - Card: “تحديث البيانات المؤقتة” with buttons for tag/path/full refresh and a prominent progress bar + status line.
  - Card: “حالة قاعدة البيانات” showing ping ms and status dot.
  - Card: “Cloudinary” showing configured state and quick validate button.
  - Card: “Pusher” showing connection state (client) and server config check.
  - Card: “البريد الإلكتروني” with test send (if configured).
- RTL layout, reuse existing tokens (`bg-muted`, `border-border`, `text-muted-foreground`).
- Accessibility: role="progressbar" with `aria-valuenow/min/max`, `aria-live` for status.

### Implementation Steps
1) Routing and Access
   - Create `app/dashboard/management-maintinance/page.tsx` (client page).
   - Server protect actions with `auth()`; client gate UI by session role.

2) Revalidation Section
   - Reuse existing action: `app/dashboard/management/settings/actions/refreshCaches.ts` (`refreshAllCaches`).
   - Add new actions:
     - `revalidateTags(tags: string[])` → loop `revalidateTag(tag)`.
     - `revalidatePaths(paths: string[])` → loop `revalidatePath(path)`.
   - Build progress component (spinner + determinate bar + result).

3) DB Health
   - Add `dbHealthCheck()` server action under `app/dashboard/management-maintinance/actions/dbHealthCheck.ts` to perform minimal query and return `{ ok, latencyMs }`.

4) Cloudinary Status
   - Client call to `/api/cloudinary/credentials` (already exists per `CloudinarySettingsForm` references) to show configured state.

5) Pusher Status
   - Client: display `usePusherConnectionStatus` indicator.
   - Server: add `pusherHealthCheck()` that validates server env keys presence (no emit in prod).

6) Email Test (optional)
   - Add `sendTestEmail()` guarded by admin role; consume existing email utility or nodemailer config from company settings.

7) Navigation
   - Un‑comment/add the item in `app/dashboard/helpers/navigationMenu.ts`:
     `{ label: 'الصيانة', href: '/dashboard/management-maintinance', icon: 'Wrench' }`.

### Safety & Permissions
- Admin‑only; never display secrets.
- All actions idempotent; no destructive toggles by default.
- Log results (info level) without sensitive values.

### Rollout
- Phase 1 (MVP): Page + cache tools + DB health + Cloudinary + Pusher status.
- Phase 2: Email test, WhatsApp test, diagnostics export.

### References
- Next.js revalidation: `revalidateTag`, `revalidatePath` – Next.js App Router docs.
- Caching patterns: `unstable_cache` tags already present in repo (`products`, `company`, etc.).
- Existing hooks/utilities: `usePusherConnectionStatus`, `refreshAllCaches`.

### Checklist (MVP)
- [ ] Create page `/dashboard/management-maintinance` (client) with cards.
- [ ] Wire existing `refreshAllCaches` + add tag/path bulk actions.
- [ ] Add progress bar with accessible status.
- [ ] Implement `dbHealthCheck()` action and surface latency.
- [ ] Surface Cloudinary configured state via `/api/cloudinary/credentials`.
- [ ] Show Pusher client connection status and server keys presence.
- [ ] Add nav item “الصيانة”.
- [ ] Admin gate everywhere.


