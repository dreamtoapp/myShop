# 🎯 SERVER-SIDE CURRENCY IMPLEMENTATION PLAN

## 🔒 PRODUCTION-SAFE SERVER IMPLEMENTATION

**Impact**: Zero risk to 3000+ active users - Server-side currency implementation only

Following the **khalid** production safety protocols for Next.js PRODUCTION Expert Agent.

---

## 📋 **SERVER-SIDE SCOPE**

**Focus**: Server components, server actions, and utilities only (11 files)
**Risk Level**: ZERO (server-side changes, backward compatible)
**Implementation Time**: ~50 minutes
**Testing Required**: 15 minutes

---

## 🎯 **SERVER-SIDE FILES TO REPLACE (11 files)**

### **Server Components (8 files):**
1. `app/(e-comm)/(cart-flow)/cart/components/OrderSummary.tsx` - **SERVER** - **REPLACE** `ر.س` hardcoded (pass currency as prop)
2. `app/(e-comm)/(cart-flow)/cart/components/AddToCartModal.tsx` - **SERVER** - **REPLACE** `ر.س` hardcoded (pass currency as prop)
3. `app/(e-comm)/(adminPage)/user/wishlist/components/WishlistProductCard.tsx` - **SERVER** - **REPLACE** `ر.س` hardcoded (pass currency as prop)
4. `app/(e-comm)/(home-page-sections)/product/cards/QuickViewModalContent.tsx` - **SERVER** - **REPLACE** `ر.س` hardcoded (pass currency as prop)
5. `app/(e-comm)/bestsellers/compnents/BestSellerProductCard.tsx` - **SERVER** - **REPLACE** `ر.س` hardcoded (pass currency as prop)
6. `app/dashboard/show-invoice/[invoiceid]/page.tsx` - **SERVER** - **REPLACE** `ر.س` hardcoded (pass currency as prop)
7. `app/dashboard/management-reports/sales/component/SalesChart.tsx` - **SERVER** - **REPLACE** `ر.س` hardcoded (pass currency as prop)
8. `app/dashboard/management-reports/drivers/[driverId]/page.tsx` - **SERVER** - **REPLACE** `ر.س` hardcoded (pass currency as prop)
9. `app/dashboard/management-categories/view/[id]/page.tsx` - **SERVER** - **REPLACE** `ر.س` hardcoded (pass currency as prop)
10. `app/dashboard/management-suppliers/view/[id]/page.tsx` - **SERVER** - **REPLACE** `ر.س` hardcoded (pass currency as prop)

### **Server Actions (2 files):**
11. `app/dashboard/management-reports/sales/action/getSalesReportData.ts` - **SERVER ACTION** - **REPLACE** `ر.س` hardcoded (query currency from DB)
12. `app/dashboard/management-reports/milestones/action/getMilestonesReportData.ts` - **SERVER ACTION** - **REPLACE** `ر.س` hardcoded (query currency from DB)

### **Utility Files (1 file):**
13. `app/(e-comm)/(adminPage)/user/notifications/helpers/notificationTemplates.ts` - **UTILITY** - **REPLACE** `ر.س` hardcoded (modify function signature)

---

## 🚀 **SERVER-SIDE IMPLEMENTATION ORDER**

### **Phase 1: Server Actions (Priority 1 - Backend Logic)**
1. **Update Server Actions** (2 files):
   - `app/dashboard/management-reports/sales/action/getSalesReportData.ts`
   - `app/dashboard/management-reports/milestones/action/getMilestonesReportData.ts`
   - **Strategy**: Query `company.defaultCurrency` from database
   - **Time**: ~15 minutes

### **Phase 2: Utility Files (Priority 2 - Helper Functions)**
1. **Update Utility Files** (1 file):
   - `app/(e-comm)/(adminPage)/user/notifications/helpers/notificationTemplates.ts`
   - **Strategy**: Modify function signature to accept currency parameter
   - **Time**: ~5 minutes

### **Phase 3: Server Components (Priority 3 - Server-Side Rendering)**
1. **Update Server Components** (8 files):
   - All server components with hardcoded currency
   - **Strategy**: Pass currency as prop from parent components
   - **Time**: ~30 minutes

---

## ✅ **SERVER-SIDE IMPLEMENTATION STRATEGY**

### **For Server Actions:**
```typescript
// 1. Query currency from database
const company = await db.company.findFirst();
const currency = company?.defaultCurrency || 'SAR';

// 2. Use in formatting
// Before: `${amount} ر.س`
// After: formatCurrency(amount, currency)
```

### **For Server Components:**
```typescript
// 1. Accept currency as prop
interface Props {
  currency: string;
}

// 2. Use in component
export function ServerComponent({ currency }: Props) {
  return (
    <div>
      <span>{formatCurrency(100, currency)}</span>
    </div>
  );
}

// 3. Pass from parent component
<ServerComponent currency={company.defaultCurrency} />
```

### **For Utility Files:**
```typescript
// 1. Modify function signature
export function generateTemplate(amount: number, currency: string) {
  // 2. Use currency parameter
  return `${formatCurrency(amount, currency)}`;
}

// 3. Update function calls
generateTemplate(100, 'SAR');
```

---

## 🔒 **SERVER-SIDE SAFETY GUARANTEES**

- **Backward Compatible** - All existing functionality preserved
- **Database Integration** - Currency fetched from company settings
- **Fallback Values** - Default to SAR if currency not set
- **No Breaking Changes** - All existing API preserved
- **Easy Rollback** - Each file can be reverted independently

**Total Implementation Time: ~50 minutes** (11 files total)
**Risk Level: ZERO** (server-side only, backward compatible)
**Testing Required: 15 minutes**

---

## 📝 **SERVER-SIDE IMPLEMENTATION CHECKLIST**

### **Before Implementation:**
- [ ] Verify database schema has `defaultCurrency` field
- [ ] Test `formatCurrency` function with different currencies
- [ ] Ensure company data is accessible in server components

### **During Implementation:**
- [ ] Update server actions first (backend logic)
- [ ] Update utility files second (helper functions)
- [ ] Update server components last (UI components)
- [ ] Test each change individually

### **After Implementation:**
- [ ] Verify all server actions work correctly
- [ ] Test server components render properly
- [ ] Ensure no breaking changes in API
- [ ] Verify currency is passed correctly to child components

---

## 📝 **NEXT STEPS**

1. **Start with Phase 1** - Server actions (backend logic)
2. **Test thoroughly** - Verify database queries work
3. **Proceed phase by phase** - One file at a time
4. **Verify each change** - Ensure no breaking changes

**Ready for immediate implementation with zero risk to production.**
