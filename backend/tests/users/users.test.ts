import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import jwt from 'jsonwebtoken';
import { createApp } from '../../src/app.js';
import { env } from '../../src/config/env.js';
import { ROLES } from '../../src/config/constants.js';

let server: http.Server;
let baseUrl: string;

test.before(async () => {
  const app = createApp();
  server = http.createServer(app);
  await new Promise<void>((resolve) => {
    server.listen(0, () => {
      const addr = server.address() as { port: number };
      baseUrl = `http://localhost:${addr.port}/api`;
      resolve();
    });
  });
});

test.after(async () => {
  server.closeAllConnections?.();
  await new Promise<void>((resolve) => server.close(() => resolve()));
  setTimeout(() => process.exit(0), 50);
});

const generateTokenForRole = (role: string, email = 'user@test.com'): string => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (jwt.sign as any)(
    { userId: `test-${role.toLowerCase()}`, email, role, name: `${role} User` },
    env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

test('USERS: ADMIN can create an internal ACCOUNTANT user', async () => {
  const adminToken = generateTokenForRole(ROLES.ADMIN, 'admin@urbanledger.com');

  const res = await fetch(`${baseUrl}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify({
      name: 'Accountant Priya',
      email: 'priya.accountant@urbanledger.com',
      password: 'Password123',
      role: 'ACCOUNTANT',
    }),
  });

  assert.equal(res.status, 201);
  const body = await res.json();
  assert.equal(body.success, true);
  assert.equal(body.data.user.email, 'priya.accountant@urbanledger.com');
  assert.equal(body.data.user.role, 'ACCOUNTANT');
  assert.equal(body.data.user.passwordHash, undefined);
});

test('USERS: Non-admin (ACCOUNTANT) is forbidden from creating users (403)', async () => {
  const accountantToken = generateTokenForRole(ROLES.ACCOUNTANT, 'priya.accountant@urbanledger.com');

  const res = await fetch(`${baseUrl}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accountantToken}`,
    },
    body: JSON.stringify({
      name: 'Rogue Admin',
      email: 'rogue@urbanledger.com',
      password: 'Password123',
      role: 'ADMIN',
    }),
  });

  assert.equal(res.status, 403);
  const body = await res.json();
  assert.equal(body.success, false);
  assert.equal(body.error.code, 'INSUFFICIENT_PERMISSIONS');
});

test('USERS: CONTACT is forbidden from creating users (403)', async () => {
  const contactToken = generateTokenForRole(ROLES.CONTACT, 'client@portal.com');

  const res = await fetch(`${baseUrl}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${contactToken}`,
    },
    body: JSON.stringify({
      name: 'Unauthorized User',
      email: 'unauth@urbanledger.com',
      password: 'Password123',
      role: 'ACCOUNTANT',
    }),
  });

  assert.equal(res.status, 403);
  const body = await res.json();
  assert.equal(body.success, false);
});

test('USERS: Unauthenticated request to create user returns 401', async () => {
  const res = await fetch(`${baseUrl}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'No Token User',
      email: 'notoken@urbanledger.com',
      password: 'Password123',
      role: 'ACCOUNTANT',
    }),
  });

  assert.equal(res.status, 401);
});

test('USERS: ADMIN can list users with pagination', async () => {
  const adminToken = generateTokenForRole(ROLES.ADMIN, 'admin@urbanledger.com');

  const res = await fetch(`${baseUrl}/users?page=1&limit=5`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });

  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.success, true);
  assert.ok(Array.isArray(body.data.items));
  assert.ok(body.data.pagination);
  assert.equal(body.data.pagination.page, 1);
});
