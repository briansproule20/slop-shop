/**
 * Script to fetch your Printify Shop ID
 *
 * Usage:
 * 1. Set your PRINTIFY_API_TOKEN in .env.local
 * 2. Run: node scripts/get-shop-id.js
 */

const PRINTIFY_API_TOKEN = process.env.PRINTIFY_API_TOKEN;

if (!PRINTIFY_API_TOKEN) {
  console.error('❌ PRINTIFY_API_TOKEN not found in environment variables');
  console.log('\nPlease add it to your .env.local file:');
  console.log('PRINTIFY_API_TOKEN=your_token_here\n');
  process.exit(1);
}

async function getShops() {
  try {
    const response = await fetch('https://api.printify.com/v1/shops.json', {
      headers: {
        'Authorization': `Bearer ${PRINTIFY_API_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }

    const shops = await response.json();

    console.log('\n✅ Found your Printify shops:\n');
    shops.forEach((shop, index) => {
      console.log(`Shop ${index + 1}:`);
      console.log(`  ID: ${shop.id}`);
      console.log(`  Title: ${shop.title}`);
      console.log(`  Sales Channel: ${shop.sales_channel}`);
      console.log('');
    });

    if (shops.length === 1) {
      console.log(`\n📝 Add this to your .env.local:`);
      console.log(`PRINTIFY_SHOP_ID=${shops[0].id}\n`);
    } else if (shops.length > 1) {
      console.log(`\n📝 You have multiple shops. Choose the one you want to use and add to .env.local:`);
      console.log(`PRINTIFY_SHOP_ID=<shop_id_here>\n`);
    }
  } catch (error) {
    console.error('❌ Error fetching shops:', error.message);
    process.exit(1);
  }
}

getShops();
