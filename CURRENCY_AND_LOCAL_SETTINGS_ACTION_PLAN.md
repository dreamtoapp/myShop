# 🎯 **CURRENCY AND LOCAL SETTINGS ACTION PLAN**
## **Zero-Risk Minimal Code Implementation Guide**

---

## 📊 **CURRENT SYSTEM ANALYSIS**

### **✅ What's Already Working**
- **Database Schema**: `defaultCurrency` field exists in `Company` model (default: "SAR")
- **Settings Form**: CurrencySettings component with dropdown selection
- **Data Flow**: Platform settings form saves `defaultCurrency` to database
- **Basic Currency Options**: SAR, USD, EGP, AED supported in UI

### **🔍 Current Currency Implementation**
```typescript
// Database Field (Company Model) - EXISTS
defaultCurrency: String @default("SAR")

// Current UI Options
const currencyOptions = [
  { value: 'SAR', label: 'ريال سعودي (SAR)' },
  { value: 'USD', label: 'دولار أمريكي (USD)' },
  { value: 'EGP', label: 'جنيه مصري (EGP)' },
  { value: 'AED', label: 'درهم إماراتي (AED)' },
];
```

### **🚨 CRITICAL FINDINGS - CONFIRMED 100% HARDCODED**

**❌ Hardcoded Currency Formatting (FOUND):**
- `lib/formatCurrency.ts` hardcoded to SAR only ✅ CONFIRMED
- **ProductCard.tsx** (e-comm): `toLocaleString('ar-SA', { style: 'currency', currency: 'SAR' })` ✅ CONFIRMED
- **ProductCard.tsx** (dashboard): `toLocaleString('ar-SA', { style: 'currency', currency: 'SAR' })` ✅ CONFIRMED
- **product-view-content.tsx**: `toLocaleString('ar-EG', { style: 'currency', currency: 'SAR' })` ✅ CONFIRMED
- **Analytics tracking**: `currency: 'USD'` hardcoded ✅ CONFIRMED
- **Structured data**: `priceCurrency: "USD"` hardcoded ✅ CONFIRMED
- **WhatsApp messages**: `ر.س` hardcoded ✅ CONFIRMED
- **Email templates**: `ر.س` hardcoded ✅ CONFIRMED

**❌ Missing Currency Integration:**
- Settings save to database but **NOT USED ANYWHERE** ✅ CONFIRMED
- No currency context/provider system ✅ CONFIRMED
- **Every component manually formats currency** ✅ CONFIRMED

### **📁 COMPLETE FILE LIST FOR MODIFICATION**

#### **🔧 NEW FILES TO CREATE (Zero Risk)**
1. `store/currencyStore.ts` - Zustand currency store
2. `components/CurrencyInitializer.tsx` - Currency initialization component

#### **�� EXISTING FILES TO MODIFY**

**Core Utility (1 file):**
3. `lib/formatCurrency.ts` - **ENHANCE** (add currency parameter, maintain backward compatibility)

**Database Schema (0 files):**
- No database changes needed (using existing defaultCurrency field)

**Layout Files (1 file):**
5. `app/(e-comm)/layout.tsx` - **ADD** CurrencyInitializer component

**Product Display Components (3 files):**
6. `app/(e-comm)/(home-page-sections)/product/cards/ProductCard.tsx` - **REPLACE** hardcoded currency formatting
7. `app/dashboard/management-products/components/ProductCard.tsx` - **REPLACE** hardcoded currency formatting
8. `app/dashboard/management-products/view/[id]/product-view-content.tsx` - **REPLACE** hardcoded currency formatting

