import type { Request, Response, NextFunction } from 'express';
import { dashboardService } from './dashboard.service.js';
import { sendSuccess } from '../../utils/response.js';
import type { RevenueExpenseQuery, RecentTransactionsQuery } from './dashboard.schema.js';

export class DashboardController {
  public async getSummary(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await dashboardService.getSummary();
      sendSuccess(res, 'Dashboard summary retrieved successfully', data, 200);
    } catch (error) {
      next(error);
    }
  }

  public async getRevenueExpenseTrend(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await dashboardService.getRevenueExpenseTrend(req.query as unknown as RevenueExpenseQuery);
      sendSuccess(res, 'Revenue and expense trend retrieved successfully', data, 200);
    } catch (error) {
      next(error);
    }
  }

  public async getBudgetHealth(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await dashboardService.getBudgetHealth();
      sendSuccess(res, 'Budget health metrics retrieved successfully', data, 200);
    } catch (error) {
      next(error);
    }
  }

  public async getReceivables(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await dashboardService.getReceivablesSummary();
      sendSuccess(res, 'Receivables summary retrieved successfully', data, 200);
    } catch (error) {
      next(error);
    }
  }

  public async getPayables(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await dashboardService.getPayablesSummary();
      sendSuccess(res, 'Payables summary retrieved successfully', data, 200);
    } catch (error) {
      next(error);
    }
  }

  public async getAccountingHealth(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await dashboardService.getAccountingHealth();
      sendSuccess(res, 'Accounting health indicators retrieved successfully', data, 200);
    } catch (error) {
      next(error);
    }
  }

  public async getRecentTransactions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await dashboardService.getRecentTransactions(req.query as unknown as RecentTransactionsQuery);
      sendSuccess(res, 'Recent transactions retrieved successfully', data, 200);
    } catch (error) {
      next(error);
    }
  }
}

export const dashboardController = new DashboardController();
