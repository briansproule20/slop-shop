/**
 * API route to fetch available Printify product blueprints
 */

import { getBlueprints } from '@/lib/printify-client';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const blueprints = await getBlueprints();
    return NextResponse.json(blueprints);
  } catch (error) {
    console.error('Error fetching blueprints:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch blueprints' },
      { status: 500 }
    );
  }
}
