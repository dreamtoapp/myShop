'use client';

import { CompanyDataStatus } from '@/helpers/companyDataValidator';

interface HealthTooltipProps {
  status: CompanyDataStatus;
  title: string;
}

export default function HealthTooltip({ status, title }: HealthTooltipProps) {
  return (
    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap z-[9999] border border-gray-700">
      <div className="font-medium">{title}</div>
      <div className="text-xs mt-1 text-gray-300">
        اكتمال البيانات: {status.completionPercentage}%
      </div>
      <div className="text-xs mt-1 text-gray-400">
        انقر لعرض التفاصيل
      </div>
    </div>
  );
}
