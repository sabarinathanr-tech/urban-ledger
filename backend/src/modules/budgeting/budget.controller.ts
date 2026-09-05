import type { Request, Response, NextFunction } from 'express';
import { budgetService } from './budget.service.js';
import { sendSuccess } from '../../utils/response.js';

export class BudgetController {
  public async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const budgets = await budgetService.listBudgets();
      sendSuccess(res, 'Budgets retrieved successfully', budgets);
    } catch (err) {
      next(err);
    }
  }

  public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const budget = await budgetService.createBudget(req.body);
      sendSuccess(res, 'Budget created successfully', budget, 201);
    } catch (err) {
      next(err);
    }
  }
}

export const budgetController = new BudgetController();
