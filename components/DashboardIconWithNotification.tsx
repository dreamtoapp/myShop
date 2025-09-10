'use client';

import Link from 'next/link';
import { Icon } from '@/components/icons/Icon';
import { useCompanyDataStatus } from '@/helpers/useCompanyDataStatus';

export default function DashboardIconWithNotification() {
  const { hasMissingData, hasCriticalMissing, loading, status } = useCompanyDataStatus();

  return (
    <Link href="/dashboard" className="flex items-center relative group">
      <Icon
        name="LayoutGrid"
        className={`h-5 w-5 transition-colors ${hasMissingData
          ? 'text-red-500'
          : 'text-primary-foreground'
          }`}
      />

      {/* Red pulsing notification dot */}
      {!loading && hasMissingData && (
        <div className="absolute -top-1 -right-1">
          <div className={`h-3 w-3 rounded-full ${hasCriticalMissing ? 'bg-red-500' : 'bg-orange-500'
            } animate-pulse`} />
          <div className={`absolute inset-0 h-3 w-3 rounded-full ${hasCriticalMissing ? 'bg-red-500' : 'bg-orange-500'
            } animate-ping opacity-75`} />
        </div>
      )}

      {/* Enhanced Tooltip on hover - positioned relative to icon */}
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap z-[9999] border border-gray-700">
        <div className="font-medium">
          {hasMissingData
            ? (hasCriticalMissing ? 'بيانات حرجة مفقودة' : 'بيانات مهمة مفقودة')
            : 'لوحة التحكم'
          }
        </div>
        {status && (
          <div className="text-xs mt-1 text-gray-300">
            اكتمال البيانات: {status.completionPercentage}%
          </div>
        )}
        <div className="text-xs mt-1 text-gray-400">
          انقر للانتقال للوحة التحكم
        </div>
      </div>
    </Link>
  );
}
