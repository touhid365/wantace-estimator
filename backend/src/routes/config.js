import express from 'express';
import { getActiveConfig } from '../controllers/configController.js';

const router = express.Router();

router.get('/', getActiveConfig);

export default router;