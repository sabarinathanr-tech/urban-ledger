import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { createApp } from '../../src/app.js';

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
});

test('AUTH: successful public signup creates user with CONTACT role', async () => {
  const res = await fetch(`${baseUrl}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'John Doe',
      email: 'john.doe@example.com',
      mobile: '+91 9876543210',
      password: 'Password123',
      confirmPassword: 'Password123',
      role: 'ADMIN', // Should be ignored and set to CONTACT
    }),
  });

  assert.equal(res.status, 201);
  const body = await res.json();
  assert.equal(body.success, true);
  assert.ok(body.data.token);
  assert.equal(body.data.user.email, 'john.doe@example.com');
  assert.equal(body.data.user.role, 'CONTACT'); // Cannot self-assign ADMIN
  assert.equal(body.data.user.passwordHash, undefined); // Never return password hash
});

test('AUTH: duplicate email returns 409 Conflict', async () => {
  const res = await fetch(`${baseUrl}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'John Clone',
      email: 'john.doe@example.com',
      password: 'Password123',
      confirmPassword: 'Password123',
    }),
  });

  assert.equal(res.status, 409);
  const body = await res.json();
  assert.equal(body.success, false);
  assert.equal(body.error.code, 'USER_EXISTS');
});

test('AUTH: invalid email format returns 400 Bad Request', async () => {
  const res = await fetch(`${baseUrl}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Bad Email',
      email: 'not-an-email',
      password: 'Password123',
      confirmPassword: 'Password123',
    }),
  });

  assert.equal(res.status, 400);
  const body = await res.json();
  assert.equal(body.success, false);
  assert.equal(body.error.code, 'VALIDATION_ERROR');
});

test('AUTH: weak password (< 8 chars, no numbers) returns 400 Bad Request', async () => {
  const res = await fetch(`${baseUrl}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Weak Pass',
      email: 'weak@example.com',
      password: 'short',
      confirmPassword: 'short',
    }),
  });

  assert.equal(res.status, 400);
  const body = await res.json();
  assert.equal(body.success, false);
});

test('AUTH: password mismatch returns 400 Bad Request', async () => {
  const res = await fetch(`${baseUrl}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Mismatch Pass',
      email: 'mismatch@example.com',
      password: 'Password123',
      confirmPassword: 'DifferentPassword456',
    }),
  });

  assert.equal(res.status, 400);
  const body = await res.json();
  assert.equal(body.success, false);
});

test('AUTH: successful login returns JWT token and user profile', async () => {
  const res = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'john.doe@example.com',
      password: 'Password123',
    }),
  });

  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.success, true);
  assert.ok(body.data.token);
  assert.equal(body.data.user.email, 'john.doe@example.com');
  assert.equal(body.data.user.passwordHash, undefined);
});

test('AUTH: invalid password returns 401 Unauthorized', async () => {
  const res = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'john.doe@example.com',
      password: 'WrongPassword999',
    }),
  });

  assert.equal(res.status, 401);
  const body = await res.json();
  assert.equal(body.success, false);
  assert.equal(body.error.code, 'INVALID_CREDENTIALS');
});

test('AUTH: non-existent email returns 401 Unauthorized', async () => {
  const res = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'doesnotexist@example.com',
      password: 'Password123',
    }),
  });

  assert.equal(res.status, 401);
  const body = await res.json();
  assert.equal(body.success, false);
  assert.equal(body.error.code, 'INVALID_CREDENTIALS');
});

test('AUTH: GET /api/auth/me returns current user with valid Bearer token', async () => {
  // 1. Login to obtain token
  const loginRes = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'john.doe@example.com',
      password: 'Password123',
    }),
  });
  const { data } = await loginRes.json();
  const token = data.token;

  // 2. Fetch /me
  const meRes = await fetch(`${baseUrl}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  assert.equal(meRes.status, 200);
  const meBody = await meRes.json();
  assert.equal(meBody.success, true);
  assert.equal(meBody.data.user.email, 'john.doe@example.com');
  assert.equal(meBody.data.user.passwordHash, undefined);
});

test('AUTH: GET /api/auth/me without token returns 401 Unauthorized', async () => {
  const res = await fetch(`${baseUrl}/auth/me`);
  assert.equal(res.status, 401);
  const body = await res.json();
  assert.equal(body.success, false);
  assert.equal(body.error.code, 'AUTHENTICATION_REQUIRED');
});

test('AUTH: GET /api/auth/me with invalid token returns 401 Unauthorized', async () => {
  const res = await fetch(`${baseUrl}/auth/me`, {
    headers: { Authorization: 'Bearer invalid.token.value' },
  });
  assert.equal(res.status, 401);
  const body = await res.json();
  assert.equal(body.success, false);
  assert.equal(body.error.code, 'TOKEN_INVALID');
});

test('AUTH: POST /api/auth/logout returns 200', async () => {
  const res = await fetch(`${baseUrl}/auth/logout`, { method: 'POST' });
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.success, true);
});
