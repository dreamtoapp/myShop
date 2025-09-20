import { Settings } from 'lucide-react';
import HubSettingsLayout from '../../../health-status/components/HubSettingsLayout';
import PlatformSettingsForm from './components/PlatformSettingsForm';
import { fetchPlatform } from './actions/fetchPlatform';

export default async function PlatformPage() {
    // Fetch initial data on the server
    const initialData = await fetchPlatform();

    // Debug: Log what we're passing to the form

    // Calculate progress based on actual data
    const total = 8; // Total number of platform settings
    const data = initialData as any; // Type assertion for new fields
    const current = initialData ? [
        data.showHeroImage,
        data.showStoreLocation,
        data.showCustomerCount,
        data.showProductCount,
        data.showVision2030,
        data.isTaxEnabled,
        data.emailNotifications,
        data.defaultCurrency,
    ].filter(Boolean).length : 0;

    const progress = { current, total, isComplete: current === total };

    return (
        <HubSettingsLayout
            title="إعدادات المتجر"
            description="إدارة الإعدادات العامة للمتجر "
            icon={Settings}
            progress={progress}
        >
            <PlatformSettingsForm initialData={initialData} />
        </HubSettingsLayout>
    );
}