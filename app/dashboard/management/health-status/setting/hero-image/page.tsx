import { Image as ImageIcon } from 'lucide-react';
import HubSettingsLayout from '../../components/HubSettingsLayout';
import HeroImageForm from './components/HeroImageForm';
import { fetchCompany } from '@/app/dashboard/management/settings/actions/fetchCompany';

export default async function HeroImagePage() {
  const company = await fetchCompany();
  const total = 1;
  const current = company?.profilePicture ? 1 : 0;
  const progress = { current, total, isComplete: current === total };

  return (
    <HubSettingsLayout
      title="صورة الهيرو"
      description="إدارة صورة الهيرو الرئيسية للمتجر"
      icon={ImageIcon}
      progress={progress}
    >
      <HeroImageForm initialUrl={company?.profilePicture} companyId={company?.id} />
    </HubSettingsLayout>
  );
}


