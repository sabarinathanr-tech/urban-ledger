import { Router } from 'express';
import { authController } from './auth.controller.js';
import { validateBody } from '../../middleware/validation.middleware.js';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { signupSchema, loginSchema } from './auth.schema.js';

const router = Router();

router.post('/signup', validateBody(signupSchema), authController.signup);
router.post('/login', validateBody(loginSchema), authController.login);
router.post('/logout', authController.logout);
router.get('/me', requireAuth, authController.me);

export default router;
