/**
 * Get variants for a specific blueprint
 */

const PRINTIFY_API_TOKEN = process.env.PRINTIFY_API_TOKEN;
const blueprintId = process.argv[2];

if (!PRINTIFY_API_TOKEN) {
  console.error('❌ PRINTIFY_API_TOKEN not found in environment');
  process.exit(1);
}

if (!blueprintId) {
  console.log('Usage: PRINTIFY_API_TOKEN=your_token node scripts/get-blueprint-variants.js <blueprint_id>');
  console.log('Example: PRINTIFY_API_TOKEN=your_token node scripts/get-blueprint-variants.js 76');
  process.exit(1);
}

async function getBlueprintVariants() {
  try {
    console.log(`\n🔍 Fetching variants for blueprint ${blueprintId}...\n`);

    const response = await fetch(`https://api.printify.com/v1/catalog/blueprints/${blueprintId}/print_providers.json`, {
      headers: {
        'Authorization': `Bearer ${PRINTIFY_API_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch blueprint: ${await response.text()}`);
    }

    const printProviders = await response.json();

    console.log(`✅ Found ${printProviders.length} print providers for blueprint ${blueprintId}:\n`);
    console.log('═══════════════════════════════════════════════════════\n');

    printProviders.forEach(provider => {
      console.log(`📦 Print Provider: ${provider.title}`);
      console.log(`   ID: ${provider.id}`);
      console.log(`   Location: ${provider.location?.country || 'N/A'}`);
      console.log(`\n   Variants:`);

      provider.variants.forEach(variant => {
        console.log(`     - ID: ${variant.id} | ${variant.title}`);
        if (variant.options) {
          Object.entries(variant.options).forEach(([key, value]) => {
            console.log(`       ${key}: ${value}`);
          });
        }
      });
      console.log('');
    });

    console.log('═══════════════════════════════════════════════════════\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

getBlueprintVariants();
