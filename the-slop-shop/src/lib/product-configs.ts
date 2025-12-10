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
  position: string; // Print area position (e.g., 'front', 'cover')
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
    position: 'front',
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
    position: 'front',
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
    position: 'front',
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
    position: 'front',
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
    position: 'front',
    variants: [
      101409, // Natural / 15" x 16"
      103598, // Black / 15" x 16"
    ],
    tags: ['Tote Bag', 'Bags', 'Accessories', 'Canvas'],
    product_type: 'Accessories',
  },
  greetingCard: {
    name: 'Greeting Cards (1, 10, 30, 50pcs)',
    blueprint_id: 1094,
    print_provider_id: 228, // Taylor
    price: 599, // $5.99 for 1pc (base price)
    scale: 0.66, // Scale to fill front panel height (1725/2625 = 0.66)
    x: 0.75, // Position on right half (front of card when folded)
    y: 0.5,
    angle: 0, // No rotation
    position: 'cover',
    variants: [
      81834, // 4.25" x 5.5" (Vertical) / Matte / 1 pc
    ],
    tags: ['Greeting Cards', 'Cards', 'Stationery', 'Paper Goods'],
    product_type: 'Paper Goods',
  },
  petBandana: {
    name: 'Pet Bandana',
    blueprint_id: 562,
    print_provider_id: 70, // Printed Mint
    price: 1699, // $16.99
    scale: 1.0,
    x: 0.5,
    y: 0.25,
    angle: 0,
    position: 'front',
    variants: [
      101403, // 20" × 10" (small)
      101404, // 27" × 13" (large)
    ],
    tags: ['Pet', 'Dog', 'Bandana', 'Pet Accessories'],
    product_type: 'Pet Accessories',
  },
  petFoodMat: {
    name: 'Pet Food Mat (12x18)',
    blueprint_id: 855,
    print_provider_id: 70, // Printed Mint
    price: 1999, // $19.99
    scale: 1.0, // Square image on landscape mat
    x: 0.5,
    y: 0.5,
    angle: 0, // No rotation - scale up square to cover landscape mat
    position: 'front',
    variants: [
      76892, // 12" × 18" / Rectangle
    ],
    tags: ['Pet', 'Dog', 'Cat', 'Pet Accessories', 'Food Mat'],
    product_type: 'Pet Accessories',
  },
  poster: {
    name: 'Matte Vertical Poster',
    blueprint_id: 282,
    print_provider_id: 99, // Printify Choice
    price: 1499, // $14.99
    scale: 1.27,
    x: 0.5,
    y: 0.5,
    angle: 0,
    position: 'front',
    variants: [
      43135, // 11" x 14" / Matte
      43138, // 12" x 18" / Matte
      43141, // 16" x 20" / Matte
    ],
    tags: ['Poster', 'Wall Art', 'Print', 'Paper Goods'],
    product_type: 'Paper Goods',
  },
  hoodie: {
    name: 'Unisex Heavy Blend Hoodie',
    blueprint_id: 77,
    print_provider_id: 99, // Printify Choice
    price: 4499, // $44.99
    scale: 0.85, // Larger print area coverage
    x: 0.5,
    y: 0.5,
    angle: 0,
    position: 'front',
    variants: [
      // Black
      32918, // Black / S
      32919, // Black / M
      32920, // Black / L
      32921, // Black / XL
      32922, // Black / 2XL
      32923, // Black / 3XL
      // Navy
      32894, // Navy / S
      32895, // Navy / M
      32896, // Navy / L
      32897, // Navy / XL
      32898, // Navy / 2XL
      32899, // Navy / 3XL
      // Dark Heather
      32878, // Dark Heather / S
      32879, // Dark Heather / M
      32880, // Dark Heather / L
      32881, // Dark Heather / XL
      32882, // Dark Heather / 2XL
      32883, // Dark Heather / 3XL
      // Sport Grey
      32902, // Sport Grey / S
      32903, // Sport Grey / M
      32904, // Sport Grey / L
      32905, // Sport Grey / XL
      32906, // Sport Grey / 2XL
      32907, // Sport Grey / 3XL
      // Irish Green
      33369, // Irish Green / S
      33370, // Irish Green / M
      33371, // Irish Green / L
      33372, // Irish Green / XL
      33373, // Irish Green / 2XL
      33374, // Irish Green / 3XL
      // Military Green
      33425, // Military Green / S
      33426, // Military Green / M
      33427, // Military Green / L
      33428, // Military Green / XL
      33429, // Military Green / 2XL
      33430, // Military Green / 3XL
      // Maroon
      32886, // Maroon / S
      32887, // Maroon / M
      32888, // Maroon / L
      32889, // Maroon / XL
      32890, // Maroon / 2XL
      32891, // Maroon / 3XL
      // Sand
      42164, // Sand / S
      42165, // Sand / M
      42166, // Sand / L
      42167, // Sand / XL
      42168, // Sand / 2XL
      42169, // Sand / 3XL
      // Indigo Blue
      42267, // Indigo Blue / S
      42268, // Indigo Blue / M
      42269, // Indigo Blue / L
      42270, // Indigo Blue / XL
      42271, // Indigo Blue / 2XL
      42272, // Indigo Blue / 3XL
      // Orchid
      81519, // Orchid / S
      81520, // Orchid / M
      81521, // Orchid / L
      81522, // Orchid / XL
      81523, // Orchid / 2XL
      81524, // Orchid / 3XL
    ],
    tags: ['Hoodie', 'Sweatshirt', 'Apparel', 'Clothing'],
    product_type: 'Apparel',
  },
};

export function getProductConfig(productKey: string): ProductConfig {
  const config = PRODUCT_CONFIGS[productKey];
  if (!config) {
    throw new Error(`Unknown product configuration: ${productKey}`);
  }
  return config;
}
