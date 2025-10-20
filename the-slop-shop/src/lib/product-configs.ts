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
}

export const PRODUCT_CONFIGS: Record<string, ProductConfig> = {
  ceramicMug: {
    name: 'White Ceramic Mug, 11oz',
    blueprint_id: 503,
    print_provider_id: 48, // Colorway (only available provider for this blueprint)
    price: 1499, // $14.99
    scale: 1.0,
    x: 0.5,
    y: 0.5,
    variants: [
      67624, // 11oz variant
    ],
  },
};

export function getProductConfig(productKey: string): ProductConfig {
  const config = PRODUCT_CONFIGS[productKey];
  if (!config) {
    throw new Error(`Unknown product configuration: ${productKey}`);
  }
  return config;
}
