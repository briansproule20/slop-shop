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
  if (!token) {
    throw new Error('PRINTIFY_API_TOKEN is not configured');
  }

  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

/**
 * Get shop ID from environment
 */
function getShopId(): string {
  const shopId = process.env.PRINTIFY_SHOP_ID;
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
      const error = await response.text();
      throw new Error(`Failed to upload image to Printify: ${error}`);
    }

    return response.json();
  }

  // Regular URL upload
  const response = await fetch(`${PRINTIFY_API_BASE}/uploads/images.json`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      file_name: fileName,
      url: imageUrl,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to upload image to Printify: ${error}`);
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

  const response = await fetch(
    `${PRINTIFY_API_BASE}/shops/${shopId}/products.json`,
    {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(productData),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create product: ${error}`);
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

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to publish product: ${error}`);
  }
}
