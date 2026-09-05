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
});

const generateTokenForRole = (role: string, email = 'staff@urbanledger.com'): string => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (jwt.sign as any)(
    { userId: `usr_${role.toLowerCase()}`, email, role, name: `${role} User` },
    env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

test('SALES: CONTACT is forbidden (403) from creating sales orders', async () => {
  const token = generateTokenForRole(ROLES.CONTACT);
  const res = await fetch(`${baseUrl}/sales`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      customerId: 'c1111111-1111-1111-1111-111111111111',
      lines: [{ productId: 'p1111111-1111-1111-1111-111111111111', quantity: 2 }],
    }),
  });

  assert.equal(res.status, 403);
});

test('SALES: ACCOUNTANT can create sales order with automatic 18% GST calculation', async () => {
  const token = generateTokenForRole(ROLES.ACCOUNTANT);
  const res = await fetch(`${baseUrl}/sales`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      customerId: 'c1111111-1111-1111-1111-111111111111', // Nimesh Pathak
      lines: [
        {
          productId: 'p1111111-1111-1111-1111-111111111111', // Office Chair: 4500
          quantity: 2,
        },
      ],
    }),
  });

  assert.equal(res.status, 201);
  const body = await res.json();
  assert.equal(body.success, true);
  assert.equal(body.data.subtotal, 9000); // 2 * 4500
  assert.equal(body.data.taxTotal, 1620); // 18% of 9000
  assert.equal(body.data.grandTotal, 10620); // 9000 + 1620
  assert.equal(body.data.status, 'CONFIRMED');
});

test('SALES: Invoicing a sales order creates Customer Invoice and double-entry posting', async () => {
  const token = generateTokenForRole(ROLES.ADMIN);
  // 1. Create SO
  const createRes = await fetch(`${baseUrl}/sales`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      customerId: 'c1111111-1111-1111-1111-111111111111',
      lines: [{ productId: 'p1111111-1111-1111-1111-111111111111', quantity: 1 }],
    }),
  });
  const createBody = await createRes.json();
  const soId = createBody.data.id;

  // 2. Invoice SO
  const invRes = await fetch(`${baseUrl}/sales/${soId}/invoice`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });

  assert.equal(invRes.status, 200);
  const invBody = await invRes.json();
  assert.equal(invBody.success, true);
  assert.equal(invBody.data.order.status, 'INVOICED');
  assert.ok(invBody.data.invoice.invoiceNumber);
  assert.ok(invBody.data.invoice.journalEntryId);
});
