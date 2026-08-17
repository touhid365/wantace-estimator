import { Config } from '../models/Config.js';
import { Lead } from '../models/Lead.js';

export const updateConfig = async (req, res) => {
  try {
    const updates = req.body;
    
    // Get current active config
    const currentConfig = await Config.findOne({ isActive: true })
      .sort({ config_version: -1 });

    if (!currentConfig) {
      return res.status(404).json({ 
        error: 'No configuration found' 
      });
    }

    // Create new version with updates
    const newConfig = new Config({
      config_version: currentConfig.config_version + 1,
      business: updates.business || currentConfig.business,
      questions: updates.questions || currentConfig.questions,
      modifiers: updates.modifiers || currentConfig.modifiers,
      isActive: true
    });

    // Deactivate old config
    currentConfig.isActive = false;
    await currentConfig.save();

    // Save new config
    await newConfig.save();

    res.json({
      success: true,
      config_version: newConfig.config_version,
      message: 'Configuration updated successfully'
    });

  } catch (error) {
    console.error('Config update error:', error);
    res.status(500).json({ 
      error: 'Failed to update configuration' 
    });
  }
};

export const getLeads = async (req, res) => {
  try {
    const leads = await Lead.find()
      .sort({ captured_at: -1 })
      .limit(100);

    res.json({
      success: true,
      count: leads.length,
      leads
    });

  } catch (error) {
    console.error('Get leads error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch leads' 
    });
  }
};