import React from 'react';
import { EvaluationResult, Language } from '../data/types';
import { translations } from '../data/translations';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Droplet, 
  Thermometer, 
  Sprout, 
  Bug, 
  Info,
  TrendingUp,
  FlaskConical
} from 'lucide-react';

interface DashboardSectionProps {
  evaluation: EvaluationResult;
  language: Language;
  onExploreFactorsClick: () => void;
  onOpenWhatIfClick: () => void;
}

export const DashboardSection: React.FC<DashboardSectionProps> = ({
  evaluation,
  language,
  onExploreFactorsClick,
  onOpenWhatIfClick
}) => {
  const t = translations[language];
  const { 
    potentialScore, 
    scoreGrade, 
    scoreGradeTa,
    soilHealthPercent, 
    waterReadinessPercent, 
    climateSuitabilityPercent, 
    pestRiskPercent,
    nutrientBalancePercent,
    contributions,
    topRisk
  } = evaluation;

  // Split factors into positive and negative
  const positiveFactors = contributions.filter(c => c.status === 'positive' || c.impact > 0);
  const negativeFactors = contributions.filter(c => c.status === 'negative' || c.impact < 0);

  // Circular gauge circumference
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (potentialScore / 100) * circumference;

  // Color theme based on potential score
  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-emerald-600 stroke-emerald-600';
    if (score >= 55) return 'text-amber-600 stroke-amber-600';
    return 'text-rose-600 stroke-rose-600';
  };

  return (
    <section id="intelligence" className="py-14 bg-stone-50 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
              <span>01</span>
              <span>·</span>
              <span>{language === 'ta' ? 'விவசாய நுண்ணறிவு' : 'Farm Intelligence Telemetry'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              {t.dashTitle}
            </h2>
            <p className="text-sm text-stone-600 mt-1 max-w-2xl">
              {t.dashSubtitle}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-1 bg-white border border-stone-200 text-stone-700 font-medium rounded-lg">
              {language === 'ta' ? 'நிலை:' : 'Status:'}{' '}
              <strong className="text-emerald-700">{language === 'ta' ? scoreGradeTa : scoreGrade}</strong>
            </span>
          </div>
        </div>

        {/* Top Cards: Score Dial & Primary Dimensions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Main Dial Card: Crop Yield Potential Score */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-stone-200/90 p-6 sm:p-7 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">
                    {t.potentialScoreLabel}
                  </span>
                  <h3 className="text-lg font-bold text-stone-900 mt-0.5">
                    {language === 'ta' ? 'பயிர் வளர்ச்சி திறன் மதிப்பீடு' : 'Calculated Potential'}
                  </h3>
                </div>
                <div className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {language === 'ta' ? scoreGradeTa : scoreGrade}
                </div>
              </div>

              {/* Circular Meter */}
              <div className="my-6 flex flex-col sm:flex-row items-center justify-center gap-6">
                <div className="relative w-36 h-36 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 130 130">
                    {/* Background track */}
                    <circle
                      cx="65"
                      cy="65"
                      r={radius}
                      className="stroke-stone-100"
                      strokeWidth="11"
                      fill="transparent"
                    />
                    {/* Active stroke */}
                    <circle
                      cx="65"
                      cy="65"
                      r={radius}
                      className={`${getScoreColor(potentialScore)} transition-all duration-1000 ease-out`}
                      strokeWidth="11"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      fill="transparent"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-4xl font-extrabold font-mono text-stone-900 tabular-nums">
                      {potentialScore}
                    </span>
                    <span className="text-xs font-medium text-stone-500">/ 100</span>
                  </div>
                </div>

                <div className="text-left space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-stone-700">80–100: Prime Conditions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span className="text-stone-700">55–79: Moderate Potential</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <span className="text-stone-700">&lt; 55: High Risk Bottlenecks</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Scientific Transparency Disclaimer */}
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-600 flex items-start gap-2">
              <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                {t.potentialScoreDisclaimer}
              </p>
            </div>
          </div>

          {/* Secondary 5 Dimension Metrics Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Metric 1: Soil Health */}
            <div className="bg-white rounded-xl border border-stone-200/90 p-5 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                  {t.soilHealth}
                </span>
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center">
                  <Sprout className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold font-mono text-stone-900 tabular-nums">
                    {soilHealthPercent}%
                  </span>
                  <span className="text-xs text-stone-500">
                    {language === 'ta' ? 'pH மற்றும் கரிம சத்து' : 'pH & Organic Matter'}
                  </span>
                </div>
                <div className="w-full h-2 bg-stone-100 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-amber-600 rounded-full transition-all duration-700"
                    style={{ width: `${soilHealthPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Metric 2: Water Readiness */}
            <div className="bg-white rounded-xl border border-stone-200/90 p-5 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                  {t.waterReadiness}
                </span>
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                  <Droplet className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold font-mono text-stone-900 tabular-nums">
                    {waterReadinessPercent}%
                  </span>
                  <span className="text-xs text-stone-500">
                    {language === 'ta' ? 'பாசனம் மற்றும் மழை' : 'Irrigation & Rain'}
                  </span>
                </div>
                <div className="w-full h-2 bg-stone-100 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-700"
                    style={{ width: `${waterReadinessPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Metric 3: Climate Suitability */}
            <div className="bg-white rounded-xl border border-stone-200/90 p-5 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                  {t.climateSuitability}
                </span>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Thermometer className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold font-mono text-stone-900 tabular-nums">
                    {climateSuitabilityPercent}%
                  </span>
                  <span className="text-xs text-stone-500">
                    {language === 'ta' ? 'வெப்பநிலை பொருத்தம்' : 'Thermal Profile'}
                  </span>
                </div>
                <div className="w-full h-2 bg-stone-100 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 rounded-full transition-all duration-700"
                    style={{ width: `${climateSuitabilityPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Metric 4: Nutrient Balance */}
            <div className="bg-white rounded-xl border border-stone-200/90 p-5 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                  {t.nutrientBalance}
                </span>
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
                  <FlaskConical className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold font-mono text-stone-900 tabular-nums">
                    {nutrientBalancePercent}%
                  </span>
                  <span className="text-xs text-stone-500">
                    {language === 'ta' ? 'NPK சமநிலை' : 'NPK Harmony'}
                  </span>
                </div>
                <div className="w-full h-2 bg-stone-100 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-purple-600 rounded-full transition-all duration-700"
                    style={{ width: `${nutrientBalancePercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Bottom Wide Alert: Top Identified Risk */}
            <div className="sm:col-span-2 bg-stone-900 text-white rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 block">
                    {language === 'ta' ? 'கண்டறியப்பட்ட முதன்மை ஆபத்து:' : 'Primary Detected Vulnerability:'}{' '}
                    {language === 'ta' ? topRisk.categoryTa : topRisk.category}
                  </span>
                  <p className="text-xs text-stone-300 mt-0.5">
                    {language === 'ta' ? topRisk.summaryTa : topRisk.summary}
                  </p>
                </div>
              </div>
              <button
                onClick={onOpenWhatIfClick}
                className="px-3.5 py-1.5 text-xs font-semibold text-stone-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg whitespace-nowrap transition-colors"
              >
                {language === 'ta' ? 'மாற்றிப்பார் (What-If)' : 'Simulate Fix'}
              </button>
            </div>
          </div>
        </div>

        {/* Why this score? (Explainable factors breakdown) */}
        <div className="mt-8 bg-white rounded-2xl border border-stone-200/90 p-6 sm:p-7 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 pb-4 border-b border-stone-100 gap-2">
            <div>
              <h3 className="text-lg font-bold text-stone-900 tracking-tight flex items-center gap-2">
                <span>{t.whyThisScore}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-semibold">
                  {language === 'ta' ? 'வெளிப்படையான AI கணக்கீடு' : 'Transparent Calculation'}
                </span>
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                {t.whySubtitle}
              </p>
            </div>

            <button
              onClick={onExploreFactorsClick}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 group self-start sm:self-auto"
            >
              <span>{language === 'ta' ? 'முழு விளக்க விளக்கப்படம் காண்க' : 'Open Feature Contribution Chart'}</span>
              <TrendingUp className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Positive Factors */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{t.positiveFactors}</span>
              </div>
              <div className="space-y-2">
                {positiveFactors.slice(0, 3).map((f, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100 text-xs flex items-start justify-between gap-3"
                  >
                    <div>
                      <span className="font-semibold text-stone-900 block">{f.name}</span>
                      <p className="text-stone-600 text-[11px] mt-0.5 leading-snug">
                        {language === 'ta' ? f.explanationTa : f.explanation}
                      </p>
                    </div>
                    <span className="font-mono font-bold text-emerald-700 text-xs shrink-0 tabular-nums">
                      +{Math.abs(f.impact)} pts
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Negative / Limiting Factors */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-rose-800">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>{t.negativeFactors}</span>
              </div>
              <div className="space-y-2">
                {negativeFactors.length === 0 ? (
                  <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-500 text-center">
                    {language === 'ta' ? 'குறிப்பிடத்தக்க குறைபாடுகள் இல்லை.' : 'No major negative bottlenecks detected in current conditions.'}
                  </div>
                ) : (
                  negativeFactors.slice(0, 3).map((f, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-rose-50/50 border border-rose-100 text-xs flex items-start justify-between gap-3"
                    >
                      <div>
                        <span className="font-semibold text-stone-900 block">{f.name}</span>
                        <p className="text-stone-600 text-[11px] mt-0.5 leading-snug">
                          {language === 'ta' ? f.explanationTa : f.explanation}
                        </p>
                      </div>
                      <span className="font-mono font-bold text-rose-700 text-xs shrink-0 tabular-nums">
                        {f.impact} pts
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
