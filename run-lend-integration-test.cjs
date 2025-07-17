#!/usr/bin/env node

// Simple Node.js runner for the lend-split integration test
const https = require('https');
const http = require('http');

// Simple fetch implementation for Node.js
global.fetch = function (url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const client = urlObj.protocol === 'https:' ? https : http;

    const req = client.request(
      {
        hostname: urlObj.hostname,
        port: urlObj.port,
        path: urlObj.pathname + urlObj.search,
        method: options.method || 'GET',
        headers: options.headers || {},
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          resolve({
            ok: res.statusCode >= 200 && res.statusCode < 300,
            status: res.statusCode,
            statusText: res.statusMessage,
            json: () => Promise.resolve(JSON.parse(data)),
            text: () => Promise.resolve(data),
          });
        });
      }
    );

    req.on('error', reject);

    if (options.body) {
      req.write(options.body);
    }

    req.end();
  });
};

// Load and run the test
const fs = require('fs');
const path = require('path');

// Read and execute the test script
const testScript = fs.readFileSync(path.join(__dirname, 'test-lend-split-integration.js'), 'utf8');
eval(testScript);

// Run the test
runLendSplitIntegrationTest();
