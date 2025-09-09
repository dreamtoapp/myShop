## Checkout Server Page Hardening Plan (Next.js App Router)

Scope: `app/(e-comm)/(cart-flow)/checkout/page.tsx`
Goal: align with Next.js App Router best practices, improve safety/observability, and reduce latency without behavior changes.

### 1) Data fetching and caching
- Use server utilities directly (current): keep direct DB reads (`fetchCompany`) and server actions.
- Add `noStore` (or `unstable_noStore`) where responses must never cache (user/cart/company):
  - In server helpers that read user/cart/company, call `import { unstable_noStore as noStore } from 'next/cache'` and `noStore()` at the top.
- Prefer tag-based revalidation when settings can change:
  - In company/settings write actions, `revalidateTag('company')`.
  - In readers, use `cache()` + `fetch(..., { next: { tags: ['company'] } })` or keep direct Prisma and rely on noStore.

### 2) Parallelization and error isolation
- Keep `Promise.all` for user/cart/addresses/settings; wrap each in a small guard to return defaults on failure so one error doesn’t crash the page.
- Add a compact safe default for each payload (already done for platform settings). Ensure `addresses` is `[]` on failure.

### 3) Type-safety and contracts
- Define minimal DTO types for the props passed to `CheckoutClient` (no implicit `any`).
- Narrow user/cart item shapes at the boundary (already mapping cart items); add a small `type` for `PlatformSettings` including `requireOtp: boolean`.

### 4) Multi-tenant and environment
- If multi-tenant: derive tenant from `headers()`/host and load the correct company row. Add a `getTenantCompany(tenantId)` helper.
- Ensure `getCompanyOtpRequirement()` is tenant-aware.

### 5) Auth and redirects
- Keep early redirect for unauthenticated users. Add an allow-list for system preview/testing via a feature flag if needed.

### 6) Observability and errors
- Replace generic `console.error` with a unified logger (already using `debug/error`).
- Add breadcrumb context (userId, cartId, tenant) on error logs.

### 7) Security
- Never pass secrets via props. Only non-sensitive computed settings.
- Validate `user.id` before all reads; avoid leaking existence via error messages.

### 8) Performance
- Avoid JSON serialization churn: pass only the fields needed by `CheckoutClient` (already narrowed for cart items).
- Consider streaming parts of the page with Suspense only if needed; otherwise keep simple server-render.

### 9) API elimination (done)
- Removed the `/api/platform-settings` roundtrip; keep direct DB read. Document the endpoint as optional for external uses only.

### 10) Implementation checklist
1. Add `requireOtp` to a `PlatformSettings` interface and pass typed props to `CheckoutClient`.
2. Add `noStore()` in DB reader helpers for user/cart/company (if not present).
3. Make `getCompanyOtpRequirement()` tenant-aware when applicable.
4. Harden error logging with context.
5. Confirm all props are serializable and minimal.

### 11) Rollback plan
- All changes are additive and isolated to server helpers and prop shapes. If issues arise, revert to the previous `getPlatformSettingsDirect()` and disable `noStore()` calls.

### 12) Acceptance criteria
- Page compiles and renders with identical UI.
- CTA validation still respects `requireOtp`.
- No unexpected caching of user/cart/settings (verified by toggling values).

