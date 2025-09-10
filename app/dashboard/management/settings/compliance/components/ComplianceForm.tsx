'use client';

import { useMemo, useState, useTransition } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { updateCompliance } from '../../actions/updateCompliance';
import { Loader2 } from 'lucide-react';

interface Props {
  initial: {
    taxNumber?: string | null;
    taxPercentage?: number | null;
    commercialRegistrationNumber?: string | null;
    saudiBusinessId?: string | null;
  } | null;
}

export default function ComplianceForm({ initial }: Props) {
  const [taxNumber, setTaxNumber] = useState(initial?.taxNumber ?? '');
  const [taxPercentage, setTaxPercentage] = useState<number>(Number(initial?.taxPercentage ?? 15));
  const [cr, setCr] = useState(initial?.commercialRegistrationNumber ?? '');
  const [sb, setSb] = useState(initial?.saudiBusinessId ?? '');
  const [isPending, startTransition] = useTransition();

  // Lightweight client validation for better UX
  const errors = useMemo(() => {
    const err: Record<string, string | null> = { vat: null, tax: null, cr: null, sb: null };
    if (taxNumber && taxNumber.length !== 15) err.vat = 'يجب أن يتكون من 15 رقمًا';
    if (taxPercentage < 0 || taxPercentage > 100) err.tax = 'النسبة بين 0 و 100%';
    if (cr && cr.length !== 10) err.cr = 'يجب أن يتكون من 10 أرقام';
    if (sb && sb.length !== 10) err.sb = 'يجب أن يتكون من 10 أرقام';
    return err;
  }, [taxNumber, taxPercentage, cr, sb]);

  const hasErrors = Boolean(errors.vat || errors.tax || errors.cr || errors.sb);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">بيانات الضرائب والامتثال</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6" dir="rtl">
          {/* VAT + Tax Percentage */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="grid gap-1">
              <label className="text-sm">الرقم الضريبي (VAT)</label>
              <Input
                value={taxNumber}
                inputMode="numeric"
                maxLength={15}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D+/g, '').slice(0, 15);
                  setTaxNumber(v);
                }}
                placeholder="مثال: 310XXXXXXXXXXXX"
              />
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground">حتى 15 رقم</span>
                {errors.vat && <span className="text-[11px] text-destructive">{errors.vat}</span>}
              </div>
            </div>
            <div className="grid gap-1">
              <label className="text-sm">نسبة الضريبة (%)</label>
              <div className="relative">
                <Input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={100}
                  step={1}
                  value={taxPercentage}
                  onChange={(e) => {
                    const n = Math.max(0, Math.min(100, Math.round(Number(e.target.value) || 0)));
                    setTaxPercentage(n);
                  }}
                  placeholder="15"
                />
                <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground">من 0% إلى 100%</span>
                {errors.tax && <span className="text-[11px] text-destructive">{errors.tax}</span>}
              </div>
            </div>
          </div>
          {/* CR */}
          <div className="grid gap-1">
            <label className="text-sm">السجل التجاري (CR)</label>
            <Input
              value={cr}
              inputMode="numeric"
              maxLength={10}
              onChange={(e) => {
                const v = e.target.value.replace(/\D+/g, '').slice(0, 10);
                setCr(v);
              }}
              placeholder="مثال: 101XXXXXXXX"
            />
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground">حتى 10 أرقام</span>
              {errors.cr && <span className="text-[11px] text-destructive">{errors.cr}</span>}
            </div>
          </div>
          {/* Saudi Business */}
          <div className="grid gap-1">
            <label className="text-sm">المركز السعودي للأعمال</label>
            <Input
              value={sb}
              inputMode="numeric"
              maxLength={10}
              onChange={(e) => {
                const v = e.target.value.replace(/\D+/g, '').slice(0, 10);
                setSb(v);
              }}
              placeholder="مثال: 700XXXXXXXX"
            />
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground">حتى 10 أرقام</span>
              {errors.sb && <span className="text-[11px] text-destructive">{errors.sb}</span>}
            </div>
          </div>
          <div className="pt-3 flex items-center justify-end gap-3">
            <Button disabled={isPending || hasErrors} onClick={() => {
              startTransition(async () => {
                const res = await updateCompliance({ taxNumber, taxPercentage, commercialRegistrationNumber: cr, saudiBusinessId: sb });
                if (res.ok) toast.success('تم الحفظ'); else toast.error(res.message || 'فشل الحفظ');
              });
            }}>{isPending ? (<span className="inline-flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> جاري الحفظ...</span>) : 'حفظ'}</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


