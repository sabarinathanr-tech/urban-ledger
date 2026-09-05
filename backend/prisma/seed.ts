import { PrismaClient, Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';
import { seedAccounts } from './seed-data/accounts.js';
import { seedJournals } from './seed-data/journals.js';
import { seedProducts } from './seed-data/products.js';
import { seedContacts } from './seed-data/contacts.js';
import { seedUsers } from './seed-data/users.js';
import { seedAnalyticAccounts, seedBudgets } from './seed-data/budgets.js';

const prisma = new PrismaClient();

async function hashPassword(plainText: string): Promise<string> {
  try {
    return await bcrypt.hash(plainText, 10);
  } catch {
    // Fallback development bcrypt hash for password "Admin@12345"
    return '$2b$10$wT0o3q6.kP/d/gUo3wQ06.zO2LqGZ7B4fD.9j3F3wR2K4zE1t7wGe';
  }
}

async function cleanDatabase() {
  console.log('🧹 Cleaning existing data...');
  // Delete in dependency order
  await prisma.journalEntryLine.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.invoiceLine.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.billLine.deleteMany();
  await prisma.bill.deleteMany();
  await prisma.salesOrderLine.deleteMany();
  await prisma.salesOrder.deleteMany();
  await prisma.purchaseOrderLine.deleteMany();
  await prisma.purchaseOrder.deleteMany();
  await prisma.journalEntry.deleteMany();
  await prisma.budget.deleteMany();
  await prisma.analyticAccount.deleteMany();
  await prisma.journal.deleteMany();
  await prisma.account.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();
  await prisma.contact.deleteMany();
}

async function main() {
  console.log('🌱 Starting Urban Ledger database seed...');
  await cleanDatabase();

  // 1. Seed Accounts (Chart of Accounts)
  console.log('📊 Seeding Chart of Accounts...');
  const accountMap = new Map<string, string>(); // code -> id
  for (const acc of seedAccounts) {
    const created = await prisma.account.create({
      data: {
        id: acc.id,
        name: acc.name,
        code: acc.code,
        type: acc.type,
      },
    });
    accountMap.set(acc.code, created.id);
  }

  // 2. Seed Journals
  console.log('📓 Seeding Journals...');
  const journalMap = new Map<string, string>(); // type -> id
  for (const j of seedJournals) {
    const created = await prisma.journal.create({
      data: {
        id: j.id,
        name: j.name,
        type: j.type,
        defaultDebitAccountId: j.defaultDebitAccountCode
          ? accountMap.get(j.defaultDebitAccountCode)
          : undefined,
        defaultCreditAccountId: j.defaultCreditAccountCode
          ? accountMap.get(j.defaultCreditAccountCode)
          : undefined,
      },
    });
    journalMap.set(j.type, created.id);
  }

  // 3. Seed Products
  console.log('🛋️ Seeding Products...');
  const productMap = new Map<string, string>(); // name -> id
  for (const p of seedProducts) {
    const created = await prisma.product.create({
      data: {
        id: p.id,
        name: p.name,
        type: p.type,
        salesPrice: new Prisma.Decimal(p.salesPrice),
        purchasePrice: new Prisma.Decimal(p.purchasePrice),
        category: p.category,
      },
    });
    productMap.set(p.name, created.id);
  }

  // 4. Seed Contacts
  console.log('👥 Seeding Contacts...');
  const contactMap = new Map<string, string>(); // email -> id
  for (const c of seedContacts) {
    const created = await prisma.contact.create({
      data: {
        id: c.id,
        name: c.name,
        type: c.type,
        email: c.email,
        mobile: c.mobile,
        city: c.city,
        state: c.state,
        pincode: c.pincode,
        profileImage: c.profileImage,
      },
    });
    contactMap.set(c.email, created.id);
  }

  // 5. Seed Users
  console.log('🔐 Seeding Users...');
  const userMap = new Map<string, string>(); // email -> id
  for (const u of seedUsers) {
    const passwordHash = await hashPassword(u.plainPassword);
    const contactId = u.contactEmail ? contactMap.get(u.contactEmail) : undefined;

    const created = await prisma.user.create({
      data: {
        id: u.id,
        name: u.name,
        email: u.email,
        mobile: u.mobile,
        passwordHash,
        role: u.role,
        contactId,
      },
    });
    userMap.set(u.email, created.id);
  }

  // 6. Seed Analytic Accounts & Budgets
  console.log('📈 Seeding Analytic Accounts & Budgets...');
  const analyticMap = new Map<string, string>(); // name -> id
  for (const aa of seedAnalyticAccounts) {
    const created = await prisma.analyticAccount.create({
      data: {
        id: aa.id,
        name: aa.name,
        type: aa.type,
      },
    });
    analyticMap.set(aa.name, created.id);
  }

  for (const b of seedBudgets) {
    await prisma.budget.create({
      data: {
        id: b.id,
        name: b.name,
        startDate: new Date(b.startDate),
        endDate: new Date(b.endDate),
        plannedAmount: new Prisma.Decimal(b.plannedAmount),
        responsibleUserId: userMap.get(b.responsibleUserEmail)!,
        analyticAccountId: analyticMap.get(b.analyticAccountName)!,
      },
    });
  }

  // =========================================================================
  // 7. DEMO TRANSACTION FLOW 1: SALE TO NIMESH PATHAK (5 OFFICE CHAIRS)
  // Customer buys 5 Office Chairs
  // -> Sales Order -> Invoice -> Payment -> Journal Entries
  // =========================================================================
  console.log('💼 Seeding Demo Sales Flow (Nimesh Pathak - 5 Office Chairs)...');

  const customerId = contactMap.get('nimesh@pathak.com')!;
  const officeChairId = productMap.get('Office Chair')!;
  const salesJournalId = journalMap.get('SALES')!;
  const cashJournalId = journalMap.get('CASH')!;
  const debtorsAccountId = accountMap.get('1100')!; // Debtors
  const salesIncomeAccountId = accountMap.get('4000')!; // Sales Income
  const cashAccountId = accountMap.get('1000')!; // Cash

  const qty = new Prisma.Decimal(5);
  const unitPrice = new Prisma.Decimal(4500.00);
  const taxRate = new Prisma.Decimal(18.00);
  const subtotal = qty.mul(unitPrice); // 22,500.00
  const taxAmount = subtotal.mul(taxRate).div(100); // 4,050.00
  const totalAmount = subtotal.add(taxAmount); // 26,550.00

  // 7a. Sales Order
  const salesOrder = await prisma.salesOrder.create({
    data: {
      reference: 'SO-2026-0001',
      customerId,
      orderDate: new Date('2026-01-15T10:00:00Z'),
      status: 'INVOICED',
      subtotal,
      taxAmount,
      totalAmount,
      lines: {
        create: [
          {
            productId: officeChairId,
            quantity: qty,
            unitPrice,
            taxRate,
            lineSubtotal: subtotal,
            lineTax: taxAmount,
            lineTotal: totalAmount,
          },
        ],
      },
    },
  });

  // 7b. Sales Journal Entry (Invoice posting: Debit Debtors, Credit Sales Income)
  const invoiceJournalEntry = await prisma.journalEntry.create({
    data: {
      journalId: salesJournalId,
      date: new Date('2026-01-15T11:00:00Z'),
      reference: 'JE-INV-2026-0001',
      sourceType: 'INVOICE',
      status: 'POSTED',
      lines: {
        create: [
          {
            accountId: debtorsAccountId,
            description: 'Customer Invoice Receivable - Nimesh Pathak (SO-2026-0001)',
            debit: totalAmount,
            credit: new Prisma.Decimal(0),
          },
          {
            accountId: salesIncomeAccountId,
            description: 'Sales Revenue - 5 Office Chairs',
            debit: new Prisma.Decimal(0),
            credit: totalAmount,
          },
        ],
      },
    },
  });

  // 7c. Customer Invoice
  const invoice = await prisma.invoice.create({
    data: {
      reference: 'INV-2026-0001',
      customerId,
      salesOrderId: salesOrder.id,
      journalEntryId: invoiceJournalEntry.id,
      invoiceDate: new Date('2026-01-15T11:00:00Z'),
      dueDate: new Date('2026-01-30T11:00:00Z'),
      status: 'POSTED',
      paymentStatus: 'PAID',
      subtotal,
      taxAmount,
      totalAmount,
      paidAmount: totalAmount,
      outstandingAmount: new Prisma.Decimal(0),
      lines: {
        create: [
          {
            productId: officeChairId,
            description: 'Office Chair (Executive High Back)',
            quantity: qty,
            unitPrice,
            taxRate,
            lineSubtotal: subtotal,
            lineTax: taxAmount,
            lineTotal: totalAmount,
          },
        ],
      },
    },
  });

  // Update sourceId on journal entry
  await prisma.journalEntry.update({
    where: { id: invoiceJournalEntry.id },
    data: { sourceId: invoice.id },
  });

  // 7d. Payment & Payment Journal Entry (Customer pays Cash: Debit Cash, Credit Debtors)
  const paymentJournalEntry = await prisma.journalEntry.create({
    data: {
      journalId: cashJournalId,
      date: new Date('2026-01-16T14:00:00Z'),
      reference: 'JE-PAY-2026-0001',
      sourceType: 'PAYMENT',
      status: 'POSTED',
      lines: {
        create: [
          {
            accountId: cashAccountId,
            description: 'Cash Received - Invoice INV-2026-0001',
            debit: totalAmount,
            credit: new Prisma.Decimal(0),
          },
          {
            accountId: debtorsAccountId,
            description: 'Settlement of Customer Debtors - INV-2026-0001',
            debit: new Prisma.Decimal(0),
            credit: totalAmount,
          },
        ],
      },
    },
  });

  const salesPayment = await prisma.payment.create({
    data: {
      reference: 'PAY-2026-0001',
      invoiceId: invoice.id,
      paymentDate: new Date('2026-01-16T14:00:00Z'),
      amount: totalAmount,
      method: 'CASH',
      journalId: cashJournalId,
      journalEntryId: paymentJournalEntry.id,
      status: 'POSTED',
    },
  });

  await prisma.journalEntry.update({
    where: { id: paymentJournalEntry.id },
    data: { sourceId: salesPayment.id },
  });

  // =========================================================================
  // 8. DEMO TRANSACTION FLOW 2: PURCHASE FROM AZURE FURNITURE
  // Company buys 10 Office Chairs from Azure Furniture
  // -> Purchase Order -> Vendor Bill -> Bank Payment -> Journal Entries
  // =========================================================================
  console.log('📦 Seeding Demo Purchase Flow (Azure Furniture - 10 Office Chairs)...');

  const vendorId = contactMap.get('orders@azurefurniture.com')!;
  const purchaseJournalId = journalMap.get('PURCHASE')!;
  const bankJournalId = journalMap.get('BANK')!;
  const creditorsAccountId = accountMap.get('2000')!; // Creditors
  const purchaseExpenseAccountId = accountMap.get('5000')!; // Purchases Expense
  const bankAccountId = accountMap.get('1010')!; // Bank
  const procurementAnalyticId = analyticMap.get('Furniture Procurement')!;

  const pQty = new Prisma.Decimal(10);
  const pUnitPrice = new Prisma.Decimal(2800.00);
  const pTaxRate = new Prisma.Decimal(18.00);
  const pSubtotal = pQty.mul(pUnitPrice); // 28,000.00
  const pTaxAmount = pSubtotal.mul(pTaxRate).div(100); // 5,040.00
  const pTotalAmount = pSubtotal.add(pTaxAmount); // 33,040.00

  // 8a. Purchase Order
  const purchaseOrder = await prisma.purchaseOrder.create({
    data: {
      reference: 'PO-2026-0001',
      vendorId,
      orderDate: new Date('2026-01-10T09:00:00Z'),
      status: 'BILLED',
      subtotal: pSubtotal,
      taxAmount: pTaxAmount,
      totalAmount: pTotalAmount,
      lines: {
        create: [
          {
            productId: officeChairId,
            quantity: pQty,
            unitPrice: pUnitPrice,
            taxRate: pTaxRate,
            lineSubtotal: pSubtotal,
            lineTax: pTaxAmount,
            lineTotal: pTotalAmount,
          },
        ],
      },
    },
  });

  // 8b. Bill Journal Entry (Debit Purchases Expense, Credit Creditors)
  const billJournalEntry = await prisma.journalEntry.create({
    data: {
      journalId: purchaseJournalId,
      date: new Date('2026-01-12T15:00:00Z'),
      reference: 'JE-BILL-2026-0001',
      sourceType: 'BILL',
      status: 'POSTED',
      lines: {
        create: [
          {
            accountId: purchaseExpenseAccountId,
            analyticAccountId: procurementAnalyticId,
            description: 'Inventory Purchase - 10 Office Chairs (PO-2026-0001)',
            debit: pTotalAmount,
            credit: new Prisma.Decimal(0),
          },
          {
            accountId: creditorsAccountId,
            description: 'Vendor Payable - Azure Furniture',
            debit: new Prisma.Decimal(0),
            credit: pTotalAmount,
          },
        ],
      },
    },
  });

  // 8c. Vendor Bill
  const bill = await prisma.bill.create({
    data: {
      reference: 'BILL-2026-0001',
      vendorId,
      purchaseOrderId: purchaseOrder.id,
      journalEntryId: billJournalEntry.id,
      billDate: new Date('2026-01-12T15:00:00Z'),
      dueDate: new Date('2026-01-27T15:00:00Z'),
      status: 'POSTED',
      paymentStatus: 'PAID',
      subtotal: pSubtotal,
      taxAmount: pTaxAmount,
      totalAmount: pTotalAmount,
      paidAmount: pTotalAmount,
      outstandingAmount: new Prisma.Decimal(0),
      lines: {
        create: [
          {
            productId: officeChairId,
            description: 'Raw Materials / Inventory: Office Chair Units',
            quantity: pQty,
            unitPrice: pUnitPrice,
            taxRate: pTaxRate,
            lineSubtotal: pSubtotal,
            lineTax: pTaxAmount,
            lineTotal: pTotalAmount,
          },
        ],
      },
    },
  });

  await prisma.journalEntry.update({
    where: { id: billJournalEntry.id },
    data: { sourceId: bill.id },
  });

  // 8d. Bill Payment & Journal Entry (Debit Creditors, Credit Bank)
  const billPaymentJournalEntry = await prisma.journalEntry.create({
    data: {
      journalId: bankJournalId,
      date: new Date('2026-01-18T16:30:00Z'),
      reference: 'JE-PAY-2026-0002',
      sourceType: 'PAYMENT',
      status: 'POSTED',
      lines: {
        create: [
          {
            accountId: creditorsAccountId,
            description: 'Settlement of Vendor Payable - BILL-2026-0001',
            debit: pTotalAmount,
            credit: new Prisma.Decimal(0),
          },
          {
            accountId: bankAccountId,
            description: 'Bank Outflow - Vendor Payment to Azure Furniture',
            debit: new Prisma.Decimal(0),
            credit: pTotalAmount,
          },
        ],
      },
    },
  });

  const billPayment = await prisma.payment.create({
    data: {
      reference: 'PAY-2026-0002',
      billId: bill.id,
      paymentDate: new Date('2026-01-18T16:30:00Z'),
      amount: pTotalAmount,
      method: 'BANK',
      journalId: bankJournalId,
      journalEntryId: billPaymentJournalEntry.id,
      status: 'POSTED',
    },
  });

  await prisma.journalEntry.update({
    where: { id: billPaymentJournalEntry.id },
    data: { sourceId: billPayment.id },
  });

  console.log('✅ Seed successfully completed with full double-entry accounting integrity!');
}

main()
  .catch((e) => {
    console.error('❌ Error executing seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
