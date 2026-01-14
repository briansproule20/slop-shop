/**
 * Printify API client utilities
 */

import type {
  PrintifyBlueprint,
  PrintifyImage,
  PrintifyPrintProvider,
  PrintifyProduct,
  PrintifyVariant,
} from './printify-types';

const PRINTIFY_API_BASE = 'https://api.printify.com/v1';

/**
 * Get Printify API headers
 */
function getHeaders(): HeadersInit {
  const token = process.env.PRINTIFY_API_TOKEN;

  console.log('🔑 Checking API token:', {
    exists: !!token,
    length: token?.length,
    prefix: token?.substring(0, 20) + '...'
  });

  if (!token) {
    throw new Error('PRINTIFY_API_TOKEN is not configured');
  }

  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'User-Agent': 'Slop-Shop/1.0',
  };
}

/**
 * Get shop ID from environment
 */
function getShopId(): string {
  const shopId = process.env.PRINTIFY_SHOP_ID;

  console.log('🏪 Checking shop ID:', {
    exists: !!shopId,
    value: shopId
  });

  if (!shopId) {
    throw new Error('PRINTIFY_SHOP_ID is not configured');
  }
  return shopId;
}

/**
 * Upload an image to Printify
 * Supports both URLs and base64 data URLs
 */
export async function uploadImageToPrintify(
  imageUrl: string,
  fileName: string
): Promise<PrintifyImage> {
  console.log('🔍 Uploading image:', { fileName, urlType: imageUrl.startsWith('data:') ? 'base64' : 'url' });

  // If it's a base64 data URL, we need to upload via file contents
  if (imageUrl.startsWith('data:')) {
    // Convert base64 to binary
    const base64Data = imageUrl.split(',')[1];
    const binaryData = Buffer.from(base64Data, 'base64');
    const base64Contents = binaryData.toString('base64');

    const response = await fetch(`${PRINTIFY_API_BASE}/uploads/images.json`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        file_name: fileName,
        contents: base64Contents,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Image upload error (base64):', errorText);
      console.error('❌ Status:', response.status, response.statusText);

      let errorMessage = `Failed to upload image (${response.status})`;
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = `Failed to upload image: ${JSON.stringify(errorJson)}`;
      } catch {
        errorMessage = `Failed to upload image: ${errorText || response.statusText}`;
      }

      throw new Error(errorMessage);
    }

    return response.json();
  }

  // Regular URL upload
  console.log('📤 Uploading image from URL:', imageUrl);
  const response = await fetch(`${PRINTIFY_API_BASE}/uploads/images.json`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      file_name: fileName,
      url: imageUrl,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ Image upload error (URL):', errorText);
    console.error('❌ Status:', response.status, response.statusText);

    let errorMessage = `Failed to upload image (${response.status})`;
    try {
      const errorJson = JSON.parse(errorText);
      errorMessage = `Failed to upload image: ${JSON.stringify(errorJson)}`;
    } catch {
      errorMessage = `Failed to upload image: ${errorText || response.statusText}`;
    }

    throw new Error(errorMessage);
  }

  return response.json();
}

/**
 * Get available product blueprints (catalog)
 */
export async function getBlueprints(): Promise<PrintifyBlueprint[]> {
  const response = await fetch(`${PRINTIFY_API_BASE}/catalog/blueprints.json`, {
    headers: getHeaders(),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to fetch blueprints: ${error}`);
  }

  return response.json();
}

/**
 * Get blueprint details including variants
 */
export async function getBlueprintDetails(
  blueprintId: number
): Promise<{ variants: PrintifyVariant[] }> {
  const response = await fetch(
    `${PRINTIFY_API_BASE}/catalog/blueprints/${blueprintId}.json`,
    {
      headers: getHeaders(),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to fetch blueprint details: ${error}`);
  }

  return response.json();
}

/**
 * Get print providers for a blueprint
 */
export async function getPrintProviders(
  blueprintId: number
): Promise<PrintifyPrintProvider[]> {
  const response = await fetch(
    `${PRINTIFY_API_BASE}/catalog/blueprints/${blueprintId}/print_providers.json`,
    {
      headers: getHeaders(),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to fetch print providers: ${error}`);
  }

  return response.json();
}

/**
 * Create a product in Printify
 */
export async function createProduct(
  productData: Partial<PrintifyProduct>
): Promise<PrintifyProduct> {
  const shopId = getShopId();

  console.log('🔍 Creating product in shop:', shopId);
  console.log('📋 Product data:', JSON.stringify(productData, null, 2));

  const response = await fetch(
    `${PRINTIFY_API_BASE}/shops/${shopId}/products.json`,
    {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(productData),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ Printify API error response:', errorText);
    console.error('❌ Status:', response.status, response.statusText);

    let errorMessage = `Failed to create product (${response.status})`;
    try {
      const errorJson = JSON.parse(errorText);
      errorMessage = `Failed to create product: ${JSON.stringify(errorJson)}`;
    } catch {
      errorMessage = `Failed to create product: ${errorText || response.statusText}`;
    }

    throw new Error(errorMessage);
  }

  return response.json();
}

/**
 * Publish a product to Shopify
 */
export async function publishProductToShopify(
  productId: string
): Promise<void> {
  const shopId = getShopId();

  console.log('📢 Publishing product to Shopify:', { productId, shopId });

  const response = await fetch(
    `${PRINTIFY_API_BASE}/shops/${shopId}/products/${productId}/publish.json`,
    {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        title: true,
        description: true,
        images: true,
        variants: true,
        tags: true,
      }),
    }
  );

  const responseText = await response.text();
  console.log('📢 Publish response:', response.status, responseText);

  if (!response.ok) {
    console.error('❌ Failed to publish to Shopify:', {
      status: response.status,
      statusText: response.statusText,
      body: responseText,
    });
    throw new Error(`Failed to publish product (${response.status}): ${responseText}`);
  }

  console.log('✅ Product published to Shopify successfully');
}
