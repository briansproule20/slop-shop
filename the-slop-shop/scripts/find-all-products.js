/**
 * Find all product IDs by searching Printify
 */

const PRINTIFY_API_TOKEN = process.env.PRINTIFY_API_TOKEN;

if (!PRINTIFY_API_TOKEN) {
  console.error('❌ PRINTIFY_API_TOKEN not found');
  process.exit(1);
}

const searches = [
  'mug',
  'bottle',
  'tumbler',
  'canvas',
  'poster',
  'tote',
  'shirt',
  'hoodie',
];

async function findProducts() {
  try {
    console.log('\n🔍 Searching Printify for all product types...\n');

    const response = await fetch('https://api.printify.com/v1/catalog/blueprints.json', {
      headers: {
        'Authorization': `Bearer ${PRINTIFY_API_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${await response.text()}`);
    }

    const blueprints = await response.json();

    console.log(`✅ Found ${blueprints.length} total products\n`);
    console.log('═══════════════════════════════════════════════════════\n');

    for (const searchTerm of searches) {
      const matches = blueprints.filter(bp =>
        bp.title.toLowerCase().includes(searchTerm)
      );

      if (matches.length > 0) {
        console.log(`\n📦 ${searchTerm.toUpperCase()} (${matches.length} found):\n`);
        matches.slice(0, 5).forEach(product => {
          console.log(`   ${product.id.toString().padEnd(6)} - ${product.title}`);
          if (product.brand) console.log(`            Brand: ${product.brand}`);
        });
      }
    }

    console.log('\n\n═══════════════════════════════════════════════════════');
    console.log('\n💡 Copy these IDs to update your product selector!\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

findProducts();
