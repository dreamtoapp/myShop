'use client';

import { useState, useTransition } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { updateCompliance } from '../../actions/updateCompliance';

interface Props {
  initial: { taxNumber?: string | null; commercialRegistrationNumber?: string | null; saudiBusinessId?: string | null } | null;
}

export default function ComplianceForm({ initial }: Props) {
  const [taxNumber, setTaxNumber] = useState(initial?.taxNumber ?? '');
  const [cr, setCr] = useState(initial?.commercialRegistrationNumber ?? '');
  const [sb, setSb] = useState(initial?.saudiBusinessId ?? '');
  const [isPending, startTransition] = useTransition();

  return (
    <div className="space-y-4">
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
        <span className="text-[11px] text-muted-foreground">حتى 15 رقم</span>
      </div>
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
        <span className="text-[11px] text-muted-foreground">حتى 10 أرقام</span>
      </div>
      <div className="grid gap-1">
        <label className="text-sm">رقم التعريف (Saudi Business)</label>
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
        <span className="text-[11px] text-muted-foreground">حتى 10 أرقام</span>
      </div>
      <div className="pt-2">
        <Button disabled={isPending} onClick={() => {
          startTransition(async () => {
            const res = await updateCompliance({ taxNumber, commercialRegistrationNumber: cr, saudiBusinessId: sb });
            if (res.ok) toast.success('تم الحفظ'); else toast.error(res.message || 'فشل الحفظ');
          });
        }}>حفظ</Button>
      </div>
    </div>
  );
}