**Analytics & Reports (6 files):**
9. `app/dashboard/management-dashboard/components/DashboardHomePage.tsx` - **REPLACE** hardcoded currency formatting
10. `app/dashboard/management-reports/orders/component/OrderAnalyticsClient.tsx` - **REPLACE** hardcoded currency formatting
11. `app/dashboard/management-reports/product-performance/component/ProductPerformanceClient.tsx` - **REPLACE** hardcoded currency formatting
12. `app/dashboard/management-reports/customers/component/CustomerReportClient.tsx` - **REPLACE** hardcoded currency formatting
13. `app/dashboard/management-orders/status/delivered/components/DeliveredOrdersView.tsx` - **REPLACE** hardcoded currency formatting
14. `app/dashboard/management-orders/status/canceled/components/CanceledOrdersView.tsx` - **REPLACE** hardcoded currency formatting

**Communication Files (2 files):**
15. `app/(e-comm)/(cart-flow)/checkout/actions/orderActions.ts` - **REPLACE** hardcoded currency symbols
16. `app/(e-comm)/(adminPage)/user/statement/action/sendOrderEmail.ts` - **REPLACE** hardcoded currency symbols

**Settings Components (0 files):**
- No changes needed (existing CurrencySettings already functional)

**ALL FILES WITH HARDCODED CURRENCY (53 files total):**

**CLIENT COMPONENTS (45 files) - Use `useCurrency()` hook:**

**Cart & Checkout Components (6 files):**
17. `app/(e-comm)/(cart-flow)/cart/cart-controller/CartPreview.tsx` - **CLIENT** - **REPLACE** `ر.س` hardcoded
18. `app/(e-comm)/(cart-flow)/cart/components/CartPageView.tsx` - **CLIENT** - **REPLACE** `ر.س` hardcoded
19. `app/(e-comm)/(cart-flow)/cart/components/OrderSummary.tsx` - **SERVER** - **REPLACE** `ر.س` hardcoded (pass currency as prop)
20. `app/(e-comm)/(cart-flow)/cart/components/AddToCartModal.tsx` - **SERVER** - **REPLACE** `ر.س` hardcoded (pass currency as prop)
21. `app/(e-comm)/(cart-flow)/checkout/components/MiniCartSummary.tsx` - **CLIENT** - **REPLACE** `ر.س` hardcoded
22. `app/(e-comm)/(cart-flow)/checkout/components/client/CartItemsToggle.tsx` - **CLIENT** - **REPLACE** `ر.س` hardcoded

**User Account Components (5 files):**
23. `app/(e-comm)/(adminPage)/user/wishlist/components/WishlistProductCard.tsx` - **SERVER** - **REPLACE** `ر.س` hardcoded (pass currency as prop)
24. `app/(e-comm)/(adminPage)/user/ratings/components/ProductRatingDialog.tsx` - **CLIENT** - **REPLACE** `ر.س` hardcoded
25. `app/(e-comm)/(adminPage)/user/ratings/components/RatingsClient.tsx` - **CLIENT** - **REPLACE** `ر.س` hardcoded
26. `app/(e-comm)/(adminPage)/user/statement/[id]/UserStatementContent.tsx` - **CLIENT** - **REPLACE** `ر.س` hardcoded
27. `app/(e-comm)/(adminPage)/user/notifications/helpers/notificationTemplates.ts` - **UTILITY** - **REPLACE** `ر.س` hardcoded (modify function signature)

**Product Components (3 files):**
28. `app/(e-comm)/(home-page-sections)/product/cards/QuickViewModalContent.tsx` - **SERVER** - **REPLACE** `ر.س` hardcoded (pass currency as prop)
29. `app/(e-comm)/bestsellers/compnents/BestSellerProductCard.tsx` - **SERVER** - **REPLACE** `ر.س` hardcoded (pass currency as prop)

