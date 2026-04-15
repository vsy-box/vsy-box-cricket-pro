import { Router } from 'express';
import { loginWithPhone, getProfile, updateProfile, adminLogin } from '../controllers/authController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// User phone login (no password)
router.post('/login', loginWithPhone);

// Admin login (email + password)
router.post('/admin/login', adminLogin);

// Protected user routes
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);

export default router;
