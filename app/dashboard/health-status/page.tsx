import { getCompanyDataStatus } from '../actions/validateCompanyData';
import { Target, Building2, MapPin, Phone, Mail, Clock, FileText, Image, CreditCard, Shield, Truck, Globe } from 'lucide-react';
import HealthStatusHeader from '@/components/health-status/HealthStatusHeader';
import OverallHealthStatus from '@/components/health-status/OverallHealthStatus';
import BusinessImpactMetrics from '@/components/health-status/BusinessImpactMetrics';
import FieldCategorySection from '@/components/health-status/FieldCategorySection';
import BusinessRecommendations from '@/components/health-status/BusinessRecommendations';

// Business Impact Analysis for each field
const FIELD_BUSINESS_IMPACT = {
  // Core Business Identity - CRITICAL for operations
  fullName: {
    category: 'الهوية التجارية',
    priority: 'critical',
    businessImpact: 'اسم المتجر مطلوب لجميع المعاملات التجارية والفواتير',
    userImpact: 'العملاء يحتاجون لمعرفة اسم المتجر للثقة والاعتراف',
    icon: Building2,
    color: 'red'
  },
  email: {
    category: 'التواصل التجاري',
    priority: 'critical',
    businessImpact: 'البريد الإلكتروني ضروري للتواصل مع العملاء وإرسال الفواتير',
    userImpact: 'العملاء يحتاجون طريقة للتواصل الرسمي مع المتجر',
    icon: Mail,
    color: 'red'
  },
  phoneNumber: {
    category: 'التواصل التجاري',
    priority: 'critical',
    businessImpact: 'رقم الهاتف مطلوب للتواصل المباشر مع العملاء وحل المشاكل',
    userImpact: 'العملاء يحتاجون رقم للاستفسارات العاجلة والدعم',
    icon: Phone,
    color: 'red'
  },
  whatsappNumber: {
    category: 'التواصل التجاري',
    priority: 'critical',
    businessImpact: 'واتساب ضروري لإشعارات الطلبات والتواصل السريع مع العملاء',
    userImpact: 'العملاء يفضلون التواصل عبر واتساب للسرعة والسهولة',
    icon: Phone,
    color: 'red'
  },
  address: {
    category: 'الموقع والتوصيل',
    priority: 'critical',
    businessImpact: 'العنوان مطلوب لتحديد موقع المتجر وحساب رسوم التوصيل',
    userImpact: 'العملاء يحتاجون لمعرفة موقع المتجر للزيارة أو التوصيل',
    icon: MapPin,
    color: 'red'
  },
  latitude: {
    category: 'الموقع والتوصيل',
    priority: 'critical',
    businessImpact: 'إحداثيات الموقع ضرورية لحساب المسافات ورسوم التوصيل بدقة',
    userImpact: 'تحديد موقع دقيق للمتجر على الخرائط',
    icon: MapPin,
    color: 'red'
  },
  longitude: {
    category: 'الموقع والتوصيل',
    priority: 'critical',
    businessImpact: 'إحداثيات الموقع ضرورية لحساب المسافات ورسوم التوصيل بدقة',
    userImpact: 'تحديد موقع دقيق للمتجر على الخرائط',
    icon: MapPin,
    color: 'red'
  },

  // Business Compliance - CRITICAL for legal operations
  taxNumber: {
    category: 'الامتثال الضريبي',
    priority: 'critical',
    businessImpact: 'الرقم الضريبي مطلوب قانونياً لإصدار الفواتير الضريبية',
    userImpact: 'العملاء يحتاجون فواتير ضريبية صحيحة للمحاسبة',
    icon: CreditCard,
    color: 'red'
  },
  taxPercentage: {
    category: 'الامتثال الضريبي',
    priority: 'important',
    businessImpact: 'النسبة الضريبية مطلوبة لحساب إجمالي الفاتورة بشكل صحيح',
    userImpact: 'تضمن عرض السعر النهائي بدقة للعميل',
    icon: CreditCard,
    color: 'orange'
  },
  taxQrImage: {
    category: 'الامتثال الضريبي',
    priority: 'important',
    businessImpact: 'رمز QR متطلب للفوترة الإلكترونية حسب الأنظمة المحلية',
    userImpact: 'يسهل التحقق من صحة الفاتورة من قِبل العميل',
    icon: CreditCard,
    color: 'orange'
  },
  commercialRegistrationNumber: {
    category: 'الامتثال القانوني',
    priority: 'critical',
    businessImpact: 'رقم السجل التجاري مطلوب قانونياً لممارسة النشاط التجاري',
    userImpact: 'يثبت شرعية المتجر وموثوقيته للعملاء',
    icon: Shield,
    color: 'red'
  },
  saudiBusinessId: {
    category: 'الامتثال القانوني',
    priority: 'important',
    businessImpact: 'رقم المنشأة يدعم التكاملات الحكومية ويثبت الهوية المؤسسية',
    userImpact: 'يرفع الثقة خصوصاً للجهات والمؤسسات',
    icon: Shield,
    color: 'orange'
  },

  // Branding & Operations - IMPORTANT for business success
  logo: {
    category: 'الهوية البصرية',
    priority: 'important',
    businessImpact: 'الشعار ضروري للهوية البصرية والثقة التجارية',
    userImpact: 'العملاء يتعرفون على المتجر من خلال الشعار',
    icon: Image,
    color: 'orange'
  },
  profilePicture: {
    category: 'الهوية البصرية',
    priority: 'optional',
    businessImpact: 'صورة الملف تعزز الهوية والموثوقية في صفحات المتجر والدعم',
    userImpact: 'تساعد العملاء على التعرف على المتجر أو المسؤول بشكل بصري',
    icon: Image,
    color: 'blue'
  },
  workingHours: {
    category: 'ساعات العمل',
    priority: 'important',
    businessImpact: 'ساعات العمل مهمة لإدارة التوقعات وتنظيم العمليات',
    userImpact: 'العملاء يحتاجون لمعرفة متى يمكنهم التواصل أو الزيارة',
    icon: Clock,
    color: 'orange'
  },
  minShipping: {
    category: 'سياسة التوصيل',
    priority: 'important',
    businessImpact: 'الحد الأدنى للشحن المجاني يؤثر على قرارات الشراء',
    userImpact: 'العملاء يريدون معرفة متى يحصلون على شحن مجاني',
    icon: Truck,
    color: 'orange'
  },
  shippingFee: {
    category: 'سياسة التوصيل',
    priority: 'important',
    businessImpact: 'رسوم الشحن تؤثر على تكلفة الطلب وقرارات الشراء',
    userImpact: 'العملاء يحتاجون معرفة تكلفة التوصيل قبل الشراء',
    icon: Truck,
    color: 'orange'
  },
  online: {
    category: 'ساعات العمل',
    priority: 'important',
    businessImpact: 'حالة المتجر (متصل/غير متصل) تؤثر على استقبال الطلبات والظهور للعملاء',
    userImpact: 'توضح للعميل إن كان المتجر متاحاً الآن',
    icon: Clock,
    color: 'orange'
  },

  // Marketing & Growth - OPTIONAL but valuable
  bio: {
    category: 'التسويق والمحتوى',
    priority: 'optional',
    businessImpact: 'نبذة عن المتجر تساعد في التسويق وبناء الثقة',
    userImpact: 'العملاء يريدون معرفة المزيد عن المتجر وقصته',
    icon: FileText,
    color: 'blue'
  },
  twitter: {
    category: 'التسويق الرقمي',
    priority: 'optional',
    businessImpact: 'حسابات التواصل الاجتماعي تساعد في التسويق والوصول للعملاء',
    userImpact: 'العملاء يريدون متابعة المتجر على منصات التواصل',
    icon: Globe,
    color: 'blue'
  },
  linkedin: {
    category: 'التسويق الرقمي',
    priority: 'optional',
    businessImpact: 'لينكدإن مفيد للتواصل التجاري والعملاء المؤسسيين',
    userImpact: 'العملاء المؤسسيين يفضلون التواصل عبر لينكدإن',
    icon: Globe,
    color: 'blue'
  },
  instagram: {
    category: 'التسويق الرقمي',
    priority: 'optional',
    businessImpact: 'انستغرام فعال لعرض المنتجات والوصول للشباب',
    userImpact: 'العملاء الشباب يفضلون متابعة المنتجات على انستغرام',
    icon: Globe,
    color: 'blue'
  },
  facebook: {
    category: 'التسويق الرقمي',
    priority: 'optional',
    businessImpact: 'فيسبوك منصة مهمة للوصول لجمهور أوسع',
    userImpact: 'العملاء يريدون متابعة المتجر على فيسبوك',
    icon: Globe,
    color: 'blue'
  },
  tiktok: {
    category: 'التسويق الرقمي',
    priority: 'optional',
    businessImpact: 'تيك توك قناة نمو قوية للفيديو القصير وزيادة الوصول',
    userImpact: 'شريحة كبيرة من العملاء تتابع العلامات على تيك توك',
    icon: Globe,
    color: 'blue'
  },
  snapchat: {
    category: 'التسويق الرقمي',
    priority: 'optional',
    businessImpact: 'سناب شات يدعم العروض السريعة والوصول لفئات عمرية شابة',
    userImpact: 'بعض العملاء يفضلون متابعة العروض على سناب شات',
    icon: Globe,
    color: 'blue'
  },
  website: {
    category: 'الحضور الرقمي',
    priority: 'optional',
    businessImpact: 'الموقع الإلكتروني يعزز المصداقية والوصول للعملاء',
    userImpact: 'العملاء يريدون زيارة موقع المتجر للمزيد من المعلومات',
    icon: Globe,
    color: 'blue'
  },
  // System/Integration settings (read-only informational)
  whatsappPermanentToken: {
    category: 'إعدادات النظام',
    priority: 'optional',
    businessImpact: 'مطلوب لتفعيل تكامل واتساب وإرسال الإشعارات',
    userImpact: 'لا يؤثر مباشرة على تجربة العميل، لكنه يمكّن التواصل',
    icon: Globe,
    color: 'blue'
  },
  whatsappPhoneNumberId: {
    category: 'إعدادات النظام',
    priority: 'optional',
    businessImpact: 'معرّف رقم واتساب ضروري لواجهة Meta',
    userImpact: 'لا تأثير مباشر، إعداد تشغيلي',
    icon: Globe,
    color: 'blue'
  },
  whatsappApiVersion: {
    category: 'إعدادات النظام',
    priority: 'optional',
    businessImpact: 'إصدار واجهة واتساب يُستخدم في التكاملات',
    userImpact: 'لا تأثير مباشر',
    icon: Globe,
    color: 'blue'
  },
  whatsappBusinessAccountId: {
    category: 'إعدادات النظام',
    priority: 'optional',
    businessImpact: 'معرّف حساب واتساب التجاري للتكامل',
    userImpact: 'لا تأثير مباشر',
    icon: Globe,
    color: 'blue'
  },
  whatsappWebhookVerifyToken: {
    category: 'إعدادات النظام',
    priority: 'optional',
    businessImpact: 'توكن التحقق من واتساب ضروري لاستقبال الرسائل',
    userImpact: 'لا تأثير مباشر، إعداد تشغيلي',
    icon: Globe,
    color: 'blue'
  },
  whatsappAppSecret: {
    category: 'إعدادات النظام',
    priority: 'optional',
    businessImpact: 'سر تطبيق واتساب مطلوب للمصادقة الآمنة',
    userImpact: 'لا تأثير مباشر، إعداد تشغيلي',
    icon: Globe,
    color: 'blue'
  },
  whatsappEnvironment: {
    category: 'إعدادات النظام',
    priority: 'optional',
    businessImpact: 'بيئة واتساب تحدد الخادم المستخدم (تطوير/إنتاج)',
    userImpact: 'لا تأثير مباشر، إعداد تشغيلي',
    icon: Globe,
    color: 'blue'
  },
  createdAt: {
    category: 'البيانات التعريفية',
    priority: 'optional',
    businessImpact: 'تاريخ الإنشاء مفيد للتدقيق والتحليلات',
    userImpact: 'لا تأثير مباشر',
    icon: FileText,
    color: 'blue'
  },
  updatedAt: {
    category: 'البيانات التعريفية',
    priority: 'optional',
    businessImpact: 'تاريخ آخر تحديث يساعد على تتبع الصيانة والجودة',
    userImpact: 'لا تأثير مباشر',
    icon: FileText,
    color: 'blue'
  },

  // Email/SMTP Configuration - CRITICAL for email functionality
  emailUser: {
    category: 'إعدادات البريد الإلكتروني',
    priority: 'important',
    businessImpact: 'اسم مستخدم البريد الإلكتروني مطلوب لإرسال الرسائل',
    userImpact: 'العملاء يحتاجون استقبال إشعارات البريد الإلكتروني',
    icon: Mail,
    color: 'orange'
  },
  emailPass: {
    category: 'إعدادات البريد الإلكتروني',
    priority: 'important',
    businessImpact: 'كلمة مرور البريد الإلكتروني مطلوبة للمصادقة',
    userImpact: 'العملاء يحتاجون استقبال إشعارات البريد الإلكتروني',
    icon: Mail,
    color: 'orange'
  },
  smtpHost: {
    category: 'إعدادات البريد الإلكتروني',
    priority: 'important',
    businessImpact: 'خادم SMTP مطلوب لإرسال الرسائل الإلكترونية',
    userImpact: 'العملاء يحتاجون استقبال إشعارات البريد الإلكتروني',
    icon: Mail,
    color: 'orange'
  },
  smtpPort: {
    category: 'إعدادات البريد الإلكتروني',
    priority: 'important',
    businessImpact: 'منفذ SMTP مطلوب للاتصال بخادم البريد',
    userImpact: 'العملاء يحتاجون استقبال إشعارات البريد الإلكتروني',
    icon: Mail,
    color: 'orange'
  },
  smtpUser: {
    category: 'إعدادات البريد الإلكتروني',
    priority: 'important',
    businessImpact: 'مستخدم SMTP مطلوب للمصادقة مع الخادم',
    userImpact: 'العملاء يحتاجون استقبال إشعارات البريد الإلكتروني',
    icon: Mail,
    color: 'orange'
  },
  smtpPass: {
    category: 'إعدادات البريد الإلكتروني',
    priority: 'important',
    businessImpact: 'كلمة مرور SMTP مطلوبة للمصادقة مع الخادم',
    userImpact: 'العملاء يحتاجون استقبال إشعارات البريد الإلكتروني',
    icon: Mail,
    color: 'orange'
  },
  smtpFrom: {
    category: 'إعدادات البريد الإلكتروني',
    priority: 'important',
    businessImpact: 'عنوان المرسل مطلوب لإرسال الرسائل الإلكترونية',
    userImpact: 'العملاء يحتاجون معرفة مصدر الرسائل الإلكترونية',
    icon: Mail,
    color: 'orange'
  },

  // Cloudinary Integration - CRITICAL for image uploads
  cloudinaryCloudName: {
    category: 'إعدادات رفع الصور',
    priority: 'important',
    businessImpact: 'اسم سحابة Cloudinary مطلوب لرفع وتخزين الصور',
    userImpact: 'العملاء يحتاجون رؤية صور المنتجات والشركة',
    icon: Image,
    color: 'orange'
  },
  cloudinaryApiKey: {
    category: 'إعدادات رفع الصور',
    priority: 'important',
    businessImpact: 'مفتاح API لـ Cloudinary مطلوب للمصادقة',
    userImpact: 'العملاء يحتاجون رؤية صور المنتجات والشركة',
    icon: Image,
    color: 'orange'
  },
  cloudinaryApiSecret: {
    category: 'إعدادات رفع الصور',
    priority: 'important',
    businessImpact: 'سر API لـ Cloudinary مطلوب للمصادقة الآمنة',
    userImpact: 'العملاء يحتاجون رؤية صور المنتجات والشركة',
    icon: Image,
    color: 'orange'
  },
  cloudinaryUploadPreset: {
    category: 'إعدادات رفع الصور',
    priority: 'important',
    businessImpact: 'إعداد رفع Cloudinary مطلوب لتحسين الصور',
    userImpact: 'العملاء يحتاجون رؤية صور عالية الجودة',
    icon: Image,
    color: 'orange'
  },
  cloudinaryClientFolder: {
    category: 'إعدادات رفع الصور',
    priority: 'optional',
    businessImpact: 'مجلد Cloudinary يساعد في تنظيم الصور',
    userImpact: 'لا تأثير مباشر على تجربة العميل',
    icon: Image,
    color: 'blue'
  },

  // Pusher Real-time - CRITICAL for notifications
  pusherAppId: {
    category: 'إعدادات الإشعارات المباشرة',
    priority: 'important',
    businessImpact: 'معرف تطبيق Pusher مطلوب للإشعارات المباشرة',
    userImpact: 'العملاء يحتاجون إشعارات فورية عن الطلبات',
    icon: Globe,
    color: 'orange'
  },
  pusherKey: {
    category: 'إعدادات الإشعارات المباشرة',
    priority: 'important',
    businessImpact: 'مفتاح Pusher مطلوب للاتصال بخدمة الإشعارات',
    userImpact: 'العملاء يحتاجون إشعارات فورية عن الطلبات',
    icon: Globe,
    color: 'orange'
  },
  pusherSecret: {
    category: 'إعدادات الإشعارات المباشرة',
    priority: 'important',
    businessImpact: 'سر Pusher مطلوب للمصادقة الآمنة',
    userImpact: 'العملاء يحتاجون إشعارات فورية عن الطلبات',
    icon: Globe,
    color: 'orange'
  },
  pusherCluster: {
    category: 'إعدادات الإشعارات المباشرة',
    priority: 'important',
    businessImpact: 'عنقود Pusher يحدد الخادم المستخدم للإشعارات',
    userImpact: 'العملاء يحتاجون إشعارات فورية عن الطلبات',
    icon: Globe,
    color: 'orange'
  },

  // Analytics and Other Integrations
  gtmContainerId: {
    category: 'إعدادات التحليلات',
    priority: 'optional',
    businessImpact: 'معرف حاوية GTM مطلوب لتتبع سلوك المستخدمين',
    userImpact: 'لا تأثير مباشر، يساعد في تحسين الخدمة',
    icon: Globe,
    color: 'blue'
  },
  googleMapsApiKey: {
    category: 'إعدادات الخرائط',
    priority: 'optional',
    businessImpact: 'مفتاح Google Maps مطلوب لعرض الخرائط والمواقع',
    userImpact: 'العملاء يمكنهم رؤية موقع المتجر على الخرائط',
    icon: MapPin,
    color: 'blue'
  },
  authCallbackUrl: {
    category: 'إعدادات المصادقة',
    priority: 'optional',
    businessImpact: 'رابط استدعاء المصادقة مطلوب لتسجيل الدخول',
    userImpact: 'العملاء يمكنهم تسجيل الدخول بأمان',
    icon: Globe,
    color: 'blue'
  },
  requireWhatsappOtp: {
    category: 'إعدادات السلوك',
    priority: 'optional',
    businessImpact: 'تفعيل OTP واتساب يحدد طريقة التحقق من الهوية',
    userImpact: 'العملاء يحتاجون التحقق عبر واتساب',
    icon: Globe,
    color: 'blue'
  },
  requireLocation: {
    category: 'إعدادات السلوك',
    priority: 'optional',
    businessImpact: 'تفعيل الموقع يحدد ما إذا كان مطلوباً من العملاء',
    userImpact: 'العملاء قد يحتاجون مشاركة موقعهم',
    icon: MapPin,
    color: 'blue'
  }
};

