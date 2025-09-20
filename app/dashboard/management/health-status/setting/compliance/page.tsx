import { Shield } from 'lucide-react';
import HubSettingsLayout from '../../../health-status/components/HubSettingsLayout';
import { fetchCompliance } from './actions/fetchCompliance';
import ComplianceForm from './components/ComplianceForm';

export default async function CompliancePage() {
  const data = await fetchCompliance();
  const total = 4;
  const current = [
    data?.taxNumber,
    data?.taxPercentage,
    data?.commercialRegistrationNumber,
    data?.saudiBusinessId,
  ].filter(Boolean).length;
  const progress = { current, total, isComplete: current === total };

  return (
    <HubSettingsLayout
      title="المعلومات القانونية"
      description="البيانات القانونية والضريبية"
      icon={Shield}
      progress={progress}
    >
      <ComplianceForm initialValues={data ?? {}} />
    </HubSettingsLayout>
  );
}


