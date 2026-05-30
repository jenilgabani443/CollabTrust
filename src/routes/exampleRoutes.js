import express from 'express';
import exampleController from '../controllers/exampleController.js';

const router = express.Router();

// Define example routes
router.get('/', exampleController.getAllItems);
router.get('/error', exampleController.triggerError);
router.get('/rejection', exampleController.triggerRejection);
router.get('/:id', exampleController.getItem);

export default router;
