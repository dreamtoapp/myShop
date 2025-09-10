"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { saveCompany } from "../../actions/saveCompnay";
import { z } from "zod";

// Zod schema for company profile only
const CompanyProfileSchema = z.object({
    id: z.string().optional(),
    fullName: z.string().min(2, 'اسم المتجر مطلوب'),
    email: z.string().email('صيغة البريد الإلكتروني غير صحيحة'),
    phoneNumber: z.string().min(8, 'رقم الهاتف مطلوب'),
    whatsappNumber: z.string().min(8, 'رقم الواتساب مطلوب'),
    bio: z.string().optional(),
});

type CompanyProfileFormData = z.infer<typeof CompanyProfileSchema>;

interface CompanyProfileFormProps {
    company?: any;
    onProgressChange?: (current: number, total: number, isComplete: boolean) => void;
}

export default function CompanyProfileForm({ company, onProgressChange }: CompanyProfileFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isComplete, setIsComplete] = useState(
        !!(company?.fullName && company?.email && company?.phoneNumber)
    );

    const {
        register,
        handleSubmit,
        formState: { errors, isDirty },
        reset,
        watch,
    } = useForm<CompanyProfileFormData>({
        resolver: zodResolver(CompanyProfileSchema),
        defaultValues: {
            id: company?.id || '',
            fullName: company?.fullName || '',
            email: company?.email || '',
            phoneNumber: company?.phoneNumber || '',
            whatsappNumber: company?.whatsappNumber || '',
            bio: company?.bio || '',
        },
    });


    // Report progress to parent (top progress bar)
    useEffect(() => {
        const subscription = watch((vals) => {
            const total = 3;
            const current = [vals.fullName, vals.email, vals.phoneNumber].filter(Boolean).length;
            onProgressChange?.(current, total, current === total);
        });
        return () => subscription.unsubscribe();
    }, [watch, onProgressChange]);

    const onSubmit = async (data: CompanyProfileFormData) => {
        setIsSubmitting(true);
        try {
            // Merge with existing company data to preserve other fields
            const updatedData = {
                ...company,
                ...data,
            };

            await saveCompany(updatedData);
            setIsComplete(true);
            toast.success("تم حفظ معلومات المتجر بنجاح ✅");
            reset(data); // Reset form with new values
        } catch (error) {
            console.error("❌ Failed to save company profile:", error);
            toast.error("حدث خطأ أثناء الحفظ، الرجاء المحاولة مرة أخرى.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6" dir="rtl">
            {/* Completion Status */}
            {isComplete && (
                <Alert className="border-green-200 bg-green-50">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                        تم إكمال المعلومات الأساسية للشركة بنجاح
                    </AlertDescription>
                </Alert>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Company Name */}
                    <div className="space-y-2">
                        <Label htmlFor="fullName" className="text-sm font-medium text-right block">
                            اسم المتجر *
                        </Label>
                        <Input
                            id="fullName"
                            type="text"
                            placeholder="أدخل اسم المتجر"
                            {...register('fullName')}
                            className="text-right"
                            dir="rtl"
                        />
                        {errors.fullName && (
                            <div className="flex items-center gap-2 text-xs text-destructive">
                                <AlertCircle className="w-3 h-3" />
                                {errors.fullName.message}
                            </div>
                        )}
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium text-right block">
                            البريد الإلكتروني *
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="أدخل البريد الإلكتروني"
                            {...register('email')}
                            className="text-right"
                            dir="rtl"
                        />
                        {errors.email && (
                            <div className="flex items-center gap-2 text-xs text-destructive">
                                <AlertCircle className="w-3 h-3" />
                                {errors.email.message}
                            </div>
                        )}
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-2">
                        <Label htmlFor="phoneNumber" className="text-sm font-medium text-right block">
                            رقم الهاتف *
                        </Label>
                        <Input
                            id="phoneNumber"
                            type="tel"
                            placeholder="أدخل رقم الهاتف"
                            {...register('phoneNumber')}
                            className="text-right"
                            dir="rtl"
                        />
                        {errors.phoneNumber && (
                            <div className="flex items-center gap-2 text-xs text-destructive">
                                <AlertCircle className="w-3 h-3" />
                                {errors.phoneNumber.message}
                            </div>
                        )}
                    </div>

                    {/* WhatsApp Number */}
                    <div className="space-y-2">
                        <Label htmlFor="whatsappNumber" className="text-sm font-medium text-right block">
                            رقم الواتساب *
                        </Label>
                        <Input
                            id="whatsappNumber"
                            type="tel"
                            placeholder="أدخل رقم الواتساب"
                            {...register('whatsappNumber')}
                            className="text-right"
                            dir="rtl"
                        />
                        <p className="text-xs text-muted-foreground">اكتب الرقم بصيغة دولية: +9665XXXXXXXX (يُقبل 05XXXXXXXX أيضًا)</p>
                        {errors.whatsappNumber && (
                            <div className="flex items-center gap-2 text-xs text-destructive">
                                <AlertCircle className="w-3 h-3" />
                                {errors.whatsappNumber.message}
                            </div>
                        )}
                    </div>
                </div>

                {/* Company Bio */}
                <div className="space-y-2">
                    <Label htmlFor="bio" className="text-sm font-medium text-right block">
                        نبذة عن المتجر (اختياري)
                    </Label>
                    <Textarea
                        id="bio"
                        placeholder="أدخل نبذة مختصرة عن شركتك"
                        {...register('bio')}
                        className="text-right min-h-[100px]"
                        dir="rtl"
                    />
                    {errors.bio && (
                        <div className="flex items-center gap-2 text-xs text-destructive">
                            <AlertCircle className="w-3 h-3" />
                            {errors.bio.message}
                        </div>
                    )}
                </div>

                {/* Form Actions */}
                <div className="flex gap-4 pt-6 border-t justify-end">
                    <Button
                        type="submit"
                        disabled={isSubmitting || !isDirty}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                                جاري الحفظ...
                            </>
                        ) : (
                            'حفظ المعلومات'
                        )}
                    </Button>
                </div>
            </form>


        </div>
    );
}