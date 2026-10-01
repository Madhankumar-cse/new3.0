import { CropRecord, EvaluationResult, FactorContribution, RiskItem, ActionRecommendation } from './types';
import { CROP_PROFILES } from './dataset';

/**
 * AgriLens AI Transparent Agronomic Scoring Engine
 * Computes an explainable "Crop Yield Potential Score" (0–100)
 * derived from soil indicators, climate factors, nutrient balance, water readiness, and pest pressure.
 * 
 * Note: Transparent decision-support model, NOT guaranteed actual yield forecasting.
 */
export function calculateYieldPotential(input: CropRecord): EvaluationResult {
  const profile = CROP_PROFILES[input.crop_type] || CROP_PROFILES['Groundnut'];

  // 1. CLIMATE SUITABILITY (Max 25 pts)
  // Optimal temp range + rainfall suitability
  let climatePoints = 12.5;
  const [minOptTemp, maxOptTemp] = profile.optimalTempRange;
  if (input.temperature_c >= minOptTemp && input.temperature_c <= maxOptTemp) {
    climatePoints += 6.5;
  } else {
    const tempDev = Math.min(Math.abs(input.temperature_c - (minOptTemp + maxOptTemp) / 2), 12);
    climatePoints -= (tempDev / 12) * 6.0;
  }

  const [minOptRain, maxOptRain] = profile.optimalRainfallRange;
  if (input.rainfall_mm >= minOptRain && input.rainfall_mm <= maxOptRain) {
    climatePoints += 6.0;
  } else {
    const rainDev = Math.min(Math.abs(input.rainfall_mm - (minOptRain + maxOptRain) / 2), 700);
    climatePoints -= (rainDev / 700) * 5.5;
  }
  climatePoints = Math.max(2, Math.min(25, climatePoints));

  // 2. SOIL SUITABILITY & HEALTH (Max 25 pts)
  // Soil pH optimality (Max 13 pts) + Organic Matter (Max 12 pts)
  let soilPoints = 12.5;
  const [minOptPh, maxOptPh] = profile.optimalPhRange;
  if (input.soil_ph >= minOptPh && input.soil_ph <= maxOptPh) {
    soilPoints += 6.5;
  } else {
    const phDev = Math.min(Math.abs(input.soil_ph - (minOptPh + maxOptPh) / 2), 2.5);
    soilPoints -= (phDev / 2.5) * 6.5;
  }

  // Organic Matter: healthy is 3.0% - 6.0%
  if (input.organic_matter_percent >= 3.5) {
    soilPoints += Math.min(6.0, (input.organic_matter_percent / 6.0) * 6.0);
  } else {
    soilPoints -= ((3.5 - input.organic_matter_percent) / 3.5) * 5.0;
  }
  soilPoints = Math.max(3, Math.min(25, soilPoints));

  // 3. NUTRIENT BALANCE (Max 25 pts)
  // Checks NPK presence and balance
  let nutrientPoints = 14.0;
  const idealN = 140; // baseline
  const idealP = 80;
  const idealK = 100;

  // Excessive N check
  if (input.nitrogen_kg_acre > 240) {
    nutrientPoints -= 3.5; // Excessive nitrogen creates vegetative rankness & susceptibility
  } else if (input.nitrogen_kg_acre >= 100 && input.nitrogen_kg_acre <= 200) {
    nutrientPoints += 3.5;
  }

  // Phosphorus
  if (input.phosphorus_kg_acre < 35) {
    nutrientPoints -= 3.0; // Deficiency
  } else if (input.phosphorus_kg_acre >= 60 && input.phosphorus_kg_acre <= 130) {
    nutrientPoints += 3.5;
  }

  // Potassium
  if (input.potassium_kg_acre < 40) {
    nutrientPoints -= 3.0;
  } else if (input.potassium_kg_acre >= 70 && input.potassium_kg_acre <= 170) {
    nutrientPoints += 4.0;
  }

  // N:P:K harmony check
  const npRatio = input.nitrogen_kg_acre / (input.phosphorus_kg_acre || 1);
  if (npRatio > 5.0) {
    nutrientPoints -= 3.0; // Skewed ratio
  } else if (npRatio >= 1.2 && npRatio <= 2.8) {
    nutrientPoints += 2.0; // Balanced
  }
  nutrientPoints = Math.max(3, Math.min(25, nutrientPoints));

  // 4. WATER READINESS & AVAILABILITY (Max 25 pts)
  // Irrigation coverage and compensation for low rainfall
  let waterPoints = 12.0;
  const irrigationRatio = input.irrigation_coverage_percent / 100;

  if (input.rainfall_mm < 450) {
    // Low rainfall: relies heavily on irrigation
    if (irrigationRatio >= 0.75) {
      waterPoints += 8.0; // Well buffered by irrigation
    } else if (irrigationRatio <= 0.3) {
      waterPoints -= 7.5; // Severe drought risk
    } else {
      waterPoints -= 2.0;
    }
  } else if (input.rainfall_mm > 1500) {
    // High rainfall: irrigation matters less, drainage is critical
    waterPoints += 4.0;
  } else {
    // Moderate rainfall
    waterPoints += irrigationRatio * 9.0;
  }
  waterPoints = Math.max(3, Math.min(25, waterPoints));

  // 5. PEST & BIOLOGICAL STRESS (Penalty 0 to -16 pts)
  let pestPenalty = 0;
  if (input.pest_pressure_index <= 0.15) {
    pestPenalty = 0; // pristine
  } else if (input.pest_pressure_index <= 0.35) {
    pestPenalty = 3.5;
  } else if (input.pest_pressure_index <= 0.6) {
    pestPenalty = 8.5;
  } else {
    pestPenalty = Math.min(16, 8.5 + (input.pest_pressure_index - 0.6) * 25);
  }

  // Final Potential Score (0–100)
  const rawScore = climatePoints + soilPoints + nutrientPoints + waterPoints - pestPenalty;
  const potentialScore = Math.max(10, Math.min(98, Math.round(rawScore)));

  // Secondary sub-indices for dashboard
  const soilHealthPercent = Math.round((soilPoints / 25) * 100);
  const waterReadinessPercent = Math.round((waterPoints / 25) * 100);
  const climateSuitabilityPercent = Math.round((climatePoints / 25) * 100);
  const nutrientBalancePercent = Math.round((nutrientPoints / 25) * 100);
  const pestRiskPercent = Math.min(100, Math.round(input.pest_pressure_index * 125));

  // Factor contributions calculation
  const contributions: FactorContribution[] = [
    {
      name: "Irrigation Coverage",
      category: "water",
      impact: Math.round((input.irrigation_coverage_percent - 50) * 0.28),
      currentValue: `${input.irrigation_coverage_percent}%`,
      unit: "%",
      referenceNorm: "50% - 85% coverage",
      status: input.irrigation_coverage_percent >= 60 ? "positive" : input.irrigation_coverage_percent <= 30 ? "negative" : "neutral",
      explanation: input.irrigation_coverage_percent >= 60
        ? "Robust irrigation coverage buffers farm yield against seasonal dry spells."
        : "Low irrigation coverage leaves the field vulnerable to soil moisture deficits.",
      explanationTa: input.irrigation_coverage_percent >= 60
        ? "வலுவான பாசன அமைப்பு பருவமழை குறைபாட்டை ஈடுசெய்து பயிரைக் காக்கிறது."
        : "குறைந்த பாசன வசதி பயிரை வறட்சிக்கு ஆளாக்கி விளைச்சலை பாதிக்கலாம்."
    },
    {
      name: "Soil Organic Matter",
      category: "soil",
      impact: Math.round((input.organic_matter_percent - 2.5) * 4.2),
      currentValue: `${input.organic_matter_percent}%`,
      unit: "%",
      referenceNorm: "3.0% - 5.5%",
      status: input.organic_matter_percent >= 3.0 ? "positive" : "negative",
      explanation: input.organic_matter_percent >= 3.0
        ? "Rich organic matter bolsters microbial biodiversity, aeration, and moisture holding capacity."
        : "Organic matter below 3.0% restricts microbial nutrient conversion and water retention.",
      explanationTa: input.organic_matter_percent >= 3.0
        ? "அதிக இயற்கை சத்து மண்ணின் நுண்ணுயிர்கள் மற்றும் நீர் தேக்கும் திறனை கூட்டுகிறது."
        : "மண்ணில் 3% க்கும் குறைவான இயற்கை சத்து ஊட்டச்சத்து பரிமாற்றத்தை தாமதப்படுத்துகிறது."
    },
    {
      name: "Temperature Suitability",
      category: "climate",
      impact: (input.temperature_c >= minOptTemp && input.temperature_c <= maxOptTemp) ? +8 : -Math.round(Math.abs(input.temperature_c - 27) * 0.9),
      currentValue: `${input.temperature_c}°C`,
      unit: "°C",
      referenceNorm: `${minOptTemp}°C - ${maxOptTemp}°C optimal for ${input.crop_type}`,
      status: (input.temperature_c >= minOptTemp && input.temperature_c <= maxOptTemp) ? "positive" : "negative",
      explanation: (input.temperature_c >= minOptTemp && input.temperature_c <= maxOptTemp)
        ? `Ambient thermal range matches ideal physiological growth for ${input.crop_type}.`
        : `Temperature deviation induces physiological stress or hampers reproductive flowering.`,
      explanationTa: (input.temperature_c >= minOptTemp && input.temperature_c <= maxOptTemp)
        ? `${input.crop_type} பயிருக்கு உகந்த வெப்பநிலை நிலவுகிறது.`
        : `வெப்பநிலை மாறுபாடு பயிரின் பூக்கும் மற்றும் மகசூல் திறனை பாதிக்கிறது.`
    },
    {
      name: "Pest Pressure",
      category: "pest",
      impact: -Math.round(input.pest_pressure_index * 20),
      currentValue: input.pest_pressure_index.toFixed(3),
      unit: "index (0-1)",
      referenceNorm: "< 0.25 low threshold",
      status: input.pest_pressure_index <= 0.25 ? "positive" : "negative",
      explanation: input.pest_pressure_index <= 0.25
        ? "Low pest pressure prevents early foliage damage and fungal transmission."
        : "Elevated pest pressure damages photosynthetic leaf canopy and risks yield suppression.",
      explanationTa: input.pest_pressure_index <= 0.25
        ? "குறைந்த பூச்சி தாக்கம் பயிர் இலைகளைப் பாதுகாத்து நல்ல ஒளிச்சேர்க்கையைத் தருகிறது."
        : "அதிக பூச்சி அழுத்தம் இலை பரப்பை சேதப்படுத்தி பயிர் திறனைக் குறைக்கும்."
    },
    {
      name: "Soil pH Balance",
      category: "soil",
      impact: (input.soil_ph >= minOptPh && input.soil_ph <= maxOptPh) ? +6 : -Math.round(Math.abs(input.soil_ph - 6.8) * 5),
      currentValue: input.soil_ph.toFixed(2),
      unit: "pH",
      referenceNorm: `${minOptPh} - ${maxOptPh}`,
      status: (input.soil_ph >= minOptPh && input.soil_ph <= maxOptPh) ? "positive" : "negative",
      explanation: (input.soil_ph >= minOptPh && input.soil_ph <= maxOptPh)
        ? "Soil reaction allows unhindered root uptake of macronutrients and trace minerals."
        : input.soil_ph < 6.0
          ? "Acidic soil causes phosphorus fixation and aluminum/manganese sensitivity."
          : "Alkaline soil (>7.8) induces micronutrient lock-in (zinc, iron).",
      explanationTa: (input.soil_ph >= minOptPh && input.soil_ph <= maxOptPh)
        ? "சீரான மண் கார அமில நிலை வேர்கள் சத்துக்களை எளிதாக உறிஞ்ச உதவுகிறது."
        : input.soil_ph < 6.0
          ? "அமில மண் மணிச்சத்து மற்றும் நுண்ணூட்டச்சத்துக்கள் வேருக்கு கிடைப்பதை தடுக்கிறது."
          : "கார மண் துத்தநாகம் மற்றும் இரும்பு சத்து கிடைப்பதை குறைக்கிறது."
    },
    {
      name: "NPK Nutrient Harmony",
      category: "nutrient",
      impact: (npRatio >= 1.2 && npRatio <= 2.8 && input.nitrogen_kg_acre <= 220) ? +9 : -7,
      currentValue: `${Math.round(input.nitrogen_kg_acre)}:${Math.round(input.phosphorus_kg_acre)}:${Math.round(input.potassium_kg_acre)}`,
      unit: "N-P-K (kg/ac)",
      referenceNorm: "Balanced N-P-K ratio",
      status: (npRatio >= 1.2 && npRatio <= 2.8 && input.nitrogen_kg_acre <= 220) ? "positive" : "negative",
      explanation: (npRatio >= 1.2 && npRatio <= 2.8 && input.nitrogen_kg_acre <= 220)
        ? "Well-proportioned macronutrient delivery supports root branching and structural firmness."
        : "Imbalanced or excessive nitrogen leads to soft tissue lodging and nutrient antagonism.",
      explanationTa: (npRatio >= 1.2 && npRatio <= 2.8 && input.nitrogen_kg_acre <= 220)
        ? "சமச்சீர் NPK உர அளவு வேர் வளர்ச்சிக்கும் உறுதிக்கும் துணை நிற்கிறது."
        : "சமநிலையற்ற தழைச்சத்து பயிர் சாய்வதற்கும் பூச்சி தாக்குதலுக்கும் வழிவகுக்கும்."
    }
  ];

  // Farm Risk Radar Evaluation
  const waterRiskScore = Math.max(10, Math.min(95, Math.round(
    (100 - input.irrigation_coverage_percent) * 0.6 + (input.rainfall_mm < 500 ? (500 - input.rainfall_mm) * 0.1 : 0)
  )));

  const climateRiskScore = Math.max(12, Math.min(95, Math.round(
    (input.temperature_c > 35 ? (input.temperature_c - 35) * 8 : (input.temperature_c < 20 ? (20 - input.temperature_c) * 6 : 15)) +
    (input.rainfall_mm < 350 || input.rainfall_mm > 1650 ? 25 : 5)
  )));

  const soilRiskScore = Math.max(10, Math.min(95, Math.round(
    Math.abs(input.soil_ph - 6.8) * 18 + (input.organic_matter_percent < 2.5 ? (2.5 - input.organic_matter_percent) * 16 : 8)
  )));

  const nutrientRiskScore = Math.max(12, Math.min(95, Math.round(
    (input.nitrogen_kg_acre > 230 ? 25 : 5) +
    (input.phosphorus_kg_acre < 35 ? 25 : 5) +
    (input.potassium_kg_acre < 45 ? 25 : 5) +
    (npRatio > 4 ? 20 : 5)
  )));

  const pestRiskScore = Math.max(10, Math.min(95, Math.round(input.pest_pressure_index * 115)));

  const getRiskLevel = (score: number): { level: 'Low' | 'Moderate' | 'High'; levelTa: 'குறைவு' | 'நடுத்தரம்' | 'அதிகம்' } => {
    if (score < 40) return { level: 'Low', levelTa: 'குறைவு' };
    if (score <= 68) return { level: 'Moderate', levelTa: 'நடுத்தரம்' };
    return { level: 'High', levelTa: 'அதிகம்' };
  };

  const risks: RiskItem[] = [
    {
      category: "Water Risk",
      categoryTa: "நீர் மேலாண்மை ஆபத்து",
      score: waterRiskScore,
      ...getRiskLevel(waterRiskScore),
      summary: waterRiskScore > 65 ? "High moisture deficit threat detected" : "Adequate water buffering available",
      summaryTa: waterRiskScore > 65 ? "கடுமையான நீர் தட்டுப்பாடு அபாயம்" : "போதுமான நீர் ஆதரவு உள்ளது",
      detail: `Irrigation covers ${input.irrigation_coverage_percent}% while seasonal rainfall is ${Math.round(input.rainfall_mm)}mm.`,
      detailTa: `பாசன பரப்பளவு ${input.irrigation_coverage_percent}%, மழைப்பொழிவு ${Math.round(input.rainfall_mm)} மி.மீ.`
    },
    {
      category: "Climate Risk",
      categoryTa: "வானிலை & வெப்பநிலை ஆபத்து",
      score: climateRiskScore,
      ...getRiskLevel(climateRiskScore),
      summary: climateRiskScore > 65 ? "Thermal stress beyond comfort threshold" : "Thermal conditions within expected ranges",
      summaryTa: climateRiskScore > 65 ? "பயிர் தாங்க முடியாத வெப்பநிலை அழுத்தம்" : "வானிலை சுமுகமாக உள்ளது",
      detail: `Temperature recorded at ${input.temperature_c}°C with current rainfall regime.`,
      detailTa: `தற்போதைய வெப்பநிலை ${input.temperature_c}°C.`
    },
    {
      category: "Soil Risk",
      categoryTa: "மண் வளம் & கார அமில ஆபத்து",
      score: soilRiskScore,
      ...getRiskLevel(soilRiskScore),
      summary: soilRiskScore > 65 ? "Soil reaction or organic depletion limiting uptake" : "Soil physicochemical properties sound",
      summaryTa: soilRiskScore > 65 ? "மண் கார அமில நிலை அல்லது கரிம சத்து குறைவு" : "மண் பண்புகள் சீராக உள்ளன",
      detail: `Soil pH stands at ${input.soil_ph.toFixed(2)} with ${input.organic_matter_percent}% organic matter.`,
      detailTa: `மண் pH ${input.soil_ph.toFixed(2)}, கரிம சத்து ${input.organic_matter_percent}%.`
    },
    {
      category: "Nutrient Risk",
      categoryTa: "ஊட்டச்சத்து சமநிலையின்மை ஆபத்து",
      score: nutrientRiskScore,
      ...getRiskLevel(nutrientRiskScore),
      summary: nutrientRiskScore > 65 ? "Severe N-P-K skew or critical macronutrient shortage" : "Nutrient ratios balanced",
      summaryTa: nutrientRiskScore > 65 ? "NPK உர விகிதத்தில் ஏற்றத்தாழ்வு" : "உர அளவு சமநிலையில் உள்ளது",
      detail: `N:P:K measured at ${Math.round(input.nitrogen_kg_acre)}:${Math.round(input.phosphorus_kg_acre)}:${Math.round(input.potassium_kg_acre)} kg/acre.`,
      detailTa: `NPK அளவு ${Math.round(input.nitrogen_kg_acre)}:${Math.round(input.phosphorus_kg_acre)}:${Math.round(input.potassium_kg_acre)} கிலோ/ஏக்கர்.`
    },
    {
      category: "Pest Risk",
      categoryTa: "பூச்சி மற்றும் நோய் ஆபத்து",
      score: pestRiskScore,
      ...getRiskLevel(pestRiskScore),
      summary: pestRiskScore > 65 ? "Critical pest pressure threatening biomass loss" : "Pest population below economic injury limit",
      summaryTa: pestRiskScore > 65 ? "அதிகரித்த பூச்சி அழுத்தம் விளைச்சலை பாதிக்கும்" : "பூச்சி தாக்கம் கட்டுப்பாட்டில் உள்ளது",
      detail: `Pest pressure index at ${(input.pest_pressure_index).toFixed(3)} (threshold 0.25).`,
      detailTa: `பூச்சி குறியீடு ${(input.pest_pressure_index).toFixed(3)}.`
    }
  ];

  // Identify Top Risk
  const sortedRisks = [...risks].sort((a, b) => b.score - a.score);
  const topRisk = sortedRisks[0];

  // Dynamic Prioritized Action Plan
  const actionPlan: ActionRecommendation[] = [];

  if (input.irrigation_coverage_percent < 55) {
    actionPlan.push({
      priority: 1,
      title: "Enhance Irrigation & Moisture Conservation",
      titleTa: "பாசன பரப்பை விரிவுபடுத்துதல் மற்றும் ஈரப்பத மேலாண்மை",
      category: "Water Readiness",
      currentCondition: `Current irrigation coverage is only ${input.irrigation_coverage_percent}%.`,
      currentConditionTa: `தற்போதைய பாசன வசதி ${input.irrigation_coverage_percent}% மட்டுமே.`,
      whyItMatters: "Insufficient moisture during vegetative and reproductive stages causes flower abortion and stunted kernels.",
      whyItMattersTa: "பயிர் வளர்ச்சி மற்றும் பூக்கும் பருவத்தில் நீர் பற்றாக்குறை மகசூலை நேரடியாக குறைக்கும்.",
      suggestedImprovement: "Implement micro-drip or sprinkler cycles to increase coverage above 75%, and apply organic straw mulch.",
      suggestedImprovementTa: "சொட்டு நீர் பாசனம் அமைத்து பாசனத்தை 75% மேல் உயர்த்தவும், வைக்கோல் மூடாக்கு இடவும்.",
      estimatedImpactPoints: Math.min(12, Math.round((75 - input.irrigation_coverage_percent) * 0.22))
    });
  }

  if (input.pest_pressure_index > 0.35) {
    actionPlan.push({
      priority: actionPlan.length + 1,
      title: "Integrated Pest & Canopy Protection",
      titleTa: "ஒருங்கிணைந்த பூச்சி கட்டுப்பாடு மேலாண்மை",
      category: "Crop Protection",
      currentCondition: `Pest pressure index is elevated at ${input.pest_pressure_index.toFixed(3)}.`,
      currentConditionTa: `பூச்சி அழுத்தம் குறியீடு ${input.pest_pressure_index.toFixed(3)} ஆக உள்ளது.`,
      whyItMatters: "High pest infestation reduces active photosynthetic leaf area and invites secondary viral vectors.",
      whyItMattersTa: "அதிக பூச்சி தாக்கம் இலைகளின் ஒளிச்சேர்க்கை திறனை குறைத்து நோய்களை பரப்பும்.",
      suggestedImprovement: "Deploy yellow sticky traps, neem-based biological repellents, and monitor field border vegetation.",
      suggestedImprovementTa: "மஞ்சள் ஒட்டும் பொறிகள், வேப்பெண்ணெய் கரைசல் மற்றும் இயற்கை எதிரிகளை பயன்படுத்தவும்.",
      estimatedImpactPoints: Math.min(10, Math.round((input.pest_pressure_index - 0.2) * 22))
    });
  }

  if (input.organic_matter_percent < 2.8 || input.soil_ph < 5.8 || input.soil_ph > 7.8) {
    actionPlan.push({
      priority: actionPlan.length + 1,
      title: "Soil Conditioning & Organic Matter Enrichment",
      titleTa: "மண் வளம் பெருக்கல் மற்றும் கார அமில சமநிலை",
      category: "Soil Health",
      currentCondition: `Soil pH is ${input.soil_ph.toFixed(2)} with ${input.organic_matter_percent}% organic matter.`,
      currentConditionTa: `மண் pH ${input.soil_ph.toFixed(2)}, கரிம சத்து ${input.organic_matter_percent}%.`,
      whyItMatters: "Suboptimal soil reaction locks applied phosphorus and potassium, lowering fertilizer use efficiency.",
      whyItMattersTa: "மண்ணின் தீவிர கார அல்லது அமில நிலை பயிர்கள் உரங்களை உறிஞ்சுவதை தடுக்கிறது.",
      suggestedImprovement: input.soil_ph < 5.8 
        ? "Apply agricultural lime (calcium carbonate) alongside farmyard manure or green compost."
        : input.soil_ph > 7.8
          ? "Incorporate gypsum and humic compost to lower alkalinity and improve percolation."
          : "Apply 2-3 tons/acre well-decomposed bio-compost to raise organic matter above 3.5%.",
      suggestedImprovementTa: input.soil_ph < 5.8
        ? "அமிலத் தன்மையை குறைக்க விவசாய சுண்ணாம்பு மற்றும் மக்கிய தொழு உரம் இடவும்."
        : input.soil_ph > 7.8
          ? "காரத் தன்மையை குறைக்க ஜிப்சம் மற்றும் மக்கிய உரம் சேர்த்து மண்ணை சமன் செய்யவும்."
          : "மண்ணின் கரிம சத்தை அதிகரிக்க ஏக்கருக்கு 2-3 டன் மக்கிய இயற்கை உரம் இடவும்.",
      estimatedImpactPoints: 7
    });
  }

  if (input.nitrogen_kg_acre > 220 || input.phosphorus_kg_acre < 45 || input.potassium_kg_acre < 50) {
    actionPlan.push({
      priority: actionPlan.length + 1,
      title: "Nutrient Calibration & Balanced N-P-K Ratio",
      titleTa: "சமச்சீர் N-P-K ஊட்டச்சத்து மேலாண்மை",
      category: "Nutrient Management",
      currentCondition: `Current NPK is ${Math.round(input.nitrogen_kg_acre)}:${Math.round(input.phosphorus_kg_acre)}:${Math.round(input.potassium_kg_acre)} kg/ac.`,
      currentConditionTa: `தற்போதைய NPK அளவு ${Math.round(input.nitrogen_kg_acre)}:${Math.round(input.phosphorus_kg_acre)}:${Math.round(input.potassium_kg_acre)} கிலோ/ஏக்கர்.`,
      whyItMatters: "Excess nitrogen without adequate potassium makes stems brittle and susceptible to drought or fungal blast.",
      whyItMattersTa: "பொட்டாஷ் மற்றும் மணிச்சத்து இல்லாத அதிக தழைச்சத்து பயிரை பலவீனமாக்கும்.",
      suggestedImprovement: "Moderate synthetic urea applications; top-dress with bio-potash and rock phosphate for balanced root support.",
      suggestedImprovementTa: "யூரியாவை குறைத்து, தேவையான அளவு பொட்டாஷ் மற்றும் பாஸ்பேட் உரங்களை பிரித்து இடவும்.",
      estimatedImpactPoints: 6
    });
  }

  // Fallback if farm is already highly optimal
  if (actionPlan.length === 0) {
    actionPlan.push({
      priority: 1,
      title: "Maintain Precision Monitoring & Micronutrient Spray",
      titleTa: "துல்லிய மேலாண்மை மற்றும் நுண்ணூட்டச்சத்து தெளிப்பு",
      category: "Yield Maintenance",
      currentCondition: "Farm parameters are closely aligned with optimal reference norms.",
      currentConditionTa: "பண்ணை குறியீடுகள் உகந்த நிலையில் உள்ளன.",
      whyItMatters: "Sustaining high potential requires safeguarding against mid-season climatic spikes or micronutrient leaching.",
      whyItMattersTa: "நிலையான விளைச்சலுக்கு நுண்ணூட்டச்சத்து சமநிலையை தொடர்ந்து பேண வேண்டும்.",
      suggestedImprovement: "Schedule prophylactic bio-stimulant or zinc/boron foliar application at vegetative transition.",
      suggestedImprovementTa: "பூக்கும் பருவத்திற்கு முன் துத்தநாகம், போரான் நுண்ணூட்டக் கரைசலை தெளிக்கவும்.",
      estimatedImpactPoints: 3
    });
  }

  // Score Grade
  let scoreGrade = "Excellent";
  let scoreGradeTa = "மிகச் சிறந்தது";
  if (potentialScore < 45) {
    scoreGrade = "Needs Critical Intervention";
    scoreGradeTa = "உடனடி கவனம் தேவை";
  } else if (potentialScore < 65) {
    scoreGrade = "Moderate Potential";
    scoreGradeTa = "நடுத்தர வளர்ச்சி திறன்";
  } else if (potentialScore < 80) {
    scoreGrade = "Good Potential";
    scoreGradeTa = "நல்ல வளர்ச்சி திறன்";
  }

  return {
    potentialScore,
    scoreGrade,
    scoreGradeTa,
    soilHealthPercent,
    waterReadinessPercent,
    climateSuitabilityPercent,
    pestRiskPercent,
    nutrientBalancePercent,
    contributions,
    risks,
    topRisk,
    actionPlan,
    breakdown: {
      climatePoints,
      soilPoints,
      nutrientPoints,
      waterPoints,
      pestPenalty
    }
  };
}
