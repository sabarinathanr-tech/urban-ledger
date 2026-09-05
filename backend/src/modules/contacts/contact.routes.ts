import { Router } from 'express';
import { contactController } from './contact.controller.js';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { requireRole } from '../../middleware/role.middleware.js';
import { validateBody, validateQuery } from '../../middleware/validation.middleware.js';
import { createContactSchema, updateContactSchema, listContactsQuerySchema } from './contact.schema.js';
import { ROLES } from '../../config/constants.js';

const router = Router();

// All contacts endpoints require authentication
router.use(requireAuth);

router.get('/', validateQuery(listContactsQuerySchema), (req, res, next) => contactController.list(req, res, next));
router.get('/:id', (req, res, next) => contactController.getById(req, res, next));

// Contact mutations require ADMIN or ACCOUNTANT
router.post(
  '/',
  requireRole(ROLES.ADMIN, ROLES.ACCOUNTANT),
  validateBody(createContactSchema),
  (req, res, next) => contactController.create(req, res, next)
);

router.put(
  '/:id',
  requireRole(ROLES.ADMIN, ROLES.ACCOUNTANT),
  validateBody(updateContactSchema),
  (req, res, next) => contactController.update(req, res, next)
);

router.delete(
  '/:id',
  requireRole(ROLES.ADMIN, ROLES.ACCOUNTANT),
  (req, res, next) => contactController.remove(req, res, next)
);

export default router;
