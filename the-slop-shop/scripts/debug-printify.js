/**
 * Debug script to check your Printify account setup
 *
 * Usage:
 * PRINTIFY_API_TOKEN=your_token node scripts/debug-printify.js
 *
 * Or set it in your shell first:
 * export PRINTIFY_API_TOKEN=your_token
 * node scripts/debug-printify.js
 */

const PRINTIFY_API_TOKEN = process.env.PRINTIFY_API_TOKEN;

if (!PRINTIFY_API_TOKEN) {
  console.error('❌ PRINTIFY_API_TOKEN not found');
  console.log('\nSteps to fix:');
  console.log('1. Go to https://printify.com/app/account/api');
  console.log('2. Click "Generate" to create a new API token');
  console.log('3. Copy the token');
  console.log('4. Add to .env.local: PRINTIFY_API_TOKEN=your_token_here\n');
  process.exit(1);
}

async function debugPrintify() {
  console.log('🔍 Checking your Printify account...\n');

  try {
    // Test 1: Check API token validity
    console.log('1️⃣ Testing API token...');
    const testResponse = await fetch('https://api.printify.com/v1/catalog/blueprints.json', {
      headers: {
        'Authorization': `Bearer ${PRINTIFY_API_TOKEN}`,
      },
    });

    if (!testResponse.ok) {
      const error = await testResponse.text();
      console.error(`❌ API token is invalid or expired`);
      console.error(`   Error: ${error}`);
      console.log('\n   Fix: Generate a new token at https://printify.com/app/account/api\n');
      process.exit(1);
    }

    console.log('✅ API token is valid!\n');

    // Test 2: Check for shops
    console.log('2️⃣ Checking for connected shops/stores...');
    const shopsResponse = await fetch('https://api.printify.com/v1/shops.json', {
      headers: {
        'Authorization': `Bearer ${PRINTIFY_API_TOKEN}`,
      },
    });

    if (!shopsResponse.ok) {
      const error = await shopsResponse.text();
      console.error(`❌ Failed to fetch shops: ${error}\n`);
      process.exit(1);
    }

    const shops = await shopsResponse.json();

    if (shops.length === 0) {
      console.log('❌ No shops/stores connected to your Printify account!\n');
      console.log('📝 Next steps:');
      console.log('1. Go to https://printify.com/app/stores');
      console.log('2. Click "Add new store" or "Connect store"');
      console.log('3. Connect your Shopify store (or create a manual store for testing)');
      console.log('4. Come back and run this script again\n');
      process.exit(1);
    }

    console.log(`✅ Found ${shops.length} shop(s)!\n`);
    console.log('═══════════════════════════════════════\n');

    shops.forEach((shop, index) => {
      console.log(`Shop #${index + 1}:`);
      console.log(`  📛 Title: ${shop.title}`);
      console.log(`  🆔 Shop ID: ${shop.id}`);
      console.log(`  🛍️  Sales Channel: ${shop.sales_channel || 'N/A'}`);
      console.log(`  🔗 Connected: ${shop.connected ? 'Yes' : 'No'}`);
      console.log('');
    });

    console.log('═══════════════════════════════════════\n');

    if (shops.length === 1) {
      console.log('✅ Perfect! You have exactly one shop.\n');
      console.log('📝 Add this to your .env.local file:\n');
      console.log(`PRINTIFY_SHOP_ID=${shops[0].id}\n`);
    } else {
      console.log('📝 You have multiple shops. Choose the one you want to use.\n');
      console.log('Add ONE of these to your .env.local file:\n');
      shops.forEach((shop, index) => {
        console.log(`# Option ${index + 1}: ${shop.title}`);
        console.log(`PRINTIFY_SHOP_ID=${shop.id}\n`);
      });
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
    console.error('\n   Full error:', error);
    process.exit(1);
  }
}

debugPrintify();
