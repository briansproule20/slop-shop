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
  golfTowel: {
    name: 'Golf Towel',
    blueprint_id: 1614,
    print_provider_id: 228, // Taylor
    price: 1999, // $19.99
    scale: 1.4, // 140% - fill the print area completely, edge to edge
    x: 0.5,
    y: 0.5,
    angle: 0, // No rotation - towel is already portrait (16" × 24")
    variants: [
      112488, // 16" × 24"
    ],
    tags: ['Golf', 'Sports', 'Towel', 'Accessories'],
    product_type: 'Sports & Outdoors',
  },
  journal: {
    name: 'Journal - Blank',
    blueprint_id: 76,
    print_provider_id: 1, // SPOKE Custom Products (verified working)
    price: 2199, // $21.99
    scale: 1.42, // 142% - match the print area aspect ratio (3742/2625) for full coverage without showing too much of the image
    x: 0.5,
    y: 0.5,
    angle: 0, // No rotation
    variants: [
      34241, // Journal (verified variant ID from Printify API)
    ],
    tags: ['Journal', 'Notebook', 'Stationery', 'Paper Goods'],
    product_type: 'Paper Goods',
  },
  toteBag: {
    name: 'Cotton Canvas Tote Bag',
    blueprint_id: 1313,
    print_provider_id: 99, // Printify Choice (verified working)
    price: 1799, // $17.99
    scale: 1.2, // 120% - fill the print area nicely (3000x3600 portrait)
    x: 0.5,
    y: 0.5,
    angle: 0, // No rotation - print area is already portrait
    variants: [
      101409, // Natural / 15" x 16"
      103598, // Black / 15" x 16"
    ],
    tags: ['Tote Bag', 'Bags', 'Accessories', 'Canvas'],
    product_type: 'Accessories',
  },
};

export function getProductConfig(productKey: string): ProductConfig {
  const config = PRODUCT_CONFIGS[productKey];
  if (!config) {
    throw new Error(`Unknown product configuration: ${productKey}`);
  }
  return config;
}
