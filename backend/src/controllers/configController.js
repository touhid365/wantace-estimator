import { Config } from '../models/Config.js';

export const getActiveConfig = async (req, res) => {
  try {
    const config = await Config.findOne({ isActive: true })
      .sort({ config_version: -1 });
    
    if (!config) {
      return res.status(404).json({ 
        error: 'No active configuration found' 
      });
    }

    // Return only what the public estimator needs
    const publicConfig = {
      config_version: config.config_version,
      business: config.business,
      questions: config.questions.filter(q => q.active).sort((a, b) => a.order - b.order),
      modifiers: config.modifiers
    };

    res.json(publicConfig);
  } catch (error) {
    console.error('Get config error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch configuration' 
    });
  }
};