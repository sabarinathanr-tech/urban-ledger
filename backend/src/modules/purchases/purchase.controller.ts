import type { Request, Response, NextFunction } from 'express';
import { purchaseService } from './purchase.service.js';
import { sendSuccess } from '../../utils/response.js';
import type { CreatePurchaseOrderInput, ListPurchaseOrdersQuery } from './purchase.schema.js';

export class PurchaseController {
  public async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await purchaseService.listPurchaseOrders(
        req.query as unknown as ListPurchaseOrdersQuery
      );
      sendSuccess(res, 'Purchase orders retrieved successfully', result);
    } catch (err) {
      next(err);
    }
  }

  public async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const order = await purchaseService.getPurchaseOrderById(req.params.id as string);
      sendSuccess(res, 'Purchase order retrieved successfully', order);
    } catch (err) {
      next(err);
    }
  }

  public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const order = await purchaseService.createPurchaseOrder(
        req.body as CreatePurchaseOrderInput
      );
      sendSuccess(res, 'Purchase order created successfully', order, 201);
    } catch (err) {
      next(err);
    }
  }

  public async confirm(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const order = await purchaseService.confirmPurchaseOrder(req.params.id as string);
      sendSuccess(res, 'Purchase order confirmed successfully', order);
    } catch (err) {
      next(err);
    }
  }

  public async bill(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await purchaseService.billPurchaseOrder(req.params.id as string);
      sendSuccess(res, 'Purchase order converted to vendor bill', result);
    } catch (err) {
      next(err);
    }
  }
}

export const purchaseController = new PurchaseController();
