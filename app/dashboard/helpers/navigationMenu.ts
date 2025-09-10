// NOTE: All icon values are string names. Use the global <Icon name={item.icon} /> component to render.

// Function to get pending orders count - this will be called from the server component
export async function getPendingOrdersCount(): Promise<number> {
  try {
    // Use the existing getOrderCounts function that we know works
    const { getOrderCounts } = await import('../management-orders/actions/get-order-counts');
    const orderCounts = await getOrderCounts();
    return orderCounts.pending;
  } catch (error) {
    console.error('Error fetching pending orders count:', error);
    return 0;
  }
}

export const navigationItems = [
  {
    label: 'الطلبات',
    href: '/dashboard/management-orders',
    icon: 'ClipboardList',
    children: [
      { label: 'جميع الطلبات', href: '/dashboard/management-orders', icon: 'ClipboardList' },
      { label: 'قيد المراجعة', href: '/dashboard/management-orders/status/pending', icon: 'Clock' },
      { label: 'مخصصة للسائقين', href: '/dashboard/management-orders/status/assigned', icon: 'UserCheck' },
      { label: 'قيد التوصيل', href: '/dashboard/management-orders/status/in-way', icon: 'Truck' },
      { label: 'مكتملة', href: '/dashboard/management-orders/status/delivered', icon: 'CheckCircle' },
      { label: 'ملغاة', href: '/dashboard/management-orders/status/canceled', icon: 'XCircle' },
      { label: 'تحليلات الطلبات', href: '/dashboard/management-orders/analytics', icon: 'Activity' }
    ]
  },
  {
    label: 'المنتجات',
    href: '/dashboard/management-products',
    icon: 'Package',
    children: [
      { label: 'المنتجات', href: '/dashboard/management-products', icon: 'Package' },
      { label: 'التصنيفات', href: '/dashboard/management-categories', icon: 'Tags' },
      { label: 'الموردين', href: '/dashboard/management-suppliers', icon: 'Warehouse' },
      { label: 'العروض', href: '/dashboard/management-offer', icon: 'Megaphone' }
    ]
  },
  {
    label: 'العملاء',
    href: '/dashboard/management-users/customer',
    icon: 'Users',
    children: [
      { label: 'العملاء', href: '/dashboard/management-users/customer', icon: 'Users' },
      { label: 'الدعم', href: '/dashboard/management/client-submission', icon: 'Headset' }
    ]
  },
  {
    label: 'الفريق',
    href: '/dashboard/management-users/drivers',
    icon: 'Truck',
    children: [
      { label: 'المشرفون', href: '/dashboard/management-users/admin', icon: 'Shield' },
      // { label: 'التسويق', href: '/dashboard/management-users/marketer', icon: 'Megaphone' },
      { label: 'السائقون', href: '/dashboard/management-users/drivers', icon: 'Truck' },

    ]
  },
  {
    label: 'معلومات المتجر',
    href: '/dashboard/management/settings/company-profile',
    icon: 'Building2',
    children: [
      { label: 'معلومات المتجر', href: '/dashboard/management/settings/company-profile', icon: 'Building2' },
      { label: 'إعدادات المنصة', href: '/dashboard/management/settings/platform', icon: 'Settings' },
      { label: 'الموقع والعنوان', href: '/dashboard/management/settings/location', icon: 'MapPin' },

      { label: 'الروابط الاجتماعية', href: '/dashboard/management/settings/social-media', icon: 'Share2' },
      { label: 'الشعار والهوية', href: '/dashboard/management/settings/branding', icon: 'Palette' },
      { label: 'الامتثال (VAT/CR/رقم التعريف)', href: '/dashboard/management/settings/compliance', icon: 'ShieldCheck' },
      // السياسات ضمن معلومات المتجر
      { label: 'سياسة الموقع', href: '/dashboard/management/policies/website', icon: 'Globe' },
      { label: 'سياسة الإرجاع', href: '/dashboard/management/policies/return', icon: 'Undo' },
      { label: 'سياسة الخصوصية', href: '/dashboard/management/policies/privacy', icon: 'Shield' },
      { label: 'سياسة الشحن', href: '/dashboard/management/policies/shipping', icon: 'Truck' },
      // عناصر إضافية مطلوبة ضمن معلومات المتجر
      { label: 'المناوبات', href: '/dashboard/shifts', icon: 'Clock' },
      { label: 'من نحن', href: '/dashboard/management/about', icon: 'Info' },
      { label: 'دليل الاستخدام', href: '/dashboard/guidelines', icon: 'BookOpen' },
    ]
  },
  {
    label: 'المالية',
    href: '/dashboard/management-expenses',
    icon: 'DollarSign',
    children: [
      { label: 'المصروفات', href: '/dashboard/management-expenses', icon: 'DollarSign' },
      { label: 'الإيرادات', href: '/dashboard/management-expenses/revenue', icon: 'TrendingUp' },
      { label: 'التقارير المالية', href: '/dashboard/management-expenses/reports', icon: 'BarChart3' }
    ]
  },
  {
    label: 'التقارير',
    href: '/dashboard/management-reports',
    icon: 'BarChart3',
    children: [
      // 📊 تقارير المبيعات والربحية
      { label: '📊 المبيعات والربحية', href: '', icon: 'TrendingUp', key: 'category-header-1' },
      { label: 'تقرير المبيعات', href: '/dashboard/management-reports/sales', icon: 'TrendingUp' },
      { label: 'التقارير المالية', href: '/dashboard/management-reports/finance', icon: 'DollarSign' },
      { label: 'أداء المنتجات', href: '/dashboard/management-reports/product-performance', icon: 'BarChart2' },

      // Separator
      { label: '---', href: '', icon: 'Minus', key: 'separator-1' },

      // 📋 تقارير العمليات والمخزون
      { label: '📋 العمليات والمخزون', href: '', icon: 'ClipboardList', key: 'category-header-2' },
      { label: 'تحليلات الطلبات', href: '/dashboard/management-reports/orders', icon: 'Activity' },
      { label: 'تقرير المخزون', href: '/dashboard/management-reports/inventory', icon: 'ClipboardList' },
      { label: 'تقرير السائقين والتوصيل', href: '/dashboard/management-reports/drivers', icon: 'Truck' },

      // Separator
      { label: '---', href: '', icon: 'Minus', key: 'separator-2' },

      // 👥 تقارير العملاء والتسويق
      { label: '👥 العملاء والتسويق', href: '', icon: 'UserCheck', key: 'category-header-3' },
      { label: 'تقرير العملاء', href: '/dashboard/management-reports/customers', icon: 'UserCheck' },
      { label: 'تقرير العروض والتخفيضات', href: '/dashboard/management-reports/promotions', icon: 'Gift' },
      { label: 'تقرير التقييمات والمراجعات', href: '/dashboard/management-reports/reviews', icon: 'Star' },

      // Separator
      { label: '---', href: '', icon: 'Minus', key: 'separator-3' },

      // 🏆 تقارير عامة وإنجازات
      { label: '🏆 الإنجازات والأرقام', href: '', icon: 'Award', key: 'category-header-4' },
      { label: 'الإنجازات والأرقام القياسية', href: '/dashboard/management-reports/milestones', icon: 'Award' },
    ]
  },
  {
    label: 'إعدادات المنصة',
    href: '/dashboard/management/settings/platform',
    icon: 'Settings',
    iconOnly: true,
    children: [

      // { label: 'تحديث البيانات', href: '/dashboard/management/settings/platform#refresh', icon: 'RefreshCw' },
      { label: 'إعدادات متقدمة', href: '/dashboard/management/settings/advanced', icon: 'Wrench' },

      { label: 'System Log', href: '/dashboard/management/settings/errors', icon: 'Bug' },
      { label: 'حالة التطبيق', href: '/dashboard/health-status', icon: 'Activity' },
      { label: 'تحسين المحركات', href: '/dashboard/management-seo', icon: 'Search' },
      { label: 'الصيانة', href: '/dashboard/management-maintinance', icon: 'Wrench' },
    ]
  }
];

export type NavigationItem = {
  label: string;
  href?: string;
  icon?: string; // Made optional since some parent items may not need icons
  badge?: string;
  key?: string;
  iconOnly?: boolean;
  children?: NavigationItem[];
};