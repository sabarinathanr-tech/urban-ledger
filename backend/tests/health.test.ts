import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { createApp } from '../src/app.js';
import { prisma } from '../src/config/db.js';

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

test('GET /api/health returns 200 and healthy status', async () => {
  const res = await fetch(`${baseUrl}/health`, {
    headers: { connection: 'close' },
  });
  assert.equal(res.status, 200);

  const body = await res.json();
  assert.equal(body.success, true);
  assert.equal(body.message, 'Urban Ledger API is running');
  assert.equal(body.data.status, 'healthy');
  assert.ok(body.data.timestamp);
});
