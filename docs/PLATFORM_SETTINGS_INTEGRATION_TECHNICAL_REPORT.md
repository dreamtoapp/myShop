# 🔧 Platform Settings Integration - Critical Implementation Checklist

## 🚨 **CRITICAL TASK - IMPLEMENTATION CHECKLIST**

> **⚠️ WARNING**: This is a critical integration task that affects the entire e-commerce frontend. Follow each step carefully and verify before proceeding to the next step.

---

## 📋 **PHASE 1: DATABASE SCHEMA EXTENSION** 
> **Status**: ✅ COMPLETED | **Priority**: 🔴 Critical

### **Step 1.1: Update Prisma Schema**
- [x] **1.1.1** Open `prisma/schema.prisma`
- [x] **1.1.2** Locate the `Company` model
- [x] **1.1.3** Add the following fields to Company model:
  ```typescript
  // Platform Display Settings
  showHeroImage        Boolean @default(true)
  showStoreLocation    Boolean @default(true)
  showCustomerCount    Boolean @default(true)
  showProductCount     Boolean @default(true)
  showVision2030       Boolean @default(true)
  
  // Tax Settings
  isTaxEnabled         Boolean @default(true)
  
  // Notification Settings
  emailNotifications   Boolean @default(true)
  
  // Currency Settings
  defaultCurrency      String  @default("SAR")
  ```
- [x] **1.1.4** Save the file
- [x] **1.1.5** Run `npx prisma generate` to update Prisma client
- [x] **1.1.6** Run `npx prisma db push` to update database schema
- [x] **1.1.7** Verify no errors in terminal

### **Step 1.2: Update Zod Validation Schema**
- [x] **1.2.1** Open `app/dashboard/management/settings/helper/companyZodAndInputs.ts`
- [x] **1.2.2** Locate the `CompanySchema` export
- [x] **1.2.3** Add the following fields to CompanySchema:
  ```typescript
  // Platform Display Settings
  showHeroImage: z.boolean().optional(),
  showStoreLocation: z.boolean().optional(),
  showCustomerCount: z.boolean().optional(),
  showProductCount: z.boolean().optional(),
  showVision2030: z.boolean().optional(),
  
  // Tax Settings
  isTaxEnabled: z.boolean().optional(),
  
  // Notification Settings
  emailNotifications: z.boolean().optional(),
  
  // Currency Settings
  defaultCurrency: z.enum(['SAR', 'USD', 'EGP', 'AED']).optional(),
  ```
- [x] **1.2.4** Save the file
- [x] **1.2.5** Run `npx tsc --noEmit` to verify no TypeScript errors

---

## 📋 **PHASE 2: BACKEND INTEGRATION**
> **Status**: ✅ COMPLETED | **Priority**: 🔴 Critical

### **Step 2.1: Integrate Platform Settings Form with Backend**
- [x] **2.1.1** Open `app/dashboard/management/health-status/setting/platform/components/PlatformSettingsForm.tsx`
- [x] **2.1.2** Locate the form submission handler
- [x] **2.1.3** Update form to save new platform settings fields to Company model
- [x] **2.1.4** Update save action to include new fields
- [x] **2.1.5** Test form submission at `http://localhost:3000/dashboard/management/health-status/setting/platform`
- [x] **2.1.6** Verify data is saved to database

### **Step 2.2: Update Platform Settings Actions**
- [x] **2.2.1** Locate platform settings actions file
- [x] **2.2.2** Update `savePlatformSettings` action to handle new fields
- [x] **2.2.3** Update `fetchPlatformSettings` action to return new fields
- [x] **2.2.4** Add `revalidatePath` for instant UI updates
- [x] **2.2.5** Test actions work correctly

---

## 📋 **PHASE 3: FRONTEND COMPONENT INTEGRATION**
> **Status**: ❌ Not Started | **Priority**: 🔴 Critical

