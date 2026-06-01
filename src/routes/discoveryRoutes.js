import express from 'express';
import { discoverCreators, getCreatorById } from '../controllers/discoveryController.js';
import { verifyToken, restrictTo } from '../middleware/auth.js';

const router = express.Router();

// Only Brands (and Admins) are allowed to search for creators
router.get('/creators', verifyToken, restrictTo('Brand', 'Admin'), discoverCreators);

// Get a single creator's full profile by ID
router.get('/creators/:id', verifyToken, restrictTo('Brand', 'Admin'), getCreatorById);

export default router;