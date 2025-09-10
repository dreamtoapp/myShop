"use client";

import { useEffect, useState } from 'react';
import SettingsLayout from '../components/SettingsLayout';
import { Building2 } from 'lucide-react';
import CompanyProfileForm from './components/CompanyProfileForm';
import { fetchCompany } from '../actions/fetchCompany';

export default function CompanyProfilePage() {
    const [company, setCompany] = useState<any>(null);
    const [progress, setProgress] = useState({ current: 0, total: 3, isComplete: false });

    useEffect(() => {
        const load = async () => {
            const data = await fetchCompany();
            setCompany(data);
            const current = [data?.fullName, data?.email, data?.phoneNumber].filter(Boolean).length;
            setProgress({ current, total: 3, isComplete: current === 3 });
        };
        load();
    }, []);

    return (
        <SettingsLayout
            title="معلومات المتجر"
            description="إدارة المعلومات الأساسية للمتجر"
            icon={Building2}
            progress={progress}
        >
            <CompanyProfileForm company={company || undefined} onProgressChange={(current, total, isComplete) => setProgress({ current, total, isComplete })} />
        </SettingsLayout>
    );
}