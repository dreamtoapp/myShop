'use server';

import { fetchCompliance } from './fetchCompliance';

export async function getProgress() {
  const data = await fetchCompliance();
  const total = 4;
  const current = [
    data?.taxNumber,
    data?.taxPercentage,
    data?.commercialRegistrationNumber,
    data?.saudiBusinessId,
  ].filter(Boolean).length;
  const percent = Math.round((current / Math.max(1, total)) * 100);
  return { current, total, percent };
}


