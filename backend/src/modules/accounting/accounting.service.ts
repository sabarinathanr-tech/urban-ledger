import { Prisma } from '@prisma/client';
import { prisma, isDatabaseAvailable } from '../../config/db.js';
import { seedAccounts } from '../../../prisma/seed-data/accounts.js';
import { seedJournals } from '../../../prisma/seed-data/journals.js';
import { BadRequestError, NotFoundError } from '../../utils/errors.js';
import { logger } from '../../utils/logger.js';

export interface AccountRecord {
  id: string;
  name: string;
  code: string;
  type: 'ASSET' | 'LIABILITY' | 'EXPENSE' | 'INCOME' | 'CAPITAL';
  isActive: boolean;
  debitBalance: number;
  creditBalance: number;
  balance: number; // Net balance
}

export interface JournalRecord {
  id: string;
  name: string;
  type: 'SALES' | 'PURCHASE' | 'BANK' | 'CASH' | 'MISCELLANEOUS';
  defaultDebitAccountId?: string;
  defaultCreditAccountId?: string;
  isActive: boolean;
}

export interface JournalEntryLineDraft {
  id?: string;
  accountId: string;
  accountName?: string;
  accountCode?: string;
  debit: number;
  credit: number;
  description?: string;
  analyticAccountId?: string;
}

export interface JournalEntryDraft {
  journalId: string;
  date: string;
  reference: string;
  lines: JournalEntryLineDraft[];
}

export interface JournalEntryRecord {
  id: string;
  journalId: string;
  journalName?: string;
  date: string;
  reference: string;
  sourceType?: string;
  sourceId?: string;
  status: 'DRAFT' | 'POSTED' | 'CANCELLED';
  lines: JournalEntryLineDraft[];
  totalDebit: number;
  totalCredit: number;
  createdAt: Date;
}

// In-Memory Storage & Seed Initializer
const memoryAccounts = new Map<string, AccountRecord>();
const memoryJournals = new Map<string, JournalRecord>();
const memoryEntries = new Map<string, JournalEntryRecord>();

// Seed Chart of Accounts
seedAccounts.forEach((a) => {
  memoryAccounts.set(a.id, {
    id: a.id,
    name: a.name,
    code: a.code,
    type: a.type,
    isActive: true,
    debitBalance: 0,
    creditBalance: 0,
    balance: 0,
  });
});

// Seed additional standard accounts if missing
const gstAccountId = 'a2002000-0000-0000-0000-000000002002';
if (!memoryAccounts.has(gstAccountId)) {
  memoryAccounts.set(gstAccountId, {
    id: gstAccountId,
    name: 'GST Tax Payable / Input',
    code: '2002',
    type: 'LIABILITY',
    isActive: true,
    debitBalance: 0,
    creditBalance: 0,
    balance: 0,
  });
}

// Seed Journals
seedJournals.forEach((j) => {
  memoryJournals.set(j.id, {
    id: j.id,
    name: j.name,
    type: j.type,
    defaultDebitAccountId: j.defaultDebitAccountCode
      ? Array.from(memoryAccounts.values()).find((a) => a.code === j.defaultDebitAccountCode)?.id
      : undefined,
    defaultCreditAccountId: j.defaultCreditAccountCode
      ? Array.from(memoryAccounts.values()).find((a) => a.code === j.defaultCreditAccountCode)?.id
      : undefined,
    isActive: true,
  });
});

// Seed Initial Journal Entries to demonstrate double-entry balance
const salesJournal = Array.from(memoryJournals.values()).find((j) => j.type === 'SALES') || Array.from(memoryJournals.values())[0];
const cashJournal = Array.from(memoryJournals.values()).find((j) => j.type === 'CASH') || salesJournal;
const bankJournal = Array.from(memoryJournals.values()).find((j) => j.type === 'BANK') || salesJournal;

