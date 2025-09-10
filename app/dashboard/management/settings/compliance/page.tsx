import { Building2 } from 'lucide-react';
import SettingsLayout from '../components/SettingsLayout';
import { getCompliance } from '../actions/getCompliance';
import ComplianceForm from './components/ComplianceForm';

export default async function CompliancePage() {
  const initial = await getCompliance();
  // Derive progress from existing values (VAT/tax%/CR/SB)
  const fields = [
    Boolean(initial?.taxNumber),
    typeof initial?.taxPercentage === 'number',
    Boolean(initial?.commercialRegistrationNumber),
    Boolean(initial?.saudiBusinessId),
  ];
  const current = fields.filter(Boolean).length;
  const total = fields.length;
  return (
    <SettingsLayout
      title="المستندات الحكومية"
      description="إدخال بيانات الضرائب والسجل التجاري والمركز السعودي للأعمال"
      icon={Building2}
      progress={{ current, total, isComplete: current === total && total > 0 }}
    >
      <ComplianceForm initial={initial} />
    </SettingsLayout>
  );
}


