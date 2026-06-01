import express from 'express';
import { discoverCreators } from '../controllers/discoveryController.js';
import { verifyToken, restrictTo } from '../middleware/auth.js';

const router = express.Router();

// Only Brands (and Admins) are allowed to search for creators
router.get('/creators', verifyToken, restrictTo('Brand', 'Admin'), discoverCreators);

export default router;