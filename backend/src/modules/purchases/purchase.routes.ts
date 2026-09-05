import { Router } from 'express';
import { purchaseController } from './purchase.controller.js';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { requireRole } from '../../middleware/role.middleware.js';
import { validateBody, validateQuery } from '../../middleware/validation.middleware.js';
import { createPurchaseOrderSchema, listPurchaseOrdersQuerySchema } from './purchase.schema.js';
import { ROLES } from '../../config/constants.js';

const router = Router();

router.use(requireAuth);
router.use(requireRole(ROLES.ADMIN, ROLES.ACCOUNTANT));

router.get('/', validateQuery(listPurchaseOrdersQuerySchema), (req, res, next) => purchaseController.list(req, res, next));
router.get('/:id', (req, res, next) => purchaseController.getById(req, res, next));
router.post('/', validateBody(createPurchaseOrderSchema), (req, res, next) => purchaseController.create(req, res, next));
router.post('/:id/confirm', (req, res, next) => purchaseController.confirm(req, res, next));
router.post('/:id/bill', (req, res, next) => purchaseController.bill(req, res, next));

export default router;