const debtorsAcc = Array.from(memoryAccounts.values()).find((a) => a.code === '1100') || Array.from(memoryAccounts.values())[0];
const salesAcc = Array.from(memoryAccounts.values()).find((a) => a.code === '4000') || Array.from(memoryAccounts.values())[1];
const bankAcc = Array.from(memoryAccounts.values()).find((a) => a.code === '1010') || Array.from(memoryAccounts.values())[0];
const gstAcc = memoryAccounts.get(gstAccountId) || salesAcc;

// Seed Entry 1: Confirmed Sale Invoice (Balanced: 125,000)
const initialEntry1: JournalEntryRecord = {
  id: 'ent_seed_001',
  journalId: salesJournal.id,
  journalName: salesJournal.name,
  date: '2026-09-02',
  reference: 'JRN/2026/0001',
  sourceType: 'INVOICE',
  sourceId: 'INV-2026-0042',
  status: 'POSTED',
  lines: [
    {
      id: 'l_001',
      accountId: debtorsAcc.id,
      accountName: debtorsAcc.name,
      accountCode: debtorsAcc.code,
      debit: 125000,
      credit: 0,
      description: 'Customer Invoice INV-2026-0042: Prestige Living',
    },
    {
      id: 'l_002',
      accountId: salesAcc.id,
      accountName: salesAcc.name,
      accountCode: salesAcc.code,
      debit: 0,
      credit: 105932.2,
      description: 'Sales Revenue',
    },
    {
      id: 'l_003',
      accountId: gstAcc.id,
      accountName: gstAcc.name,
      accountCode: gstAcc.code,
      debit: 0,
      credit: 19067.8,
      description: '18% GST Output Tax',
    },
  ],
  totalDebit: 125000,
  totalCredit: 125000,
  createdAt: new Date('2026-09-02T10:00:00Z'),
};

// Seed Entry 2: Payment Received (Balanced: 45,000)
const initialEntry2: JournalEntryRecord = {
  id: 'ent_seed_002',
  journalId: bankJournal.id,
  journalName: bankJournal.name,
  date: '2026-09-03',
  reference: 'JRN/2026/0002',
  sourceType: 'PAYMENT',
  sourceId: 'PAY-2026-0031',
  status: 'POSTED',
  lines: [
    {
      id: 'l_004',
      accountId: bankAcc.id,
      accountName: bankAcc.name,
      accountCode: bankAcc.code,
      debit: 45000,
      credit: 0,
      description: 'Bank Inward: Modern Living Spaces',
    },
    {
      id: 'l_005',
      accountId: debtorsAcc.id,
      accountName: debtorsAcc.name,
      accountCode: debtorsAcc.code,
      debit: 0,
      credit: 45000,
      description: 'Settlement against Receivables',
    },
  ],
  totalDebit: 45000,
  totalCredit: 45000,
  createdAt: new Date('2026-09-03T11:30:00Z'),
};

memoryEntries.set(initialEntry1.id, initialEntry1);
memoryEntries.set(initialEntry2.id, initialEntry2);

export class AccountingService {
  /**
   * Recalculate running account balances from all posted journal entries
   */
  private recalculateBalances(): void {
    // Reset balances
    for (const acc of memoryAccounts.values()) {
      acc.debitBalance = 0;
      acc.creditBalance = 0;
      acc.balance = 0;
    }

    // Accumulate debits and credits from all POSTED entries
    for (const entry of memoryEntries.values()) {
      if (entry.status !== 'POSTED') continue;
      for (const line of entry.lines) {
        const acc = memoryAccounts.get(line.accountId);
        if (acc) {
          acc.debitBalance += Number(line.debit || 0);
          acc.creditBalance += Number(line.credit || 0);
        }
      }
    }

    // Compute net balance based on account type
    for (const acc of memoryAccounts.values()) {
      if (acc.type === 'ASSET' || acc.type === 'EXPENSE') {
        acc.balance = acc.debitBalance - acc.creditBalance;
      } else {
        acc.balance = acc.creditBalance - acc.debitBalance;
      }
    }
  }

