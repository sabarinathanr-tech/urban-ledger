import type { Request, Response, NextFunction } from 'express';
import { profitLossService } from './profit-loss.service.js';
import { balanceSheetService } from './balance-sheet.service.js';
import { sendSuccess } from '../../utils/response.js';

export class ReportController {
  public async getProfitLoss(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pnl = await profitLossService.getStatement();
      sendSuccess(res, 'Profit and Loss statement retrieved successfully', pnl);
    } catch (err) {
      next(err);
    }
  }

  public async getBalanceSheet(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sheet = await balanceSheetService.getStatement();
      sendSuccess(res, 'Balance Sheet retrieved successfully', sheet);
    } catch (err) {
      next(err);
    }
  }
}

export const reportController = new ReportController();
