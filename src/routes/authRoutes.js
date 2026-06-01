import express from 'express';
// Ensure the path matches where your authController is located
import { register, login } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

export default router;