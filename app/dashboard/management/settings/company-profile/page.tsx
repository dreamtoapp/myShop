import SettingsLayout from '../components/SettingsLayout';
import { Building2 } from 'lucide-react';
import CompanyProfileForm from './components/CompanyProfileForm';
import { fetchCompany } from '../actions/fetchCompany';

export default async function CompanyProfilePage() {
    const company = await fetchCompany();
    return (
        <SettingsLayout
            title="معلومات المتجر"
            description="إدارة المعلومات الأساسية للمتجر"
            icon={Building2}
        >
            <CompanyProfileForm company={company || undefined} />
        </SettingsLayout>
    );
}