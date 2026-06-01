import express from 'express';
import { transitionCampaignStatus, submitDeliverableUrl } from '../controllers/campaignController.js';
import { verifyToken, restrictTo } from '../middleware/auth.js';

const router = express.Router();

// All campaign routes require the user to be logged in
router.use(verifyToken);

// Route to transition campaign status (Brand or Admin only)
router.put('/:id/status', restrictTo('Brand', 'Admin'), transitionCampaignStatus);

// Route for Creators to submit their deliverables
router.post('/:id/deliverables', restrictTo('Creator'), submitDeliverableUrl);

export default router;