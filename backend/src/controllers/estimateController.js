import { Lead } from '../models/Lead.js';
import { Config } from '../models/Config.js';
import { calculateEstimate } from '../services/calculator.js';
import { v4 as uuidv4 } from 'uuid';

export const submitEstimate = async (req, res) => {
  try {
    const { name, phone, email, answers } = req.body;

    // Validate required fields
    if (!name || !phone || !email) {
      return res.status(400).json({ 
        error: 'Name, phone, and email are required' 
      });
    }

    if (!answers || typeof answers !== 'object') {
      return res.status(400).json({ 
        error: 'Answers are required' 
      });
    }

    // Get active config
    const config = await Config.findOne({ isActive: true })
      .sort({ config_version: -1 });
    
    if (!config) {
      return res.status(404).json({ 
        error: 'No active configuration found' 
      });
    }

    // Calculate estimate
    let result;
    try {
      result = calculateEstimate(config, answers);
    } catch (calcError) {
      return res.status(400).json({ 
        error: calcError.message 
      });
    }

    // Create lead
    const lead = new Lead({
      id: `ld_${uuidv4().slice(0, 8)}`,
      captured_at: new Date(),
      config_version: config.config_version,
      name,
      phone,
      email,
      answers,
      estimate_low: result.estimate_low,
      estimate_high: result.estimate_high
    });

    await lead.save();

    res.status(201).json({
      success: true,
      lead_id: lead.id,
      estimate_low: result.estimate_low,
      estimate_high: result.estimate_high,
      breakdown: result.breakdown
    });

  } catch (error) {
    console.error('Estimate submission error:', error);
    res.status(500).json({ 
      error: 'Failed to submit estimate' 
    });
  }
};