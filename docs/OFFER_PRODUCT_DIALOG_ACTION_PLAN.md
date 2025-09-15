### Offer Product Dialog – Zero-Risk Action Plan

#### Goal
Enable adding a new product directly from an Offer manage page via a dialog. The created item uses the existing `Product` table with `type = 'offer-only'`, is automatically linked to the current `Offer` via `OfferProduct`, and the page lists all linked products immediately. No breaking changes.

#### Zero-Risk Principles
- Additive only: do not remove or alter existing flows (assign existing products still works).
- Keep current schema/models intact (use existing `Product.type`, `OfferProduct`).
- Graceful error handling; revalidation of affected paths.
- Clear rollback: new UI is additive; simply hide/remove the button if needed.

---

#### Current Models (unchanged)
- `Product`: has `type String @default("product")`.
- `Offer`: existing model.
- `OfferProduct`: join table with unique `(offerId, productId)`.

---

#### New UX Flow
- Location: `/dashboard/management-offer/manage/[id]`.
- Add button: "إضافة منتج للعرض" (Add Product to Offer).
- Opens dialog "منتج جديد للعرض" with minimal fields:
  - name, price, image (single), optional category.
- On submit:
  1) Create `Product` with `type = 'offer-only'`, `published = true`.
  2) Link to current offer via `OfferProduct.create`.
  3) Revalidate relevant paths and close dialog.
- Assigned products list shows new item instantly.

---

#### Feature Flag
Not required. The dialog will be available by default. If you need to hide it temporarily, comment out the button or add a simple runtime check.

---

#### Server Actions (new)
1) `app/dashboard/management-offer/actions/create-offer-product.ts`
   - Input: `{ offerId, name, price, imageUrl?, categoryId? }`
   - Steps:
     - Validate offer exists.
     - Create `Product`:
       - `type: 'offer-only'`, `published: true`, map basic fields.
       - Optional: create `CategoryProduct` link if `categoryId` provided.
     - Create `OfferProduct` row to link product to offer.
     - `revalidatePath('/dashboard/management-offer');`
       `revalidatePath(`/dashboard/management-offer/manage/${offerId}`);`
     - Return `{ success, message, productId }`.

2) (Optional) `list-offer-products.ts` – slim list for assigned products.

3) (Optional) `unlink-offer-product.ts` – removes only the link, not the product.

4) (Optional) `toggleProductType.ts` – flips between `'offer-only'` and `'product'`.

---

#### Components (new/updated)
- New: `app/dashboard/management-offer/components/OfferProductDialog.tsx`
  - Props: `{ offerId: string; onSuccess?: (productId: string) => void }`.
  - Simple form with client-side validation.
  - Calls `create-offer-product` action.

- Update: `manage/[id]/page.tsx`
  - Add primary button to open dialog.
  - Keep existing `ProductSelector` (backward compatible). Optionally remove later if desired.

- (Optional) Update: `AssignedProducts.tsx`
  - Show small badge if `product.type === 'offer-only'` ("عرض فقط").

---

#### API/Queries
- Homepage: already filtered to `{ published: true, type: 'product' }` (excludes offer-only).
- Offer page: continues to list products via `OfferProduct` join; no changes.

---

#### Rollback Plan
- Remove or hide the dialog button; existing behaviors remain.
- Created products persist; can unlink or change `type` back to `'product'` later.
- No migrations → safe rollback.

---

#### Testing Checklist
- Create product via dialog → appears in assigned list.
- Product `type` is `'offer-only'`; not shown in homepage grid.
- Unlinking keeps the product; re-link works.
- Existing flow (assign existing product) still works.
- No console errors; ESLint clean; Arabic labels correct.

---

#### Implementation Tasks (sequence)
1) Create server action `create-offer-product.ts` with validation and revalidation.
2) Add `OfferProductDialog.tsx` with minimal fields and submit.
3) Wire dialog into `manage/[id]/page.tsx` with a primary button.
4) (Optional) Add badge in `AssignedProducts.tsx` for offer-only.
5) Test end-to-end.


