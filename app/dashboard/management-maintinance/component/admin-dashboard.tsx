'use client';
// SaaS Admin/Owner Maintenance Dashboard
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/icons/Icon';
import { useState } from 'react';
import { refreshAllCaches } from '../../management/settings/actions/refreshCaches';
import { dbHealthCheck } from '../actions/dbHealthCheck';
import { pusherHealthCheck } from '../actions/pusherHealthCheck';
import { sendTestEmail } from '../actions/sendTestEmail';
import { getAtlasClusterInfo } from '../actions/getAtlasClusterInfo';

export default function AdminMaintenanceDashboard() {
  const [refreshing, setRefreshing] = useState(false);
  const [refreshDone, setRefreshDone] = useState<'idle' | 'ok' | 'err'>('idle');
  const [dbLatency, setDbLatency] = useState<number | null>(null);
  const [dbName, setDbName] = useState<string | null>(null);
  const [dbPlan, setDbPlan] = useState<string | null>(null);
  const [atlasPlan, setAtlasPlan] = useState<string | null>(null);
  const [atlasProvider, setAtlasProvider] = useState<string | null>(null);
  const [pusherConfigured, setPusherConfigured] = useState<boolean | null>(null);
  const [missingKeys, setMissingKeys] = useState<string[]>([]);

  const handleRefreshHealth = async () => {
    setRefreshing(true);
    setRefreshDone('idle');
    const res = await refreshAllCaches();
    setRefreshing(false);
    setRefreshDone(res.ok ? 'ok' : 'err');
  };
  const handleCheckDb = async () => {
    const db = await dbHealthCheck();
    setDbLatency(db.ok ? db.latencyMs ?? null : null);
    setDbName(db.ok ? (db as any).dbName ?? null : null);
    setDbPlan(db.ok ? (db as any).plan ?? null : null);
    const atlas = await getAtlasClusterInfo();
    if (atlas.ok) {
      setAtlasPlan((atlas as any).instanceSizeName ?? null);
      setAtlasProvider((atlas as any).providerName ?? null);
    }
  };
  const handleCheckPusher = async () => {
    const p = await pusherHealthCheck();
    setPusherConfigured(p.ok && p.configured);
    setMissingKeys(Array.isArray((p as any).missing) ? (p as any).missing : []);
  };

  return (
    <div className="max-w-5xl mx-auto py-10 space-y-8">
      <h1 className="text-3xl font-bold mb-6">لوحة صيانة النظام</h1>
      {/* Database Health */}
      <Card className="p-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-lg font-semibold">
            <Icon name="Database" className="text-purple-500" />
            صحة قاعدة البيانات
            <Badge color="success">{dbLatency !== null ? 'تم الفحص' : 'خامل'}</Badge>
          </div>
          <ul className="text-gray-500 text-sm mt-2 space-y-1 list-disc list-inside">
            <li>
              {dbLatency !== null ? (
                <>
                  زمن الاستجابة: <span className="font-medium">{dbLatency}ms</span>
                </>
              ) : (
                'اضغط فحص لعرض الحالة.'
              )}
            </li>
            {dbName && (
              <li>
                قاعدة البيانات:
                <Badge variant="secondary" className="ml-2 px-2 py-0.5 text-xs">{dbName}</Badge>
              </li>
            )}
            {(atlasPlan || dbPlan) && (
              <li>
                الخطة: <span className="font-medium">{atlasPlan ?? dbPlan}</span>
                {atlasProvider && <span className="ml-2">({atlasProvider})</span>}
              </li>
            )}
          </ul>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleCheckDb}>
            <Icon name="Info" className="mr-2" /> فحص
          </Button>
        </div>
      </Card>

      {/* Realtime (Pusher) Status */}
      <Card className="p-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-lg font-semibold">
            <Icon name="Radio" className="text-green-500" />
            الحالة الفورية (Pusher)
            <Badge color={pusherConfigured === false ? 'destructive' : 'success'}>
              {pusherConfigured === null ? 'خامل' : pusherConfigured ? 'مُفعّل' : 'غير مُعد'}
            </Badge>
          </div>
          <div className="text-gray-500 text-sm mt-1">
            {pusherConfigured === null && 'اضغط فحص لعرض الحالة.'}
            {pusherConfigured === true && 'Pusher مُفعّل (مفاتيح البيئة موجودة).'}
            {pusherConfigured === false && (
              <span>
                Pusher غير مُعد، تحقق من مفاتيح البيئة.
                {missingKeys.length > 0 && (
                  <span className="ml-2">المفقود: <span className="font-medium">{missingKeys.join(', ')}</span></span>
                )}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleCheckPusher}>
            <Icon name="Info" className="mr-2" /> فحص
          </Button>
        </div>
      </Card>

      {/* Cache & Revalidation */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <Icon name="RefreshCw" className="text-primary" />
            التخزين المؤقت وإعادة التحقق
          </div>
          <Button onClick={handleRefreshHealth} disabled={refreshing}>
            <Icon name="Bolt" className="mr-2" /> تحديث شامل
          </Button>
        </div>
        <div className="space-y-2">
          <div className="h-2 w-full rounded bg-neutral-200" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={refreshing ? 70 : refreshDone === 'ok' ? 100 : 0}>
            <div className={`h-2 rounded ${refreshDone === 'err' ? 'bg-red-500' : 'bg-primary'} transition-all duration-500`} style={{ width: `${refreshing ? 70 : refreshDone === 'ok' ? 100 : 0}%` }} />
          </div>
          <div className="text-sm text-muted-foreground">
            {refreshing && 'جاري التحديث…'}
            {refreshDone === 'ok' && 'تم التحديث بنجاح.'}
            {refreshDone === 'err' && 'فشل التحديث.'}
            {refreshDone === 'idle' && !refreshing && 'خامل'}
          </div>
        </div>
      </Card>

      {/* Cloudinary Status */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <Icon name="Image" className="text-amber-600" />
            حالة الوسائط (Cloudinary)
          </div>
          <Button variant="outline" onClick={() => window.open('/dashboard/management/settings/advanced', '_self')}>
            فتح الإعدادات
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">
          الحالة التفصيلية متوفرة في صفحة الإعدادات المتقدمة (تتضمن الاستهلاك والحصة). استخدم هذا القسم لمراجعة المفاتيح عند وجود مشاكل رفع.
        </div>
      </Card>

      {/* Email Test */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <Icon name="Mail" className="text-emerald-600" />
            اختبار البريد
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={async () => {
              const to = prompt('أدخل بريداً لتجربة الإرسال:');
              if (!to) return;
              const res = await sendTestEmail(to);
              alert(res.ok ? 'تم الإرسال بنجاح' : `فشل: ${res.message}`);
            }}
          >
            إرسال بريد تجريبي
          </Button>
          <div className="text-xs text-muted-foreground">يحتاج EMAIL_USER/EMAIL_PASS مهيّأة في البيئة.</div>
        </div>
      </Card>

    </div>
  );
}
