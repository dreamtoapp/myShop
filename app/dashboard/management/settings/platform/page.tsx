"use client";

import { useEffect, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings } from 'lucide-react';
import SettingsLayout from '../components/SettingsLayout';
import { fetchCompany } from '../actions/fetchCompany';
import { saveCompany } from '../actions/saveCompnay';

const PlatformSchema = z.object({
    id: z.string().optional(),
    workingHours: z.string().trim().optional(),
    shippingFee: z
        .number({ invalid_type_error: 'القيمة يجب أن تكون رقمًا' })
        .min(0, 'لا يمكن أن تكون سالبة'),
    minShipping: z
        .number({ invalid_type_error: 'القيمة يجب أن تكون رقمًا' })
        .min(0, 'لا يمكن أن تكون سالبة'),
});

type PlatformFormValues = {
    id?: string;
    workingHours?: string;
    shippingFee: number;
    minShipping: number;
};

export default function PlatformPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [company, setCompany] = useState<any>(null);

    const { register, handleSubmit, reset, watch, setValue, formState: { isDirty, isSubmitting, errors } } = useForm<PlatformFormValues>({
        resolver: zodResolver(PlatformSchema),
        mode: 'onTouched',
        defaultValues: {
            id: '',
            workingHours: '',
            shippingFee: 0,
            minShipping: 0,
        },
    });

    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchCompany();
                if (data) {
                    setCompany(data);
                    reset({
                        id: data.id || '',
                        workingHours: data.workingHours || '',
                        shippingFee: Number(data.shippingFee ?? 0),
                        minShipping: Number(data.minShipping ?? 0),
                    });
                }
            } catch (error) {
                console.error('Error fetching platform data:', error);
                toast.error('فشل في تحميل بيانات المنصة');
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, [reset]);

    const onSubmit: SubmitHandler<PlatformFormValues> = async (values) => {
        try {
            const currentCompany = company || (await fetchCompany());
            if (!currentCompany) {
                toast.error('لم يتم العثور على بيانات المتجر');
                return;
            }

            // No confirm prompts currently needed

            const updatedData = {
                ...currentCompany,
                ...values,
            };

            const result = await saveCompany(updatedData);
            if (result.success) {
                toast.success('تم حفظ البيانات بنجاح');
                setCompany(result.company ?? currentCompany);
                reset(values);
            } else {
                toast.error(result.message || 'فشل في حفظ البيانات');
            }
        } catch (error) {
            console.error('Error saving platform data:', error);
            toast.error('فشل في حفظ البيانات');
        }
    };

    const watched = watch();

    // Single source-of-truth helpers for numeric display
    const toDisplayNumber = (value: unknown, max?: number) => {
        const n = typeof value === 'number' ? value : Number(value);
        if (!Number.isFinite(n)) return 0;
        if (typeof max === 'number') return Math.min(max, Math.max(0, Math.round(n)));
        return Math.max(0, Math.round(n));
    };

    // Normalize and guard numeric inputs on blur
    const normalizeNumber = (field: 'shippingFee' | 'minShipping') => (e: React.FocusEvent<HTMLInputElement>) => {
        const raw = e.target.value;
        const num = Number(raw);
        if (!Number.isFinite(num)) return;
        let next = Math.max(0, Math.round(num));
        setValue(field, next, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
    };
    // Progress integrated with the form: required fields are always counted;
    // optional fields are counted ONLY if provided (non-empty), and excluded from total otherwise.
    const requiredValid = [
        Number.isFinite(Number(watched.shippingFee)),
        Number.isFinite(Number(watched.minShipping)),
    ].filter(Boolean).length;

    const optionalProvided = [
        (watched.workingHours ?? '').toString().trim() !== '',
    ];
    const optionalValid = optionalProvided.filter(Boolean).length;

    const completedFields = requiredValid + optionalValid;
    const totalFields = 2 + optionalProvided.filter(Boolean).length;
    const isComplete = completedFields === totalFields && totalFields > 0;

    if (isLoading) {
        return (
            <SettingsLayout
                title="إعدادات المنصة"
                description="إدارة الإعدادات العامة للمنصة"
                icon={Settings}
                progress={{ current: 0, total: totalFields, isComplete: false }}
            >
                <div className="flex items-center justify-center h-32">
                    <div className="text-muted-foreground">جاري التحميل...</div>
                </div>
            </SettingsLayout>
        );
    }

    return (
        <SettingsLayout
            title="إعدادات المنصة"
            description="إدارة الإعدادات العامة للمنصة"
            icon={Settings}
            progress={{ current: completedFields, total: totalFields, isComplete }}
        >
            <div className="space-y-8">
                {/* Unified Form */}
                <Card className="shadow-sm border-0 bg-gradient-to-br from-background to-muted/50">
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <input type="hidden" {...register('id')} />

                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-foreground">ساعات العمل</Label>
                                <Input
                                    type="text"
                                    placeholder="مثال: الأحد - الخميس: 8:00 ص - 10:00 م"
                                    {...register('workingHours')}
                                />
                                {errors.workingHours && (
                                    <p className="text-xs text-destructive">{errors.workingHours.message as string}</p>
                                )}
                            </div>

                            {/* Tax fields removed per request */}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-foreground">رسوم التوصيل (ريال)</Label>
                                    <Input
                                        type="number"
                                        step="1"
                                        min={0}
                                        placeholder="0"
                                        {...register('shippingFee', { valueAsNumber: true })}
                                        onBlur={normalizeNumber('shippingFee')}
                                    />
                                    {errors.shippingFee && (
                                        <p className="text-xs text-destructive">{errors.shippingFee.message as string}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-foreground">حد التوصيل المجاني (ريال)</Label>
                                    <Input
                                        type="number"
                                        step="1"
                                        min={0}
                                        placeholder="0"
                                        {...register('minShipping', { valueAsNumber: true })}
                                        onBlur={normalizeNumber('minShipping')}
                                    />
                                    {errors.minShipping && (
                                        <p className="text-xs text-destructive">{errors.minShipping.message as string}</p>
                                    )}
                                    <p className="text-xs text-muted-foreground">إذا كانت قيمة السلة ≥ هذا الحد، يصبح التوصيل مجانيًا.</p>
                                </div>
                            </div>

                            {/* Business logic summary - uses a single source of truth (form state) */}
                            <div className="p-3 rounded-md bg-muted/50 border text-sm text-muted-foreground">
                                <div>رسوم التوصيل الحالية: <span className="font-medium text-foreground">{toDisplayNumber(watched.shippingFee)} ريال</span></div>
                                <div>التوصيل مجاني من: <span className="font-medium text-foreground">{toDisplayNumber(watched.minShipping)} ريال</span></div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <Button type="submit" disabled={!isDirty || isSubmitting}>
                                    {isSubmitting ? 'جارٍ الحفظ...' : 'حفظ الإعدادات'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </SettingsLayout>
    );
} 