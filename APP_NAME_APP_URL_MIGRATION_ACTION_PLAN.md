# APP_NAME & APP_URL Migration Action Plan

## 🎯 Objective
Migrate `APP_NAME` and `APP_URL` from environment variables to Company table (`fullName` and `website` fields) for dynamic configuration.

## 📊 Data Flow Architecture

### **Backend Data Retrieval:**
```typescript
// Database Query
const company = await db.company.findFirst({
  select: { 
    fullName: true,    // → APP_NAME
    website: true      // → APP_URL
  }
});

// Fallback Chain
appName: company?.fullName || process.env.APP_NAME || 'My Shop'
appUrl: company?.website || process.env.APP_URL || 'http://localhost:3000'
```

### **Caching Strategy:**
- **Server-side**: `unstable_cache` with `revalidateTag('company')`
- **Cache Duration**: 1 hour
- **Invalidation**: When company data is updated via admin

---

## 📊 Current Company Schema Analysis

### ✅ **EXISTING FIELDS THAT CAN BE USED:**

#### **Company Identity Fields:**
- `fullName` - Company full name (can be used as app name)
- `email` - Company email
- `phoneNumber` - Company phone
- `whatsappNumber` - WhatsApp number
- `logo` - Company logo URL
- `profilePicture` - Profile picture URL
- `bio` - Company description
- `website` - Company website URL (can be used as app URL)

#### **Social Media & Contact:**
- `twitter`, `linkedin`, `instagram`, `tiktok`, `facebook`, `snapchat` - Social media URLs
- `address` - Company address
- `taxPercentage`, `taxNumber`, `taxQrImage` - Tax information
- `commercialRegistrationNumber`, `saudiBusinessId` - Compliance IDs
- `workingHours` - Working hours
- `minShipping`, `shippingFee` - Shipping settings
- `online` - Online status
- `latitude`, `longitude` - Location coordinates

#### **DB-Backed Settings (Already Migrated):**
- **WhatsApp**: `whatsappPermanentToken`, `whatsappPhoneNumberId`, `whatsappApiVersion`, `whatsappBusinessAccountId`, `whatsappWebhookVerifyToken`, `whatsappAppSecret`, `whatsappEnvironment`
- **Email/SMTP**: `emailUser`, `emailPass`, `smtpHost`, `smtpPort`, `smtpUser`, `smtpPass`, `smtpFrom`
- **Analytics**: `gtmContainerId`
- **Cloudinary**: `cloudinaryCloudName`, `cloudinaryApiKey`, `cloudinaryApiSecret`, `cloudinaryUploadPreset`, `cloudinaryClientFolder`
- **Pusher**: `pusherAppId`, `pusherKey`, `pusherSecret`, `pusherCluster`
- **Maps**: `googleMapsApiKey`
- **Auth**: `authCallbackUrl`, `requireWhatsappOtp`, `requireLocation`

### ✅ **USING EXISTING FIELDS (No New Fields Needed):**
- `fullName` - Will be used as application name for branding
- `website` - Will be used as application base URL

---

## 🎯 Task-Based Implementation Plan

### **TASK 1: Create Backend Helper Functions**

#### **1.1 Create App Config Helper**
**File:** `helpers/appConfig.ts`
```typescript
import db from '@/lib/prisma';

export interface AppConfig {
  appName: string;
  appUrl: string;
}

export async function getAppConfig(): Promise<AppConfig> {
  const company = await db.company.findFirst({
    select: { 
      fullName: true,    // → APP_NAME
      website: true      // → APP_URL
    }
  });
  
  return {
    appName: company?.fullName || process.env.APP_NAME || 'My Shop',
    appUrl: company?.website || process.env.APP_URL || 'http://localhost:3000'
  };
}

export async function getAppName(): Promise<string> {
  const config = await getAppConfig();
  return config.appName;
}

export async function getAppUrl(): Promise<string> {
  const config = await getAppConfig();
  return config.appUrl;
}
```

#### **1.2 Create Cached Version for Performance**
**File:** `helpers/cachedAppConfig.ts`
```typescript
import { unstable_cache } from 'next/cache';
import { getAppConfig } from './appConfig';

export const getCachedAppConfig = unstable_cache(
  async () => getAppConfig(),
  ['app-config'],
  { 
    tags: ['company'],
    revalidate: 3600 // 1 hour
  }
);
```

**✅ Task 1 Complete:** Backend data retrieval functions ready

---

### **TASK 2: Update Email Templates**

#### **2.1 Update OTP Email Template**
**File:** `lib/email/sendOtpEmail.ts`

**Before:**
```typescript
const createOTPEmailTemplate = (otp: string, recipientName?: string) => `
  <h2>${process.env.APP_NAME || 'Your App Name'}</h2>
  <p>© ${new Date().getFullYear()} ${process.env.APP_NAME || 'Your App Name'}. All rights reserved.</p>
  <p>Need help? <a href="${process.env.APP_URL}/contact">Contact support</a></p>
`;
```

