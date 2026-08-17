export function calculateEstimate(config, answers) {
  const { questions, modifiers } = config;

  // Validate required fields
  const requiredKeys = questions
    .filter(q => q.active && q.required)
    .map(q => q.key);
  
  for (const key of requiredKeys) {
    if (!answers[key] && answers[key] !== 0) {
      throw new Error(`Missing required field: ${key}`);
    }
  }

  const roofArea = Number(answers['roof_area']);
  if (isNaN(roofArea) || roofArea <= 0) {
    throw new Error('Invalid roof area. Must be a positive number.');
  }

  // Helper to get selected option
  const getSelectedOption = (questionKey) => {
    const q = questions.find(item => item.key === questionKey);
    if (!q || !q.options) return null;
    const selectedValue = answers[questionKey];
    return q.options.find(opt => opt.value === selectedValue) || null;
  };

  // Extract rates with safe parsing
  const materialOpt = getSelectedOption('material');
  const pitchOpt = getSelectedOption('pitch');
  const layersOpt = getSelectedOption('layers');
  const storiesOpt = getSelectedOption('stories');

  // Default values if options not found
  const ratePerSqft = materialOpt?.rate_per_sqft !== undefined ? Number(materialOpt.rate_per_sqft) : 0;
  const pitchMult = pitchOpt?.multiplier !== undefined ? Number(pitchOpt.multiplier) : 1.0;
  const tearOffPerSqft = layersOpt?.tear_off_per_sqft !== undefined ? Number(layersOpt.tear_off_per_sqft) : 0;
  const storiesMult = storiesOpt?.multiplier !== undefined ? Number(storiesOpt.multiplier) : 1.0;

  // Validate material selection
  if (ratePerSqft === 0) {
    throw new Error('Invalid material selection. Please select a valid material.');
  }

  const wasteFactor = Number(modifiers.waste_factor || 0.10);
  const permitFee = Number(modifiers.permit_flat_fee || 350);
  const spreadPct = Number(modifiers.range_spread_pct || 12) / 100;

  // Core arithmetic per spec
  // Base Material Cost = A × R_m × (1 + W)
  const baseMaterialCost = roofArea * ratePerSqft * (1 + wasteFactor);
  
  // Tear-Off Cost = A × R_t
  const tearOffCost = roofArea * tearOffPerSqft;
  
  // Adjusted Subtotal = (Base Material Cost + Tear-Off Cost) × M_p × M_s
  const subtotal = (baseMaterialCost + tearOffCost) * pitchMult * storiesMult;
  
  // Total Base Estimate = Adjusted Subtotal + F_p
  const midPointEstimate = subtotal + permitFee;

  // Estimate Range: E_low = E_mid × (1 - S), E_high = E_mid × (1 + S)
  const estimateLow = Math.round(midPointEstimate * (1 - spreadPct));
  const estimateHigh = Math.round(midPointEstimate * (1 + spreadPct));

  return {
    estimate_low: estimateLow,
    estimate_high: estimateHigh,
    breakdown: {
      baseMaterialCost: Math.round(baseMaterialCost),
      tearOffCost: Math.round(tearOffCost),
      subtotal: Math.round(subtotal),
      permitFee,
      wasteFactor,
      pitchMult,
      storiesMult,
      ratePerSqft,
      roofArea
    }
  };
}