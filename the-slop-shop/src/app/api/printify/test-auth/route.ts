/**
 * Test endpoint to verify Printify credentials are loaded
 */

import { NextResponse } from 'next/server';

export async function GET() {
  const token = process.env.PRINTIFY_API_TOKEN;
  const shopId = process.env.PRINTIFY_SHOP_ID;

  console.log('Environment check:', {
    tokenExists: !!token,
    tokenLength: token?.length,
    tokenPrefix: token?.substring(0, 20),
    shopIdExists: !!shopId,
    shopId: shopId,
  });

  // Test a simple API call to Printify
  try {
    const response = await fetch('https://api.printify.com/v1/shops.json', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const responseText = await response.text();
    console.log('Printify API response:', {
      status: response.status,
      statusText: response.statusText,
      body: responseText,
    });

    return NextResponse.json({
      credentialsLoaded: {
        token: !!token,
        shopId: !!shopId,
      },
      apiTest: {
        status: response.status,
        ok: response.ok,
        body: responseText,
      },
    });
  } catch (error) {
    console.error('Test failed:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Test failed',
      },
      { status: 500 }
    );
  }
}
