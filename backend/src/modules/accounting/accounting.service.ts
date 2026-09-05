/**
 * Urban Ledger - Accounting Service Boundary
 * Central entry point for all accounting operations triggered by sales, purchases, and payments.
 * Planned for full ERP implementation following foundation milestone.
 */

export interface JournalEntryLineDraft {
  accountId: string;
  partnerId?: string;
  debit: number;
  credit: number;
  description?: string;
  analyticAccountId?: string;
}

export interface JournalEntryDraft {
  journalId: string;
  date: Date;
  reference: string;
  lines: JournalEntryLineDraft[];
}

export class AccountingService {
  /**
   * Generates journal entries from confirmed customer invoices.
   * Sales -> Invoice -> AccountingService -> Journal Entry -> General Ledger
   */
  public async createInvoiceEntry(invoiceId: string): Promise<string> {
    // Stubbed for future accounting module implementation
    return `entry_inv_${invoiceId}`;
  }

  /**
   * Generates journal entries from confirmed vendor bills.
   * Purchase -> Bill -> AccountingService -> Journal Entry -> General Ledger
   */
  public async createBillEntry(billId: string): Promise<string> {
    // Stubbed for future accounting module implementation
    return `entry_bill_${billId}`;
  }

  /**
   * Generates journal entries from customer/vendor payments and reconciles invoices.
   */
  public async createPaymentEntry(paymentId: string): Promise<string> {
    // Stubbed for future accounting module implementation
    return `entry_pay_${paymentId}`;
  }
}

export const accountingService = new AccountingService();
