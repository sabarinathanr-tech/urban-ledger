export interface SeedAnalyticAccount {
  id: string;
  name: string;
  type: 'INCOME' | 'EXPENSES';
}

export interface SeedBudget {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  plannedAmount: string;
  analyticAccountName: string;
  responsibleUserEmail: string;
}

export const seedAnalyticAccounts: SeedAnalyticAccount[] = [
  {
    id: 'aa100000-0000-0000-0000-000000000001',
    name: 'Furniture Procurement',
    type: 'EXPENSES',
  },
  {
    id: 'aa200000-0000-0000-0000-000000000002',
    name: 'Showroom Operations',
    type: 'EXPENSES',
  },
  {
    id: 'aa300000-0000-0000-0000-000000000003',
    name: 'Retail Furniture Sales',
    type: 'INCOME',
  },
];

export const seedBudgets: SeedBudget[] = [
  {
    id: 'b1000000-0000-0000-0000-000000000001',
    name: 'Q1 Furniture Procurement Budget',
    startDate: '2026-01-01T00:00:00.000Z',
    endDate: '2026-03-31T23:59:59.999Z',
    plannedAmount: '150000.00',
    analyticAccountName: 'Furniture Procurement',
    responsibleUserEmail: 'admin@urbanfurniture.com',
  },
];
