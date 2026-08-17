import express from 'express';
import { submitEstimate } from '../controllers/estimateController.js';

const router = express.Router();

router.post('/', submitEstimate);

export default router;