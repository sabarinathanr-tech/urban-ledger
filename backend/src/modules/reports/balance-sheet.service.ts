import { accountingService } from '../accounting/accounting.service.js';
import { profitLossService } from './profit-loss.service.js';

export interface BalanceSheetStatement {
  asOfDate: string;
  assets: {
    items: Array<{ name: string; amount: number }>;
    total: number;
  };
  liabilities: {
    items: Array<{ name: string; amount: number }>;
    total: number;
  };
  equity: {
    items: Array<{ name: string; amount: number }>;
    currentYearProfit: number;
    total: number;
  };
  totalLiabilitiesAndEquity: number;
  isBalanced: boolean;
}

export class BalanceSheetService {
  public async getStatement(): Promise<BalanceSheetStatement> {
    const accounts = await accountingService.getChartOfAccounts();
    const pnl = await profitLossService.getStatement();

    // Asset accounts
    const assetAccounts = accounts.filter((a) => a.type === 'ASSET');
    const assetItems = assetAccounts
      .map((a) => ({ name: a.name, amount: a.balance }))
      .filter((a) => a.amount !== 0);
    const totalAssets = assetItems.reduce((s, i) => s + i.amount, 0);

    // Liability accounts
    const liabilityAccounts = accounts.filter((a) => a.type === 'LIABILITY');
    const liabilityItems = liabilityAccounts
      .map((a) => ({ name: a.name, amount: a.balance }))
      .filter((a) => a.amount !== 0);
    const totalLiabilities = liabilityItems.reduce((s, i) => s + i.amount, 0);

    // Equity accounts
    const equityAccounts = accounts.filter((a) => a.type === 'CAPITAL');
    const equityItems = equityAccounts
      .map((a) => ({ name: a.name, amount: a.balance }))
      .filter((a) => a.amount !== 0);
    const totalCapital = equityItems.reduce((s, i) => s + i.amount, 0);

    const totalEquity = Number((totalCapital + pnl.netProfit).toFixed(2));
    const totalLiabilitiesAndEquity = Number((totalLiabilities + totalEquity).toFixed(2));
    const isBalanced = Math.abs(totalAssets - totalLiabilitiesAndEquity) < 1.0;

    return {
      asOfDate: new Date().toISOString().split('T')[0],
      assets: {
        items: assetItems,
        total: Number(totalAssets.toFixed(2)),
      },
      liabilities: {
        items: liabilityItems,
        total: Number(totalLiabilities.toFixed(2)),
      },
      equity: {
        items: equityItems,
        currentYearProfit: Number(pnl.netProfit.toFixed(2)),
        total: Number(totalEquity.toFixed(2)),
      },
      totalLiabilitiesAndEquity,
      isBalanced,
    };
  }
}

export const balanceSheetService = new BalanceSheetService();
