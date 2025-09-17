## Management About Page – Zero‑Risk UX Refactor Plan

### Objectives
- Simplify the editor UX for About page content with minimal, surgical changes.
- Prevent upload errors (400) by aligning image workflow with record lifecycle.
- Preserve all existing functionality, RTL, and design tokens.

### Current Pain Points
- Image upload returns 400 when `id` is missing (new record + autoUpload).
- Tooltip/info density and form validation feedback are verbose/inconsistent.
- Tabs (About, Features, FAQ) are functional but lack clear save guidance per tab.

### Target UX (Simple & Safe)
- Clear per‑tab save flow and non-blocking image upload.
- Inline, minimal validation messages; no layout shift.
- Upload‑only behavior when record is not yet created; switch to DB update once `id` exists.

### Minimal Changes (Files/Areas)
- `app/dashboard/management/about/components/AboutForm.tsx`
  - If `!defaultValues?.id`: pass `uploadOnly` to image upload and keep `autoUpload`.
  - After successful upload, set form field with returned URL as today.
  - Disable submit button only during submit (preserve existing behavior).
  - Keep RTL and existing inputs; no class changes unless required.

- `components/AddImage.tsx` (optional, non-breaking enhancement)
  - Accept `uploadOnly` prop; when true, append `uploadOnly=true` to formData.
  - No visual or API changes for other usages.

### Validation & Errors (Consistency)
- Show single-line error text under each field (already present).
- For image errors, keep shadcn Alert; keep content concise and non-intrusive.

### Data/Flow Diagram
- New record (no id): AddImage → POST `/api/images` with `uploadOnly=true` → returns `imageUrl` → set `heroImageUrl` → user saves form → server action persists URL.
- Existing record (id present): AddImage → POST `/api/images` with `recordId`, `table`, `tableField` → DB update + cache revalidation.

### Non‑Goals
- No schema changes; no API contract changes.
- No style overhaul or component moving.

### Rollout Steps
1) Implement guarded upload‑only in `AboutForm` when `!id`.
2) (Optional) Wire `uploadOnly` prop through `AddImage` for clarity (backward compatible).
3) Manual verification on route `dashboard/management/about` for both cases: with and without id.

### Acceptance Criteria
- Upload on new records succeeds (no 400) and fills `heroImageUrl`.
- Upload on existing records updates DB and revalidates as before.
- No layout shifts; RTL intact; tabs unchanged visually.
- All other usages of `AddImage` unaffected.

### Risk & Mitigation
- Risk: Accidental change to other `AddImage` callers → keep prop optional, default false.
- Risk: Missing id detection → derive from `defaultValues?.id` only.

### Test Checklist (Manual)
- New About (no id): upload image → success → submit form → persists.
- Existing About (has id): upload image → DB updates; page revalidation ok.
- Form validation: required fields show concise messages; no overlap.

### Implementation Notes
- Append `formData.append('uploadOnly', 'true')` when needed; server already honors this flag.
- Avoid touching global styles/providers; keep classNames unchanged unless necessary.