  public async getChartOfAccounts(): Promise<AccountRecord[]> {
    if (isDatabaseAvailable()) {
      try {
        const dbAccounts = await prisma.account.findMany({
          include: {
            journalLines: {
              include: { journalEntry: true },
            },
          },
          orderBy: { code: 'asc' },
        });

        if (dbAccounts.length > 0) {
          return dbAccounts.map((a) => {
            let debitBalance = 0;
            let creditBalance = 0;
            for (const line of a.journalLines) {
              if (line.journalEntry.status === 'POSTED') {
                debitBalance += Number(line.debit);
                creditBalance += Number(line.credit);
              }
            }
            const balance =
              a.type === 'ASSET' || a.type === 'EXPENSE'
                ? debitBalance - creditBalance
                : creditBalance - debitBalance;

            return {
              id: a.id,
              name: a.name,
              code: a.code,
              type: a.type,
              isActive: a.isActive,
              debitBalance: Number(debitBalance.toFixed(2)),
              creditBalance: Number(creditBalance.toFixed(2)),
              balance: Number(balance.toFixed(2)),
            };
          });
        }
      } catch (err) {
        logger.warn('Failed to query accounts from Prisma, falling back to memory', err);
      }
    }

    this.recalculateBalances();
    return Array.from(memoryAccounts.values()).sort((a, b) => a.code.localeCompare(b.code));
  }

  public async getJournals(): Promise<JournalRecord[]> {
    if (isDatabaseAvailable()) {
      try {
        const dbJournals = await prisma.journal.findMany({
          where: { isActive: true },
          orderBy: { name: 'asc' },
        });
        if (dbJournals.length > 0) {
          return dbJournals.map((j) => ({
            id: j.id,
            name: j.name,
            type: j.type,
            defaultDebitAccountId: j.defaultDebitAccountId || undefined,
            defaultCreditAccountId: j.defaultCreditAccountId || undefined,
            isActive: j.isActive,
          }));
        }
      } catch (err) {
        logger.warn('Failed to query journals from Prisma, falling back to memory', err);
      }
    }

    return Array.from(memoryJournals.values());
  }