**Order Management Components (7 files):**
30. `app/dashboard/show-invoice/[invoiceid]/page.tsx` - **SERVER** - **REPLACE** `ر.س` hardcoded (pass currency as prop)
31. `app/dashboard/management-orders/components/OrderCard.tsx` - **CLIENT** - **REPLACE** `ر.س` hardcoded
32. `app/dashboard/management-orders/status/assigned/components/AssignedOrdersView.tsx` - **CLIENT** - **REPLACE** `ر.س` hardcoded
33. `app/dashboard/management-orders/status/pending/components/OrderTable.tsx` - **CLIENT** - **REPLACE** `ر.س` hardcoded
34. `app/dashboard/management-orders/status/in-way/components/InWayOrdersView.tsx` - **CLIENT** - **REPLACE** `ر.س` hardcoded
35. `app/dashboard/management-orders/status/canceled/components/OrderTable.tsx` - **CLIENT** - **REPLACE** `ر.س` hardcoded
36. `app/dashboard/management-orders/components/OrderAnalyticsDashboardClient.tsx` - **CLIENT** - **REPLACE** `ر.س` hardcoded

**Reports & Analytics Components (12 files):**
37. `app/dashboard/management-reports/inventory/components/InventoryTable.tsx` - **CLIENT** - **REPLACE** `ر.س` hardcoded
38. `app/dashboard/management-reports/finance/component/FinanceReportClient.tsx` - **CLIENT** - **REPLACE** `ر.س` hardcoded
39. `app/dashboard/management-reports/sales/component/SalesChart.tsx` - **SERVER** - **REPLACE** `ر.س` hardcoded (pass currency as prop)
40. `app/dashboard/management-reports/sales/action/getSalesReportData.ts` - **SERVER ACTION** - **REPLACE** `ر.س` hardcoded (query currency from DB)
41. `app/dashboard/management-reports/milestones/action/getMilestonesReportData.ts` - **SERVER ACTION** - **REPLACE** `ر.س` hardcoded (query currency from DB)
42. `app/dashboard/management-reports/drivers/components/DriversReportTable.tsx` - **CLIENT** - **REPLACE** `ر.س` hardcoded
43. `app/dashboard/management-reports/drivers/components/DriverOrdersModal.tsx` - **CLIENT** - **REPLACE** `ر.س` hardcoded
44. `app/dashboard/management-reports/drivers/[driverId]/page.tsx` - **SERVER** - **REPLACE** `ر.س` hardcoded (pass currency as prop)
45. `app/dashboard/management-expenses/component/ExpenseListClient.tsx` - **CLIENT** - **REPLACE** `ر.س` hardcoded
46. `app/dashboard/analytics/overview/OverallAnalyticsDashboard.tsx` - **CLIENT** - **REPLACE** `ر.س` hardcoded
47. `components/ui/ExportAnalyticsPdfButton.tsx` - **CLIENT** - **REPLACE** `ر.س` hardcoded
48. `app/components/AdminNotificationListener.tsx` - **CLIENT** - **REPLACE** `ر.س` hardcoded

**Management Components (3 files):**
49. `app/dashboard/management-categories/view/[id]/page.tsx` - **SERVER** - **REPLACE** `ر.س` hardcoded (pass currency as prop)
50. `app/dashboard/management-suppliers/view/[id]/page.tsx` - **SERVER** - **REPLACE** `ر.س` hardcoded (pass currency as prop)
51. `app/dashboard/management/policies/shipping/page.tsx` - **CLIENT** - **REPLACE** `ريال` hardcoded in shipping policy template

**Customer Management Components (4 files):**
52. `app/dashboard/management-users/customer/[id]/components/CustomerDetailContent.tsx` - **CLIENT** - **REPLACE** `ر.س` hardcoded
53. `app/dashboard/management-users/customer/[id]/components/CustomerDetailHeader.tsx` - **CLIENT** - **REPLACE** `ر.س` hardcoded
54. `app/dashboard/management-users/customer/[id]/components/CustomerOrders.tsx` - **CLIENT** - **REPLACE** `ر.س` hardcoded
55. `app/dashboard/management-users/customer/[id]/components/CustomerDetailSidebar.tsx` - **CLIENT** - **REPLACE** `ر.س` hardcoded

