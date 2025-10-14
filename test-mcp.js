#!/usr/bin/env node

import { spawn } from 'child_process';

const server = spawn('npx', ['ts-node', 'src/server.ts'], {
  stdio: ['pipe', 'pipe', 'inherit'],
  cwd: process.cwd()
});

let messageId = 1;

function sendRequest(method, params = {}) {
  const request = {
    jsonrpc: '2.0',
    id: messageId++,
    method,
    params
  };
  console.log('📤 Gönderilen:', JSON.stringify(request, null, 2));
  server.stdin.write(JSON.stringify(request) + '\n');
}

server.stdout.on('data', (data) => {
  const lines = data.toString().split('\n').filter(line => line.trim());
  lines.forEach(line => {
    try {
      const response = JSON.parse(line);
      console.log('📥 Alınan:', JSON.stringify(response, null, 2));
    } catch (e) {
      console.log('📥 Ham veri:', line);
    }
  });
});

// Test senaryosu
setTimeout(() => {
  console.log('\n🔧 1. Initialize isteği gönderiliyor...\n');
  sendRequest('initialize', {
    protocolVersion: '2024-11-05',
    capabilities: {},
    clientInfo: {
      name: 'test-client',
      version: '1.0.0'
    }
  });
}, 500);

setTimeout(() => {
  console.log('\n🔧 2. Initialized notification gönderiliyor...\n');
  server.stdin.write(JSON.stringify({
    jsonrpc: '2.0',
    method: 'notifications/initialized'
  }) + '\n');
}, 1500);

setTimeout(() => {
  console.log('\n🔧 3. Tools listesi isteniyor...\n');
  sendRequest('tools/list');
}, 2500);

setTimeout(() => {
  console.log('\n🔧 4. Tool çağrılıyor (setup-new_mcp)...\n');
  sendRequest('tools/call', {
    name: 'setup-new_mcp',
    arguments: {}
  });
}, 3500);

setTimeout(() => {
  console.log('\n✅ Test tamamlandı, sunucu kapatılıyor...\n');
  server.kill();
  process.exit(0);
}, 10000);
