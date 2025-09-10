'use client';

import { useState, useEffect } from 'react';
import { CompanyDataStatus } from './companyDataValidator';

/**
 * Reusable hook to get company data status
 * Can be used in any component to check for missing data
 */
export function useCompanyDataStatus() {
  const [status, setStatus] = useState<CompanyDataStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/company-data-status');
        if (!response.ok) throw new Error('Failed to fetch company data status');

        const data = await response.json();
        setStatus(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching company data status:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        // Set critical status on error
        setStatus({
          isComplete: false,
          missingFields: ['fullName', 'email', 'phoneNumber', 'whatsappNumber', 'address'],
          criticalMissing: ['fullName', 'email', 'phoneNumber', 'whatsappNumber', 'address'],
          warnings: ['خطأ في تحميل بيانات الشركة'],
          completionPercentage: 0,
          criticalFieldsComplete: false,
          operationalFieldsComplete: false
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, []);

  return {
    status,
    loading,
    error,
    hasMissingData: status ? !status.isComplete : false,
    hasCriticalMissing: status ? status.criticalMissing.length > 0 : false,
    completionPercentage: status?.completionPercentage || 0
  };
}
