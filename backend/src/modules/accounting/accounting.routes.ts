import { Router } from 'express';
import { accountingController } from './accounting.controller.js';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { requireRole } from '../../middleware/role.middleware.js';
import { validateBody } from '../../middleware/validation.middleware.js';
import { journalEntrySchema } from './accounting.validators.js';
import { ROLES } from '../../config/constants.js';

const router = Router();

// Strict authorization: Only ADMIN and ACCOUNTANT roles have access to internal accounting ledgers!
router.use(requireAuth);
router.use(requireRole(ROLES.ADMIN, ROLES.ACCOUNTANT));

router.get('/chart-of-accounts', (req, res, next) => accountingController.getChartOfAccounts(req, res, next));
router.get('/journals', (req, res, next) => accountingController.getJournals(req, res, next));
router.get('/journal-entries', (req, res, next) => accountingController.getJournalEntries(req, res, next));
router.post('/journal-entries', validateBody(journalEntrySchema), (req, res, next) =>
  accountingController.createJournalEntry(req, res, next)
);
router.get('/ledger', (req, res, next) => accountingController.getLedger(req, res, next));

export default router;
