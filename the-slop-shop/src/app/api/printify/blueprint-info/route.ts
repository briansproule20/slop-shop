/**
 * API route to get blueprint details including variants and print providers
 */

import { getBlueprintDetails, getPrintProviders } from '@/lib/printify-client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const blueprintId = searchParams.get('blueprintId');

    if (!blueprintId) {
      return NextResponse.json(
        { error: 'blueprintId is required' },
        { status: 400 }
      );
    }

    // Fetch blueprint details and print providers in parallel
    const [details, printProviders] = await Promise.all([
      getBlueprintDetails(Number(blueprintId)),
      getPrintProviders(Number(blueprintId)),
    ]);

    return NextResponse.json({
      variants: details.variants,
      printProviders,
    });
  } catch (error) {
    console.error('Error fetching blueprint info:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch blueprint info' },
      { status: 500 }
    );
  }
}
