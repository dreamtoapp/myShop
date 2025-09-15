import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/prisma';

export async function GET(_request: NextRequest) {
  try {
    const company = await db.company.findFirst({
      select: {
        pusherKey: true,
        pusherCluster: true,
      },
    });

    if (!company) {
      return NextResponse.json(
        { error: 'No company configuration found' },
        { status: 404 }
      );
    }

    const { pusherKey, pusherCluster } = company;

    // Check if Pusher is configured
    if (!pusherKey || !pusherCluster) {
      return NextResponse.json(
        { error: 'Pusher not configured' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      pusherKey,
      pusherCluster,
    });
  } catch (error) {
    console.error('Error fetching Pusher config:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
