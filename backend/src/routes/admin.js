import express from 'express';
import { updateConfig, getLeads } from '../controllers/adminController.js';
import { requireOwnerAuth } from '../middleware/auth.js';

const router = express.Router();

// All admin routes require authentication
router.use(requireOwnerAuth);

router.put('/config', updateConfig);
router.get('/leads', getLeads);

export default router;