### **Step 3.1: Update Header Component**
- [ ] **3.1.1** Open `app/(e-comm)/homepage/component/Header/HeaderUnified.tsx`
- [ ] **3.1.2** Locate the interface `HeaderUnifiedProps`
- [ ] **3.1.3** Add new prop: `showStoreLocation?: boolean;`
- [ ] **3.1.4** Find the component's JSX return statement
- [ ] **3.1.5** Add conditional rendering for store location:
  ```typescript
  {showStoreLocation && (
    <div className="store-location">
      {companyData?.address || 'الموقع غير محدد'}
    </div>
  )}
  ```
- [ ] **3.1.6** Save the file
- [ ] **3.1.7** Run `npx tsc --noEmit` to verify no TypeScript errors

### **Step 3.2: Update Footer Component**
- [ ] **3.2.1** Open `app/(e-comm)/homepage/component/Fotter/Fotter.tsx`
- [ ] **3.2.2** Locate the interface `FooterProps`
- [ ] **3.2.3** Add new props:
  ```typescript
  showCustomerCount?: boolean;
  showProductCount?: boolean;
  showVision2030?: boolean;
  customerCount?: number;
  productCount?: number;
  ```
- [ ] **3.2.4** Find the component's JSX return statement
- [ ] **3.2.5** Add conditional rendering for customer count:
  ```typescript
  {showCustomerCount && customerCount && (
    <div className="customer-count">
      <span>{customerCount} عميل</span>
    </div>
  )}
  ```
- [ ] **3.2.6** Add conditional rendering for product count:
  ```typescript
  {showProductCount && productCount && (
    <div className="product-count">
      <span>{productCount} منتج</span>
    </div>
  )}
  ```
- [ ] **3.2.7** Add conditional rendering for Vision 2030:
  ```typescript
  {showVision2030 && (
    <Image
      src="/assets/visionlogo.svg"
      alt="Saudi Vision 2030"
      width={108}
      height={36}
    />
  )}
  ```
- [ ] **3.2.8** Save the file
- [ ] **3.2.9** Run `npx tsc --noEmit` to verify no TypeScript errors

### **Step 3.3: Create Currency Display Component**
- [ ] **3.3.1** Create new file: `components/CurrencyDisplay.tsx`
- [ ] **3.3.2** Add the following content:
  ```typescript
  interface CurrencyDisplayProps {
    amount: number;
    currency: string;
    showSymbol?: boolean;
  }

  export function CurrencyDisplay({ amount, currency, showSymbol = true }: CurrencyDisplayProps) {
    const formatCurrency = (amount: number, currency: string) => {
      const symbols = {
        SAR: 'ر.س',
        USD: '$',
        EGP: 'ج.م',
        AED: 'د.إ'
      };
      
      if (showSymbol) {
        return `${symbols[currency as keyof typeof symbols]} ${amount.toFixed(2)}`;
      }
      return `${amount.toFixed(2)} ${currency}`;
    };

    return <span>{formatCurrency(amount, currency)}</span>;
  }
  ```
- [ ] **3.3.3** Save the file
- [ ] **3.3.4** Run `npx tsc --noEmit` to verify no TypeScript errors

### **Step 3.4: Update Homepage Component**
- [ ] **3.4.1** Open `app/(e-comm)/page.tsx`
- [ ] **3.4.2** Import the PlatformSettingsService:
  ```typescript
  import { PlatformSettingsService } from '@/services/platformSettingsService';
  ```
- [ ] **3.4.3** Add platform settings fetch in the component:
  ```typescript
  const platformSettings = await PlatformSettingsService.getDisplaySettings();
  ```
- [ ] **3.4.4** Add conditional rendering for hero image:
  ```typescript
  {platformSettings.showHeroImage && company?.profilePicture && (
    <HeroSection imageUrl={company.profilePicture} />
  )}
  ```
- [ ] **3.4.5** Update ProductInfiniteGrid props:
  ```typescript
  <ProductInfiniteGrid 
    logo={company?.logo || '/fallback/dreamToApp2-dark.png'}
    showStoreLocation={platformSettings.showStoreLocation}
  />
  ```