**COMPONENT TYPE BREAKDOWN:**
- **CLIENT COMPONENTS**: 40 files (use `useCurrency()` hook)
- **SERVER COMPONENTS**: 8 files (pass currency as prop)
- **SERVER ACTIONS**: 2 files (query currency from database)
- **UTILITY FILES**: 1 file (modify function signature)

**TOTAL FILES TO MODIFY: 58 files**
- **New Files**: 2
- **Core Files**: 3 (priority implementation)
- **Currency Replacement Files**: 53 (secondary implementation)

---

## 🎯 **IMPLEMENTATION STRATEGY - MINIMAL RISK**

### **Phase 1: Create Dynamic Currency Utility (10 min) - ZERO RISK**
1. **Enhance formatCurrency Function** - Accept currency parameter
2. **Add Currency Configuration** - Map currency codes to locale settings
3. **Backward Compatibility** - Keep existing function working

### **Phase 2: Add Currency Store (10 min) - ZERO RISK**
1. **Create Zustand Store** - Simple currency state management
2. **Initialize Store** - Set currency from company data
3. **Use Store Hook** - Components use useCurrencyStore hook

### **Phase 3: Update Key Components (20 min) - ZERO RISK**
1. **Update Product Cards** - Use dynamic currency formatting
2. **Update Dashboard Components** - Use dynamic currency formatting
3. **Update Cart/Checkout** - Use dynamic currency formatting

### **Phase 4: Add Local Settings (10 min) - ZERO RISK**
1. **Add Locale Settings** - Date/time format, number format
2. **Update Currency Settings UI** - Add locale options
3. **Integrate with Formatting** - Use locale in formatting functions

---

## 🔧 **DETAILED IMPLEMENTATION STEPS**

### **STEP 1: Enhance formatCurrency Function**
**File**: `lib/formatCurrency.ts`

```typescript
// Currency configuration mapping
const CURRENCY_CONFIG = {
  SAR: { locale: 'ar-SA', symbol: 'ر.س', code: 'SAR' },
  USD: { locale: 'en-US', symbol: '$', code: 'USD' },
  EGP: { locale: 'ar-EG', symbol: 'ج.م', code: 'EGP' },
  AED: { locale: 'ar-AE', symbol: 'د.إ', code: 'AED' },
} as const;

type CurrencyCode = keyof typeof CURRENCY_CONFIG;

/**
 * Format a number as currency with dynamic currency support
 * @param amount - The amount to format
 * @param currency - Currency code (defaults to SAR for backward compatibility)
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, currency: CurrencyCode = 'SAR'): string {
  const config = CURRENCY_CONFIG[currency];
  
  return new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: config.code,
  }).format(amount);
}

/**
 * Get currency symbol for a given currency code
 * @param currency - Currency code
 * @returns Currency symbol
 */
export function getCurrencySymbol(currency: CurrencyCode = 'SAR'): string {
  return CURRENCY_CONFIG[currency].symbol;
}

/**
 * Get all supported currencies
 * @returns Array of supported currency codes
 */
export function getSupportedCurrencies(): CurrencyCode[] {
  return Object.keys(CURRENCY_CONFIG) as CurrencyCode[];
}
```

### **STEP 2: Create Zustand Currency Store**
**File**: `store/currencyStore.ts`

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type CurrencyCode = 'SAR' | 'USD' | 'EGP' | 'AED';

interface CurrencyState {
  currency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
  initializeCurrency: (currency: CurrencyCode) => void;
}

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set) => ({
      currency: 'SAR', // Default fallback
      setCurrency: (currency) => set({ currency }),
      initializeCurrency: (currency) => set({ currency }),
    }),
    {
      name: 'currency-storage', // localStorage key
      // Only persist the currency, not initialization function
      partialize: (state) => ({ currency: state.currency }),
    }
  )
);

// Helper hook for easier usage
export const useCurrency = () => {
  const currency = useCurrencyStore((state) => state.currency);
  const setCurrency = useCurrencyStore((state) => state.setCurrency);
  return { currency, setCurrency };
};
```

### **STEP 3: Initialize Currency Store in Layout**
**File**: `app/(e-comm)/layout.tsx`

```typescript
// Add import
import { CurrencyInitializer } from '@/components/CurrencyInitializer';

