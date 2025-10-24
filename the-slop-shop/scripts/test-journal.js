/**
 * Test journal blueprint 76 configuration
 */

const fs = require('fs');
const path = require('path');

// Read .env.local
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const TOKEN = envContent.match(/PRINTIFY_API_TOKEN=(.+)/)?.[1]?.trim();

if (!TOKEN) {
  console.error('❌ Could not find PRINTIFY_API_TOKEN in .env.local');
  process.exit(1);
}

async function testJournal() {
  console.log('\n🔍 Testing Journal (Blueprint 76)...\n');

  try {
    // Fetch print providers for blueprint 76
    const url = 'https://api.printify.com/v1/catalog/blueprints/76/print_providers.json';
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(`❌ Failed to fetch blueprint 76: ${error}`);
      process.exit(1);
    }

    const providers = await response.json();

    console.log(`✅ Blueprint 76 exists! Found ${providers.length} print providers:\n`);
    console.log('═══════════════════════════════════════════════════════\n');

    providers.forEach((provider, index) => {
      console.log(`Provider #${index + 1}: ${provider.title}`);
      console.log(`  ID: ${provider.id}`);
      console.log(`  Location: ${provider.location?.country || 'Unknown'}`);
      console.log(`\n  Available Variants:`);

      if (provider.variants && provider.variants.length > 0) {
        provider.variants.forEach(variant => {
          console.log(`    ✓ Variant ID: ${variant.id}`);
          console.log(`      Title: ${variant.title}`);
          if (variant.options) {
            Object.entries(variant.options).forEach(([key, value]) => {
              console.log(`      ${key}: ${value}`);
            });
          }
          console.log('');
        });
      } else {
        console.log(`    ⚠️  No variants found for this provider`);
      }
      console.log('---\n');
    });

    console.log('═══════════════════════════════════════════════════════\n');
    console.log('📝 Use one of these combinations in product-configs.ts:\n');

    providers.forEach(provider => {
      const firstVariant = provider.variants[0];
      if (firstVariant) {
        console.log(`  blueprint_id: 76,`);
        console.log(`  print_provider_id: ${provider.id}, // ${provider.title}`);
        console.log(`  variants: [${firstVariant.id}], // ${firstVariant.title}`);
        console.log('');
      }
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testJournal();
