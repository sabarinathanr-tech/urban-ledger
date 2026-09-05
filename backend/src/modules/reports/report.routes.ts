import { Router } from 'express';
import { reportController } from './report.controller.js';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { requireRole } from '../../middleware/role.middleware.js';
import { ROLES } from '../../config/constants.js';

const router = Router();

router.use(requireAuth);
router.use(requireRole(ROLES.ADMIN, ROLES.ACCOUNTANT));

router.get('/profit-loss', (req, res, next) => reportController.getProfitLoss(req, res, next));
router.get('/balance-sheet', (req, res, next) => reportController.getBalanceSheet(req, res, next));

export default router;
