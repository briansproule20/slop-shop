/**
 * Search for specific Printify products
 *
 * Usage:
 * PRINTIFY_API_TOKEN=your_token node scripts/search-products.js "coffee mug"
 */

const PRINTIFY_API_TOKEN = process.env.PRINTIFY_API_TOKEN;
const searchTerm = process.argv[2]?.toLowerCase() || '';

if (!PRINTIFY_API_TOKEN) {
  console.error('❌ PRINTIFY_API_TOKEN not found');
  process.exit(1);
}

if (!searchTerm) {
  console.log('Usage: node scripts/search-products.js "search term"');
  console.log('Example: node scripts/search-products.js "mug"');
  process.exit(1);
}

async function searchProducts() {
  try {
    console.log(`\n🔍 Searching for products matching: "${searchTerm}"\n`);

    const response = await fetch('https://api.printify.com/v1/catalog/blueprints.json', {
      headers: {
        'Authorization': `Bearer ${PRINTIFY_API_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch blueprints: ${await response.text()}`);
    }

    const blueprints = await response.json();
    const matches = blueprints.filter(bp =>
      bp.title.toLowerCase().includes(searchTerm) ||
      bp.description?.toLowerCase().includes(searchTerm) ||
      bp.brand?.toLowerCase().includes(searchTerm)
    );

    if (matches.length === 0) {
      console.log(`❌ No products found matching "${searchTerm}"\n`);
      console.log('Try searching for:');
      console.log('  - mug');
      console.log('  - bottle');
      console.log('  - tumbler');
      console.log('  - shirt');
      console.log('  - poster');
      console.log('  - canvas');
      console.log('  - tote');
      process.exit(0);
    }

    console.log(`✅ Found ${matches.length} matching products:\n`);
    console.log('═══════════════════════════════════════════════════════\n');

    matches.forEach(product => {
      console.log(`📦 ${product.title}`);
      console.log(`   ID: ${product.id}`);
      console.log(`   Brand: ${product.brand || 'N/A'}`);
      if (product.description) {
        console.log(`   Description: ${product.description.substring(0, 60)}...`);
      }
      console.log('');
    });

    console.log('═══════════════════════════════════════════════════════\n');
    console.log('💡 To use these products, add their IDs to:');
    console.log('   src/components/product-selector-dialog.tsx\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

searchProducts();