**After:**
```typescript
import { getAppConfig } from '@/helpers/appConfig';

const createOTPEmailTemplate = async (otp: string, recipientName?: string) => {
  const { appName, appUrl } = await getAppConfig();
  
  return `
    <h2>${appName}</h2>
    <p>© ${new Date().getFullYear()} ${appName}. All rights reserved.</p>
    <p>Need help? <a href="${appUrl}/contact">Contact support</a></p>
  `;
};

// Update the sendOtpEmail function
export const sendOtpEmail = async (to: string, otp: string, recipientName?: string) => {
  try {
    const { appName } = await getAppConfig();
    await transporter.sendMail({
      from: `"${process.env.EMAIL_SENDER_NAME}" <${process.env.EMAIL_USER}>`,
      to,
      subject: `Your Verification Code - ${appName}`,
      html: await createOTPEmailTemplate(otp, recipientName),
    });
    return { success: true, message: 'Verification email sent' };
  } catch (error) {
    return { success: false, message: 'Failed to send verification email' };
  }
};
```

#### **2.2 Update Admin OTP Email Template**
**File:** `app/(e-comm)/(adminPage)/auth/verify/action/otp-via-email.ts`

**Apply same pattern:**
```typescript
import { getAppConfig } from '@/helpers/appConfig';

// Update createOTPEmailTemplate function
const createOTPEmailTemplate = async (otp: string, recipientName?: string) => {
  const { appName, appUrl } = await getAppConfig();
  // ... template with appName and appUrl
};

// Update sendEmail function
export const sendEmail = async (to: string, subject: string, html: string) => {
  // ... existing code
};

// Update the main function
export const sendOtpViaEmail = async (email: string) => {
  // ... existing code ...
  const { appName } = await getAppConfig();
  const emailResult = await sendEmail(
    email,
    `Your Verification Code - ${appName}`,
    await createOTPEmailTemplate(token),
  );
  // ... rest of function
};
```

#### **2.3 Update Order Email Template**
**File:** `app/(e-comm)/(adminPage)/user/statement/action/sendOrderEmail.ts`

**Update the template generation:**
```typescript
import { getAppConfig } from '@/helpers/appConfig';

// In the sendOrderEmail function
export const sendOrderEmail = async (orderId: string, to: string) => {
  // ... existing code ...
  
  const { appName } = await getAppConfig();
  
  // Update template usage
  const htmlTemplate = generateOrderEmailTemplate(orderData, customerName, companyData, appName);
  
  const mailOptions = {
    from: `"${companyData.fullName || appName || 'Online Shop'}" <${process.env.EMAIL_USER}>`,
    to,
    subject: `تفاصيل الطلبية #${orderData.orderNumber}`,
    html: htmlTemplate,
  };
  
  // ... rest of function
};

// Update generateOrderEmailTemplate function
const generateOrderEmailTemplate = (orderData: any, customerName: string, companyData: any, appName: string) => {
  return `
    <!-- ... existing template ... -->
    <p>شكراً لاختياركم ${companyData.fullName || appName || 'متجرنا'}</p>
    <!-- ... rest of template ... -->
  `;
};
```

**✅ Task 2 Complete:** All email templates use database values

---

### **TASK 3: Update Platform Settings API**

#### **3.1 Update Platform Settings Route**
**File:** `app/api/platform-settings/route.ts`

**Before:**
```typescript
return Response.json({
  companyName: process.env.COMPANY_NAME,
  companySlogan: process.env.COMPANY_SLOGAN,
  appName: process.env.APP_NAME,
  appUrl: process.env.APP_URL,
  // ... other settings
});
```

**After:**
```typescript
import { getCachedAppConfig } from '@/helpers/cachedAppConfig';

export async function GET() {
  const { appName, appUrl } = await getCachedAppConfig();
  
  return Response.json({
    companyName: process.env.COMPANY_NAME,
    companySlogan: process.env.COMPANY_SLOGAN,
    appName,        // From database (fullName)
    appUrl,         // From database (website)
    // ... other settings
  });
}
```

#### **3.2 Update Cart Page API Call**
**File:** `app/(e-comm)/(cart-flow)/cart/page.tsx`

**The cart page will automatically get the correct values from the platform-settings API, no changes needed.**

**✅ Task 3 Complete:** Platform settings API returns database values

---

### **TASK 4: Update Admin Interface**

#### **4.1 Ensure Fields are Included in Settings Form**
**File:** `app/dashboard/management/settings/advanced/overview/page.tsx`

**Verify these fields are in the fields array:**
```typescript
const fields: (keyof NonNullable<typeof company>)[] = [
  // ... existing fields ...
  'fullName',  // Company Name → App Name
  'website',   // Website URL → App URL
  // ... rest of fields ...
];
```

#### **4.2 Update Form Labels and Descriptions**
**File:** `app/dashboard/management/settings/advanced/page.tsx`

**Update the Company Information section:**
```tsx
<Card>
  <CardHeader>
    <CardTitle>Company Information</CardTitle>
    <CardDescription>
      Company name will be used as app name in emails and branding
    </CardDescription>
  </CardHeader>
  <CardContent className="space-y-4">
    <div>
      <Label htmlFor="fullName">Company Name</Label>
      <Input
        id="fullName"
        name="fullName"
        placeholder="My Shop"
        defaultValue={company?.fullName || ''}
      />
      <p className="text-sm text-muted-foreground mt-1">
        This will be used as the application name in emails and branding
      </p>
    </div>
    <div>
      <Label htmlFor="website">Website URL</Label>
      <Input
        id="website"
        name="website"
        placeholder="https://myshop.com"
        defaultValue={company?.website || ''}
      />
      <p className="text-sm text-muted-foreground mt-1">
        This will be used as the base URL for links in emails
      </p>
    </div>
  </CardContent>
