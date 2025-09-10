"use client";

import { useEffect, useState } from 'react';
import { Palette } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import SettingsLayout from '../components/SettingsLayout';
import AddImage from '@/components/AddImage';
import { fetchCompany } from '../actions/fetchCompany';

export default function BrandingPage() {
    const [companyId, setCompanyId] = useState<string | null>(null);
    const [logoUrl, setLogoUrl] = useState<string | undefined>(undefined);
    const [heroUrl, setHeroUrl] = useState<string | undefined>(undefined);
    const [primaryColor, setPrimaryColor] = useState<string>('#0ea5e9');
    const [secondaryColor, setSecondaryColor] = useState<string>('#22c55e');

    useEffect(() => {
        const load = async () => {
            const data = await fetchCompany();
            setCompanyId(data?.id ?? null);
            setLogoUrl(data?.logo || undefined);
            setHeroUrl(data?.profilePicture || undefined);
        };
        load();
    }, []);

    return (
        <SettingsLayout
            title="الشعار والهوية"
            description="ارفع شعارًا واضحًا وصورة تعريف متناسقة لتحسين الانطباع الأول والهوية البصرية"
            icon={Palette}
        >
            <div className="space-y-10">
                <div className="p-4 rounded-lg bg-muted/40 border text-sm text-muted-foreground leading-6">
                    <div className="font-medium text-foreground mb-1">إرشادات سريعة للحصول على أفضل نتيجة</div>
                    <ul className="list-disc list-inside space-y-1">
                        <li>صيغة الشعار المفضلة: PNG بخلفية شفافة، أبعاد مقترحة 512×512 بكسل.</li>
                        <li>صورة الهوية/الملف: JPG/PNG بنسبة 1:1، أبعاد مقترحة 1024×1024 بكسل.</li>
                        <li>حافظ على مساحة فارغة حول الشعار (Padding) حتى لا يلتصق بالحواف.</li>
                        <li>تأكد من تباين جيد بين الشعار والخلفية لوضوح أعلى في الوضعين الفاتح والداكن.</li>
                    </ul>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Logo Card */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base">شعار المتجر (Logo)</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-xs text-muted-foreground">يُستخدم في الرأس (Header)، الفوتر (Footer)، الإشعارات وبعض القوائم.</p>
                            <div className="flex flex-wrap gap-2 text-[10px]">
                                <span className="px-2 py-1 rounded-full bg-muted text-foreground">مقترح: 512×512</span>
                                <span className="px-2 py-1 rounded-full bg-muted text-foreground">نسبة 1:1</span>
                                <span className="px-2 py-1 rounded-full bg-muted text-foreground">PNG شفاف</span>
                            </div>
                            <div className="w-full sm:w-64 h-40 border-2 border-dashed border-border rounded-lg overflow-hidden bg-muted/30 flex items-center justify-center">
                                {companyId && (
                                    <AddImage
                                        url={logoUrl}
                                        alt="شعار المتجر"
                                        recordId={companyId}
                                        table="company"
                                        tableField="logo"
                                        autoUpload
                                        onUploadComplete={(url) => setLogoUrl(url)}
                                    />
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Hero Card */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base">صورة الهيرو (Hero Image)</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-xs text-muted-foreground">تظهر في قسم الهيرو في الصفحات التعريفية، وقد تُستخدم في بطاقات/مشاركات محددة.</p>
                            <div className="flex flex-wrap gap-2 text-[10px]">
                                <span className="px-2 py-1 rounded-full bg-muted text-foreground">مقترح: 1920×1080</span>
                                <span className="px-2 py-1 rounded-full bg-muted text-foreground">نسبة 16:9</span>
                                <span className="px-2 py-1 rounded-full bg-muted text-foreground">JPG/PNG</span>
                            </div>
                            <div className="w-full sm:w-64 h-40 border-2 border-dashed border-border rounded-lg overflow-hidden bg-muted/30 flex items-center justify-center">
                                {companyId && (
                                    <AddImage
                                        url={heroUrl}
                                        alt="صورة الهوية"
                                        recordId={companyId}
                                        table="company"
                                        tableField="profilePicture"
                                        autoUpload
                                        onUploadComplete={(url) => setHeroUrl(url)}
                                    />
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Brand colors (UI only - coming soon) */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base">ألوان الهوية (قريبًا)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">اللون الأساسي (Primary)</label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        value={primaryColor}
                                        onChange={(e) => setPrimaryColor(e.target.value)}
                                        className="h-10 w-12 cursor-pointer rounded border border-border bg-background"
                                    />
                                    <span className="text-xs text-muted-foreground">{primaryColor.toUpperCase()}</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">اللون الثانوي (Secondary)</label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        value={secondaryColor}
                                        onChange={(e) => setSecondaryColor(e.target.value)}
                                        className="h-10 w-12 cursor-pointer rounded border border-border bg-background"
                                    />
                                    <span className="text-xs text-muted-foreground">{secondaryColor.toUpperCase()}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end pt-4">
                            <button
                                type="button"
                                onClick={() => toast.info('قريبًا: سيتم تطبيق الألوان على ثيم التطبيق والمكوّنات بعد التفعيل')}
                                className="px-4 py-2 rounded bg-muted text-foreground hover:bg-muted/80 text-sm"
                            >
                                حفظ الألوان (قريبًا)
                            </button>
                        </div>
                    </CardContent>
                </Card>

                {/* Live preview */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base">معاينة فورية (سطح المكتب والجوال)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Desktop preview */}
                            <div className="space-y-3">
                                <div className="text-sm font-medium">سطح المكتب</div>
                                {/* Browser-like frame */}
                                <div className="rounded-2xl border bg-background overflow-hidden shadow-sm">
                                    <div className="h-10 flex items-center justify-between px-3 bg-muted/60">
                                        <div className="flex items-center gap-2">
                                            <span className="h-3 w-3 rounded-full bg-red-400" />
                                            <span className="h-3 w-3 rounded-full bg-yellow-400" />
                                            <span className="h-3 w-3 rounded-full bg-green-400" />
                                        </div>
                                        <div className="flex-1 mx-3 h-6 rounded-full bg-muted/40 max-w-[420px]" />
                                        <div className="w-5" />
                                    </div>
                                    {/* Page header with logo */}
                                    <div className="h-12 bg-muted/50 flex items-center px-4">
                                        {logoUrl ? (
                                            <img src={logoUrl} alt="Logo" className="h-7 w-auto" />
                                        ) : (
                                            <div className="h-7 w-28 bg-muted rounded" />
                                        )}
                                    </div>
                                    {/* Full desktop hero (16:9, rounded) */}
                                    <div className="relative w-full overflow-hidden rounded-xl shadow-sm" style={{ paddingTop: '56.25%' }}>
                                        {heroUrl ? (
                                            <img src={heroUrl} alt="Hero" className="absolute inset-0 w-full h-full object-cover" />
                                        ) : (
                                            <div className="absolute inset-0 bg-muted/50" />
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent" />
                                        <div className="absolute bottom-3 left-4 text-white text-sm">عنوان تجريبي فوق الصورة</div>
                                    </div>
                                    {/* Body with grid of 4 simulated product cards (centered content width) */}
                                    <div className="px-6 py-5">
                                        <div className="mx-auto max-w-[980px] grid grid-cols-2 lg:grid-cols-4 gap-5">
                                            {Array.from({ length: 4 }).map((_, idx) => (
                                                <div key={`desk-card-${idx}`} className="rounded-2xl border bg-card text-card-foreground overflow-hidden shadow-sm">
                                                    <div className="p-2.5 space-y-1.5">
                                                        <div className="h-2.5 w-5/6 bg-muted rounded" />
                                                        <div className="h-2.5 w-2/3 bg-muted rounded" />
                                                        <div className="flex items-center justify-between pt-2">
                                                            <div className="h-3.5 w-20 bg-muted rounded" />
                                                            <div className="h-6 w-20 bg-primary/20 rounded-md" />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Mobile preview */}
                            <div className="space-y-3">
                                <div className="text-sm font-medium">الجوال</div>
                                {/* Phone frame */}
                                <div className="mx-auto w-[300px] rounded-[40px] border-[10px] border-foreground/10 bg-foreground/5 shadow-md">
                                    <div className="rounded-[30px] overflow-hidden bg-background">
                                        {/* Top bezel with camera notch */}
                                        <div className="relative h-8 bg-background">
                                            <div className="absolute left-1/2 -translate-x-1/2 top-1 h-5 w-28 rounded-b-2xl bg-foreground/10" />
                                        </div>
                                        {/* App bar with logo */}
                                        <div className="h-10 bg-muted/60 flex items-center px-3">
                                            {logoUrl ? (
                                                <img src={logoUrl} alt="Logo" className="h-5 w-auto" />
                                            ) : (
                                                <div className="h-5 w-20 bg-muted rounded" />
                                            )}
                                        </div>
                                        {/* Full mobile hero area */}
                                        <div className="h-48 relative">
                                            {heroUrl ? (
                                                <img src={heroUrl} alt="Hero" className="absolute inset-0 w-full h-full object-cover" />
                                            ) : (
                                                <div className="absolute inset-0 bg-muted/50" />
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                                        </div>
                                        {/* Body with 6 simulated product cards */}
                                        <div className="p-3 grid grid-cols-2 gap-3">
                                            {Array.from({ length: 6 }).map((_, idx) => (
                                                <div key={`mob-card-${idx}`} className="rounded-2xl border bg-card text-card-foreground overflow-hidden shadow-sm">
                                                    <div className="p-1.5 space-y-1">
                                                        <div className="h-2 w-3/4 bg-muted rounded" />
                                                        <div className="h-2 w-1/2 bg-muted rounded" />
                                                        <div className="flex items-center justify-between pt-1">
                                                            <div className="h-2.5 w-12 bg-muted rounded" />
                                                            <div className="h-5 w-16 bg-primary/20 rounded-md" />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        {/* Home indicator */}
                                        <div className="h-10 flex items-center justify-center">
                                            <div className="h-1 w-24 rounded-full bg-foreground/20" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </SettingsLayout>
    );
} 