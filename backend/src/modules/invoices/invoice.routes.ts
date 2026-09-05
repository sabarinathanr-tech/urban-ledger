import { Router } from 'express';
import { invoiceController } from './invoice.controller.js';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { requireRole } from '../../middleware/role.middleware.js';
import { validateBody, validateQuery } from '../../middleware/validation.middleware.js';
import { createInvoiceSchema, listInvoicesQuerySchema } from './invoice.schema.js';
import { ROLES } from '../../config/constants.js';

const router = Router();

router.use(requireAuth);

// Both internal users (ADMIN, ACCOUNTANT) and external portal users (CONTACT) can list and view invoices (scoped by controller)
router.get('/', validateQuery(listInvoicesQuerySchema), (req, res, next) => invoiceController.list(req, res, next));
router.get('/:id', (req, res, next) => invoiceController.getById(req, res, next));

// Only internal staff can issue new tax invoices
router.post(
  '/',
  requireRole(ROLES.ADMIN, ROLES.ACCOUNTANT),
  validateBody(createInvoiceSchema),
  (req, res, next) => invoiceController.create(req, res, next)
);

export default router;