</Card>
```

#### **4.3 Verify Update Action**
**File:** `app/dashboard/management/settings/actions/updateCompany.ts`

**Ensure it calls revalidateTag after update:**
```typescript
// The action should already handle fullName and website fields
// Just ensure revalidateTag('company') is called after update
// This will invalidate the cached app config
```

**✅ Task 4 Complete:** Admin can update company name and website (which become app name and URL)

---

### **TASK 5: Testing & Validation**

#### **5.1 Test Backend Data Retrieval**
```bash
# Test database connection
npx prisma db push

# Test data retrieval
npx prisma studio
# Check that fullName and website fields have data
```

#### **5.2 Test Email Templates**
- [ ] OTP emails render with correct company name
- [ ] Order emails use correct company name
- [ ] Email links use correct website URL
- [ ] Fallback to environment variables works

#### **5.3 Test Platform Settings API**
- [ ] API returns correct app name and URL from database
- [ ] Caching works properly
- [ ] Frontend receives correct values

#### **5.4 Test Admin Interface**
- [ ] Form fields display current values (fullName, website)
- [ ] Saving updates database
- [ ] Changes reflect in emails and API immediately

**✅ Task 5 Complete:** All functionality tested and working

---

## 📋 Implementation Summary

### **How Data Flows from Backend:**

1. **Database Query:**
   ```typescript
   const company = await db.company.findFirst({
     select: { fullName: true, website: true }
   });
   ```

2. **Helper Function:**
   ```typescript
   const { appName, appUrl } = await getAppConfig();
   // appName = company.fullName || process.env.APP_NAME || 'My Shop'
   // appUrl = company.website || process.env.APP_URL || 'http://localhost:3000'
   ```

3. **Caching:**
   ```typescript
   const { appName, appUrl } = await getCachedAppConfig();
   // Cached for 1 hour, invalidated when company data changes
   ```

4. **Usage in Templates:**
   ```typescript
   // Email templates
   <h2>${appName}</h2>
   <a href="${appUrl}/contact">Contact</a>
   
   // API responses
   return Response.json({ appName, appUrl });
   ```

### **Task Execution Order:**
1. ✅ **Task 1:** Create helper functions
2. ✅ **Task 2:** Update email templates  
3. ✅ **Task 3:** Update platform API
4. ✅ **Task 4:** Update admin interface
5. ✅ **Task 5:** Test everything

### **Files Modified:**
1. `helpers/appConfig.ts` - Backend data retrieval
2. `helpers/cachedAppConfig.ts` - Caching layer
3. `lib/email/sendOtpEmail.ts` - OTP email template
4. `app/(e-comm)/(adminPage)/auth/verify/action/otp-via-email.ts` - Admin OTP email
5. `app/(e-comm)/(adminPage)/user/statement/action/sendOrderEmail.ts` - Order email
6. `app/api/platform-settings/route.ts` - Platform settings API
7. `app/dashboard/management/settings/advanced/page.tsx` - Admin form labels

### **No Database Changes Required:**
- Uses existing `fullName` and `website` fields
- No schema migrations needed
- No data migration required

---

## ⏱️ Estimated Timeline

- **Task 1**: Helper Functions (20 minutes)
- **Task 2**: Email Templates (30 minutes)
- **Task 3**: Platform API (15 minutes)
- **Task 4**: Admin Interface (20 minutes)
- **Task 5**: Testing (20 minutes)

**Total Estimated Time**: 1 hour 45 minutes

## ✅ Success Criteria

- [ ] All email templates use database values (fullName → appName, website → appUrl)
- [ ] Platform settings API returns database values
- [ ] Admin can update company name and website
- [ ] Fallback to environment variables works
- [ ] No breaking changes to existing functionality
- [ ] Performance is maintained with caching
- [ ] All tests pass

## 🚨 Production Safety

### **Rollback Plan:**
- **No database changes** to revert
- **Code changes** can be reverted via git
- **Environment variables** remain as fallback
- **Zero downtime** migration

### **Testing Checklist:**
- [ ] Email delivery works
- [ ] Platform settings API responds correctly
- [ ] Admin interface updates work
- [ ] Caching invalidates properly
- [ ] Fallback to environment variables works

---

**Ready to implement this migration? The plan is task-based, uses existing database fields, and includes comprehensive testing.**
