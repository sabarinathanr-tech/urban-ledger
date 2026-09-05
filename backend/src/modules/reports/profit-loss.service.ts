import { accountingService } from '../accounting/accounting.service.js';

export interface ProfitLossStatement {
  period: string;
  revenue: {
    items: Array<{ name: string; amount: number }>;
    total: number;
  };
  cogs: {
    items: Array<{ name: string; amount: number }>;
    total: number;
  };
  grossProfit: number;
  operatingExpenses: {
    items: Array<{ name: string; amount: number }>;
    total: number;
  };
  netProfit: number;
}

export class ProfitLossService {
  public async getStatement(): Promise<ProfitLossStatement> {
    const accounts = await accountingService.getChartOfAccounts();

    // Income accounts (Code 4xxx)
    const incomeAccounts = accounts.filter((a) => a.type === 'INCOME');
    const revenueItems = incomeAccounts.map((a) => ({
      name: a.name,
      amount: Math.abs(a.balance),
    }));
    const totalRevenue = revenueItems.reduce((s, i) => s + i.amount, 0);

    // COGS (Purchases, Code 5xxx)
    const cogsAccounts = accounts.filter((a) => a.code.startsWith('5'));
    const cogsItems = cogsAccounts.map((a) => ({
      name: a.name,
      amount: Math.abs(a.balance),
    }));
    const totalCogs = cogsItems.reduce((s, i) => s + i.amount, 0);

    const grossProfit = totalRevenue - totalCogs;

    // Operating expenses (Code 6xxx or other EXPENSE)
    const opExpAccounts = accounts.filter(
      (a) => a.type === 'EXPENSE' && !a.code.startsWith('5')
    );
    const expItems = opExpAccounts.map((a) => ({
      name: a.name,
      amount: Math.abs(a.balance),
    }));
    const totalOperatingExpenses = expItems.reduce((s, i) => s + i.amount, 0);

    const netProfit = grossProfit - totalOperatingExpenses;

    return {
      period: 'FY 2026-2027 (Year to Date)',
      revenue: {
        items: revenueItems,
        total: Number(totalRevenue.toFixed(2)),
      },
      cogs: {
        items: cogsItems,
        total: Number(totalCogs.toFixed(2)),
      },
      grossProfit: Number(grossProfit.toFixed(2)),
      operatingExpenses: {
        items: expItems,
        total: Number(totalOperatingExpenses.toFixed(2)),
      },
      netProfit: Number(netProfit.toFixed(2)),
    };
  }
}

export const profitLossService = new ProfitLossService();
