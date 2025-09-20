# 📊 Company Data Management Report

## Executive Summary
This report analyzes how company information is retrieved, managed, and distributed across the entire codebase. The application uses a **singleton pattern** for company data with multiple access patterns and caching strategies.

---

## 🏗️ Architecture Overview

### **Core Data Sources**
1. **Primary Database**: MongoDB via Prisma (`Company` model)
2. **Caching Layer**: Next.js `unstable_cache` with tag-based invalidation
3. **Environment Fallbacks**: Static defaults for critical app settings

### **Data Access Patterns**
- **Direct Database Access**: `db.company.findFirst()`
- **Cached Access**: `companyInfo()` with 1-hour cache
- **Wrapped Access**: Route-specific `fetchCompany()` functions
- **Layout Data**: Parallel fetching in `fetchEcommLayoutData()`

---

## 📁 File Structure Analysis

### **Core Company Actions** (77 files found)

#### **1. Primary Data Sources**
```
📂 app/dashboard/management/settings/actions/
├── fetchCompany.ts          # Main company fetcher (no cache)
├── saveCompnay.ts           # Company data saver with validation
└── helper/companyZodAndInputs.ts  # Zod validation schema

📂 app/(e-comm)/actions/
└── companyDetail.ts         # Cached company info (1hr cache)
```

#### **2. Health Status Settings** (Route-specific wrappers)
```
📂 app/dashboard/management/health-status/setting/
├── company-profile/actions/fetchCompany.ts    # Wrapper for company profile
├── compliance/actions/fetchCompliance.ts      # Compliance subset
├── location/actions/fetchLocation.ts          # Location subset  
├── platform/actions/fetchPlatform.ts         # Platform subset
├── shipping-rules/actions/fetchShippingRules.ts # Shipping subset
└── social-media/actions/getSocialMedia.ts    # Social media subset
```

#### **3. Layout & Global Data**
```
📂 app/(e-comm)/helpers/
└── layoutData.ts           # Parallel data fetching for e-comm layout

📂 app/dashboard/
├── layout.tsx              # Dashboard layout data
└── actions/validateCompanyData.ts  # Company data validation
```

---

## 🔄 Data Flow Patterns

### **Pattern 1: Direct Database Access**
```typescript
// app/dashboard/management/settings/actions/fetchCompany.ts
export const fetchCompany = async (): Promise<Company | null> => {
  const data = await db.company.findFirst();
  return data ? { ...data } : null;
};
```
**Usage**: Admin settings, health status pages, form initialization

### **Pattern 2: Cached Access**
```typescript
// app/(e-comm)/actions/companyDetail.ts
export const companyInfo = async () => {
  return await cacheData(
    async () => db.company.findFirst(),
    ['companyInfo'],
    { revalidate: 1, tags: ['company'] }
  )();
};
```
**Usage**: E-commerce frontend, public pages, performance-critical areas

### **Pattern 3: Route-Specific Wrappers**
```typescript
// Example: app/dashboard/management/health-status/setting/compliance/actions/fetchCompliance.ts
import { fetchCompany as baseFetchCompany } from '@/app/dashboard/management/settings/actions/fetchCompany';

export async function fetchCompliance() {
  const data = await baseFetchCompany();
  return {
    id: data?.id,
    taxNumber: data?.taxNumber || '',
    commercialRegistrationNumber: data?.commercialRegistrationNumber || '',
    saudiBusinessId: data?.saudiBusinessId || '',
  };
}
```
**Usage**: Health status settings, form-specific data subsets

### **Pattern 4: Layout Data Aggregation**
```typescript
// app/(e-comm)/helpers/layoutData.ts
export async function fetchEcommLayoutData() {
  const [companyData, session] = await Promise.all([
    companyInfo(),  // Cached company data
    getSession(),
  ]);
  // Additional parallel fetches...
}
```
**Usage**: E-commerce layout, global state management

---

## 💾 Database Schema Analysis

### **Company Model Fields** (Prisma Schema)
```typescript
model Company {
  // Identity & Contact
  id, fullName, email, phoneNumber, whatsappNumber
  logo, profilePicture, bio, website, address
  
  // Social Media
  twitter, linkedin, instagram, tiktok, facebook, snapchat
  
  // Business & Compliance  
  taxPercentage, taxNumber, taxQrImage
  commercialRegistrationNumber, saudiBusinessId
  
  // Operations
  workingHours, minShipping, shippingFee, online
  latitude, longitude
  
  // WhatsApp Integration
  whatsappPermanentToken, whatsappPhoneNumberId, whatsappApiVersion
  whatsappBusinessAccountId, whatsappWebhookVerifyToken, whatsappAppSecret
  
  // Email/SMTP Settings
  emailUser, emailPass, smtpHost, smtpPort, smtpUser, smtpPass, smtpFrom
  
  // Timestamps
  createdAt, updatedAt
}
```