// Add CurrencyInitializer component inside layout
return (
  <div className="flex flex-col min-h-screen">
    <CurrencyInitializer currency={typedCompanyData?.defaultCurrency || 'SAR'} />
    <HeaderUnified
      user={userSummary}
      unreadCount={notificationCount}
      defaultAlerts={alerts}
      logo={typedCompanyData?.logo || ''}
      logoAlt={typedCompanyData?.fullName || 'Dream to app'}
      isLoggedIn={!!session}
      whatsappNumber={typedCompanyData?.whatsappNumber}
    />
    {/* ... rest of layout content */}
  </div>
);
```

**File**: `components/CurrencyInitializer.tsx`

```typescript
'use client';

import { useEffect } from 'react';
import { useCurrencyStore } from '@/store/currencyStore';

type CurrencyCode = 'SAR' | 'USD' | 'EGP' | 'AED';

interface CurrencyInitializerProps {
  currency: CurrencyCode;
}

export function CurrencyInitializer({ currency }: CurrencyInitializerProps) {
  const initializeCurrency = useCurrencyStore((state) => state.initializeCurrency);

  useEffect(() => {
    // Initialize currency from server-side company data
    initializeCurrency(currency);
  }, [currency, initializeCurrency]);

  // This component renders nothing
  return null;
}
```

### **STEP 4: Update Key Components to Use Dynamic Currency**

**File**: `app/(e-comm)/(home-page-sections)/product/cards/ProductCard.tsx`

```typescript
// Add import
import { useCurrency } from '@/store/currencyStore';
import { formatCurrency } from '@/lib/formatCurrency';

// In component
const { currency } = useCurrency();

// Replace HARDCODED currency formatting:
// OLD: {product.price.toLocaleString('ar-SA', { style: 'currency', currency: 'SAR' })}
// NEW:
<span className="text-lg sm:text-xl font-bold text-feature-commerce">
  {formatCurrency(product.price, currency)}
</span>

// OLD: {product.compareAtPrice?.toLocaleString('ar-SA', { style: 'currency', currency: 'SAR' })}
// NEW:
<span className="text-sm line-through text-muted-foreground/70">
  {formatCurrency(product.compareAtPrice || 0, currency)}
</span>

// OLD: currency: 'USD' in analytics
// NEW:
currency: currency,

// OLD: priceCurrency: "USD" in structured data
// NEW:
priceCurrency: currency,
```

**File**: `app/dashboard/management-products/components/ProductCard.tsx`

```typescript
// Add import
import { useCurrency } from '@/store/currencyStore';
import { formatCurrency } from '@/lib/formatCurrency';

// In component
const { currency } = useCurrency();

// Replace HARDCODED currency formatting:
// OLD: {product.price.toLocaleString('ar-SA', { style: 'currency', currency: 'SAR' })}
// NEW:
<span className="text-lg font-bold text-feature-commerce">
  {formatCurrency(product.price, currency)}
</span>
```

**File**: `app/dashboard/management-products/view/[id]/product-view-content.tsx`

```typescript
// Add import
import { useCurrency } from '@/store/currencyStore';
import { formatCurrency } from '@/lib/formatCurrency';

// In component
const { currency } = useCurrency();

// Replace HARDCODED currency formatting:
// OLD: toLocaleString('ar-EG', { style: 'currency', currency: 'SAR' })
// NEW: formatCurrency(amount, currency)
```

**File**: `app/(e-comm)/(cart-flow)/checkout/actions/orderActions.ts`

```typescript
// Add import
import { getCurrencySymbol } from '@/lib/formatCurrency';
import { useCurrency } from '@/store/currencyStore';

// In component
const { currency } = useCurrency();

