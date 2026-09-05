export interface SeedAccount {
  id: string;
  name: string;
  code: string;
  type: 'ASSET' | 'LIABILITY' | 'EXPENSE' | 'INCOME' | 'CAPITAL';
}

export const seedAccounts: SeedAccount[] = [
  {
    id: 'a1000000-0000-0000-0000-000000001000',
    name: 'Cash',
    code: '1000',
    type: 'ASSET',
  },
  {
    id: 'a1010000-0000-0000-0000-000000001010',
    name: 'Bank',
    code: '1010',
    type: 'ASSET',
  },
  {
    id: 'a1100000-0000-0000-0000-000000001100',
    name: 'Debtors',
    code: '1100',
    type: 'ASSET',
  },
  {
    id: 'a2000000-0000-0000-0000-000000002000',
    name: 'Creditors',
    code: '2000',
    type: 'LIABILITY',
  },
  {
    id: 'a3000000-0000-0000-0000-000000003000',
    name: 'Owner Capital',
    code: '3000',
    type: 'CAPITAL',
  },
  {
    id: 'a4000000-0000-0000-0000-000000004000',
    name: 'Sales Income',
    code: '4000',
    type: 'INCOME',
  },
  {
    id: 'a5000000-0000-0000-0000-000000005000',
    name: 'Purchases Expense',
    code: '5000',
    type: 'EXPENSE',
  },
];
