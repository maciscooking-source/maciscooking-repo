const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const TOKEN = process.env.VERCEL_TOKEN;

if (!TOKEN) {
  console.log('❌ VERCEL_TOKEN not found in environment');
  console.log('');
  console.log('To deploy, you need a Vercel token:');
  console.log('1. Go to https://vercel.com/account/tokens');
  console.log('2. Create a new token');
  console.log('3. Run: VERCEL_TOKEN=your_token node deploy.js');
  console.log('');
  console.log('Or use the Vercel CLI:');
  console.log('  vercel login');
  console.log('  vercel --prod');
  process.exit(1);
}

console.log('🚀 Deploying to Vercel...');

try {
  // Build first
  console.log('📦 Building...');
  execSync('npm run build', { stdio: 'inherit' });
  
  // Copy API files
  console.log('📋 Copying API files...');
  fs.cpSync('api', 'dist/api', { recursive: true });
  fs.cpSync('public', 'dist', { recursive: true, force: true });
  
  // Deploy
  console.log('🌐 Deploying...');
  execSync(`npx vercel --token ${TOKEN} --prod`, { stdio: 'inherit' });
  
  console.log('✅ Deployment complete!');
} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  process.exit(1);
}