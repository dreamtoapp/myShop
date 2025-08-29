import { Building2 } from 'lucide-react';
import SettingsLayout from '../components/SettingsLayout';
import { getCompliance } from '../actions/getCompliance';
import ComplianceForm from './components/ComplianceForm';

export default async function CompliancePage() {
  const initial = await getCompliance();
  return (
    <SettingsLayout
      title="الامتثال"
      description="إدخال أرقام الامتثال (VAT / CR / رقم التعريف)"
      icon={Building2}
      progress={{ current: initial ? 1 : 0, total: 1, isComplete: Boolean(initial) }}
    >
      <ComplianceForm initial={initial} />
    </SettingsLayout>
  );
}


