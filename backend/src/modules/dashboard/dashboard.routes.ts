import { Router } from 'express';
import { dashboardController } from './dashboard.controller.js';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { requireRole } from '../../middleware/role.middleware.js';
import { validateQuery } from '../../middleware/validation.middleware.js';
import { dashboardSummaryQuerySchema, revenueExpenseQuerySchema, recentTransactionsQuerySchema } from './dashboard.schema.js';
import { ROLES } from '../../config/constants.js';

const router = Router();

// Internal Dashboard is strictly restricted to ADMIN and ACCOUNTANT
router.use(requireAuth);
router.use(requireRole(ROLES.ADMIN, ROLES.ACCOUNTANT));

router.get('/summary', validateQuery(dashboardSummaryQuerySchema), dashboardController.getSummary);
router.get('/revenue-expense', validateQuery(revenueExpenseQuerySchema), dashboardController.getRevenueExpenseTrend);
router.get('/budget-health', dashboardController.getBudgetHealth);
router.get('/receivables', dashboardController.getReceivables);
router.get('/payables', dashboardController.getPayables);
router.get('/accounting-health', dashboardController.getAccountingHealth);
router.get('/recent-transactions', validateQuery(recentTransactionsQuerySchema), dashboardController.getRecentTransactions);

export default router;
