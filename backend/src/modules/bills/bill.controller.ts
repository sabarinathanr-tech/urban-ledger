import type { Request, Response, NextFunction } from 'express';
import { billService } from './bill.service.js';
import { sendSuccess } from '../../utils/response.js';
import type { CreateBillInput, ListBillsQuery } from './bill.schema.js';

export class BillController {
  public async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await billService.listBills(
        req.query as unknown as ListBillsQuery,
        req.user
      );
      sendSuccess(res, 'Vendor bills retrieved successfully', result);
    } catch (err) {
      next(err);
    }
  }

  public async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const bill = await billService.getBillById(req.params.id as string, req.user);
      sendSuccess(res, 'Vendor bill retrieved successfully', bill);
    } catch (err) {
      next(err);
    }
  }

  public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const bill = await billService.createBill(req.body as CreateBillInput);
      sendSuccess(res, 'Vendor bill posted to General Ledger', bill, 201);
    } catch (err) {
      next(err);
    }
  }
}

export const billController = new BillController();
