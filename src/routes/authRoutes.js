import express from 'express';
// Ensure the path matches where your authController is located
import { register, login, getMe, updateMe, deleteMe } from '../controllers/authController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes (require authentication)
router.get('/me', verifyToken, getMe);
router.patch('/me', verifyToken, updateMe);
router.delete('/me', verifyToken, deleteMe);

export default router;