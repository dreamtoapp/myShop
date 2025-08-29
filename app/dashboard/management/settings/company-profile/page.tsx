import SettingsLayout from '../components/SettingsLayout';
import { Building2 } from 'lucide-react';
import CompanyProfileForm from './components/CompanyProfileForm';

export default function CompanyProfilePage() {
    return (
        <SettingsLayout
            title="معلومات المتجر"
            description="إدارة المعلومات الأساسية للمتجر"
            icon={Building2}
        >
            <CompanyProfileForm />
        </SettingsLayout>
    );
} 