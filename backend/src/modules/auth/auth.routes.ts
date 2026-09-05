import { Router } from 'express';
import { authController } from './auth.controller.js';
import { validateBody } from '../../middleware/validation.middleware.js';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { createRateLimiter } from '../../middleware/rate-limiter.middleware.js';
import { signupSchema, loginSchema } from './auth.schema.js';

const router = Router();
const authLimiter = createRateLimiter(30, 60 * 1000);

router.post('/setup-admin', authLimiter, validateBody(signupSchema), authController.setupAdmin);
router.post('/signup', authLimiter, validateBody(signupSchema), authController.signup);
router.post('/login', authLimiter, validateBody(loginSchema), authController.login);
router.post('/logout', authController.logout);
router.get('/me', requireAuth, authController.me);

export default router;
