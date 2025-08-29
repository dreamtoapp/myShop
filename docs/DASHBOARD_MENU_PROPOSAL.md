### Dashboard Menu – Proposed Structure (Arabic, two-level collapsible submenus)

Goal: Use real submenus (collapsible groups) with two nesting levels. Parents toggle open/close and contain clickable children. Existing routes remain unchanged.

#### 1) لوحة التحكم
- [ ] لوحة التحكم: `/dashboard` icon: `LayoutDashboard`

#### 2) الطلبات
- [ ] جميع الطلبات: `/dashboard/management-orders`
- [ ] قيد المراجعة: `/dashboard/management-orders/status/pending`
- [ ] مخصصة للسائقين: `/dashboard/management-orders/status/assigned`
- [ ] قيد التوصيل: `/dashboard/management-orders/status/in-way`
- [ ] مكتملة: `/dashboard/management-orders/status/delivered`
- [ ] ملغاة: `/dashboard/management-orders/status/canceled`
- [ ] تحليلات الطلبات: `/dashboard/management-orders/analytics`

#### 3) المنتجات
- [ ] المنتجات: `/dashboard/management-products`
- [ ] التصنيفات: `/dashboard/management-categories`
- [ ] الموردين: `/dashboard/management-suppliers`

#### 4) العملاء
- [ ] العملاء: `/dashboard/management-users/customer`
- [ ] الدعم (تذاكر): `/dashboard/management/client-submission`

#### 5) الفريق
- [ ] المشرفون: `/dashboard/management-users/admin`
- [ ] السائقون: `/dashboard/management-users/drivers`

---

### الإعدادات (Submenus)

Parent: بيانات الشركة (collapsible)
- [ ] معلومات الشركة: `/dashboard/management/settings/company-profile`
- [ ] الموقع والعنوان: `/dashboard/management/settings/location`
- [ ] الروابط الاجتماعية: `/dashboard/management/settings/social-media`
- [ ] الشعار والهوية: `/dashboard/management/settings/branding`
- [ ] الامتثال (VAT/CR/رقم التعريف): `/dashboard/management/settings/compliance`

Parent: إعدادات المنصة (collapsible)
- [ ] إعدادات المنصة: `/dashboard/management/settings/platform`
- [ ] تحديث البيانات: `/dashboard/management/settings/platform#refresh`
- [ ] إعدادات متقدمة: `/dashboard/management/settings/advanced`

Parent: السياسات (collapsible)
- [ ] سياسة الموقع: `/dashboard/management/policies/website`
- [ ] سياسة الإرجاع: `/dashboard/management/policies/return`
- [ ] سياسة الخصوصية: `/dashboard/management/policies/privacy`
- [ ] سياسة الشحن: `/dashboard/management/policies/shipping`

Parent: أدوات إضافية (collapsible)
- [ ] التنبيهات: `/dashboard/management-notification`
- [ ] المناوبات: `/dashboard/shifts`
- [ ] الصيانة: `/dashboard/management-maintinance`
- [ ] التسويق: `/dashboard/management-offer`
- [ ] تحسين المحركات: `/dashboard/management-seo`
- [ ] المالية: `/dashboard/management-expenses`
- [ ] التقارير: `/dashboard/management-reports`

---

### تنفيذ سريع (تقني)
- Update `NavigationItem` type to support nested children recursively:
  ```ts
  export type NavigationItem = { label: string; href?: string; icon?: string; badge?: string; key?: string; children?: NavigationItem[] };
  ```
- Refactor `navigationMenu.ts` Settings node to include four parents (بيانات الشركة/إعدادات المنصة/السياسات/أدوات إضافية), each with its children as above.
- Sidebar component: implement collapsible behavior per parent
  - Store open state in `localStorage` (e.g., `settings.openGroups = ['company','platform']`).
  - Keyboard/ARIA: parent buttons use `aria-expanded`, child items are normal links.
- Keep routes unchanged; this is a rendering-only improvement.

### مبادئ UX مختصرة
- أقسام قليلة وواضحة، عناصر متجانسة داخل كل قسم.
- أهم المهام في الأعلى داخل كل قائمة.
- عناوين المجموعات غير قابلة للنقر لتقليل التشتيت.


