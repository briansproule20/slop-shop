/**
 * Test script to verify Printify API connection
 *
 * Usage:
 * PRINTIFY_API_TOKEN=your_token PRINTIFY_SHOP_ID=your_shop_id node scripts/test-printify-connection.js
 */

const PRINTIFY_API_TOKEN = process.env.PRINTIFY_API_TOKEN;
const PRINTIFY_SHOP_ID = process.env.PRINTIFY_SHOP_ID;

if (!PRINTIFY_API_TOKEN || !PRINTIFY_SHOP_ID) {
  console.error('❌ Missing required environment variables');
  console.log('\nMake sure both are set in .env.local:');
  console.log('PRINTIFY_API_TOKEN=...');
  console.log('PRINTIFY_SHOP_ID=...\n');
  process.exit(1);
}

async function testConnection() {
  console.log('🧪 Testing Printify Integration...\n');

  try {
    // Test 1: Get blueprints (product catalog)
    console.log('1️⃣ Fetching product catalog...');
    const blueprintsRes = await fetch('https://api.printify.com/v1/catalog/blueprints.json', {
      headers: { 'Authorization': `Bearer ${PRINTIFY_API_TOKEN}` },
    });

    if (!blueprintsRes.ok) {
      throw new Error(`Failed to fetch blueprints: ${await blueprintsRes.text()}`);
    }

    const blueprints = await blueprintsRes.json();
    console.log(`✅ Found ${blueprints.length} available products\n`);

    // Test 2: Get shop details
    console.log('2️⃣ Checking shop connection...');
    const shopRes = await fetch(`https://api.printify.com/v1/shops/${PRINTIFY_SHOP_ID}.json`, {
      headers: { 'Authorization': `Bearer ${PRINTIFY_API_TOKEN}` },
    });

    if (!shopRes.ok) {
      throw new Error(`Failed to fetch shop: ${await shopRes.text()}`);
    }

    const shop = await shopRes.json();
    console.log(`✅ Connected to: ${shop.title}`);
    console.log(`   Sales Channel: ${shop.sales_channel || 'Manual'}`);
    console.log(`   Status: ${shop.connected ? 'Connected' : 'Not Connected'}\n`);

    // Test 3: Show some popular products
    console.log('3️⃣ Popular products available:\n');
    const popularIds = [3, 6, 380, 77, 842];
    const popularProducts = blueprints.filter(bp => popularIds.includes(bp.id));

    popularProducts.forEach(product => {
      console.log(`   • ${product.title} (ID: ${product.id})`);
    });

    console.log('\n═══════════════════════════════════════');
    console.log('✅ All tests passed!');
    console.log('═══════════════════════════════════════\n');
    console.log('Your Printify integration is ready to use! 🎉\n');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error('\nFull error:', error);
    process.exit(1);
  }
}

testConnection();
