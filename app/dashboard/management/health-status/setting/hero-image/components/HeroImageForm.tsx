"use client";

import AddImage from '@/components/AddImage';

export default function HeroImageForm({ initialUrl, companyId }: { initialUrl?: string; companyId?: string }) {
  return (
    <div className="space-y-6" dir="rtl">
      {/* Hero Image Section */}
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground">صورة الهيرو</h3>
          <p className="text-sm text-muted-foreground">صورة الهيرو تظهر في الصفحة الرئيسية للمتجر وتعكس هوية علامتك التجارية</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 items-start">
          {/* Hero Image Upload Area */}
          <div className="w-full min-w-0">
            <div className="relative w-full max-w-full aspect-[2/1] min-h-[180px] rounded-xl border-2 border-dashed border-muted-foreground/25 overflow-hidden bg-muted/5 hover:border-muted-foreground/40 transition-colors">
              <AddImage
                url={initialUrl}
                alt="صورة الهيرو"
                className="w-full h-full object-cover"
                recordId={companyId || ''}
                table="company"
                tableField="profilePicture"
                autoUpload={true}
              />
            </div>
          </div>

          {/* Specifications */}
          <div className="flex-1 space-y-4 min-w-[240px]">
            <div className="bg-muted/30 rounded-lg p-4 space-y-3">
              <h4 className="text-sm font-medium text-foreground">مواصفات صورة الهيرو المثلى</h4>
              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  <span>الأنواع المسموحة: PNG, JPG, WEBP, AVIF</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  <span>الأبعاد الموصى بها: 1920×600 بكسل (نسبة 3.2:1)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  <span>الحد الأقصى للحجم: 5MB</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  <span>جودة عالية ووضوح ممتاز للعرض على جميع الأجهزة</span>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-muted/30 rounded-lg p-4 border border-border">
              <div className="flex items-start gap-3">
                <div className="p-1 bg-muted rounded-full">
                  <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-foreground mb-1">نصائح لصورة الهيرو المثالية</h5>
                  <p className="text-xs text-muted-foreground">استخدم صورة جذابة تعكس طبيعة منتجاتك أو خدماتك. تجنب النصوص المعقدة واختر صورًا واضحة ومشرقة.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


