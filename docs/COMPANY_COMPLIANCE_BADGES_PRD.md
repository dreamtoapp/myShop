### Title
Company Compliance Badges (VAT, CR, Saudi Business ID) – Data, Settings, and Conditional UI

### Goal
- Store company compliance identifiers in Prisma (VAT, Commercial Registration, Saudi Business/Enterprise ID).
- Expose secure admin-only settings to view/edit these values.
- Render compliance badges in the homepage footer only when corresponding data exists.

### In/Out of Scope
- In: Prisma schema update and migration; admin settings UI (dashboard); server actions; conditional rendering in footer. Arabic-only UI.
- Out: External verification APIs; uploading legal certificates; multi-company; input validation/i18n system.

### Assumptions
- Single `Company` record pattern already used by the app.
- Admin roles are `ADMIN | SUPER_ADMIN` (auth already used in maintenance actions).
- Footer currently uses static demo values and `BadgeDialog` for QR/Copy.

### Data Model (Prisma)
- Existing in `Company`:
  - `taxNumber: String` (already present, used for VAT)
- Add only (plain text, no validation):
  - `commercialRegistrationNumber: String?`
  - `saudiBusinessId: String?`

### Migration
1) Create Prisma migration adding two nullable fields:
   - `commercialRegistrationNumber`
   - `saudiBusinessId`
2) Do not change `taxNumber`. No backfill needed.

### Server Actions
- `actions/company/updateCompliance.ts`
  - Input: `{ taxNumber?: string | null, commercialRegistrationNumber?: string | null, saudiBusinessId?: string | null }`
  - Auth: `ADMIN | SUPER_ADMIN` only.
  - Behavior: trim strings; store as provided without format checks.
  - Writes to `taxNumber` (existing), and the two new fields; returns updated values.
- `actions/company/getCompliance.ts`
  - Returns the three fields for settings and for SSR footer.

- Location: new dedicated route `app/dashboard/management/settings/compliance` (linked in the Settings menu). Keep `tax-info` for legacy QR.
- Navigation: add to `navigationMenu.ts` under Settings: `{ label: 'الامتثال (VAT/CR/رقم التعريف)', href: '/dashboard/management/settings/compliance', icon: 'ShieldCheck' }`.
- Page content: Add a "Compliance" card with three plain text inputs (Arabic labels) bound to:
  - الرقم الضريبي → `taxNumber` (existing)
  - السجل التجاري → `commercialRegistrationNumber` (new)
  - رقم التعريف (Saudi Business) → `saudiBusinessId` (new)
- Behaviors:
  - No input validation; simple text fields.
  - Save button -> calls `updateCompliance` server action.
  - Success/failure toasts (shadcn/sonner).

- ### Homepage Footer – Conditional Badges
- Source: server component reads `getCompliance()`.
- For each field, render its badge only if a non-empty value exists:
  - Saudi Business ID badge (sa_busnees.avif) with dialog showing ID and QR.
  - CR badge (cr.avif) with dialog showing CR and QR.
  - VAT badge (Vat.svg) with dialog showing VAT (from `taxNumber`) and QR.
- Remove any demo labels; keep title and number with copy + QR download.

### Validation Rules (UI)
- None. Values are stored/displayed as provided. Empty value hides the badge.

### Security & Privacy
- Admin-only server actions; never expose edit endpoints publicly.
- SSR-only fetch for footer; no client exposure of values beyond rendered view.
- No logging of IDs in analytics.

### i18n
- Arabic-only labels; no localization planned now.

### Acceptance Criteria
- Can save/update/clear the three fields in dashboard settings.
- Footer shows badges for non-empty values only.
- Copy to clipboard and QR (SVG download) work in each dialog.
- No demo text is shown anywhere; numbers render once near copy button.
- All changes pass type checks and linting.

### Tasks
1) Prisma schema: add `commercialRegistrationNumber`, `saudiBusinessId`; run migration.
2) Add `getCompliance` and `updateCompliance` server actions with auth (read/write `taxNumber` + new fields).
3) Dashboard UI: “Compliance” card with three plain text inputs and Save.
4) Footer:
   - Replace demo constants with values from `getCompliance()`.
   - Conditional rendering of `BadgeDialog` instances when values are non-empty.
5) QA: SSR footer visibility; dialogs copy/QR; access control.

### Rollout Plan
- Deploy migration.
- Ship settings UI; set values in production via dashboard.
- Verify footer shows exactly the configured badges.

### Risks
- Free-text may include typos; mitigated by admin review in settings.
- Multi-tenant future may require scoping by domain; out of scope now.


