#!/usr/bin/env node

/**
 * Admin Management Script
 * 
 * Usage:
 *   node scripts/manage-admins.js list
 *   node scripts/manage-admins.js grant <email>
 *   node scripts/manage-admins.js revoke <email>
 *   node scripts/manage-admins.js add-user <name> <email> <password>
 *   node scripts/manage-admins.js reset-password <email> <new-password>
 *   node scripts/manage-admins.js delete-user <email>
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Load Firebase config from .env
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env');
  const config = {};
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const [key, ...rest] = trimmed.split('=');
      if (key) config[key.trim()] = rest.join('=').trim().replace(/^["']|["']$/g, '');
    }
  }
  return config;
}

const env = loadEnv();
const DATABASE_URL = env.VITE_FIREBASE_DATABASE_URL;

if (!DATABASE_URL) {
  console.error('\x1b[31mError: VITE_FIREBASE_DATABASE_URL not found in .env\x1b[0m');
  console.error('Make sure your .env file has the Firebase database URL.');
  process.exit(1);
}

const USERS_PATH = 'nexus_users';
const HARDCODED_ADMINS = ['greem@admin.com', 'cyrenframe97@gmail.com'];

function firebaseGet(dbPath) {
  return new Promise((resolve, reject) => {
    const url = `${DATABASE_URL}/${dbPath}.json`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(data === 'null' ? null : JSON.parse(data));
        } catch {
          resolve(null);
        }
      });
    }).on('error', reject);
  });
}

function firebaseSet(dbPath, value) {
  return new Promise((resolve, reject) => {
    const url = `${DATABASE_URL}/${dbPath}.json`;
    const data = JSON.stringify(value);
    const parsed = new URL(url);
    const options = {
      hostname: parsed.hostname,
      path: parsed.pathname,
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) },
    };
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve(true));
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function getUsers() {
  const users = await firebaseGet(USERS_PATH);
  if (!Array.isArray(users)) return [];
  return users;
}

async function saveUsers(users) {
  await firebaseSet(USERS_PATH, users);
}

function printUsers(users) {
  console.log('\n\x1b[1mRegistered Users:\x1b[0m');
  console.log('─'.repeat(70));
  console.log(`${'Name'.padEnd(20)} ${'Email'.padEnd(30)} ${'Admin'.padEnd(8)} ${'Created'}`);
  console.log('─'.repeat(70));
  for (const u of users) {
    const admin = u.isAdmin ? '\x1b[33mYES\x1b[0m' : 'no';
    const created = new Date(u.createdAt).toLocaleDateString();
    console.log(`${u.name.padEnd(20)} ${u.email.padEnd(30)} ${admin.padEnd(8)} ${created}`);
  }
  console.log('─'.repeat(70));
  console.log(`Total: ${users.length} users, ${users.filter(u => u.isAdmin).length} admins\n`);
}

async function main() {
  const [,, command, ...args] = process.argv;

  if (!command) {
    console.log('\n\x1b[1mNexus AI — Admin Manager\x1b[0m\n');
    console.log('Commands:');
    console.log('  list                          List all users');
    console.log('  grant <email>                 Grant admin access');
    console.log('  revoke <email>                Revoke admin access');
    console.log('  add-user <name> <email> <pw>  Create a new user');
    console.log('  reset-password <email> <pw>   Reset user password');
    console.log('  delete-user <email>           Delete a user');
    console.log('');
    return;
  }

  const users = await getUsers();

  switch (command) {
    case 'list':
      printUsers(users);
      break;

    case 'grant': {
      const email = args[0];
      if (!email) { console.error('Usage: node manage-admins.js grant <email>'); break; }
      const user = users.find(u => u.email === email);
      if (!user) { console.error(`\x1b[31mUser ${email} not found.\x1b[0m`); break; }
      if (HARDCODED_ADMINS.includes(email)) { console.log(`${email} is already a permanent admin.`); break; }
      user.isAdmin = true;
      await saveUsers(users);
      console.log(`\x1b[32m✓ Granted admin to ${user.name} (${email})\x1b[0m`);
      break;
    }

    case 'revoke': {
      const email = args[0];
      if (!email) { console.error('Usage: node manage-admins.js revoke <email>'); break; }
      if (HARDCODED_ADMINS.includes(email)) { console.error(`\x1b[31mCannot revoke admin from ${email} (permanent admin).\x1b[0m`); break; }
      const user = users.find(u => u.email === email);
      if (!user) { console.error(`\x1b[31mUser ${email} not found.\x1b[0m`); break; }
      user.isAdmin = false;
      await saveUsers(users);
      console.log(`\x1b[32m✓ Revoked admin from ${user.name} (${email})\x1b[0m`);
      break;
    }

    case 'add-user': {
      const [name, email, password] = args;
      if (!name || !email || !password) { console.error('Usage: node manage-admins.js add-user <name> <email> <password>'); break; }
      if (users.find(u => u.email === email)) { console.error(`\x1b[31mUser ${email} already exists.\x1b[0m`); break; }
      users.push({ name, email, password, isAdmin: false, createdAt: Date.now() });
      await saveUsers(users);
      console.log(`\x1b[32m✓ Created user ${name} (${email})\x1b[0m`);
      break;
    }

    case 'reset-password': {
      const [email, newPw] = args;
      if (!email || !newPw) { console.error('Usage: node manage-admins.js reset-password <email> <new-password>'); break; }
      const user = users.find(u => u.email === email);
      if (!user) { console.error(`\x1b[31mUser ${email} not found.\x1b[0m`); break; }
      user.password = newPw;
      await saveUsers(users);
      console.log(`\x1b[32m✓ Password reset for ${user.name} (${email})\x1b[0m`);
      break;
    }

    case 'delete-user': {
      const email = args[0];
      if (!email) { console.error('Usage: node manage-admins.js delete-user <email>'); break; }
      if (HARDCODED_ADMINS.includes(email)) { console.error(`\x1b[31mCannot delete ${email} (permanent admin).\x1b[0m`); break; }
      const idx = users.findIndex(u => u.email === email);
      if (idx === -1) { console.error(`\x1b[31mUser ${email} not found.\x1b[0m`); break; }
      const removed = users.splice(idx, 1)[0];
      await saveUsers(users);
      console.log(`\x1b[32m✓ Deleted user ${removed.name} (${email})\x1b[0m`);
      break;
    }

    default:
      console.error(`\x1b[31mUnknown command: ${command}\x1b[0m`);
  }
}

main().catch(console.error);
