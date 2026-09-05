import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes.js';
import userRoutes from '../modules/users/user.routes.js';
import dashboardRoutes from '../modules/dashboard/dashboard.routes.js';
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

export default router;
