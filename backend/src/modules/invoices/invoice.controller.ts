import type { Request, Response, NextFunction } from 'express';
import { invoiceService } from './invoice.service.js';
import { sendSuccess } from '../../utils/response.js';
import type { CreateInvoiceInput, ListInvoicesQuery } from './invoice.schema.js';

export class InvoiceController {
  public async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await invoiceService.listInvoices(
        req.query as unknown as ListInvoicesQuery,
        req.user
      );
      sendSuccess(res, 'Invoices retrieved successfully', result);
    } catch (err) {
      next(err);
    }
  }

  public async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const invoice = await invoiceService.getInvoiceById(req.params.id as string, req.user);
      sendSuccess(res, 'Invoice retrieved successfully', invoice);
    } catch (err) {
      next(err);
    }
  }

  public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const invoice = await invoiceService.createInvoice(req.body as CreateInvoiceInput);
      sendSuccess(res, 'Direct Tax Invoice posted to General Ledger', invoice, 201);
    } catch (err) {
      next(err);
    }
  }
}

export const invoiceController = new InvoiceController();