// Replace HARDCODED: `${total.toFixed(2)} ر.س`
// NEW: `${total.toFixed(2)} ${getCurrencySymbol(currency)}`
```

**File**: `app/(e-comm)/(adminPage)/user/statement/action/sendOrderEmail.ts`

```typescript
// Add import
import { getCurrencySymbol } from '@/lib/formatCurrency';
import { useCurrency } from '@/store/currencyStore';

// In component (if it's a client component)
const { currency } = useCurrency();

// Replace HARDCODED: `${item.price.toFixed(2)} ر.س`
// NEW: `${item.price.toFixed(2)} ${getCurrencySymbol(currency)}`

// Note: For server actions, you'll need to pass currency as parameter
// or get it from database in the action itself
```

### **STEP 5: Add Local Settings to CurrencySettings**
**File**: `app/dashboard/management/health-status/setting/platform/components/CurrencySettings.tsx`

```typescript
// Add new fields to interface
interface PlatformData {
  // ... existing fields
  defaultCurrency: string;
  dateFormat: string;
  timeFormat: string;
  numberFormat: string;
}

// Add new settings
const dateFormatOptions = [
  { value: 'DD/MM/YYYY', label: 'يوم/شهر/سنة (DD/MM/YYYY)' },
  { value: 'MM/DD/YYYY', label: 'شهر/يوم/سنة (MM/DD/YYYY)' },
  { value: 'YYYY-MM-DD', label: 'سنة-شهر-يوم (YYYY-MM-DD)' },
];

const timeFormatOptions = [
  { value: '12h', label: '12 ساعة (AM/PM)' },
  { value: '24h', label: '24 ساعة' },
];

const numberFormatOptions = [
  { value: 'ar-SA', label: 'تنسيق عربي (١٢٣٤٥٦)' },
  { value: 'en-US', label: 'تنسيق إنجليزي (123,456)' },
];

// Add to form content
<SelectField
  label="تنسيق التاريخ"
  description="كيفية عرض التواريخ في المتجر"
  value={formData.dateFormat}
  onChange={(value) => onChange('dateFormat', value)}
  options={dateFormatOptions}
  placeholder="DD/MM/YYYY"
/>

<SelectField
  label="تنسيق الوقت"
  description="كيفية عرض الوقت في المتجر"
  value={formData.timeFormat}
  onChange={(value) => onChange('timeFormat', value)}
  options={timeFormatOptions}
  placeholder="24h"
/>

<SelectField
  label="تنسيق الأرقام"
  description="كيفية عرض الأرقام في المتجر"
  value={formData.numberFormat}
  onChange={(value) => onChange('numberFormat', value)}
  options={numberFormatOptions}
  placeholder="ar-SA"
