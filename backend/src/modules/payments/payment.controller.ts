import type { Request, Response, NextFunction } from 'express';
import { paymentService } from './payment.service.js';
import { sendSuccess } from '../../utils/response.js';
import type { CreatePaymentInput, ListPaymentsQuery } from './payment.schema.js';

export class PaymentController {
  public async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await paymentService.listPayments(
        req.query as unknown as ListPaymentsQuery,
        req.user
      );
      sendSuccess(res, 'Payments retrieved successfully', result);
    } catch (err) {
      next(err);
    }
  }

  public async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const payment = await paymentService.getPaymentById(req.params.id as string, req.user);
      sendSuccess(res, 'Payment voucher retrieved successfully', payment);
    } catch (err) {
      next(err);
    }
  }

  public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const payment = await paymentService.createPayment(req.body as CreatePaymentInput, req.user);
      sendSuccess(res, 'Payment registered and posted to Cash/Bank Journal', payment, 201);
    } catch (err) {
      next(err);
    }
  }
}

export const paymentController = new PaymentController();
