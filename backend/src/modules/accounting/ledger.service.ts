export interface AccountBalance {
  accountId: string;
  accountCode: string;
  accountName: string;
  debit: number;
  credit: number;
  balance: number;
}

export class LedgerService {
  /**
   * Retrieves trial balance or general ledger summary.
   */
  public async getAccountBalances(): Promise<AccountBalance[]> {
    // Stubbed for future phase
    return [];
  }
}

export const ledgerService = new LedgerService();
