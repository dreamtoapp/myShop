'use client';

import { redirect } from 'next/navigation';

export default function BrandingPage() {
    // Redirect to company profile since branding is handled there
    redirect('/dashboard/management/settings/company-profile');
} 