import { NextResponse } from 'next/server';
import { getCompanyDataStatus } from '@/app/dashboard/actions/validateCompanyData';

export async function GET() {
  try {
    const status = await getCompanyDataStatus();
    return NextResponse.json(status);
  } catch (error) {
    console.error('Error in company-data-status API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch company data status' },
      { status: 500 }
    );
  }
}
