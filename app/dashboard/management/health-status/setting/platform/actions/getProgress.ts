'use server';

import { fetchPlatform } from './fetchPlatform';

export async function getProgress() {
  const data = await fetchPlatform();
  const total = 8;
  const current = [
    data?.showHeroImage,
    data?.showStoreLocation,
    data?.showCustomerCount,
    data?.showProductCount,
    data?.showVision2030,
    data?.isTaxEnabled,
    data?.emailNotifications,
    data?.defaultCurrency,
  ].filter(Boolean).length;
  const percent = Math.round((current / Math.max(1, total)) * 100);
  return { current, total, percent };
}