- [ ] **3.4.6** Save the file
- [ ] **3.4.7** Run `npx tsc --noEmit` to verify no TypeScript errors

---

## 📋 **PHASE 4: LAYOUT DATA ENHANCEMENT**
> **Status**: ❌ Not Started | **Priority**: 🔴 Critical

### **Step 4.1: Extend Layout Data Function**
- [ ] **4.1.1** Open `app/(e-comm)/helpers/layoutData.ts`
- [ ] **4.1.2** Import PlatformSettingsService:
  ```typescript
  import { PlatformSettingsService } from '@/services/platformSettingsService';
  ```
- [ ] **4.1.3** Update the Promise.all call:
  ```typescript
  const [companyData, session, platformSettings] = await Promise.all([
    companyInfo(),
    getSession(),
    PlatformSettingsService.getDisplaySettings(),
  ]);
  ```
- [ ] **4.1.4** Add platformSettings to the return object:
  ```typescript
  return {
    companyData,
    session,
    userSummary,
    notificationCount,
    alerts,
    productCount,
    clientCount,
    platformSettings,  // New: platform display settings
  };
  ```
- [ ] **4.1.5** Save the file
- [ ] **4.1.6** Run `npx tsc --noEmit` to verify no TypeScript errors

### **Step 4.2: Update Layout Component**
- [ ] **4.2.1** Open `app/(e-comm)/layout.tsx`
- [ ] **4.2.2** Destructure platformSettings from fetchEcommLayoutData:
  ```typescript
  const {
    companyData,
    session,
    userSummary,
    notificationCount,
    alerts,
    productCount,
    clientCount,
    platformSettings,  // New
  } = await fetchEcommLayoutData();
  ```
- [ ] **4.2.3** Update HeaderUnified props:
  ```typescript
  <HeaderUnified
    user={userSummary}
    unreadCount={notificationCount}
    defaultAlerts={alerts}
    logo={companyData?.logo || ''}
    logoAlt={companyData?.fullName || 'Dream to app'}
    showStoreLocation={platformSettings.showStoreLocation}  // New
    isLoggedIn={!!session}
    whatsappNumber={companyData?.whatsappNumber}
  />
  ```
- [ ] **4.2.4** Update Footer props:
  ```typescript
  <Footer
    companyName={companyData?.fullName}
    aboutus={companyData?.bio}
    email={companyData?.email}
    phone={companyData?.phoneNumber}
    whatsappNumber={companyData?.whatsappNumber}
    address={companyData?.address}
    facebook={companyData?.facebook}
    instagram={companyData?.instagram}
    twitter={companyData?.twitter}
    linkedin={companyData?.linkedin}
    tiktok={companyData?.tiktok}
    snapchat={companyData?.snapchat}
    productCount={productCount}
    clientCount={clientCount}
    workingHours={companyData?.workingHours}
    showCustomerCount={platformSettings.showCustomerCount}  // New
    showProductCount={platformSettings.showProductCount}    // New
    showVision2030={platformSettings.showVision2030}        // New
  />
  ```
- [ ] **4.2.5** Save the file
- [ ] **4.2.6** Run `npx tsc --noEmit` to verify no TypeScript errors

---

## 📋 **PHASE 5: TESTING & VERIFICATION**
> **Status**: ❌ Not Started | **Priority**: 🔴 Critical

### **Step 5.1: Database Verification**
- [ ] **5.1.1** Run `npx prisma studio` to open database browser
- [ ] **5.1.2** Navigate to Company table
- [ ] **5.1.3** Verify all new fields are present
- [ ] **5.1.4** Check default values are set correctly
- [ ] **5.1.5** Close Prisma Studio

### **Step 5.2: API Testing**
- [ ] **5.2.1** Start development server: `npm run dev`
- [ ] **5.2.2** Open browser to `http://localhost:3000/api/platform-settings`
- [ ] **5.2.3** Verify JSON response includes all new fields
- [ ] **5.2.4** Check field values are correct
- [ ] **5.2.5** Close browser tab

