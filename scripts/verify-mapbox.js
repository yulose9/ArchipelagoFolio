/**
 * Mapbox Token Verification Script
 * Run this to test your Mapbox token configuration
 */

// Load tokens from environment variables
const MAPBOX_PUBLIC_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || process.env.MAPBOX_ACCESS_TOKEN;
const MAPBOX_SECRET_TOKEN = process.env.MAPBOX_SECRET_TOKEN;

/**
 * Verify token format and basic validity
 */
function verifyTokenFormat(token: string, type: 'public' | 'secret'): boolean {
  const expectedPrefix = type === 'public' ? 'pk.' : 'sk.';
  
  if (!token.startsWith(expectedPrefix)) {
    console.error(`❌ ${type} token should start with ${expectedPrefix}`);
    return false;
  }
  
  try {
    // Basic JWT structure check (header.payload.signature)
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error(`❌ ${type} token should have 3 parts separated by dots`);
      return false;
    }
    
    // Try to decode the payload
    const payload = JSON.parse(atob(parts[1]));
    console.log(`✅ ${type} token format is valid`);
    console.log(`   User: ${payload.u}`);
    console.log(`   Token ID: ${payload.a}`);
    
    return true;
  } catch (error) {
    console.error(`❌ ${type} token is not valid JWT format:`, error);
    return false;
  }
}

/**
 * Test API connectivity with the public token
 */
async function testMapboxAPI(): Promise<boolean> {
  try {
    const testUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/philippines.json?access_token=${MAPBOX_PUBLIC_TOKEN}`;
    
    const response = await fetch(testUrl);
    const data = await response.json();
    
    if (response.ok && data.features && data.features.length > 0) {
      console.log('✅ Mapbox API connection successful');
      console.log(`   Found ${data.features.length} results for "Philippines"`);
      return true;
    } else {
      console.error('❌ Mapbox API returned error:', data);
      return false;
    }
  } catch (error) {
    console.error('❌ Failed to connect to Mapbox API:', error);
    return false;
  }
}

/**
 * Main verification function
 */
async function verifyMapboxSetup(): Promise<void> {
  console.log('🗺️  Verifying Mapbox Token Setup');
  console.log('=====================================\n');
  
  // Verify token formats
  const publicTokenValid = verifyTokenFormat(MAPBOX_PUBLIC_TOKEN, 'public');
  const secretTokenValid = verifyTokenFormat(MAPBOX_SECRET_TOKEN, 'secret');
  
  if (!publicTokenValid || !secretTokenValid) {
    console.log('\n❌ Token format verification failed');
    return;
  }
  
  console.log('\n🔍 Testing API connectivity...');
  const apiWorking = await testMapboxAPI();
  
  if (apiWorking) {
    console.log('\n🎉 Mapbox setup verification complete!');
    console.log('✅ Tokens are valid and API is accessible');
    console.log('\n📋 Next steps:');
    console.log('   1. Ensure .env.local is in your .gitignore');
    console.log('   2. Run npm run dev to start development');
    console.log('   3. Visit http://localhost:3000 to see your 3D map');
  } else {
    console.log('\n❌ Mapbox setup verification failed');
    console.log('🔧 Troubleshooting steps:');
    console.log('   1. Check token permissions in Mapbox dashboard');
    console.log('   2. Verify tokens are not expired');
    console.log('   3. Ensure network connectivity');
  }
}

// Run verification if this file is executed directly
if (typeof window === 'undefined' && require.main === module) {
  verifyMapboxSetup();
}

export { verifyMapboxSetup, verifyTokenFormat };