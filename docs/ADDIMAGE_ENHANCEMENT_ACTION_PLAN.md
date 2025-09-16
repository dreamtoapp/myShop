## AddImage Component – Production-Safe Enhancement Plan

### Goals
- Remove redundant progress UI (keep one indicator) without layout drift.
- Add client-side validation (type/size/dimensions) to improve UX while keeping server as the source of truth.
- Improve Cloudinary error clarity and surface errors via the existing notification system (no native alerts).

### Scope and Constraints (ZERO-RISK)
- No breaking changes to props or behavior by default.
- All changes are opt-in via new props with safe defaults or internal guards.
- No global style changes; Tailwind classes preserved.
- No dependency changes; use existing shadcn/ui/toast or local Alert components if already present.

### Current Behavior Snapshot
- Two progress indicators during upload: overlay progress bar and bottom bar.
- No client-side validation before upload.
- Error banner shows raw message; Cloudinary/backend errors can be opaque.

### Proposed Changes (Minimal and Isolated)
1) Progress Indicator Consolidation (New Default: Single Indicator)
   - New DEFAULT: show only the overlay progress (spinner + progressbar + cancel).
   - Add optional prop `showBottomProgress?: boolean` with DEFAULT: `false`. Set to `true` only if you want the bottom bar back.

2) Client-Side Validation (New Default: Enabled with Safe Limits)
   - Add props with safe defaults (active by default):
     - `acceptMimeTypes?: string[]` DEFAULT: ["image/jpeg","image/png","image/webp","image/avif"]
     - `maxFileSizeMB?: number` DEFAULT: 5
     - `requiredMinDimensions?: { width: number; height: number }` DEFAULT: undefined (off unless provided)
   - Perform checks in `handleFileChange` before preview/upload:
     - MIME type check (based on `file.type`).
     - File size check.
     - If `requiredMinDimensions` is set: load image in memory to validate dimensions.
   - On validation fail: prevent upload, reset `file` if set, and notify user via banner/toast with clear, localized messages.
   - Override: Consumers can disable checks by passing `acceptMimeTypes={undefined}` and/or `maxFileSizeMB={undefined}` explicitly.

3) Clear Cloudinary/Error Messaging + Better Notifications (Non-breaking)
   - Expect backend to standardize error payload shape:
     - `{ error: { code: string; message: string; details?: unknown } }` or `{ error: string }` (compat).
   - Parse safely in `onload` branch; map known Cloudinary errors (e.g., `InvalidSignature`, `FileTooLarge`, `UnsupportedFormat`) to user-friendly messages.
   - Use existing notification primitive (prefer shadcn `toast` if present; else current inline banner) to show errors and success. No native alerts.
   - Include a non-blocking hint to retry and a short code (e.g., `ERR-CLD-413`) for support logs.

4) Enhanced Error Control UX (Component-Scoped, Accessible)
   - Keep the current inline banner but improve content and accessibility:
     - Add `role="alert"` and `aria-live="polite"` for screen readers.
     - Show concise, human-readable messages derived from structured/parsed errors.
     - Include an optional short error code (e.g., `CLD-UNSUPPORTED-FORMAT`).
   - Retry behavior: keep the existing Retry button when a `file` is still selected; disable when `loading`.
   - Cancellation: keep the cancel message but standardize wording; ensure state resets progress to `0`.
   - Logging alignment: on non-network failures, optionally call the client error logger (if available) with minimal payload for observability; no blocking and no new deps.
   - Rate-limit duplicate error banners during a single upload attempt to avoid message spam.

   - UI component choice (Default: shadcn Alert when available):
     - Introduce optional prop `useShadcnAlert?: boolean` with DEFAULT: `true`. Use shadcn/ui `Alert` by default for clearer, consistent errors; gracefully fallback to the inline banner if `Alert` is not available in a given runtime context.
     - Alert content structure: strong title + brief description + optional small error code.
     - Example titles: "Image upload failed", "Network error", "Unsupported format".
     - Do not introduce new dependencies; reuse existing shadcn components only if already installed.

   - Human-readable message mapping (examples):
     - `FileTooLarge` → "The image is too large. Max size is {maxFileSizeMB} MB."
     - `UnsupportedFormat` → "Unsupported image format. Use JPEG, PNG, WEBP, or AVIF."
     - `RateLimited` → "Too many attempts. Please try again in a moment."
     - Network error → "Network issue while uploading. Check your connection and retry."

### API/Compatibility
- No changes required to `/api/images`. If backend can adopt structured errors, the frontend will use them; otherwise it falls back to current `error` string.
- New props are optional; defaults change are UI-only and conservative. Consumers can opt out via props to match legacy behavior.

### Acceptance Criteria
- Only one progress indicator is visible during upload by default (overlay kept). Bottom bar appears only if explicitly enabled.
- Selecting an invalid file shows a clear message and does not start upload.
- Cloudinary/backend errors surface human-readable messages via the app’s notification system.
- No layout shift when idle or during upload compared to current styling.
- Typescript and ESLint pass.

### Test Checklist (Manual)
- Happy path: valid image uploads, preview updates, `onUploadComplete` fires.
- Progress: overlay shows percent, Cancel aborts and resets state.
- Validation: wrong type, oversized file, and too-small dimensions each block upload with correct messages.
- Error mapping: simulate structured error responses and plain string errors; both display friendly messages.
- Responsiveness: small and large containers preserve current layout/classes.
 - Accessibility: error banner announces via `role="alert"`/`aria-live` and is keyboard operable.

### Implementation Outline (Surgical Edits Only)
- Add optional props and defaults; keep existing prop order.
- Inject validation in `handleFileChange` before preview/upload; dimension check via in-memory `Image`.
- Parse structured error shape in `xhr.onload`; map known codes; fallback to generic.
- Remove default rendering of bottom progress bar; guard behind `showBottomProgress` (default false).
- Use existing notification helper (toast/Alert) if available; otherwise keep current inline error banner.
 - Add `role="alert"`/`aria-live` to the banner, inject optional short error code, and guard repeated messages.

### Rollback Strategy
- Props are additive. To rollback to legacy UI:
  - Set `showBottomProgress` default to `true`.
  - Set `useShadcnAlert` default to `false`.
  - Require validation props to enable checks (previous behavior).


