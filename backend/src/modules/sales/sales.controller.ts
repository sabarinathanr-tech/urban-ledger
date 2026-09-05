import type { Request, Response, NextFunction } from 'express';
import { salesService } from './sales.service.js';
import { sendSuccess } from '../../utils/response.js';
import type { CreateSalesOrderInput, ListSalesOrdersQuery } from './sales.schema.js';

export class SalesController {
  public async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await salesService.listSalesOrders(req.query as unknown as ListSalesOrdersQuery);
      sendSuccess(res, 'Sales orders retrieved successfully', result);
    } catch (err) {
      next(err);
    }
  }

  public async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const order = await salesService.getSalesOrderById(req.params.id as string);
      sendSuccess(res, 'Sales order retrieved successfully', order);
    } catch (err) {
      next(err);
    }
  }

  public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const order = await salesService.createSalesOrder(req.body as CreateSalesOrderInput);
      sendSuccess(res, 'Sales order created successfully', order, 201);
    } catch (err) {
      next(err);
    }
  }

  public async confirm(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const order = await salesService.confirmSalesOrder(req.params.id as string);
      sendSuccess(res, 'Sales order confirmed successfully', order);
    } catch (err) {
      next(err);
    }
  }

  public async invoice(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await salesService.invoiceSalesOrder(req.params.id as string);
      sendSuccess(res, 'Sales order invoiced and customer invoice posted', result);
    } catch (err) {
      next(err);
    }
  }
}

export const salesController = new SalesController();
