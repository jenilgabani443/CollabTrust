import express from 'express';
// Make sure to import the new getMyCampaigns function here!
import { createCampaign, transitionCampaignStatus, submitDeliverableUrl, getMyCampaigns, getCampaignById } from '../controllers/campaignController.js';
import { verifyToken, restrictTo } from '../middleware/auth.js'; // Check if your path is auth.js or authMiddleware.js!

const router = express.Router();

// All campaign routes require the user to be logged in
router.use(verifyToken);

// NEW: Route to fetch all campaigns for the logged-in user
router.get('/', getMyCampaigns);

// NEW: Route to fetch a specific campaign by ID
router.get('/:id', getCampaignById);

// NEW: Route to create a campaign (Brand only)
router.post('/', restrictTo('Brand'), createCampaign);

// Route to transition campaign status (Brand or Admin only)
router.put('/:id/status', restrictTo('Brand', 'Admin', 'Creator', 'brand', 'creator', 'admin'), transitionCampaignStatus);

// Route for Creators to submit their deliverables
router.post('/:id/deliverables', restrictTo('Creator'), submitDeliverableUrl);

export default router;