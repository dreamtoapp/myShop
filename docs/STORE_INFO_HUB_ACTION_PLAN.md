### Store Information Hub via Health Status – Action Plan (Conservative)

#### Goal
- Convert the existing `/dashboard/health-status` page into a lightweight hub that:
  - Shows the current e‑commerce health summary (as today), and
  - Adds a server-rendered sidebar with links to store information sections.

#### Scope (strict)
- Keep the route: reuse `app/dashboard/health-status/page.tsx`.
- Add a server-rendered sidebar (inside the same page) with section links.
- Keep all existing health components and detailed analysis intact below the hub area.
- Optional: add a single new nav entry labeled "معلومات المتجر" pointing to `/dashboard/health-status` (label only; URL unchanged).

#### URL & Navigation
- URL (unchanged): `/dashboard/health-status`
- Navigation updates (additions only):
  - Horizontal header menu: add/rename an item label to "معلومات المتجر" pointing to `/dashboard/health-status`.
  - Sidebar menu (management dashboard): add the same label pointing to `/dashboard/health-status`.

#### Page Structure (server component, same route)
- Layout split (server-rendered):
  - Right/left sidebar: sticky list of section links (anchors in-page) plus deep links to existing routes.
  - Main content: keep the current health report structure; add a compact hub header above it.
- Hub header (compact):
  - Reuse existing overall health summary (completion %, status hint, icon via `AppHealthIconServer`).
  - Short paragraph explaining this page now also centralizes store information.
  - “Manage store sections” anchor area.
- Store sections (cards with links):
  - معلومات الشركة → `/dashboard/management/settings/company-profile`
  - الموقع والعنوان → `/dashboard/management/settings/location`
  - الروابط الاجتماعية → `/dashboard/management/settings/social-media`
  - الشعار والهوية → `/dashboard/management/settings/branding`
  - الامتثال (VAT/CR/Tax) → `/dashboard/management/settings/compliance`
  - السياسات: الخصوصية/الشحن → `/dashboard/management/policies/privacy`, `/dashboard/management/policies/shipping`
  - المناوبات → `/dashboard/shifts`
  - من نحن → `/dashboard/management/about`
  - دليل الاستخدام → `/dashboard/guidelines`
- Below: keep the full detailed health analysis exactly as-is (OverallHealthStatus, BusinessImpactMetrics, FieldCategorySection, BusinessRecommendations).

#### Data & Boundaries
- Reuse `getCompanyHealthStatus()` already used by layout/health page.
- No new data sources. Keep server component only; no `"use client"`.
- No dependency or config changes.

#### Implementation Steps
1) Edit `app/dashboard/health-status/page.tsx`:
   - Wrap existing content in a two-column layout: sidebar + main content.
   - Add a compact hub header above the current health report components.
   - Add a server-rendered sidebar with anchor links and external deep links (no client state).
2) Add/rename a single nav item label to "معلومات المتجر" pointing to `/dashboard/health-status` in:
   - `app/dashboard/helpers/navigationMenu.ts` (header menu)
   - `app/dashboard/management-dashboard/helpers/mainMenu.ts` (sidebar)
3) Verify RTL, spacing, and tokens use existing Tailwind classes and CSS variables. No new design tokens.
4) Manual test: navigate to `/dashboard/health-status`, verify sidebar, hub header, links, and that the detailed report remains intact below.

#### Acceptance Criteria
- `/dashboard/health-status` shows a sidebar and hub header without breaking existing health content.
- All store section links navigate correctly; no 404s.
- Existing health components render unchanged; functionality preserved.
- Optional menu labels updated to "معلومات المتجر" without changing URLs.
- No dependency, config, or global style changes.

#### Rollback Plan
- Revert the `health-status/page.tsx` edits to its previous single-column structure.
- Revert any menu label additions/changes pointing to `/dashboard/health-status`.

#### Out of Scope
- Changing the health logic, calculations, or component behavior.
- Creating new child routes or layouts.
- Global styling changes or new design tokens.


