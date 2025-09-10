"use client";

import { useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';
import SettingsLayout from '../components/SettingsLayout';
import LocationForm from './components/LocationForm';
import { fetchCompany } from '../actions/fetchCompany';

export default function LocationPage() {
    const [company, setCompany] = useState<any>(null);
    const [progress, setProgress] = useState({ current: 0, total: 3, isComplete: false });

    useEffect(() => {
        const load = async () => {
            const data = await fetchCompany();
            setCompany(data);
            const baseCurrent = [data?.address, data?.latitude, data?.longitude].filter(Boolean).length;
            setProgress({ current: baseCurrent, total: 3, isComplete: baseCurrent === 3 });
        };
        load();
    }, []);

    return (
        <SettingsLayout
            title="الموقع والعنوان"
            description="العنوان الفعلي وإحداثيات الموقع"
            icon={MapPin}
            progress={progress}
        >
            <LocationForm company={company} onProgressChange={(current, total, isComplete) => setProgress({ current, total, isComplete })} />
        </SettingsLayout>
    );
}