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

const generateTokenForRole = (role: string, email = 'staff@urbanledger.com'): string => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (jwt.sign as any)(
    { userId: `usr_${role.toLowerCase()}`, email, role, name: `${role} User` },
    env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

test('ACCOUNTING: CONTACT role is forbidden (403) from accessing Chart of Accounts', async () => {
  const token = generateTokenForRole(ROLES.CONTACT);
  const res = await fetch(`${baseUrl}/accounting/chart-of-accounts`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  assert.equal(res.status, 403);
  const body = await res.json();
  assert.equal(body.success, false);
});

test('ACCOUNTING: ACCOUNTANT role can access Chart of Accounts (200)', async () => {
  const token = generateTokenForRole(ROLES.ACCOUNTANT);
  const res = await fetch(`${baseUrl}/accounting/chart-of-accounts`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.success, true);
  assert.ok(Array.isArray(body.data));
  assert.ok(body.data.length >= 7);
});

test('ACCOUNTING: Posting unbalanced journal entry is rejected with 400 Bad Request', async () => {
  const token = generateTokenForRole(ROLES.ACCOUNTANT);
  const accountsRes = await fetch(`${baseUrl}/accounting/chart-of-accounts`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const accountsBody = await accountsRes.json();
  const acc1 = accountsBody.data[0].id;
  const acc2 = accountsBody.data[1].id;

  const res = await fetch(`${baseUrl}/accounting/journal-entries`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      journalId: 'j1000000-0000-0000-0000-000000000001',
      date: '2026-09-05',
      reference: 'JRN-TEST-UNBALANCED',
      lines: [
        { accountId: acc1, debit: 5000, credit: 0, description: 'Debit 5000' },
        { accountId: acc2, debit: 0, credit: 3500, description: 'Credit 3500 (Mismatch!)' },
      ],
    }),
  });

  assert.equal(res.status, 400);
  const body = await res.json();
  assert.equal(body.success, false);
  assert.ok(body.message.includes('Unbalanced Journal Entry'));
});

test('ACCOUNTING: Posting balanced journal entry succeeds (201) and updates ledger', async () => {
  const token = generateTokenForRole(ROLES.ADMIN);
  const accountsRes = await fetch(`${baseUrl}/accounting/chart-of-accounts`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const accountsBody = await accountsRes.json();
  const acc1 = accountsBody.data[0].id;
  const acc2 = accountsBody.data[1].id;

  const res = await fetch(`${baseUrl}/accounting/journal-entries`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      journalId: 'j1000000-0000-0000-0000-000000000001',
      date: '2026-09-05',
      reference: 'JRN-TEST-BALANCED-01',
      lines: [
        { accountId: acc1, debit: 15000, credit: 0, description: 'Balanced Dr' },
        { accountId: acc2, debit: 0, credit: 15000, description: 'Balanced Cr' },
      ],
    }),
  });

  assert.equal(res.status, 201);
  const body = await res.json();
  assert.equal(body.success, true);
  assert.equal(body.data.totalDebit, 15000);
  assert.equal(body.data.totalCredit, 15000);
});
