'use client';

import { useEffect, useMemo, useState } from 'react';
import { Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import SettingsLayout from '../components/SettingsLayout';
import { getSocialMedia } from '../actions/getSocialMedia';
import { saveSocialMedia } from '../actions/saveSocialMedia';

type SocialKey = 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'tiktok' | 'snapchat';
type SocialMediaLinks = Partial<Record<SocialKey, string>>;

export default function SocialMediaPage() {
    const [values, setValues] = useState<SocialMediaLinks>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const platforms: Array<{ key: SocialKey; label: string; placeholder: string; color: string }> = useMemo(() => ([
        { key: 'facebook', label: 'فيسبوك', placeholder: 'https://facebook.com/your-page', color: 'text-blue-600' },
        { key: 'instagram', label: 'إنستغرام', placeholder: 'https://instagram.com/your-account', color: 'text-pink-600' },
        { key: 'twitter', label: 'تويتر', placeholder: 'https://twitter.com/your-account', color: 'text-blue-400' },
        { key: 'linkedin', label: 'لينكد إن', placeholder: 'https://linkedin.com/company/your-company', color: 'text-blue-700' },
        { key: 'tiktok', label: 'تيك توك', placeholder: 'https://tiktok.com/@your-account', color: 'text-black' },
        { key: 'snapchat', label: 'سناب شات', placeholder: 'https://snapchat.com/add/your-username', color: 'text-yellow-500' },
    ]), []);

    useEffect(() => {
        const load = async () => {
            try {
                const result = await getSocialMedia();
                if (result.ok) {
                    setValues(result.data);
                } else {
                    toast.error('فشل في تحميل بيانات وسائل التواصل الاجتماعي');
                }
            } catch (e) {
                toast.error('حدث خطأ أثناء تحميل البيانات');
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, []);

    const completed = platforms.filter(({ key }) => (values[key]?.trim() ?? '') !== '').length;
    const total = platforms.length;

    const handleChange = (key: SocialKey, v: string) => {
        setValues((prev) => ({ ...prev, [key]: v }));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const result = await saveSocialMedia(values as Record<SocialKey, string>);
            if (result.ok) {
                toast.success('تم حفظ الروابط بنجاح');
            } else {
                toast.error('فشل في حفظ الروابط');
            }
        } catch (e) {
            toast.error('حدث خطأ أثناء الحفظ');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <SettingsLayout
                title="الروابط الاجتماعية"
                description="روابط وسائل التواصل الاجتماعي للشركة"
                icon={Share2}
                progress={{ current: 0, total, isComplete: false }}
            >
                <div className="flex items-center justify-center h-32">
                    <div className="text-muted-foreground">جاري التحميل...</div>
                </div>
            </SettingsLayout>
        );
    }

    return (
        <SettingsLayout
            title="الروابط الاجتماعية"
            description="روابط وسائل التواصل الاجتماعي للشركة"
            icon={Share2}
            progress={{ current: completed, total, isComplete: completed === total && total > 0 }}
        >
            <div className="space-y-6">
                {platforms.map(({ key, label, placeholder, color }) => (
                    <div key={key} className="space-y-2">
                        <label className="text-sm font-medium text-foreground">{label}</label>
                        <Input
                            value={values[key] ?? ''}
                            onChange={(e) => handleChange(key, e.target.value)}
                            placeholder={placeholder}
                            className="text-right"
                            dir="rtl"
                        />
                        {(values[key]?.trim() ?? '') !== '' ? (
                            <a href={values[key]} target="_blank" rel="noopener noreferrer" className={`text-xs ${color}`}>
                                {values[key]}
                            </a>
                        ) : (
                            <span className="text-xs text-muted-foreground">لا يوجد رابط</span>
                        )}
                    </div>
                ))}

                <div className="flex justify-end pt-2">
                    <Button onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? 'جارٍ الحفظ...' : 'حفظ الروابط'}
                    </Button>
                </div>
            </div>
        </SettingsLayout>
    );
}