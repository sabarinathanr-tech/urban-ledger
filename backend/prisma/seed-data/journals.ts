export interface SeedJournal {
  id: string;
  name: string;
  type: 'SALES' | 'PURCHASE' | 'BANK' | 'CASH' | 'MISCELLANEOUS';
  defaultDebitAccountCode?: string;
  defaultCreditAccountCode?: string;
}

export const seedJournals: SeedJournal[] = [
  {
    id: 'j1000000-0000-0000-0000-000000000001',
    name: 'Sales Journal',
    type: 'SALES',
    defaultDebitAccountCode: '1100', // Debtors
    defaultCreditAccountCode: '4000', // Sales Income
  },
  {
    id: 'j2000000-0000-0000-0000-000000000002',
    name: 'Purchase Journal',
    type: 'PURCHASE',
    defaultDebitAccountCode: '5000', // Purchases Expense
    defaultCreditAccountCode: '2000', // Creditors
  },
  {
    id: 'j3000000-0000-0000-0000-000000000003',
    name: 'Bank Journal',
    type: 'BANK',
    defaultDebitAccountCode: '1010', // Bank
    defaultCreditAccountCode: '1010', // Bank
  },
  {
    id: 'j4000000-0000-0000-0000-000000000004',
    name: 'Cash Journal',
    type: 'CASH',
    defaultDebitAccountCode: '1000', // Cash
    defaultCreditAccountCode: '1000', // Cash
  },
  {
    id: 'j5000000-0000-0000-0000-000000000005',
    name: 'Miscellaneous Journal',
    type: 'MISCELLANEOUS',
  },
];
