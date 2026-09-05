import type { JournalEntryDraft } from './accounting.service.js';

export class PostingService {
  /**
   * Validates that total debits equal total credits before posting to general ledger.
   */
  public validateBalance(draft: JournalEntryDraft): boolean {
    const totalDebit = draft.lines.reduce((sum, line) => sum + line.debit, 0);
    const totalCredit = draft.lines.reduce((sum, line) => sum + line.credit, 0);
    const difference = Math.abs(totalDebit - totalCredit);
    return difference < 0.0001;
  }

  /**
   * Posts a validated journal entry to the permanent ledger.
   */
  public async postEntry(entryId: string): Promise<boolean> {
    // Stubbed for future phase
    return true;
  }
}

export const postingService = new PostingService();