---

## 🚀 Performance & Caching Strategy

### **Caching Layers**
1. **Server-Side Cache**: `unstable_cache` with 1-hour revalidation
2. **Tag-Based Invalidation**: `revalidateTag('company')` on updates
3. **Path Revalidation**: `revalidatePath()` for specific routes

### **Cache Invalidation Points**
```typescript
// In saveCompnay.ts
revalidateTag('company');           // Invalidate cached company data
revalidatePath('/dashboard/management/settings');
revalidatePath('/');                // Homepage updates
```

### **Parallel Data Fetching**
```typescript
// Layout data optimization
const [companyData, session, productCount, clientCount] = await Promise.all([
  companyInfo(),
  getSession(), 
  db.product.count({ where: { published: true } }),
  db.user.count({ where: { role: 'CUSTOMER' } })
]);
```

---

## 🔧 Data Validation & Sanitization

### **Zod Schema Validation**
```typescript
// app/dashboard/management/settings/helper/companyZodAndInputs.ts
export const CompanySchema = z.object({
  fullName: z.string().optional().or(z.literal('')).nullable(),
  email: z.string().email().optional().or(z.literal('')).nullable(),
  // ... comprehensive field validation
});
```

### **Data Sanitization Pipeline**
```typescript
// In saveCompnay.ts
const sanitize = (data: any) => {
  // Convert empty strings to undefined
  // Coerce numeric strings for specific fields
  // Trim whitespace
  // Handle null values
};
```

---

## 📊 Usage Distribution Analysis

### **High-Frequency Usage Areas**
1. **E-commerce Frontend**: `companyInfo()` (cached)
2. **Admin Dashboard**: `fetchCompany()` (direct)
3. **Health Status Settings**: Route-specific wrappers
4. **Layout Components**: Parallel fetching

### **Data Subset Patterns**
- **Company Profile**: `fullName`, `email`, `phoneNumber`
- **Compliance**: `taxNumber`, `commercialRegistrationNumber`, `saudiBusinessId`
- **Location**: `address`, `latitude`, `longitude`
- **Social Media**: `twitter`, `linkedin`, `instagram`, etc.
- **Platform Settings**: `taxPercentage`, `workingHours`, `shippingFee`

---

## ⚠️ Current Issues & Recommendations

### **Issues Identified**
1. **Inconsistent Naming**: `saveCompnay.ts` (typo in filename)
2. **Multiple Fetch Patterns**: Could lead to data inconsistency
3. **No Centralized Company Service**: Scattered across multiple files
4. **Cache Invalidation Complexity**: Multiple invalidation points

### **Recommendations**

#### **1. Centralize Company Service**
```typescript
// services/companyService.ts
export class CompanyService {
  static async getCompany(): Promise<Company | null>
  static async getCachedCompany(): Promise<Company | null>
  static async updateCompany(data: Partial<Company>): Promise<Company>
  static async getCompanySubset(fields: string[]): Promise<Partial<Company>>
}
```

#### **2. Standardize Data Access**
- Use cached access for frontend
- Use direct access for admin operations
- Implement consistent error handling

#### **3. Improve Type Safety**
```typescript
// types/company.ts
export type CompanySubset<T extends keyof Company> = Pick<Company, T>;
export type CompanyProfile = CompanySubset<'fullName' | 'email' | 'phoneNumber'>;
export type CompanyCompliance = CompanySubset<'taxNumber' | 'commercialRegistrationNumber'>;
```

#### **4. Optimize Caching Strategy**
- Implement Redis for production
- Add cache warming for critical data
- Implement cache versioning

---

## 📈 Performance Metrics

### **Current Performance**
- **Database Queries**: ~77 files making company-related queries
- **Cache Hit Rate**: 1-hour cache for frontend data
- **Parallel Fetching**: Implemented in layout data
- **Revalidation**: Tag-based with path-specific updates

### **Optimization Opportunities**
1. **Reduce Query Redundancy**: Centralize common queries
2. **Implement Query Batching**: Group related data requests
3. **Add Database Indexing**: Optimize `findFirst()` queries
4. **Implement Data Preloading**: Warm cache for critical paths

---

## 🎯 Conclusion

The company data management system is **functional but could be optimized**. The current architecture supports the application's needs but has room for improvement in:

- **Centralization**: Moving to a unified company service
- **Consistency**: Standardizing data access patterns  
- **Performance**: Optimizing caching and query strategies
- **Maintainability**: Reducing code duplication across 77+ files

The singleton pattern with MongoDB is appropriate for the use case, but implementing the recommended improvements would significantly enhance maintainability and performance.



