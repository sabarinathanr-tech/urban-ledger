import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import jwt from 'jsonwebtoken';
import { createApp } from '../../src/app.js';
import { prisma } from '../../src/config/db.js';
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
  await prisma.$disconnect().catch(() => {});
});

const generateTokenForRole = (role: string, email = 'user@test.com'): string => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (jwt.sign as any)(
    { userId: `test-${role.toLowerCase()}`, email, role, name: `${role} User` },
    env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

test('DASHBOARD: unauthenticated request to /summary returns 401 Unauthorized', async () => {
  const res = await fetch(`${baseUrl}/dashboard/summary`);
  assert.equal(res.status, 401);
  const body = await res.json();
  assert.equal(body.success, false);
});

test('DASHBOARD: CONTACT user is forbidden from accessing /summary (403)', async () => {
  const contactToken = generateTokenForRole(ROLES.CONTACT);
  const res = await fetch(`${baseUrl}/dashboard/summary`, {
    headers: { Authorization: `Bearer ${contactToken}` },
  });

  assert.equal(res.status, 403);
  const body = await res.json();
  assert.equal(body.success, false);
  assert.equal(body.error.code, 'INSUFFICIENT_PERMISSIONS');
});

test('DASHBOARD: ADMIN can access /summary and receives correct shape', async () => {
  const adminToken = generateTokenForRole(ROLES.ADMIN);
  const res = await fetch(`${baseUrl}/dashboard/summary`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });

  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.success, true);
  assert.equal(typeof body.data.revenue, 'number');
  assert.equal(typeof body.data.expenses, 'number');
  assert.equal(typeof body.data.netProfit, 'number');
  assert.equal(typeof body.data.cashAndBank, 'number');
  assert.equal(typeof body.data.receivables, 'number');
  assert.equal(typeof body.data.payables, 'number');
  assert.equal(body.data.netProfit, body.data.revenue - body.data.expenses);
});

test('DASHBOARD: ACCOUNTANT can access /summary and receives 200 OK', async () => {
  const accountantToken = generateTokenForRole(ROLES.ACCOUNTANT);
  const res = await fetch(`${baseUrl}/dashboard/summary`, {
    headers: { Authorization: `Bearer ${accountantToken}` },
  });

  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.success, true);
});

test('DASHBOARD: GET /revenue-expense returns time-series array', async () => {
  const token = generateTokenForRole(ROLES.ADMIN);
  const res = await fetch(`${baseUrl}/dashboard/revenue-expense?limit=4`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.success, true);
  assert.ok(Array.isArray(body.data));
  assert.equal(body.data.length, 4);
  assert.ok(body.data[0].period);
  assert.equal(typeof body.data[0].revenue, 'number');
  assert.equal(typeof body.data[0].expenses, 'number');
});

test('DASHBOARD: GET /budget-health returns planned vs actual and utilization', async () => {
  const token = generateTokenForRole(ROLES.ADMIN);
  const res = await fetch(`${baseUrl}/dashboard/budget-health`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.success, true);
  assert.ok(body.data.budgetName);
  assert.equal(typeof body.data.plannedAmount, 'number');
  assert.equal(typeof body.data.actualAmount, 'number');
  assert.equal(typeof body.data.remainingAmount, 'number');
  assert.equal(typeof body.data.utilizationPercent, 'number');
  assert.ok(['HEALTHY', 'WARNING', 'EXCEEDED'].includes(body.data.status));
});

test('DASHBOARD: GET /receivables returns outstanding and overdue metrics', async () => {
  const token = generateTokenForRole(ROLES.ACCOUNTANT);
  const res = await fetch(`${baseUrl}/dashboard/receivables`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.success, true);
  assert.equal(typeof body.data.outstanding, 'number');
  assert.equal(typeof body.data.overdue, 'number');
  assert.equal(typeof body.data.openInvoices, 'number');
});

test('DASHBOARD: GET /payables returns outstanding bills and overdue metrics', async () => {
  const token = generateTokenForRole(ROLES.ACCOUNTANT);
  const res = await fetch(`${baseUrl}/dashboard/payables`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.success, true);
  assert.equal(typeof body.data.outstanding, 'number');
  assert.equal(typeof body.data.overdue, 'number');
  assert.equal(typeof body.data.openBills, 'number');
});

test('DASHBOARD: GET /accounting-health returns system status flags', async () => {
  const token = generateTokenForRole(ROLES.ADMIN);
  const res = await fetch(`${baseUrl}/dashboard/accounting-health`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.success, true);
  assert.equal(typeof body.data.booksBalanced, 'boolean');
  assert.equal(typeof body.data.confirmedInvoicesAccounted, 'boolean');
  assert.equal(typeof body.data.postedEntriesValid, 'boolean');
  assert.equal(typeof body.data.overdueReceivables, 'number');
  assert.equal(typeof body.data.budgetWarning, 'boolean');
  assert.equal(typeof body.data.unreconciledPayments, 'number');
});

test('DASHBOARD: GET /recent-transactions returns normalized list of transactions', async () => {
  const token = generateTokenForRole(ROLES.ADMIN);
  const res = await fetch(`${baseUrl}/dashboard/recent-transactions?limit=5`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.success, true);
  assert.ok(Array.isArray(body.data));
  assert.equal(body.data.length, 5);

  const tx = body.data[0];
  assert.ok(tx.id);
  assert.ok(tx.reference);
  assert.ok(tx.type);
  assert.ok(tx.party);
  assert.ok(tx.date);
  assert.equal(typeof tx.amount, 'number');
  assert.ok(tx.status);
});
