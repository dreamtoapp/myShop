/**
 * Company Data Validation Service
 * Validates company data completeness and provides admin notifications
 */

export interface CompanyDataStatus {
  isComplete: boolean;
  missingFields: string[];
  criticalMissing: string[];
  warnings: string[];
  completionPercentage: number;
  criticalFieldsComplete: boolean;
  operationalFieldsComplete: boolean;
}

export interface CompanyData {
  id?: string;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  whatsappNumber?: string;
  logo?: string;
  profilePicture?: string;
  bio?: string;
  address?: string;
  latitude?: string | null;
  longitude?: string | null;
  taxNumber?: string;
  taxQrImage?: string;
  commercialRegistrationNumber?: string | null;
  saudiBusinessId?: string | null;
  workingHours?: string;
  minShipping?: number;
  shippingFee?: number;
  twitter?: string;
  linkedin?: string;
  instagram?: string;
  tiktok?: string;
  facebook?: string;
  snapchat?: string;
  website?: string;
}

// Critical fields that are absolutely required for business operations
const CRITICAL_FIELDS = [
  'fullName',
  'email',
  'phoneNumber',
  'whatsappNumber',
  'address',
  'latitude',
  'longitude'
] as const;

// Important fields for business compliance and operations
const IMPORTANT_FIELDS = [
  'taxNumber',
  'commercialRegistrationNumber',
  'logo',
  'workingHours',
  'minShipping',
  'shippingFee'
] as const;

// Optional fields that enhance the business profile (list kept in labels below)

// Field labels for display
const FIELD_LABELS: Record<string, string> = {
  fullName: 'اسم المتجر',
  email: 'البريد الإلكتروني',
  phoneNumber: 'رقم الهاتف',
  whatsappNumber: 'رقم الواتساب',
  address: 'العنوان',
  latitude: 'خط العرض',
  longitude: 'خط الطول',
  taxNumber: 'الرقم الضريبي',
  commercialRegistrationNumber: 'رقم السجل التجاري',
  logo: 'الشعار',
  workingHours: 'ساعات العمل',
  minShipping: 'الحد الأدنى للشحن',
  shippingFee: 'رسوم الشحن',
  bio: 'نبذة عن المتجر',
  profilePicture: 'صورة الملف الشخصي',
  taxQrImage: 'صورة QR الضريبي',
  saudiBusinessId: 'رقم الهوية التجارية السعودية',
  twitter: 'تويتر',
  linkedin: 'لينكدإن',
  instagram: 'انستغرام',
  tiktok: 'تيك توك',
  facebook: 'فيسبوك',
  snapchat: 'سناب شات',
  website: 'الموقع الإلكتروني'
};

/**
 * Validates if a field value is considered "present" and valid
 */
function isFieldPresent(value: any): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed.length > 0 && trimmed !== '';
  }
  if (typeof value === 'number') {
    return value > 0;
  }
  return Boolean(value);
}

/**
 * Validates company data and returns comprehensive status
 */
export function validateCompanyData(company: CompanyData | null | undefined): CompanyDataStatus {
  if (!company) {
    return {
      isComplete: false,
      missingFields: [...CRITICAL_FIELDS, ...IMPORTANT_FIELDS],
      criticalMissing: [...CRITICAL_FIELDS],
      warnings: ['لا توجد بيانات شركة متاحة'],
      completionPercentage: 0,
      criticalFieldsComplete: false,
      operationalFieldsComplete: false
    };
  }

  const missingFields: string[] = [];
  const criticalMissing: string[] = [];
  const warnings: string[] = [];

  // Check critical fields
  CRITICAL_FIELDS.forEach(field => {
    if (!isFieldPresent(company[field as keyof CompanyData])) {
      missingFields.push(field);
      criticalMissing.push(field);
    }
  });

  // Check important fields
  IMPORTANT_FIELDS.forEach(field => {
    if (!isFieldPresent(company[field as keyof CompanyData])) {
      missingFields.push(field);
    }
  });

  // Generate specific warnings
  if (!isFieldPresent(company.latitude) || !isFieldPresent(company.longitude)) {
    warnings.push('إحداثيات الموقع مفقودة - قد يؤثر على خدمة التوصيل');
  }

  if (!isFieldPresent(company.taxNumber)) {
    warnings.push('الرقم الضريبي مفقود - مطلوب للامتثال الضريبي');
  }

  if (!isFieldPresent(company.commercialRegistrationNumber)) {
    warnings.push('رقم السجل التجاري مفقود - مطلوب للامتثال القانوني');
  }

  if (!isFieldPresent(company.logo)) {
    warnings.push('الشعار مفقود - يؤثر على الهوية البصرية للمتجر');
  }

  if (!isFieldPresent(company.workingHours)) {
    warnings.push('ساعات العمل غير محددة - قد يربك العملاء');
  }

  // Calculate completion percentages
  const totalFields = CRITICAL_FIELDS.length + IMPORTANT_FIELDS.length;
  const completedFields = totalFields - missingFields.length;
  const completionPercentage = Math.round((completedFields / totalFields) * 100);

  const criticalFieldsComplete = criticalMissing.length === 0;
  const operationalFieldsComplete = missingFields.length === 0;

  return {
    isComplete: operationalFieldsComplete,
    missingFields,
    criticalMissing,
    warnings,
    completionPercentage,
    criticalFieldsComplete,
    operationalFieldsComplete
  };
}

/**
 * Gets user-friendly field labels
 */
export function getFieldLabel(field: string): string {
  return FIELD_LABELS[field] || field;
}

/**
 * Gets missing fields with their labels
 */
export function getMissingFieldsWithLabels(status: CompanyDataStatus): Array<{ field: string, label: string, isCritical: boolean }> {
  return status.missingFields.map(field => ({
    field,
    label: getFieldLabel(field),
    isCritical: status.criticalMissing.includes(field)
  }));
}

/**
 * Gets the priority level for missing data
 */
export function getDataPriority(status: CompanyDataStatus): 'critical' | 'warning' | 'info' {
  if (status.criticalMissing.length > 0) return 'critical';
  if (status.missingFields.length > 0) return 'warning';
  return 'info';
}
