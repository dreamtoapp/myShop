import { Badge } from '@/components/ui/badge';

interface FieldAnalysisCardProps {
  field: string;
  displayName: string;
  businessImpact: string;
  userImpact: string;
  icon: any;
  isMissing: boolean;
  isCritical: boolean;
}

export default function FieldAnalysisCard({
  field,
  displayName,
  businessImpact,
  userImpact,
  icon: IconComponent,
  isMissing,
  isCritical
}: FieldAnalysisCardProps) {
  return (
    <div
      className={`p-4 rounded-lg border-2 ${isMissing
        ? isCritical
          ? 'border-red-500 bg-red-100 dark:bg-red-900 dark:border-red-600'
          : 'border-orange-500 bg-orange-100 dark:bg-orange-900 dark:border-orange-600'
        : 'border-green-500 bg-green-100 dark:bg-green-900 dark:border-green-600'
        }`}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${isMissing
          ? isCritical
            ? 'bg-red-200 dark:bg-red-800'
            : 'bg-orange-200 dark:bg-orange-800'
          : 'bg-green-200 dark:bg-green-800'
          }`}>
          <IconComponent className={`h-5 w-5 ${isMissing
            ? isCritical
              ? 'text-red-900 dark:text-red-100'
              : 'text-orange-900 dark:text-orange-100'
            : 'text-green-900 dark:text-green-100'
            }`} />
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-sm text-black bg-white p-1 border border-primary rounded-md">{displayName}</h4>
            <Badge
              variant={isMissing ? (isCritical ? 'destructive' : 'secondary') : 'default'}
              className={`text-xs ${!isMissing ? 'bg-green-600 text-white hover:bg-green-700' : ''
                }`}
            >
              {isMissing ? (isCritical ? 'حرج' : 'مهم') : 'مكتمل'}
            </Badge>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-primary">
              <span className="font-medium text-black">التأثير التجاري:</span> {businessImpact}
            </p>
            <p className="text-xs text-primary">
              <span className="font-medium text-primary">تأثير العملاء:</span> {userImpact}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-3 flex justify-end">
        <Badge variant="outline" className="text-[10px] bg-red-600 text-yellow-200 border-red-700">
          {field}
        </Badge>
      </div>
    </div>
  );
}
