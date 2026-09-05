import { Prisma } from '@prisma/client';
import { prisma, isDatabaseAvailable } from '../../config/db.js';
import { BadRequestError } from '../../utils/errors.js';
import { logger } from '../../utils/logger.js';

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

function mapPrismaBudgetToRecord(b: any): BudgetRecord {
  const planned = Number(b.plannedAmount);
  // Calculate actual expenses logged under this analytic account
  let actual = 0;
  if (b.analyticAccount?.journalLines) {
    for (const line of b.analyticAccount.journalLines) {
      actual += Number(line.debit);
    }
  }
  const remaining = planned - actual;
  const utilization = planned > 0 ? Number(((actual / planned) * 100).toFixed(1)) : 0;
  let status: 'HEALTHY' | 'WARNING' | 'EXCEEDED' = 'HEALTHY';
  if (utilization > 100) status = 'EXCEEDED';
  else if (utilization >= 80) status = 'WARNING';

  return {
    id: b.id,
    name: b.name,
    analyticAccount: b.analyticAccount?.name || 'General Analytic',
    plannedAmount: planned,
    actualAmount: Number(actual.toFixed(2)),
    remainingAmount: Number(remaining.toFixed(2)),
    utilization,
    status,
    startDate: b.startDate instanceof Date ? b.startDate.toISOString().split('T')[0] : String(b.startDate).split('T')[0],
    endDate: b.endDate instanceof Date ? b.endDate.toISOString().split('T')[0] : String(b.endDate).split('T')[0],
    responsibleUser: b.responsibleUser?.name || 'Lead Accountant',
  };
}

export class BudgetService {
  public async listBudgets(): Promise<BudgetRecord[]> {
    if (isDatabaseAvailable()) {
      try {
        const dbBudgets = await prisma.budget.findMany({
          include: {
            analyticAccount: { include: { journalLines: true } },
            responsibleUser: true,
          },
          orderBy: { startDate: 'desc' },
        });

        if (dbBudgets.length > 0) {
          return dbBudgets.map(mapPrismaBudgetToRecord);
        }
      } catch (err) {
        logger.warn('Failed to query budgets from Prisma, falling back to memory', err);
      }
    }

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

    if (isDatabaseAvailable()) {
      try {
        // Resolve or create analytic account
        let analytic = await prisma.analyticAccount.findFirst({
          where: { name: { equals: input.analyticAccount.trim(), mode: 'insensitive' } },
        });
        if (!analytic) {
          analytic = await prisma.analyticAccount.create({
            data: {
              name: input.analyticAccount.trim(),
              type: 'EXPENSES',
            },
          });
        }

        // Resolve responsible user
        const user = await prisma.user.findFirst({
          where: { role: { in: ['ADMIN', 'ACCOUNTANT'] } },
        });

        if (user && analytic) {
          const created = await prisma.budget.create({
            data: {
              name: input.name.trim(),
              plannedAmount: new Prisma.Decimal(planned),
              startDate: new Date(input.startDate),
              endDate: new Date(input.endDate),
              analyticAccountId: analytic.id,
              responsibleUserId: user.id,
            },
            include: {
              analyticAccount: { include: { journalLines: true } },
              responsibleUser: true,
            },
          });

          const mapped = mapPrismaBudgetToRecord(created);
          memoryBudgets.set(created.id, mapped);
          return mapped;
        }
      } catch (err) {
        logger.warn('Failed to persist budget to Prisma, falling back to memory', err);
      }
    }

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
