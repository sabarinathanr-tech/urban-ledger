import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes.js';
import userRoutes from '../modules/users/user.routes.js';
import dashboardRoutes from '../modules/dashboard/dashboard.routes.js';
import contactRoutes from '../modules/contacts/contact.routes.js';
import productRoutes from '../modules/products/product.routes.js';
import salesRoutes from '../modules/sales/sales.routes.js';
import purchaseRoutes from '../modules/purchases/purchase.routes.js';
import invoiceRoutes from '../modules/invoices/invoice.routes.js';
import billRoutes from '../modules/bills/bill.routes.js';
import paymentRoutes from '../modules/payments/payment.routes.js';
import accountingRoutes from '../modules/accounting/accounting.routes.js';
import budgetRoutes from '../modules/budgeting/budget.routes.js';
import reportRoutes from '../modules/reports/report.routes.js';
import { sendSuccess } from '../utils/response.js';
import { env } from '../config/env.js';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  sendSuccess(res, 'Urban Ledger API is running', {
    status: 'healthy',
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// Domain routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/contacts', contactRoutes);
router.use('/products', productRoutes);
router.use('/sales', salesRoutes);
router.use('/purchases', purchaseRoutes);
router.use('/invoices', invoiceRoutes);
router.use('/bills', billRoutes);
router.use('/payments', paymentRoutes);
router.use('/accounting', accountingRoutes);
router.use('/budgets', budgetRoutes);
router.use('/budgeting/budgets', budgetRoutes);
router.use('/reports', reportRoutes);

export default router;
