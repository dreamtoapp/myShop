# BASE_URL & NEXT_PUBLIC_BASE_URL Migration Action Plan

## 📋 **OVERVIEW**
Migrate `BASE_URL` and `NEXT_PUBLIC_BASE_URL` environment variables to use database values from `company.website` field via `getAppConfig()` helper function with environment variable fallbacks.

## 🎯 **CURRENT USAGE ANALYSIS**

### **1. BASE_URL Usage:**
- **File:** `app/dashboard/show-invoice/actions/sendInvoiceEmail.ts`
  - **Line 94:** `company.website || process.env.BASE_URL || '#'` (email footer fallback)
  - **Line 111:** `const orderLink = \`${process.env.BASE_URL}/client-invoice/${orderId}\`` (invoice link)
  - **Line 112:** `if (!process.env.BASE_URL) throw new Error('Base URL not configured');` (validation)

### **2. NEXT_PUBLIC_BASE_URL Usage:**
- **No direct usage found** in codebase

### **3. NEXT_PUBLIC_APP_URL Usage:**
- **File:** `app/(e-comm)/(cart-flow)/cart/page.tsx`
  - **Line 9:** `const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';` (platform settings fetch)

### **4. Dynamic URL Resolution (Already Using Database):**
- **Files:** `app/robots.ts`, `app/sitemap.ts`
- **Function:** `getNextAuthURL()` from `lib/auth-dynamic-config.ts`
- **Status:** ✅ Already using database via `getNextAuthURLAsync()`

### **5. Existing Helper Functions (Ready to Use):**
- **File:** `helpers/appConfig.ts` ✅
- **Function:** `getAppConfig()` - Returns `{ appName, appUrl }` from `company.website`
- **File:** `helpers/cachedAppConfig.ts` ✅
- **Function:** `getCachedAppConfig()` - Cached version with 1-hour revalidation

## 🔍 **SCHEMA VERIFICATION**

### **Company Model Fields (Prisma Schema):**
- **`fullName`** (line 295) - Company name → Used for `APP_NAME` ✅
- **`website`** (line 309) - Website URL → Used for `APP_URL`/`BASE_URL` ✅

### **Current Implementation Status:**
- **`helpers/appConfig.ts`** ✅ - Correctly uses `company.website` for `appUrl`
- **`helpers/cachedAppConfig.ts`** ✅ - Correctly uses `company.website` for `appUrl`
- **`app/api/platform-settings/route.ts`** ✅ - Returns `appUrl` from database

## 🚀 **MIGRATION PLAN**

### **TASK 1: UPDATE INVOICE EMAIL FUNCTION**
**File:** `app/dashboard/show-invoice/actions/sendInvoiceEmail.ts`

#### **Step 1.1: Update Invoice Link Generation**
- **Current:** `const orderLink = \`${process.env.BASE_URL}/client-invoice/${orderId}\``
- **New:** Use `getAppConfig()` to get `appUrl` from `company.website` field
- **Fallback:** Environment variable → `http://localhost:3000`
- **Implementation:** `const { appUrl } = await getAppConfig(); const orderLink = \`${appUrl}/client-invoice/${orderId}\``

#### **Step 1.2: Update Email Template**
- **Current:** `company.website || process.env.BASE_URL || '#'`
- **New:** Use `appUrl` from `getAppConfig()` with proper fallback chain
- **Implementation:** `appUrl || '#'` (since `getAppConfig()` already handles fallbacks)

#### **Step 1.3: Remove BASE_URL Validation**
- **Current:** `if (!process.env.BASE_URL) throw new Error('Base URL not configured');`
- **New:** Remove validation since `getAppConfig()` provides guaranteed fallback
- **Implementation:** No validation needed - `getAppConfig()` always returns a valid URL

### **TASK 2: UPDATE CART PAGE**
**File:** `app/(e-comm)/(cart-flow)/cart/page.tsx`

#### **Step 2.1: Update Platform Settings Fetch**
- **Current:** `const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';`
- **New:** Use `getAppConfig()` to get `appUrl` from `company.website` field
- **Fallback:** Environment variable → `http://localhost:3000`
- **Implementation:** `const { appUrl } = await getAppConfig(); const response = await fetch(\`${appUrl}/api/platform-settings\`, ...)`

