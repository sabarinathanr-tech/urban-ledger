import { Router } from 'express';
import { billController } from './bill.controller.js';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { requireRole } from '../../middleware/role.middleware.js';
import { validateBody, validateQuery } from '../../middleware/validation.middleware.js';
import { createBillSchema, listBillsQuerySchema } from './bill.schema.js';
import { ROLES } from '../../config/constants.js';

const router = Router();

router.use(requireAuth);

router.get('/', validateQuery(listBillsQuerySchema), (req, res, next) => billController.list(req, res, next));
router.get('/:id', (req, res, next) => billController.getById(req, res, next));

router.post(
  '/',
  requireRole(ROLES.ADMIN, ROLES.ACCOUNTANT),
  validateBody(createBillSchema),
  (req, res, next) => billController.create(req, res, next)
);

export default router;
