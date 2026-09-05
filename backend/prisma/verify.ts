import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function runVerification() {
  console.log('🔍 Running Urban Ledger Database Integrity Tests...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName}`);
      failed++;
    }
  }

  try {
    // 1. Double-entry balance test across all posted journal entries
    const entries = await prisma.journalEntry.findMany({
      where: { status: 'POSTED' },
      include: { lines: true },
    });

    assert(entries.length > 0, 'Posted journal entries exist in the database');

    for (const entry of entries) {
      const totalDebit = entry.lines.reduce((acc, l) => acc.add(l.debit), new Prisma.Decimal(0));
      const totalCredit = entry.lines.reduce((acc, l) => acc.add(l.credit), new Prisma.Decimal(0));
      assert(
        totalDebit.equals(totalCredit),
        `Journal entry ${entry.reference} is balanced (Debit ₹${totalDebit.toFixed(2)} === Credit ₹${totalCredit.toFixed(2)})`
      );
    }

    // 2. Foreign Key Integrity: Invoices to Customers & Lines
    const invoices = await prisma.invoice.findMany({
      include: { customer: true, lines: true, journalEntry: true, payments: true },
    });
    assert(invoices.length > 0, 'Invoices exist');
    for (const inv of invoices) {
      assert(inv.customer !== null, `Invoice ${inv.reference} linked to valid customer (${inv.customer.name})`);
      assert(inv.lines.length > 0, `Invoice ${inv.reference} has ${inv.lines.length} lines`);
      assert(inv.journalEntry !== null, `Invoice ${inv.reference} has traceable journal entry`);
      assert(inv.payments.length > 0, `Invoice ${inv.reference} has recorded payment`);
    }

    // 3. Foreign Key Integrity: Vendor Bills to Vendors & Lines
    const bills = await prisma.bill.findMany({
      include: { vendor: true, lines: true, journalEntry: true, payments: true },
    });
    assert(bills.length > 0, 'Bills exist');
    for (const b of bills) {
      assert(b.vendor !== null, `Bill ${b.reference} linked to valid vendor (${b.vendor.name})`);
      assert(b.lines.length > 0, `Bill ${b.reference} has ${b.lines.length} lines`);
      assert(b.journalEntry !== null, `Bill ${b.reference} has traceable journal entry`);
      assert(b.payments.length > 0, `Bill ${b.reference} has recorded payment`);
    }

    // 4. Budget to Analytic Account & Responsible User
    const budgets = await prisma.budget.findMany({
      include: { analyticAccount: true, responsibleUser: true },
    });
    assert(budgets.length > 0, 'Budgets exist');
    for (const b of budgets) {
      assert(b.analyticAccount !== null, `Budget ${b.name} linked to analytic account (${b.analyticAccount.name})`);
      assert(b.responsibleUser !== null, `Budget ${b.name} linked to responsible user (${b.responsibleUser.name})`);
    }

    // 5. Unique Email Constraint Test
    let duplicateRejected = false;
    try {
      await prisma.user.create({
        data: {
          name: 'Duplicate Test',
          email: 'admin@urbanfurniture.com', // Already exists
          passwordHash: 'dummy',
        },
      });
    } catch (e: any) {
      if (e.code === 'P2002') {
        duplicateRejected = true;
      }
    }
    assert(duplicateRejected, 'Unique constraint enforces rejection of duplicate email (P2002)');

    // 6. Trial Balance (Global Debit === Global Credit)
    const allLines = await prisma.journalEntryLine.findMany();
    const globalDebit = allLines.reduce((acc, l) => acc.add(l.debit), new Prisma.Decimal(0));
    const globalCredit = allLines.reduce((acc, l) => acc.add(l.credit), new Prisma.Decimal(0));
    assert(
      globalDebit.equals(globalCredit),
      `Global Ledger Balance: Total Debits (₹${globalDebit.toFixed(2)}) === Total Credits (₹${globalCredit.toFixed(2)})`
    );

    // 7. Report Derivation: P&L and Balance Sheet from accounting records
    const incomeLines = await prisma.journalEntryLine.findMany({
      where: { account: { type: 'INCOME' } },
    });
    const expenseLines = await prisma.journalEntryLine.findMany({
      where: { account: { type: 'EXPENSE' } },
    });
    const totalIncome = incomeLines.reduce((acc, l) => acc.add(l.credit.sub(l.debit)), new Prisma.Decimal(0));
    const totalExpense = expenseLines.reduce((acc, l) => acc.add(l.debit.sub(l.credit)), new Prisma.Decimal(0));
    const netProfit = totalIncome.sub(totalExpense);

    console.log(`\n  📊 Financial Summary Derived from Posted Entries:`);
    console.log(`     Total Revenue: ₹${totalIncome.toFixed(2)}`);
    console.log(`     Total Expense: ₹${totalExpense.toFixed(2)}`);
    console.log(`     Net Profit:    ₹${netProfit.toFixed(2)}`);

    assert(totalIncome.gt(0), 'Profit & Loss derived from journal lines: Income > 0');
    assert(totalExpense.gt(0), 'Profit & Loss derived from journal lines: Expense > 0');

    console.log(`\n=========================================`);
    console.log(`Verification Complete: ${passed} passed, ${failed} failed`);
    console.log(`=========================================\n`);

    if (failed > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error('Unexpected verification error:', err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runVerification();
