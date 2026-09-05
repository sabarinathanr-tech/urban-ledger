import { Router } from 'express';
import { paymentController } from './payment.controller.js';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { validateBody, validateQuery } from '../../middleware/validation.middleware.js';
import { createPaymentSchema, listPaymentsQuerySchema } from './payment.schema.js';

const router = Router();

router.use(requireAuth);

router.get('/', validateQuery(listPaymentsQuerySchema), (req, res, next) => paymentController.list(req, res, next));
router.get('/:id', (req, res, next) => paymentController.getById(req, res, next));
router.post('/', validateBody(createPaymentSchema), (req, res, next) => paymentController.create(req, res, next));

export default router;
