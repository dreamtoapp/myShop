import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Icon } from '@/components/icons/Icon';
import FieldAnalysisCard from './FieldAnalysisCard';

interface FieldCategorySectionProps {
  category: string;
  fields: Array<{
    field: string;
    category: string;
    priority: string;
    businessImpact: string;
    userImpact: string;
    icon: any;
    color: string;
  }>;
  missingFields: string[];
  criticalMissing: string[];
}

export default function FieldCategorySection({
  category,
  fields,
  missingFields,
  criticalMissing
}: FieldCategorySectionProps) {
  return (
    <Card key={category} >
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon name="Folder" className="h-5 w-5" />
          {category}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {fields.map(({ field, businessImpact, userImpact, icon: IconComponent }) => {
            const isMissing = missingFields.includes(field);
            const isCritical = criticalMissing.includes(field);

            return (
              <FieldAnalysisCard
                key={field}
                field={field}
                displayName={humanizeFieldName(field)}
                businessImpact={businessImpact}
                userImpact={userImpact}
                icon={IconComponent}
                isMissing={isMissing}
                isCritical={isCritical}
              />
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// Convert DB field keys into human-friendly Arabic labels
function humanizeFieldName(field: string): string {
  const map: Record<string, string> = {
    fullName: 'الاسم التجاري',
    email: 'البريد الإلكتروني',
    phoneNumber: 'رقم الهاتف',
    whatsappNumber: 'رقم واتساب',
    logo: 'شعار المتجر',
    profilePicture: 'صورة الملف',
    bio: 'نبذة عن المتجر',
    address: 'العنوان',
    latitude: 'خط العرض',
    longitude: 'خط الطول',
    workingHours: 'ساعات العمل',
    minShipping: 'حد الشحن المجاني',
    shippingFee: 'رسوم الشحن',
    taxNumber: 'الرقم الضريبي',
    taxPercentage: 'نسبة الضريبة',
    taxQrImage: 'رمز QR الضريبي',
    commercialRegistrationNumber: 'السجل التجاري',
    saudiBusinessId: 'رقم المنشأة',
    online: 'حالة المتجر',
    website: 'الموقع الإلكتروني',
    twitter: 'تويتر',
    linkedin: 'لينكدإن',
    instagram: 'إنستغرام',
    tiktok: 'تيك توك',
    facebook: 'فيسبوك',
    snapchat: 'سناب شات',
    whatsappPermanentToken: 'توكن واتساب (نظام)',
    whatsappPhoneNumberId: 'معرّف رقم واتساب (نظام)',
    whatsappApiVersion: 'إصدار واجهة واتساب (نظام)',
    whatsappBusinessAccountId: 'معرّف حساب واتساب التجاري (نظام)',
    createdAt: 'تاريخ الإنشاء',
    updatedAt: 'تاريخ آخر تحديث',
  };
  return map[field] || field;
}
