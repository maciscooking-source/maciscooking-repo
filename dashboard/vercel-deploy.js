const https = require('https');
const fs = require('fs');
const path = require('path');

const TOKEN = process.env.VERCEL_TOKEN;

if (!TOKEN) {
  console.log('Please set VERCEL_TOKEN environment variable');
  process.exit(1);
}

// Read all files from dist folder
function getFiles(dir, basePath = '') {
  const files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const relativePath = basePath ? `${basePath}/${item}` : item;
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      files.push(...getFiles(fullPath, relativePath));
    } else {
      const content = fs.readFileSync(fullPath);
      files.push({
        file: relativePath,
        data: content.toString('base64'),
        encoding: 'base64'
      });
    }
  }
  
  return files;
}

async function deploy() {
  console.log('Reading files...');
  const files = getFiles('dist');
  
  console.log(`Found ${files.length} files`);
  
  const deployment = {
    name: 'maciscooking-trading',
    project: 'maciscooking-trading',
    target: 'production',
    files
  };
  
  console.log('Creating deployment...');
  
  const options = {
    hostname: 'api.vercel.com',
    port: 443,
    path: '/v13/deployments',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${TOKEN}`,
      'Content-Type': 'application/json'
    }
  };
  
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.error) {
            reject(new Error(json.error.message));
          } else {
            resolve(json);
          }
        } catch (e) {
          resolve(data);
        }
      });
    });
    
    req.on('error', reject);
    req.write(JSON.stringify(deployment));
    req.end();
  });
}

deploy()
  .then(result => {
    console.log('Deployment created!');
    console.log(JSON.stringify(result, null, 2));
  })
  .catch(err => {
    console.error('Deployment failed:', err.message);
    process.exit(1);
  });