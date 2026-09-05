import apiClient from '@/lib/axios';

export interface AccountData {
  id: string;
  name: string;
  code: string;
  type: 'ASSET' | 'LIABILITY' | 'EXPENSE' | 'INCOME' | 'CAPITAL';
  debitBalance: number;
  creditBalance: number;
  balance: number;
  isActive: boolean;
}

export interface JournalData {
  id: string;
  name: string;
  type: 'SALES' | 'PURCHASE' | 'BANK' | 'CASH' | 'MISCELLANEOUS';
  isActive: boolean;
}

export interface JournalEntryData {
  id: string;
  journalId: string;
  journalName?: string;
  date: string;
  reference: string;
  sourceType?: string;
  sourceId?: string;
  status: 'DRAFT' | 'POSTED' | 'CANCELLED';
  lines: Array<{
    id?: string;
    accountId: string;
    accountName?: string;
    accountCode?: string;
    debit: number;
    credit: number;
    description?: string;
  }>;
  totalDebit: number;
  totalCredit: number;
}

export async function fetchChartOfAccounts() {
  const res = await apiClient.get<{ success: boolean; data: AccountData[] }>('/accounting/chart-of-accounts');
  return res.data.data;
}

export async function fetchJournals() {
  const res = await apiClient.get<{ success: boolean; data: JournalData[] }>('/accounting/journals');
  return res.data.data;
}

export async function fetchJournalEntries() {
  const res = await apiClient.get<{ success: boolean; data: JournalEntryData[] }>('/accounting/journal-entries');
  return res.data.data;
}

export async function createJournalEntry(data: {
  journalId: string;
  date: string;
  reference: string;
  lines: Array<{ accountId: string; debit: number; credit: number; description?: string }>;
}) {
  const res = await apiClient.post<{ success: boolean; data: JournalEntryData }>('/accounting/journal-entries', data);
  return res.data.data;
}

export async function fetchLedger(accountId?: string) {
  const res = await apiClient.get<{
    success: boolean;
    data: {
      account?: AccountData;
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
    };
  }>('/accounting/ledger', { params: { accountId } });
  return res.data.data;
}
