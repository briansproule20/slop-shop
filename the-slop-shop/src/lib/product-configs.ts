/**
 * Product configuration presets for Printify products
 * Following the pattern from shirtslop repo
 */

interface ProductConfig {
  name: string;
  blueprint_id: number;
  print_provider_id: number;
  variants: number[];
  price: number; // Printify expects price in cents (e.g., 1499 = $14.99)
  scale: number;
  x: number;
  y: number;
  angle: number; // Rotation angle in degrees (0-360)
  tags: string[]; // Auto-categorization tags for Shopify
  product_type: string; // Shopify product type/category
}

export const PRODUCT_CONFIGS: Record<string, ProductConfig> = {
  ceramicMug: {
    name: 'White Ceramic Mug, 11oz',
    blueprint_id: 503,
    print_provider_id: 48, // Colorway (only available provider for this blueprint)
    price: 1499, // $14.99
    scale: 0.8, // 80% of print area - shows more of the image
    x: 0.5,
    y: 0.5,
    angle: 0, // No rotation
    variants: [
      67624, // 11oz variant
    ],
    tags: ['Drinkware', 'Mugs', 'Coffee', 'Kitchen'],
    product_type: 'Drinkware',
  },
  beachTowel: {
    name: 'Beach Towel',
    blueprint_id: 352,
    print_provider_id: 1, // SPOKE Custom Products
    price: 2999, // $29.99
    scale: 1.0, // 100% of print area - full coverage
    x: 0.5,
    y: 0.5,
    angle: 270, // Rotate 90 degrees counterclockwise for portrait orientation
    variants: [
      44444, // 30" × 60"
      44445, // 36" × 72"
    ],
    tags: ['Beach', 'Towel', 'Summer', 'Home & Living'],
    product_type: 'Home & Living',
  },
};

export function getProductConfig(productKey: string): ProductConfig {
  const config = PRODUCT_CONFIGS[productKey];
  if (!config) {
    throw new Error(`Unknown product configuration: ${productKey}`);
  }
  return config;
}
