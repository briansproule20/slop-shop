/**
 * API route to search and display Printify products
 */

import { getBlueprints } from '@/lib/printify-client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q')?.toLowerCase() || '';

    const blueprints = await getBlueprints();

    if (!query) {
      // Return all blueprints if no query
      return NextResponse.json({
        total: blueprints.length,
        results: blueprints.map(bp => ({
          id: bp.id,
          title: bp.title,
          brand: bp.brand,
          model: bp.model,
        })),
      });
    }

    // Search by query
    const matches = blueprints.filter(
      bp =>
        bp.title.toLowerCase().includes(query) ||
        bp.brand?.toLowerCase().includes(query) ||
        bp.model?.toLowerCase().includes(query)
    );

    return NextResponse.json({
      query,
      total: matches.length,
      results: matches.map(bp => ({
        id: bp.id,
        title: bp.title,
        brand: bp.brand,
        model: bp.model,
      })),
    });
  } catch (error) {
    console.error('Error searching products:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to search products' },
      { status: 500 }
    );
  }
}
