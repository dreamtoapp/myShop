import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp } from 'lucide-react';

interface OverallHealthStatusProps {
  overallHealth: 'critical' | 'warning' | 'healthy';
  completionPercentage: number;
  healthMessage: string;
}

export default function OverallHealthStatus({
  overallHealth,
  completionPercentage,
  healthMessage
}: OverallHealthStatusProps) {
  const getHealthColor = () => {
    switch (overallHealth) {
      case 'critical':
        return 'border-red-500 bg-red-100 dark:bg-red-900 dark:border-red-600';
      case 'warning':
        return 'border-orange-500 bg-orange-100 dark:bg-orange-900 dark:border-orange-600';
      default:
        return 'border-green-500 bg-green-100 dark:bg-green-900 dark:border-green-600';
    }
  };

  return (
    <Card className={`border-2 ${getHealthColor()}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <TrendingUp className="h-6 w-6" />
          الحالة العامة للمتجر
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-xl font-semibold">{healthMessage}</p>
            <p className="text-muted-foreground">
              نسبة اكتمال البيانات: <span className="font-semibold text-foreground">{completionPercentage}%</span>
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary">
              {completionPercentage}%
            </div>
            <div className="text-sm text-muted-foreground">مكتمل</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>تقدم إكتمال البيانات</span>
            <span>{completionPercentage}%</span>
          </div>
          <Progress
            value={completionPercentage}
            className="h-3"
          />
        </div>
      </CardContent>
    </Card>
  );
}
