import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/prisma';

export async function GET(_request: NextRequest) {
  try {
    const company = await db.company.findFirst({
      select: {
        googleMapsApiKey: true,
      },
    });

    if (!company) {
      return NextResponse.json(
        { error: 'No company configuration found' },
        { status: 404 }
      );
    }

    const { googleMapsApiKey } = company;

    // Check if Google Maps is configured
    if (!googleMapsApiKey) {
      return NextResponse.json(
        { error: 'Google Maps not configured' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      googleMapsApiKey,
    });
  } catch (error) {
    console.error('Error fetching Google Maps config:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
