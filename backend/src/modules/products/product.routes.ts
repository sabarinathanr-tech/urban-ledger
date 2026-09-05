import { Router } from 'express';
import { productController } from './product.controller.js';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { requireRole } from '../../middleware/role.middleware.js';
import { validateBody, validateQuery } from '../../middleware/validation.middleware.js';
import { createProductSchema, updateProductSchema, listProductsQuerySchema } from './product.schema.js';
import { ROLES } from '../../config/constants.js';

const router = Router();

router.use(requireAuth);

router.get('/', validateQuery(listProductsQuerySchema), (req, res, next) => productController.list(req, res, next));
router.get('/:id', (req, res, next) => productController.getById(req, res, next));

router.post(
  '/',
  requireRole(ROLES.ADMIN, ROLES.ACCOUNTANT),
  validateBody(createProductSchema),
  (req, res, next) => productController.create(req, res, next)
);

router.put(
  '/:id',
  requireRole(ROLES.ADMIN, ROLES.ACCOUNTANT),
  validateBody(updateProductSchema),
  (req, res, next) => productController.update(req, res, next)
);

router.delete(
  '/:id',
  requireRole(ROLES.ADMIN, ROLES.ACCOUNTANT),
  (req, res, next) => productController.remove(req, res, next)
);

export default router;
