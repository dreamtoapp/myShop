'use client';

import Link from 'next/link';
import { Icon } from '@/components/icons/Icon';
import { useCompanyDataStatus } from '@/helpers/useCompanyDataStatus';

export default function AppHealthIcon() {
  const { hasMissingData, hasCriticalMissing, loading, status } = useCompanyDataStatus();

  const getHealthStatus = () => {
    if (loading) return 'loading';
    if (hasCriticalMissing) return 'critical';
    if (hasMissingData) return 'warning';
    return 'healthy';
  };

  const healthStatus = getHealthStatus();

  const getIconProps = () => {
    switch (healthStatus) {
      case 'critical':
        return {
          name: 'AlertTriangle' as const,
          className: 'h-5 w-5 text-red-500 animate-pulse',
          title: 'بيانات حرجة مفقودة'
        };
      case 'warning':
        return {
          name: 'AlertCircle' as const,
          className: 'h-5 w-5 text-orange-500',
          title: 'بيانات مهمة مفقودة'
        };
      case 'loading':
        return {
          name: 'Loader2' as const,
          className: 'h-5 w-5 text-gray-400 animate-spin',
          title: 'جاري التحميل...'
        };
      default:
        return {
          name: 'CheckCircle' as const,
          className: 'h-5 w-5 text-green-500',
          title: 'التطبيق بحالة جيدة'
        };
    }
  };

  const iconProps = getIconProps();

  return (
    <Link
      href="/dashboard/health-status"
      className="flex items-center relative group"
    >
      <Icon name={iconProps.name} className={iconProps.className} />

      {/* Enhanced Tooltip on hover - positioned relative to icon */}
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap z-[9999] border border-gray-700">
        <div className="font-medium">{iconProps.title}</div>
        {status && (
          <div className="text-xs mt-1 text-gray-300">
            اكتمال البيانات: {status.completionPercentage}%
          </div>
        )}
        <div className="text-xs mt-1 text-gray-400">
          انقر لعرض التفاصيل
        </div>
      </div>
    </Link>
  );
}
