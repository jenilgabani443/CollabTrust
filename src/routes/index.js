import express from 'express';
import exampleRoutes from './exampleRoutes.js';

const router = express.Router();

// Mount routes
router.use('/example', exampleRoutes);

export default router;
