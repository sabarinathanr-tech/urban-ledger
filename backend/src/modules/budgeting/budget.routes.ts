import { Router } from 'express';
import { budgetController } from './budget.controller.js';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { requireRole } from '../../middleware/role.middleware.js';
import { ROLES } from '../../config/constants.js';

const router = Router();

router.use(requireAuth);
router.use(requireRole(ROLES.ADMIN, ROLES.ACCOUNTANT));

router.get('/', (req, res, next) => budgetController.list(req, res, next));
router.post('/', (req, res, next) => budgetController.create(req, res, next));
router.get('/analytic-accounts', (req, res, next) => budgetController.listAnalyticAccounts(req, res, next));
router.post('/analytic-accounts', (req, res, next) => budgetController.createAnalyticAccount(req, res, next));

export default router;