### **Step 5.3: Frontend Testing**
- [ ] **5.3.1** Navigate to `http://localhost:3000`
- [ ] **5.3.2** Check header displays store location (if enabled)
- [ ] **5.3.3** Check footer displays customer/product counts (if enabled)
- [ ] **5.3.4** Check Vision 2030 logo displays (if enabled)
- [ ] **5.3.5** Check hero image displays (if enabled)
- [ ] **5.3.6** Verify no console errors

### **Step 5.4: Platform Settings Testing**
- [ ] **5.4.1** Navigate to `http://localhost:3000/dashboard/management/health-status/setting/platform`
- [ ] **5.4.2** Toggle each setting on/off
- [ ] **5.4.3** Save changes
- [ ] **5.4.4** Refresh homepage to verify changes
- [ ] **5.4.5** Test all conditional rendering works

---

## 📋 **PHASE 6: FINAL VERIFICATION**
> **Status**: ❌ Not Started | **Priority**: 🔴 Critical

### **Step 6.1: TypeScript Compilation**
- [ ] **6.1.1** Run `npx tsc --noEmit` in project root
- [ ] **6.1.2** Verify no TypeScript errors
- [ ] **6.1.3** Fix any errors found
- [ ] **6.1.4** Re-run until clean

### **Step 6.2: Linting**
- [ ] **6.2.1** Run `npm run lint`
- [ ] **6.2.2** Fix any linting errors
- [ ] **6.2.3** Re-run until clean

### **Step 6.3: Build Test**
- [ ] **6.3.1** Run `npm run build`
- [ ] **6.3.2** Verify build completes successfully
- [ ] **6.3.3** Check for any build warnings

### **Step 6.4: Production Readiness**
- [ ] **6.4.1** Verify all environment variables are set
- [ ] **6.4.2** Check database connection
- [ ] **6.4.3** Verify API endpoints work
- [ ] **6.4.4** Test all conditional rendering

---

## 🚨 **CRITICAL SUCCESS CRITERIA**

### **✅ Must Have (Non-Negotiable)**
- [x] All new fields added to Company model
- [x] Zod schema updated
- [x] API returns all new fields
- [ ] Frontend components updated
- [ ] Conditional rendering works
- [ ] No TypeScript errors
- [ ] No linting errors
- [ ] Build passes successfully

### **⚠️ Should Have (Important)**
- [ ] All settings toggle correctly
- [ ] Changes reflect immediately
- [ ] No performance degradation
- [ ] Backward compatibility maintained

### **🎯 Nice to Have (Optional)**
- [ ] Error handling for missing settings
- [ ] Performance optimizations
- [ ] Additional validation

---

## 🔄 **ROLLBACK PLAN**

If critical issues arise:

### **Step R1: Database Rollback**
- [ ] **R1.1** Run `npx prisma db push` to revert schema changes
- [ ] **R1.2** Verify database is back to original state

### **Step R2: Code Rollback**
- [ ] **R2.1** Revert all file changes using git
- [ ] **R2.2** Run `npm install` to ensure dependencies
- [ ] **R2.3** Test application works as before

### **Step R3: Verification**
- [ ] **R3.1** Run `npx tsc --noEmit`
- [ ] **R3.2** Run `npm run build`
- [ ] **R3.3** Test all existing functionality

---

## 📞 **SUPPORT & ESCALATION**

### **If You Get Stuck:**
1. **Check the error message carefully**
2. **Verify you followed the exact steps**
3. **Check file paths are correct**
4. **Ensure all imports are working**
5. **Run TypeScript check after each step**

### **Emergency Contacts:**
- **Database Issues**: Check Prisma documentation
- **TypeScript Errors**: Verify interface definitions
- **Build Failures**: Check for missing dependencies
- **Runtime Errors**: Check browser console

---

**🎯 Remember: This is a critical task. Follow each step carefully, verify before proceeding, and don't skip any verification steps!**