export default async function HealthStatusPage() {
  const companyDataStatus = await getCompanyDataStatus();

  const getOverallHealth = () => {
    if (companyDataStatus.criticalMissing.length > 0) return 'critical';
    if (companyDataStatus.missingFields.length > 0) return 'warning';
    return 'healthy';
  };

  const overallHealth = getOverallHealth();

  const getHealthMessage = () => {
    switch (overallHealth) {
      case 'critical':
        return 'المتجر يحتاج بيانات حرجة لبدء العمليات التجارية';
      case 'warning':
        return 'المتجر يعمل ولكن يحتاج تحسينات لتحقيق أفضل أداء';
      default:
        return 'المتجر في حالة ممتازة وجاهز للعمل بكفاءة عالية';
    }
  };

  // Group fields by category
  // Merge tax compliance and legal compliance into one combined category card
  const fieldsByCategory = Object.entries(FIELD_BUSINESS_IMPACT).reduce((acc, [field, config]) => {
    const originalCategory = config.category;
    const mergedCategory = (originalCategory === 'الامتثال الضريبي' || originalCategory === 'الامتثال القانوني')
      ? 'الامتثال القانوني والضريبي'
      : originalCategory;

    if (!acc[mergedCategory]) {
      acc[mergedCategory] = [];
    }
    acc[mergedCategory].push({ field, ...config, category: mergedCategory });
    return acc;
  }, {} as Record<string, Array<{ field: string; category: string; priority: string; businessImpact: string; userImpact: string; icon: any; color: string }>>);

  return (
    <div className="space-y-8 p-6" dir="rtl">
      {/* Header */}
      <HealthStatusHeader overallHealth={overallHealth} />

      {/* Overall Health Status */}
      <OverallHealthStatus
        overallHealth={overallHealth}
        completionPercentage={companyDataStatus.completionPercentage}
        healthMessage={getHealthMessage()}
      />

      {/* Business Impact Metrics */}
      <BusinessImpactMetrics
        criticalMissing={companyDataStatus.criticalMissing}
        missingFields={companyDataStatus.missingFields}
      />

      {/* Detailed Field Analysis by Category */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Target className="h-6 w-6" />
          تحليل مفصل للحقول حسب الأهمية التجارية
        </h2>

        {Object.entries(fieldsByCategory).map(([category, fields]) => (
          <FieldCategorySection
            key={category}
            category={category}
            fields={fields}
            missingFields={companyDataStatus.missingFields}
            criticalMissing={companyDataStatus.criticalMissing}
          />
        ))}
      </div>

      {/* Business Recommendations */}
      <BusinessRecommendations
        criticalMissing={companyDataStatus.criticalMissing}
        missingFields={companyDataStatus.missingFields}
        isComplete={companyDataStatus.isComplete}
        fieldBusinessImpact={FIELD_BUSINESS_IMPACT}
      />
    </div>
  );
}