const https = require('https');

const PRINTIFY_API_TOKEN = process.env.PRINTIFY_API_TOKEN;
const BLUEPRINT_ID = 77; // Hoodie

if (!PRINTIFY_API_TOKEN) {
  console.error('❌ PRINTIFY_API_TOKEN not found in environment');
  process.exit(1);
}

function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.printify.com',
      path: path,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${PRINTIFY_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(JSON.parse(data));
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

async function getHoodieVariants() {
  try {
    console.log(`\n🔍 Fetching blueprint ${BLUEPRINT_ID} with print provider 99...\n`);
    
    const blueprintInfo = await makeRequest(`/v1/catalog/blueprints/${BLUEPRINT_ID}/print_providers/99/variants.json`);
    
    console.log('Variants for Printify Choice (Provider 99):\n');
    console.log(JSON.stringify(blueprintInfo, null, 2));
    
    if (blueprintInfo.variants) {
      console.log('\n\n📋 Available Variants:\n');
      blueprintInfo.variants.forEach(variant => {
        console.log(`${variant.id}: ${variant.title}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

getHoodieVariants();

