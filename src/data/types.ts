export interface CropRecord {
  crop_type: string;
  cultivated_area_acres: number;
  rainfall_mm: number;
  temperature_c: number;
  soil_ph: number;
  nitrogen_kg_acre: number;
  phosphorus_kg_acre: number;
  potassium_kg_acre: number;
  organic_matter_percent: number;
  irrigation_coverage_percent: number;
  pest_pressure_index: number;
}

export interface CropProfile {
  crop_type: string;
  count: number;
  avgRainfall: number;
  minRainfall: number;
  maxRainfall: number;
  avgTemperature: number;
  minTemperature: number;
  maxTemperature: number;
  avgSoilPh: number;
  minSoilPh: number;
  maxSoilPh: number;
  avgNitrogen: number;
  avgPhosphorus: number;
  avgPotassium: number;
  avgOrganicMatter: number;
  avgIrrigation: number;
  avgPestPressure: number;
  optimalPhRange: [number, number];
  optimalTempRange: [number, number];
  optimalRainfallRange: [number, number];
}

export interface FactorContribution {
  name: string;
  category: 'water' | 'climate' | 'soil' | 'nutrient' | 'pest';
  impact: number; // positive or negative points
  currentValue: number | string;
  unit: string;
  referenceNorm: string;
  status: 'positive' | 'negative' | 'neutral';
  explanation: string;
  explanationTa: string;
}

export interface RiskItem {
  category: string;
  categoryTa: string;
  score: number; // 0 - 100 risk score
  level: 'Low' | 'Moderate' | 'High';
  levelTa: 'குறைவு' | 'நடுத்தரம்' | 'அதிகம்';
  summary: string;
  summaryTa: string;
  detail: string;
  detailTa: string;
}

export interface ActionRecommendation {
  priority: number;
  title: string;
  titleTa: string;
  category: string;
  currentCondition: string;
  currentConditionTa: string;
  whyItMatters: string;
  whyItMattersTa: string;
  suggestedImprovement: string;
  suggestedImprovementTa: string;
  estimatedImpactPoints: number;
}

export interface EvaluationResult {
  potentialScore: number;
  scoreGrade: string;
  scoreGradeTa: string;
  soilHealthPercent: number;
  waterReadinessPercent: number;
  climateSuitabilityPercent: number;
  pestRiskPercent: number;
  nutrientBalancePercent: number;
  contributions: FactorContribution[];
  risks: RiskItem[];
  topRisk: RiskItem;
  actionPlan: ActionRecommendation[];
  breakdown: {
    climatePoints: number;
    soilPoints: number;
    nutrientPoints: number;
    waterPoints: number;
    pestPenalty: number;
  };
}

export type Language = 'en' | 'ta';