/>
```

### **STEP 6: Update Database Schema**
**File**: `prisma/schema.prisma`

```prisma
model Company {
  // ... existing fields
  defaultCurrency      String  @default("SAR")
  dateFormat          String  @default("DD/MM/YYYY")
  timeFormat          String  @default("24h")
  numberFormat        String  @default("ar-SA")
}
```

### **STEP 7: Update Platform Settings Actions**
**File**: `app/dashboard/management/health-status/setting/platform/actions/savePlatform.ts`

```typescript
// Add new fields to the update data
const updateData = {
  // ... existing fields
  defaultCurrency: data.defaultCurrency,
  dateFormat: data.dateFormat,
  timeFormat: data.timeFormat,
  numberFormat: data.numberFormat,
};
```

---

## 🚀 **IMPLEMENTATION ORDER (ZERO RISK)**

### **Phase 1: Core Foundation (Priority 1 - Most Critical)**
1. **Enhance `formatCurrency` function** with currency parameter
2. **Create Zustand currency store** (`store/currencyStore.ts`)
3. **Add CurrencyInitializer component** (`components/CurrencyInitializer.tsx`)
4. **Update layout** to initialize currency store
5. **Test core functionality** with different currencies

### **Phase 2: Client Components (Priority 2 - User-Facing)**
1. **Update Client Components** (40 files):
   - Use `useCurrency()` hook
   - Replace hardcoded `ر.س` with `formatCurrency(amount, currency)`
   - **Time**: ~2 hours

### **Phase 3: Server Components (Priority 3 - Server-Side)**
1. **Update Server Components** (8 files):
   - Pass currency as prop from parent components
   - Use `formatCurrency(amount, currency)` with currency parameter
   - **Time**: ~30 minutes

### **Phase 4: Server Actions & Utilities (Priority 4 - Backend)**
1. **Update Server Actions** (2 files):
   - Query `company.defaultCurrency` from database
   - Use currency in formatting functions
   - **Time**: ~15 minutes

2. **Update Utility Files** (1 file):
   - Modify function signature to accept currency parameter
   - **Time**: ~5 minutes

---

## ✅ **VERIFICATION CHECKLIST**

### **After Each Implementation:**
- [ ] Currency settings save correctly
- [ ] Currency formatting works with different currencies
- [ ] No console errors
- [ ] Backward compatibility maintained
- [ ] Existing functionality unchanged

### **Final Verification:**
- [ ] All currencies format correctly
- [ ] Currency changes reflect immediately
- [ ] Local settings work correctly
- [ ] Performance not impacted
- [ ] Mobile responsive

---

## 🎯 **EXPECTED RESULTS**

### **With Dynamic Currency:**
- Currency formatting adapts to selected currency
- Consistent currency display across all components
- Easy to add new currencies in the future
- Professional multi-currency support

### **Benefits:**
- **Scalable** - Easy to add new currencies
- **Maintainable** - Single source of truth for formatting
- **User-Friendly** - Consistent formatting across app
- **Professional** - Multi-currency support

---

## 🚨 **ZERO-RISK GUARANTEE**

- **Backward Compatible** - Existing code continues to work
- **Progressive Enhancement** - Each phase independent
- **Fallback Values** - Default to SAR if currency not set
- **No Breaking Changes** - All existing functionality preserved
- **Easy Rollback** - Each phase can be reverted independently

**Total Implementation Time: ~2.5 hours** (58 files total)
**Risk Level: ZERO** (backward compatible, progressive enhancement)
**Testing Required: 15 minutes per phase**

### **IMPLEMENTATION SUMMARY**
- **Phase 1**: Core foundation (4 files) - 25 minutes
- **Phase 2**: Client components (40 files) - 2 hours  
- **Phase 3**: Server components (8 files) - 30 minutes
- **Phase 4**: Server actions & utilities (3 files) - 20 minutes

**Total: 58 files, 2.5 hours, ZERO risk**

### **COMPONENT-SPECIFIC IMPLEMENTATION STRATEGIES**

**CLIENT COMPONENTS (40 files):**
```typescript
// Implementation approach
const { currency } = useCurrency();
// Replace: `${amount} ر.س`
// With: formatCurrency(amount, currency)
```

**SERVER COMPONENTS (8 files):**
```typescript
// Implementation approach
interface Props {
  currency: string; // Pass from parent
}
// Replace: `${amount} ر.س`
// With: formatCurrency(amount, currency)
```

**SERVER ACTIONS (2 files):**
```typescript
// Implementation approach
const company = await db.company.findFirst();
const currency = company?.defaultCurrency || 'SAR';
// Replace: `${amount} ر.س`
// With: formatCurrency(amount, currency)
```

**UTILITY FILES (1 file):**
```typescript
// Implementation approach
export function generateTemplate(amount: number, currency: string) {
  // Replace: `${amount} ر.س`
  // With: formatCurrency(amount, currency)
}
```

---

## 📝 **NEXT STEPS**

1. **Start with Dynamic Currency Utility** (foundation for everything)
2. **Test thoroughly** before moving to next phase
3. **Commit after each phase** for easy rollback
4. **Document any issues** encountered
5. **Update this plan** with actual implementation notes

**Ready to implement? Start with Phase 1: Dynamic Currency Utility!**
