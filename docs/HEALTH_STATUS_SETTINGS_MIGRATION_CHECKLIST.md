### Health-Status Settings Migration Checklist

Goal: Centralize e‑comm settings under `app/dashboard/management/health-status/*` with a persistent sidebar layout.

#### 0) For each page you move (one-by-one)
- Source (example): `app/dashboard/management/settings/company-profile`
- Destination: `app/dashboard/management/health-status/setting/company-profile`

#### 1) Route structure (folder rule)
- Ensure files exist:
  - `page.tsx` (Server Component)
  - `loading.tsx` (skeleton)
  - `components/` (UI only)
  - `actions/` (server wrappers calling shared actions)
  - `helpers/` (optional, local-only helpers)

#### 2) Convert page to Server Component
- Remove `"use client"` in `page.tsx`.
- Fetch data via route-local server action wrappers.
- Compute any progress/status on the server.
- Do NOT pass event handlers from server to client components.

#### 3) Local server actions (wrappers)
- Create thin wrappers that call shared actions to avoid duplication:
  - `actions/fetchCompany.ts`
  - `actions/saveCompany.ts`
- Keep only async exports and include `'use server'`.
- Prefer scoped, field-only actions per page to reduce payloads:
  - Example: `setting/location/actions/fetchLocation.ts` returns `{ id, address, latitude, longitude }` only
  - Example: `setting/social-media/actions/getSocialMedia.ts`/`saveSocialMedia.ts` handle social links only

#### 4) Fix imports after move
- Layout: keep using `../../../settings/components/SettingsLayout` (shared UI).
- Actions: change to local wrappers, e.g. `./actions/fetchCompany`.
- Components: use relative local paths (e.g. `./components/Component.tsx`).

#### 5) Sidebar updates (health-status layout)
- File: `app/dashboard/management/health-status/layout.tsx`.
- For EVERY page moved, immediately add the matching link to the sidebar.
  - Example: `company-profile` → `/dashboard/management/health-status/setting/company-profile`
  - Example: `location` → `/dashboard/management/health-status/setting/location`
- Keep header link clickable without nested anchors (uses `HeaderLink`).
- Remove any old sidebar links pointing to `/dashboard/management/settings/...` to avoid duplicates.

#### 6) Optional redirects
- Old route → new route (if needed):
  - Create simple redirect at the old path `page.tsx`:
    - `import { redirect } from 'next/navigation';`
    - `export default function Page(){ redirect('/dashboard/management/health-status/setting/company-profile'); }`

#### 7) Client components
- Keep complex forms as client components in `components/`.
- Accept only serializable props from server (no functions).
- Handle interactions and progress client-side.

#### 8) Test checklist per page
- Page loads under the `health-status` layout with sidebar.
- No hydration errors (no nested `<a>` tags; no server → client handlers).
- Imports resolve; `pnpm dev` typechecks clean.
- Data loads via server wrapper and form submits via server action.

#### 9) Example applied: company-profile
- Created under: `health-status/setting/company-profile`.
- Added `actions/fetchCompany.ts` and `actions/saveCompany.ts` wrappers.
- Converted `page.tsx` to server; added `loading.tsx`.
- Updated sidebar link in `health-status/layout.tsx`.


