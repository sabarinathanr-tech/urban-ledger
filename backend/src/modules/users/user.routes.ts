import { Router } from 'express';
import { userController } from './user.controller.js';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { requireRole } from '../../middleware/role.middleware.js';
import { validateBody, validateQuery } from '../../middleware/validation.middleware.js';
import { createUserSchema, listUsersQuerySchema } from './user.schema.js';
import { ROLES } from '../../config/constants.js';

const router = Router();

// Internal user creation and listing are strictly restricted to ADMIN
router.use(requireAuth);
router.use(requireRole(ROLES.ADMIN));

router.post('/', validateBody(createUserSchema), userController.createUser);
router.get('/', validateQuery(listUsersQuerySchema), userController.listUsers);
router.patch('/:id/status', userController.toggleUserStatus);

export default router;
