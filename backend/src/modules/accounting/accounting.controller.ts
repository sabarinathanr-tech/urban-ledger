import type { Request, Response, NextFunction } from 'express';
import { accountingService } from './accounting.service.js';
import { sendSuccess } from '../../utils/response.js';

export class AccountingController {
  public async getChartOfAccounts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const accounts = await accountingService.getChartOfAccounts();
      sendSuccess(res, 'Chart of Accounts retrieved successfully', accounts);
    } catch (err) {
      next(err);
    }
  }

  public async updateAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const updated = await accountingService.updateAccount(id, req.body);
      sendSuccess(res, 'Account updated successfully', updated);
    } catch (err) {
      next(err);
    }
  }

  public async getJournals(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const journals = await accountingService.getJournals();
      sendSuccess(res, 'Journals retrieved successfully', journals);
    } catch (err) {
      next(err);
    }
  }

  public async getJournalEntries(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const entries = await accountingService.getJournalEntries();
      sendSuccess(res, 'Journal entries retrieved successfully', entries);
    } catch (err) {
      next(err);
    }
  }

  public async createJournalEntry(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const entry = await accountingService.createJournalEntry(req.body);
      sendSuccess(res, 'Journal entry posted successfully', entry, 201);
    } catch (err) {
      next(err);
    }
  }

  public async getLedger(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const accountId = req.query.accountId as string | undefined;
      const ledger = await accountingService.getLedger(accountId);
      sendSuccess(res, 'General ledger retrieved successfully', ledger);
    } catch (err) {
      next(err);
    }
  }
}

export const accountingController = new AccountingController();