  public async getJournalEntries(): Promise<JournalEntryRecord[]> {
    if (isDatabaseAvailable()) {
      try {
        const entries = await prisma.journalEntry.findMany({
          include: {
            journal: true,
            lines: { include: { account: true } },
          },
          orderBy: { date: 'desc' },
        });
        if (entries.length > 0) {
          return entries.map((e) => {
            const mappedLines: JournalEntryLineDraft[] = e.lines.map((l) => ({
              id: l.id,
              accountId: l.accountId,
              accountName: l.account?.name || 'Account',
              accountCode: l.account?.code || '',
              debit: Number(l.debit),
              credit: Number(l.credit),
              description: l.description || undefined,
              analyticAccountId: l.analyticAccountId || undefined,
            }));
            const totalDebit = Number(mappedLines.reduce((s, l) => s + l.debit, 0).toFixed(2));
            const totalCredit = Number(mappedLines.reduce((s, l) => s + l.credit, 0).toFixed(2));
            return {
              id: e.id,
              journalId: e.journalId,
              journalName: e.journal?.name || 'General Journal',
              date: e.date instanceof Date ? e.date.toISOString().split('T')[0] : String(e.date).split('T')[0],
              reference: e.reference,
              sourceType: e.sourceType || undefined,
              sourceId: e.sourceId || undefined,
              status: e.status,
              lines: mappedLines,
              totalDebit,
              totalCredit,
              createdAt: e.createdAt,
            };
          });
        }
      } catch (err) {
        logger.warn('Failed to query journal entries from Prisma, falling back to memory', err);
      }
    }

    return Array.from(memoryEntries.values()).sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  /**
   * Post a validated, double-entry balanced journal entry.
   * STRICT DOUBLE-ENTRY EQUALITY: Total Debits must exactly equal Total Credits!
   */
  public async createJournalEntry(input: {
    journalId: string;
    date: string;
    reference: string;
    lines: JournalEntryLineDraft[];
    sourceType?: string;
    sourceId?: string;
  }): Promise<JournalEntryRecord> {
    if (!input.lines || input.lines.length < 2) {
      throw new BadRequestError('A journal entry must contain at least 2 lines (Double Entry rule).');
    }

    const totalDebit = Number(input.lines.reduce((s, l) => s + Number(l.debit || 0), 0).toFixed(2));
    const totalCredit = Number(input.lines.reduce((s, l) => s + Number(l.credit || 0), 0).toFixed(2));

    const diff = Math.abs(totalDebit - totalCredit);
    if (diff > 0.01) {
      throw new BadRequestError(
        `Unbalanced Journal Entry! Total Debits (₹${totalDebit.toFixed(
          2
        )}) must equal Total Credits (₹${totalCredit.toFixed(2)}). Discrepancy: ₹${diff.toFixed(2)}.`
      );
    }

    const journal = memoryJournals.get(input.journalId) || Array.from(memoryJournals.values())[0];

    // Enrich line items with account info
    const enrichedLines = input.lines.map((l, idx) => {
      const acc = memoryAccounts.get(l.accountId);
      return {
        id: l.id || `line_${Date.now()}_${idx}`,
        accountId: l.accountId,
        accountName: acc ? acc.name : 'Unknown Account',
        accountCode: acc ? acc.code : '',
        debit: Number(l.debit || 0),
        credit: Number(l.credit || 0),
        description: l.description || '',
        analyticAccountId: l.analyticAccountId,
      };
    });

    const id = `ent_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newEntry: JournalEntryRecord = {
      id,
      journalId: journal.id,
      journalName: journal.name,
      date: input.date,
      reference: input.reference,
      sourceType: input.sourceType,
      sourceId: input.sourceId,
      status: 'POSTED',
      lines: enrichedLines,
      totalDebit,
      totalCredit,
      createdAt: new Date(),
    };

    if (isDatabaseAvailable()) {
      try {
        const dbJournal = await prisma.journal.findFirst({
          where: { OR: [{ id: input.journalId }, { type: (journal.type as any) }] },
        });

        const dbAccounts = await prisma.account.findMany();
        const accountByCode = new Map(dbAccounts.map((a) => [a.code, a.id]));
        const accountById = new Map(dbAccounts.map((a) => [a.id, a.id]));

        const linesToCreate = input.lines.map((l) => {
          const accMem = memoryAccounts.get(l.accountId);
          const resolvedAccountId =
            accountById.get(l.accountId) ||
            (accMem ? accountByCode.get(accMem.code) : undefined) ||
            dbAccounts[0]?.id;

          return {
            accountId: resolvedAccountId!,
            description: l.description || '',
            debit: new Prisma.Decimal(l.debit || 0),
            credit: new Prisma.Decimal(l.credit || 0),
            analyticAccountId: l.analyticAccountId || undefined,
          };
        });

        const created = await prisma.journalEntry.create({
          data: {
            journalId: dbJournal?.id || input.journalId,
            date: new Date(input.date),
            reference: input.reference,
            sourceType: input.sourceType,
            sourceId: input.sourceId,
            status: 'POSTED',
            lines: {
              create: linesToCreate,
            },
          },
        });
        newEntry.id = created.id;
      } catch (err) {
        logger.warn('Failed to persist journal entry to Prisma, falling back to memory', err);
      }
    }

    memoryEntries.set(newEntry.id, newEntry);
    this.recalculateBalances();

    return newEntry;
  }

  /**
   * General Ledger: filter and chronological itemized ledger with running balance
   */
  public async getLedger(accountId?: string): Promise<{
    account?: AccountRecord;
    entries: Array<{
      id: string;
      date: string;
      reference: string;
      description: string;
      debit: number;
      credit: number;
      runningBalance: number;
    }>;
    totalDebit: number;
    totalCredit: number;
    closingBalance: number;
  }> {
    this.recalculateBalances();
    const targetAccount = accountId ? memoryAccounts.get(accountId) : undefined;

    const ledgerRows: Array<{
      id: string;
      date: string;
      reference: string;
      description: string;
      debit: number;
      credit: number;
      runningBalance: number;
    }> = [];

    const sortedEntries = Array.from(memoryEntries.values())
      .filter((e) => e.status === 'POSTED')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    let running = 0;
    let totalDebit = 0;
    let totalCredit = 0;

    for (const entry of sortedEntries) {
      for (const line of entry.lines) {
        if (!accountId || line.accountId === accountId) {
          totalDebit += line.debit;
          totalCredit += line.credit;

          if (targetAccount?.type === 'ASSET' || targetAccount?.type === 'EXPENSE') {
            running += line.debit - line.credit;
          } else {
            running += line.credit - line.debit;
          }

          ledgerRows.push({
            id: `${entry.id}_${line.id}`,
            date: entry.date,
            reference: entry.reference,
            description: line.description || `${line.accountName}`,
            debit: line.debit,
            credit: line.credit,
            runningBalance: Number(running.toFixed(2)),
          });
        }
      }
    }

    return {
      account: targetAccount,
      entries: ledgerRows.reverse(), // most recent first
      totalDebit: Number(totalDebit.toFixed(2)),
      totalCredit: Number(totalCredit.toFixed(2)),
      closingBalance: Number(running.toFixed(2)),
    };
  }

  /**
   * Automatically generate and post double-entry voucher from confirmed Invoice
   */
  public async createInvoiceEntry(invoice: {
    id: string;
    invoiceNumber: string;
    customerName: string;
    subtotal: number;
    taxTotal: number;
    grandTotal: number;
    issueDate: string;
  }): Promise<JournalEntryRecord> {
    const sJournal = Array.from(memoryJournals.values()).find((j) => j.type === 'SALES') || Array.from(memoryJournals.values())[0];
    const debtors = Array.from(memoryAccounts.values()).find((a) => a.code === '1100') || Array.from(memoryAccounts.values())[0];
    const sales = Array.from(memoryAccounts.values()).find((a) => a.code === '4000') || Array.from(memoryAccounts.values())[1];
    const gst = memoryAccounts.get(gstAccountId) || sales;

    return this.createJournalEntry({
      journalId: sJournal.id,
      date: invoice.issueDate,
      reference: `INV-POST-${invoice.invoiceNumber}`,
      sourceType: 'CUSTOMER_INVOICE',
      sourceId: invoice.id,
      lines: [
        {
          accountId: debtors.id,
          debit: invoice.grandTotal,
          credit: 0,
          description: `Accounts Receivable: ${invoice.customerName} (${invoice.invoiceNumber})`,
        },
        {
          accountId: sales.id,
          debit: 0,
          credit: invoice.subtotal,
          description: `Sales Income (${invoice.invoiceNumber})`,
        },
        {
          accountId: gst.id,
          debit: 0,
          credit: invoice.taxTotal,
          description: `18% GST Output Tax (${invoice.invoiceNumber})`,
        },
      ],
    });
  }

  /**
   * Automatically generate and post double-entry voucher from confirmed Vendor Bill
   */
  public async createBillEntry(bill: {
    id: string;
    billNumber: string;
    vendorName: string;
    subtotal: number;
    taxTotal: number;
    grandTotal: number;
    billDate: string;
  }): Promise<JournalEntryRecord> {
    const pJournal = Array.from(memoryJournals.values()).find((j) => j.type === 'PURCHASE') || Array.from(memoryJournals.values())[0];
    const creditors = Array.from(memoryAccounts.values()).find((a) => a.code === '2000') || Array.from(memoryAccounts.values())[0];
    const purchases = Array.from(memoryAccounts.values()).find((a) => a.code === '5000') || Array.from(memoryAccounts.values())[1];
    const gst = memoryAccounts.get(gstAccountId) || purchases;

    return this.createJournalEntry({
      journalId: pJournal.id,
      date: bill.billDate,
      reference: `BILL-POST-${bill.billNumber}`,
      sourceType: 'VENDOR_BILL',
      sourceId: bill.id,
      lines: [
        {
          accountId: purchases.id,
          debit: bill.subtotal,
          credit: 0,
          description: `Cost of Goods Sold / Purchases: ${bill.vendorName} (${bill.billNumber})`,
        },
        {
          accountId: gst.id,
          debit: bill.taxTotal,
          credit: 0,
          description: `18% GST Input Tax Credit (${bill.billNumber})`,
        },
        {
          accountId: creditors.id,
          debit: 0,
          credit: bill.grandTotal,
          description: `Accounts Payable: ${bill.vendorName} (${bill.billNumber})`,
        },
      ],
    });
  }

  /**
   * Automatically generate and post double-entry voucher from Payment receipt/settlement
   */
  public async createPaymentEntry(payment: {
    id: string;
    paymentNumber: string;
    type: 'CUSTOMER_PAYMENT' | 'VENDOR_PAYMENT';
    contactName: string;
    amount: number;
    method: 'CASH' | 'BANK';
    paymentDate: string;
    referenceDoc?: string;
  }): Promise<JournalEntryRecord> {
    const isBank = payment.method === 'BANK';
    const journalType = isBank ? 'BANK' : 'CASH';
    const journal = Array.from(memoryJournals.values()).find((j) => j.type === journalType) || Array.from(memoryJournals.values())[0];

    const bankOrCash = Array.from(memoryAccounts.values()).find((a) => a.code === (isBank ? '1010' : '1000')) || Array.from(memoryAccounts.values())[0];
    const debtors = Array.from(memoryAccounts.values()).find((a) => a.code === '1100') || Array.from(memoryAccounts.values())[0];
    const creditors = Array.from(memoryAccounts.values()).find((a) => a.code === '2000') || Array.from(memoryAccounts.values())[0];

    if (payment.type === 'CUSTOMER_PAYMENT') {
      // Receipt: Dr Bank/Cash, Cr Debtors
      return this.createJournalEntry({
        journalId: journal.id,
        date: payment.paymentDate,
        reference: `PAY-REC-${payment.paymentNumber}`,
        sourceType: 'PAYMENT',
        sourceId: payment.id,
        lines: [
          {
            accountId: bankOrCash.id,
            debit: payment.amount,
            credit: 0,
            description: `Payment received from ${payment.contactName} (${payment.referenceDoc || payment.paymentNumber})`,
          },
          {
            accountId: debtors.id,
            debit: 0,
            credit: payment.amount,
            description: `Settlement against Receivables (${payment.contactName})`,
          },
        ],
      });
    } else {
      // Disbursement: Dr Creditors, Cr Bank/Cash
      return this.createJournalEntry({
        journalId: journal.id,
        date: payment.paymentDate,
        reference: `PAY-DISB-${payment.paymentNumber}`,
        sourceType: 'PAYMENT',
        sourceId: payment.id,
        lines: [
          {
            accountId: creditors.id,
            debit: payment.amount,
            credit: 0,
            description: `Payment to supplier ${payment.contactName} (${payment.referenceDoc || payment.paymentNumber})`,
          },
          {
            accountId: bankOrCash.id,
            debit: 0,
            credit: payment.amount,
            description: `Disbursement from ${isBank ? 'Bank Account' : 'Cash Register'}`,
          },
        ],
      });
    }
  }
}

export const accountingService = new AccountingService();
export { memoryAccounts, memoryJournals, memoryEntries };
