import { Router } from 'express';
import { salesController } from './sales.controller.js';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { requireRole } from '../../middleware/role.middleware.js';
import { validateBody, validateQuery } from '../../middleware/validation.middleware.js';
import { createSalesOrderSchema, listSalesOrdersQuerySchema } from './sales.schema.js';
import { ROLES } from '../../config/constants.js';

const router = Router();

router.use(requireAuth);
router.use(requireRole(ROLES.ADMIN, ROLES.ACCOUNTANT));

router.get('/', validateQuery(listSalesOrdersQuerySchema), (req, res, next) => salesController.list(req, res, next));
router.get('/:id', (req, res, next) => salesController.getById(req, res, next));
router.post('/', validateBody(createSalesOrderSchema), (req, res, next) => salesController.create(req, res, next));
router.post('/:id/confirm', (req, res, next) => salesController.confirm(req, res, next));
router.post('/:id/invoice', (req, res, next) => salesController.invoice(req, res, next));

export default router;
