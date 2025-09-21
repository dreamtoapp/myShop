import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Icon } from '@/components/icons/Icon';
import { CheckboxField } from './CheckboxField';

interface PlatformData {
  id?: string;
  showHeroImage: boolean;
  showStoreLocation: boolean;
  showCustomerCount: boolean;
  showProductCount: boolean;
  showVision2030: boolean;
  isTaxEnabled: boolean;
  emailNotifications: boolean;
  defaultCurrency: string;
}

interface TaxSettingsProps {
  formData: PlatformData;
  onChange: (field: keyof PlatformData, value: boolean) => void;
}

export function TaxSettings({ formData, onChange }: TaxSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon name="Receipt" size="sm" />
          معلومات الضريبة
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <CheckboxField
          label="تفعيل الضريبة"
          description="تفعيل أو إيقاف الضريبة على الطلبات"
          checked={formData.isTaxEnabled}
          onChange={(checked) => onChange('isTaxEnabled', checked)}
        />
      </CardContent>
    </Card>
  );
}




