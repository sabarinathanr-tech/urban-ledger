import { BadRequestError } from '../../utils/errors.js';

export interface BudgetRecord {
  id: string;
  name: string;
  analyticAccount: string;
  plannedAmount: number;
  actualAmount: number;
  remainingAmount: number;
  utilization: number;
  status: 'HEALTHY' | 'WARNING' | 'EXCEEDED';
  startDate: string;
  endDate: string;
  responsibleUser: string;
}

const memoryBudgets = new Map<string, BudgetRecord>();

const initialBudgets: BudgetRecord[] = [
  {
    id: 'bgt-1',
    name: 'Timber & Raw Materials Procurement',
    analyticAccount: 'Cost of Goods Sold (Raw Materials)',
    plannedAmount: 800000,
    actualAmount: 512000,
    remainingAmount: 288000,
    utilization: 64,
    status: 'HEALTHY',
    startDate: '2026-04-01',
    endDate: '2026-09-30',
    responsibleUser: 'Mohith (Lead Accountant)',
  },
  {
    id: 'bgt-2',
    name: 'Showroom Marketing & Digital Reach',
    analyticAccount: 'Marketing & Brand Expense',
    plannedAmount: 300000,
    actualAmount: 261000,
    remainingAmount: 39000,
    utilization: 87,
    status: 'WARNING',
    startDate: '2026-04-01',
    endDate: '2026-09-30',
    responsibleUser: 'Rohith (Admin)',
  },
  {
    id: 'bgt-3',
    name: 'Workshop Tools & Maintenance',
    analyticAccount: 'Factory & Tool Depreciation',
    plannedAmount: 200000,
    actualAmount: 215000,
    remainingAmount: -15000,
    utilization: 107.5,
    status: 'EXCEEDED',
    startDate: '2026-04-01',
    endDate: '2026-09-30',
    responsibleUser: 'Admin User',
  },
];

initialBudgets.forEach((b) => memoryBudgets.set(b.id, b));

export class BudgetService {
  public async listBudgets(): Promise<BudgetRecord[]> {
    return Array.from(memoryBudgets.values());
  }

  public async createBudget(input: {
    name: string;
    analyticAccount: string;
    plannedAmount: number;
    startDate: string;
    endDate: string;
    responsibleUser?: string;
  }): Promise<BudgetRecord> {
    if (!input.name || input.plannedAmount <= 0) {
      throw new BadRequestError('Name and a positive planned amount are required');
    }

    const id = `bgt_${Date.now()}`;
    const planned = Number(input.plannedAmount);
    const newBudget: BudgetRecord = {
      id,
      name: input.name.trim(),
      analyticAccount: input.analyticAccount.trim(),
      plannedAmount: planned,
      actualAmount: 0,
      remainingAmount: planned,
      utilization: 0,
      status: 'HEALTHY',
      startDate: input.startDate,
      endDate: input.endDate,
      responsibleUser: input.responsibleUser || 'Admin User',
    };

    memoryBudgets.set(id, newBudget);
    return newBudget;
  }
}

export const budgetService = new BudgetService();
export { memoryBudgets };
