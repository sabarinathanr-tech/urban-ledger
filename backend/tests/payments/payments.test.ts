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

const generateTokenForRole = (role: string, email = 'staff@urbanledger.com', userId = 'usr_staff'): string => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (jwt.sign as any)(
    { userId, email, role, name: `${role} User` },
    env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

test('PAYMENTS: Recording payment settles invoice and creates Cash/Bank journal entry', async () => {
  const token = generateTokenForRole(ROLES.ACCOUNTANT);

  // 1. Get seed invoice
  const invRes = await fetch(`${baseUrl}/invoices/inv_seed_001`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const invBody = await invRes.json();
  const initialBalance = invBody.data.balanceDue;

  // 2. Pay 20,000 towards invoice
  const payRes = await fetch(`${baseUrl}/payments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      type: 'CUSTOMER_PAYMENT',
      contactId: invBody.data.customerId,
      amount: 20000,
      method: 'BANK',
      invoiceId: 'inv_seed_001',
    }),
  });

  assert.equal(payRes.status, 201);
  const payBody = await payRes.json();
  assert.equal(payBody.success, true);
  assert.equal(payBody.data.amount, 20000);
  assert.ok(payBody.data.journalEntryId);

  // 3. Verify invoice balance decreased
  const updatedInvRes = await fetch(`${baseUrl}/invoices/inv_seed_001`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const updatedInvBody = await updatedInvRes.json();
  assert.equal(updatedInvBody.data.balanceDue, initialBalance - 20000);
});

test('PAYMENTS: Payment exceeding balance is rejected (400)', async () => {
  const token = generateTokenForRole(ROLES.ACCOUNTANT);

  const payRes = await fetch(`${baseUrl}/payments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      type: 'CUSTOMER_PAYMENT',
      contactId: 'c1111111-1111-1111-1111-111111111111',
      amount: 99999999, // Way above balance
      method: 'BANK',
      invoiceId: 'inv_seed_001',
    }),
  });

  assert.equal(payRes.status, 400);
  const body = await payRes.json();
  assert.equal(body.success, false);
});
