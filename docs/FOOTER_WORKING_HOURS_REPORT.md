### Footer Working Hours: Production-Safe Backend Sourcing Plan

**Objective**: Remove hardcoded "24/7" in the storefront footer and source the value from the backend with zero-risk to layout, styles, or unrelated features.

---

#### Findings (repo verification)
- **Primary footer component**: `app/(e-comm)/homepage/component/Fotter/Fotter.tsx`
  - Contains hardcoded working hours: `24/7` (visual badge/number)
- Additional occurrences of "24/7" for copy elsewhere (not footer):
  - `app/dashboard/management/policies/shipping/page.tsx` (content text)
  - `app/(e-comm)/homepage/component/slider/HomepageHeroSlider.tsx` (marketing copy)
  - `app/api/superadmin/route.ts` (JSON includes `workingHours: '24/7'`)

Note: Only the footer instance is in scope; other occurrences are informational.

---

#### Minimal change strategy (surgical)
Prefer layout-based pass-through for simplicity and consistency:
1) Extend `fetchEcommLayoutData()` to include `workingHours` from company data (same source as other footer props).
2) In `app/(e-comm)/layout.tsx`, pass `workingHours` as a new prop to `<Footer />` alongside existing props.
3) Update `FooterProps` in `Fotter.tsx` to include optional `workingHours?: string`, and render it instead of the hardcoded `"24/7"` with a strict fallback to `"24/7"` when nullish.

No dependency, route, or provider changes required. Component remains server by default.

---

#### Proposed data source
- Use company data already fetched in layout (`fetchEcommLayoutData`) as the source of truth.
- Field: `workingHours: string` (example: `"24/7"`, `"10:00–22:00"`, `"Mon–Sun 9–21"`).
- Fallback: if missing/invalid → use `"24/7"` to avoid regressions.

Validation (narrow): accept non-empty `string`; trim and clamp max length (e.g., 24 chars) before render to avoid layout overflow.

---

#### Implementation sketch (non-breaking)
- In `app/(e-comm)/helpers/layoutData`, include `workingHours` in the returned object from the same company source.
- In `app/(e-comm)/layout.tsx`, pass `workingHours={typedCompanyData?.workingHours}` to `<Footer />`.
- In `app/(e-comm)/homepage/component/Fotter/Fotter.tsx`:
  - Extend `FooterProps` with `workingHours?: string`.
  - In `CompanyInfo`, render `{workingHours ?? '24/7'}` instead of the hardcoded text.

Classes, markup, and surrounding layout remain unchanged.

---

#### Caching and performance
- Use static fetch with `revalidate: 3600` (1h) to minimize API pressure and maintain CDN-friendly output.
- If the API is dynamic, optionally revalidate via dashboard action in future (out of scope).

---

#### i18n and formatting
- Treat `workingHours` as a raw display token from backend; do not localize client-side to avoid ambiguity (e.g., RTL formatting).
- If localization is needed later, move to a structured object (out of scope).

---

#### Edge cases
- Missing field, empty string, or 4xx/5xx → render `"24/7"`.
- Overlong values → truncate with ellipsis while preserving container width.
- Non-breaking spaces and RTL numerals respected by existing typography.

---

#### Rollout checklist
- Types compile; no `any` introduced.
- No changes to Tailwind classes or component structure.
- Build footer with cached data path; verify mobile and desktop.
- Confirm no CLS: same text length class context, fallback ensures stability.

---

#### Verification checklist (production-safe)
- ✅ Only footer text node replaced; styling unchanged.
- ✅ Backward compatible with strict fallback to current `"24/7"`.
- ✅ Zero dependency or global config changes.
- ✅ Performance-neutral with cache and ISR revalidation.
- ✅ SSR/hydration safe (server fetch in RSC).
- ✅ No layout shifts or hover/style deltas.

---

#### File(s) in scope for future edit
- `app/(e-comm)/helpers/layoutData.ts` (augment company data with `workingHours`).
- `app/(e-comm)/layout.tsx` (pass `workingHours` prop to `Footer`).
- `app/(e-comm)/homepage/component/Fotter/Fotter.tsx` (add prop and replace hardcoded literal).

If you approve, I will implement the minimal edit in the file above, with a small server-side fetch helper and strict fallback to `"24/7"`.



---

### Addendum: Layout Data Flow and Integration Options

#### Current layout data flow (verified)
- Layout: `app/(e-comm)/layout.tsx`
  - Uses `fetchEcommLayoutData()` to get `companyData`, `session`, `userSummary`, `productCount`, `clientCount`, etc.
  - Passes the following props to `Footer`:
    - `companyName`, `aboutus`, `email`, `phone`, `whatsappNumber`, `address`, `facebook`, `instagram`, `twitter`, `linkedin`, `productCount`, `clientCount`, `userId`.
- Footer: `app/(e-comm)/homepage/component/Fotter/Fotter.tsx`
  - `CompanyInfo` currently renders the hardcoded `24/7` for working hours.
  - No `workingHours` prop exists today.

Implication: We can fetch `workingHours` directly inside the server `Footer` (smaller change) or extend the layout data and pass it down (slightly larger surface).

#### Two safe integration options
- Option A (Recommended, smallest surface):
  - Fetch `workingHours` inside `Fotter.tsx` via `GET /api/superadmin` with ISR (`next: { revalidate: 3600 }`).
  - Replace only the literal `24/7` with the fetched value; fallback to `"24/7"` on error/nullish.

- Option B (Pass via layout):
  - Extend `app/(e-comm)/helpers/layoutData` to include `workingHours` from the same backend source.
  - Pass `workingHours` in `app/(e-comm)/layout.tsx` to `<Footer />`.
  - Update `FooterProps` to include optional `workingHours?: string` and use fallback `"24/7"`.

Both options keep the DOM structure and Tailwind classes unchanged, ensuring no layout drift.

#### Files impacted if proceeding
- Option A: `app/(e-comm)/homepage/component/Fotter/Fotter.tsx` only.
- Option B: `app/(e-comm)/helpers/layoutData.ts`, `app/(e-comm)/layout.tsx`, and `app/(e-comm)/homepage/component/Fotter/Fotter.tsx`.

Approval requested: Choose Option A (single-file change) or Option B (layout-driven prop). I’ll implement accordingly with strict fallback to `"24/7"`.

---

### Tasks

1) Update footer working hours (priority)
   - Extend `fetchEcommLayoutData` to include `workingHours` from company data.
   - Pass `workingHours` in `app/(e-comm)/layout.tsx` to `<Footer />`.
   - In `Fotter.tsx`, add `workingHours?: string` to `FooterProps` and render `{workingHours ?? '24/7'}` in `CompanyInfo`.
   - Preserve existing classes and layout; no other changes.

2) Replace remaining 24/7 instances (after footer)
   - `app/(e-comm)/homepage/component/slider/HomepageHeroSlider.tsx`: update copy to use a shared constant or backend value if available; otherwise leave as marketing text (out of scope for now).
   - `app/dashboard/management/policies/shipping/page.tsx`: confirm if copy should remain or read from policies data source.
   - Keep scope tight; avoid unrelated refactors.