### **TASK 3: CREATE HELPER FUNCTION FOR CLIENT-SIDE**
**File:** `helpers/clientAppConfig.ts` (NEW)

#### **Step 3.1: Create Client-Side Helper**
- **Purpose:** Provide app URL for client-side components
- **Method:** Use platform settings API that already returns `appUrl`
- **Fallback:** Environment variable → `http://localhost:3000`

### **TASK 4: UPDATE PLATFORM SETTINGS API**
**File:** `app/api/platform-settings/route.ts`

#### **Step 4.1: Verify Current Implementation**
- **Status:** ✅ Already returns `appUrl` from database
- **Action:** No changes needed

### **TASK 5: TESTING & VERIFICATION**

#### **Step 5.1: TypeScript Check**
- Run `pnpm run check-types`
- Ensure no type errors

#### **Step 5.2: ESLint Check**
- Run `pnpm run check-lint`
- Ensure no linting errors

#### **Step 5.3: Build Test**
- Run `pnpm run build`
- Ensure production build succeeds

#### **Step 5.4: Functionality Test**
- Test invoice email generation
- Test cart page platform settings fetch
- Verify all URLs work correctly

## 📊 **IMPLEMENTATION DETAILS**

### **Data Flow:**
1. **Database Query:** `company.website` → `appUrl` via `getAppConfig()`
2. **Helper Function:** `getAppConfig()` with fallback chain: `company.website` → `process.env.APP_URL` → `http://localhost:3000`
3. **Caching:** `getCachedAppConfig()` with 1-hour cache and `company` tag revalidation
4. **Client-Side:** Platform settings API returns `appUrl` from database
5. **Fallback Chain:** Database → Environment → Default

### **Files to Modify:**
1. `app/dashboard/show-invoice/actions/sendInvoiceEmail.ts`
2. `app/(e-comm)/(cart-flow)/cart/page.tsx`
3. `helpers/clientAppConfig.ts` (NEW)

### **Files Already Correct:**
1. `app/api/platform-settings/route.ts` ✅
2. `app/robots.ts` ✅ (uses `getNextAuthURL()`)
3. `app/sitemap.ts` ✅ (uses `getNextAuthURL()`)

## 🔒 **SAFETY MEASURES**

### **Zero-Risk Protocol:**
- ✅ **No Database Changes** - Uses existing `website` field
- ✅ **Environment Fallback** - Still works if database fails
- ✅ **Zero Downtime** - No breaking changes
- ✅ **Easy Rollback** - Can revert code changes
- ✅ **Clean Build** - No errors or warnings

### **Fallback Chain:**
1. **Primary:** `company.website` (database field)
2. **Secondary:** `process.env.APP_URL` (environment variable)
3. **Tertiary:** `http://localhost:3000` (default fallback)

## 🎯 **EXPECTED OUTCOMES**

### **After Migration:**
- ✅ All BASE_URL usages use database values
- ✅ All NEXT_PUBLIC_APP_URL usages use database values
- ✅ Environment variables can be removed from `.env`
- ✅ Centralized URL management via admin panel
- ✅ Consistent URL handling across the application

### **Environment Variables to Remove:**
- `BASE_URL=http://localhost:3000`
- `NEXT_PUBLIC_BASE_URL=http://localhost:3000`
- `NEXT_PUBLIC_APP_URL=http://localhost:3000`

**Note:** `APP_URL` environment variable will remain as fallback for `getAppConfig()` function.

## 📝 **EXECUTION CHECKLIST**

- [ ] **Task 1:** Update invoice email function
- [ ] **Task 2:** Update cart page
- [ ] **Task 3:** Create client-side helper
- [ ] **Task 4:** Verify platform settings API
- [ ] **Task 5:** Run comprehensive tests
- [ ] **Task 6:** Remove environment variables from `.env`

## 🚨 **CRITICAL NOTES**

1. **Invoice Email:** Critical for customer communication
2. **Cart Page:** Critical for platform settings fetch
3. **SEO Files:** Already using database (no changes needed)
4. **Authentication:** Already using database (no changes needed)

## 📈 **SUCCESS METRICS**

- ✅ TypeScript compilation passes
- ✅ ESLint passes with no errors
- ✅ Production build succeeds
- ✅ All URL-dependent features work correctly
- ✅ Environment variables can be safely removed
