import React, { useState } from 'react';
import { CropRecord, EvaluationResult, Language } from '../data/types';
import { translations } from '../data/translations';
import { calculateYieldPotential } from '../data/scoringEngine';
import { 
  Sliders, 
  RotateCcw, 
  ArrowUpRight, 
  ArrowDownRight, 
  Sparkles, 
  Check, 
  Activity,
  Layers
} from 'lucide-react';

interface WhatIfSectionProps {
  currentRecord: CropRecord;
  currentEvaluation: EvaluationResult;
  language: Language;
}

export const WhatIfSection: React.FC<WhatIfSectionProps> = ({
  currentRecord,
  currentEvaluation,
  language
}) => {
  const t = translations[language];
  const [simulatedRecord, setSimulatedRecord] = useState<CropRecord>({ ...currentRecord });
  const [activePreset, setActivePreset] = useState<string>('current');

  // Recalculate whenever simulatedRecord changes
  const simulatedEvaluation = calculateYieldPotential(simulatedRecord);

  const deltaScore = simulatedEvaluation.potentialScore - currentEvaluation.potentialScore;

  const handleSliderChange = (field: keyof CropRecord, val: number) => {
    setActivePreset('custom');
    setSimulatedRecord(prev => ({
      ...prev,
      [field]: val
    }));
  };

  const applyPreset = (presetKey: string) => {
    setActivePreset(presetKey);
    const base = { ...currentRecord };

    switch (presetKey) {
      case 'current':
        setSimulatedRecord({ ...currentRecord });
        break;
      case 'irrigation':
        setSimulatedRecord({
          ...base,
          irrigation_coverage_percent: Math.min(95, base.irrigation_coverage_percent + 40)
        });
        break;
      case 'soil':
        setSimulatedRecord({
          ...base,
          organic_matter_percent: Math.min(5.5, base.organic_matter_percent + 1.8),
          soil_ph: 6.8
        });
        break;
      case 'pest':
        setSimulatedRecord({
          ...base,
          pest_pressure_index: Math.max(0.08, base.pest_pressure_index * 0.25)
        });
        break;
      case 'climate':
        setSimulatedRecord({
          ...base,
          temperature_c: Math.min(42, base.temperature_c + 5.5),
          rainfall_mm: Math.max(220, base.rainfall_mm - 350)
        });
        break;
      case 'nutrients':
        setSimulatedRecord({
          ...base,
          nitrogen_kg_acre: 140,
          phosphorus_kg_acre: 85,
          potassium_kg_acre: 110
        });
        break;
    }
  };

  const comparisonMetrics = [
    {
      name: language === 'ta' ? 'நீர் தயார்நிலை' : 'Water Readiness',
      current: currentEvaluation.waterReadinessPercent,
      simulated: simulatedEvaluation.waterReadinessPercent,
      unit: '%'
    },
    {
      name: language === 'ta' ? 'மண் வளம்' : 'Soil Health',
      current: currentEvaluation.soilHealthPercent,
      simulated: simulatedEvaluation.soilHealthPercent,
      unit: '%'
    },
    {
      name: language === 'ta' ? 'வானிலை பொருத்தம்' : 'Climate Suitability',
      current: currentEvaluation.climateSuitabilityPercent,
      simulated: simulatedEvaluation.climateSuitabilityPercent,
      unit: '%'
    },
    {
      name: language === 'ta' ? 'உர சமநிலை' : 'Nutrient Balance',
      current: currentEvaluation.nutrientBalancePercent,
      simulated: simulatedEvaluation.nutrientBalancePercent,
      unit: '%'
    },
  ];

  return (
    <section id="whatif" className="py-14 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
            <span>04</span>
            <span>·</span>
            <span>{t.whatIfTitle}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            {t.whatIfSubtitle}
          </h2>
          <p className="text-sm text-stone-600 mt-1">
            {t.whatIfDesc}
          </p>
        </div>

        {/* Preset Scenarios Strip */}
        <div className="mb-8 p-4 rounded-2xl bg-stone-50 border border-stone-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              <span>{t.presetScenarios}:</span>
            </span>
            <button
              onClick={() => applyPreset('current')}
              className="text-xs text-stone-500 hover:text-stone-800 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {[
              { id: 'current', label: t.presetCurrent },
              { id: 'irrigation', label: t.presetIrrigation },
              { id: 'soil', label: t.presetSoil },
              { id: 'pest', label: t.presetPest },
              { id: 'climate', label: t.presetClimate },
              { id: 'nutrients', label: t.presetNutrients },
            ].map(p => (
              <button
                key={p.id}
                onClick={() => applyPreset(p.id)}
                className={`px-3 py-2 text-xs font-semibold rounded-xl text-center transition-all border whitespace-nowrap ${
                  activePreset === p.id
                    ? 'bg-emerald-700 text-white border-emerald-800 shadow-sm'
                    : 'bg-white text-stone-700 hover:bg-stone-100 border-stone-200'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Comparison Scoreboard Header */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Current Score */}
          <div className="p-5 rounded-2xl bg-stone-100/80 border border-stone-200 text-center">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
              {t.currentScenario}
            </span>
            <div className="mt-2 flex items-baseline justify-center gap-1">
              <span className="text-3xl font-extrabold font-mono text-stone-800 tabular-nums">
                {currentEvaluation.potentialScore}
              </span>
              <span className="text-xs text-stone-500">/ 100</span>
            </div>
            <span className="text-xs text-stone-500 block mt-1">
              {currentRecord.crop_type} baseline
            </span>
          </div>

          {/* Simulated Score */}
          <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-300 text-center">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
              {t.simulatedScenario}
            </span>
            <div className="mt-2 flex items-baseline justify-center gap-1">
              <span className="text-3xl font-extrabold font-mono text-emerald-900 tabular-nums">
                {simulatedEvaluation.potentialScore}
              </span>
              <span className="text-xs text-emerald-700">/ 100</span>
            </div>
            <span className="text-xs text-emerald-700 font-semibold block mt-1">
              {language === 'ta' ? simulatedEvaluation.scoreGradeTa : simulatedEvaluation.scoreGrade}
            </span>
          </div>

          {/* Delta Impact */}
          <div className={`p-5 rounded-2xl border text-center ${
            deltaScore > 0 
              ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm' 
              : deltaScore < 0 
                ? 'bg-rose-600 text-white border-rose-700 shadow-sm' 
                : 'bg-stone-800 text-white border-stone-900'
          }`}>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-100 block">
              {t.estimatedChange}
            </span>
            <div className="mt-2 flex items-center justify-center gap-1.5">
              {deltaScore > 0 ? (
                <ArrowUpRight className="w-6 h-6 text-emerald-200" />
              ) : deltaScore < 0 ? (
                <ArrowDownRight className="w-6 h-6 text-rose-200" />
              ) : null}
              <span className="text-3xl font-extrabold font-mono tabular-nums">
                {deltaScore > 0 ? `+${deltaScore}` : deltaScore}
              </span>
              <span className="text-xs font-medium text-emerald-100">points</span>
            </div>
            <span className="text-xs text-emerald-100 block mt-1">
              {deltaScore > 0 
                ? (language === 'ta' ? 'மேம்பட்ட சாத்தியக்கூறு' : 'Projected potential gain')
                : deltaScore < 0 
                  ? (language === 'ta' ? 'அபாயக் குறைவு' : 'Stress penalty')
                  : (language === 'ta' ? 'மாற்றமில்லை' : 'No net variance')}
            </span>
          </div>
        </div>

        {/* Two-Column Sliders & Radar/Bar Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sliders Grid */}
          <div className="lg:col-span-7 bg-stone-50/60 rounded-2xl border border-stone-200 p-6 sm:p-7 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <span className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-emerald-700" />
                <span>{language === 'ta' ? 'விவசாய காரணிகள் ஸ்லைடர்' : 'Interactive Simulation Controls'}</span>
              </span>
              <span className="text-[11px] text-stone-500 font-mono">
                Live Delta Feedback
              </span>
            </div>

            {/* Slider 1: Irrigation */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-stone-700">{t.fieldIrrigation}</span>
                <span className="font-mono text-emerald-800 tabular-nums">
                  {Math.round(simulatedRecord.irrigation_coverage_percent)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={simulatedRecord.irrigation_coverage_percent}
                onChange={(e) => handleSliderChange('irrigation_coverage_percent', Number(e.target.value))}
                className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
            </div>

            {/* Slider 2: Soil pH */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-stone-700">{t.fieldSoilPh}</span>
                <span className="font-mono text-emerald-800 tabular-nums">
                  {simulatedRecord.soil_ph.toFixed(2)} pH
                </span>
              </div>
              <input
                type="range"
                min="4.5"
                max="9.0"
                step="0.05"
                value={simulatedRecord.soil_ph}
                onChange={(e) => handleSliderChange('soil_ph', Number(e.target.value))}
                className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
            </div>

            {/* Slider 3: Organic Matter */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-stone-700">{t.fieldOrganicMatter}</span>
                <span className="font-mono text-emerald-800 tabular-nums">
                  {simulatedRecord.organic_matter_percent.toFixed(1)}%
                </span>
              </div>
              <input
                type="range"
                min="0.2"
                max="6.5"
                step="0.1"
                value={simulatedRecord.organic_matter_percent}
                onChange={(e) => handleSliderChange('organic_matter_percent', Number(e.target.value))}
                className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
            </div>

            {/* Slider 4: Pest Pressure */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-stone-700">{t.fieldPestPressure}</span>
                <span className="font-mono text-emerald-800 tabular-nums">
                  {simulatedRecord.pest_pressure_index.toFixed(3)}
                </span>
              </div>
              <input
                type="range"
                min="0.01"
                max="0.80"
                step="0.01"
                value={simulatedRecord.pest_pressure_index}
                onChange={(e) => handleSliderChange('pest_pressure_index', Number(e.target.value))}
                className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
            </div>

            {/* Slider 5: Rainfall */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-stone-700">{t.fieldRainfall}</span>
                <span className="font-mono text-emerald-800 tabular-nums">
                  {Math.round(simulatedRecord.rainfall_mm)} mm
                </span>
              </div>
              <input
                type="range"
                min="200"
                max="2000"
                step="25"
                value={simulatedRecord.rainfall_mm}
                onChange={(e) => handleSliderChange('rainfall_mm', Number(e.target.value))}
                className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
            </div>

            {/* Slider 6: Temperature */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-stone-700">{t.fieldTemperature}</span>
                <span className="font-mono text-emerald-800 tabular-nums">
                  {simulatedRecord.temperature_c.toFixed(1)}°C
                </span>
              </div>
              <input
                type="range"
                min="16"
                max="44"
                step="0.5"
                value={simulatedRecord.temperature_c}
                onChange={(e) => handleSliderChange('temperature_c', Number(e.target.value))}
                className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
            </div>
          </div>

          {/* Sub-Metric Comparison Bars */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-stone-200 p-6 sm:p-7 shadow-xs space-y-6">
            <div className="pb-3 border-b border-stone-100">
              <h4 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
                {language === 'ta' ? 'தற்போதைய vs பரிசோதிக்கப்படும் நிலை' : 'Current vs What-If Dimension Comparison'}
              </h4>
              <span className="text-xs text-stone-500">
                {language === 'ta' ? 'நிகழ்நேர விளைவு மதிப்பீடு' : 'Real-time response on agricultural pillars'}
              </span>
            </div>

            <div className="space-y-4">
              {comparisonMetrics.map((m, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 text-xs">
                  <div className="flex justify-between font-semibold text-stone-800 mb-2">
                    <span>{m.name}</span>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-stone-500">{m.current}%</span>
                      <span className="text-stone-400">→</span>
                      <span className={`font-bold ${
                        m.simulated > m.current ? 'text-emerald-700' : m.simulated < m.current ? 'text-rose-700' : 'text-stone-900'
                      }`}>
                        {m.simulated}%
                      </span>
                    </div>
                  </div>

                  {/* Dual Bar Comparison */}
                  <div className="space-y-1">
                    <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
                      <div className="h-full bg-stone-500 rounded-full" style={{ width: `${m.current}%` }} />
                    </div>
                    <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${
                          m.simulated >= m.current ? 'bg-emerald-600' : 'bg-rose-500'
                        }`} 
                        style={{ width: `${m.simulated}%` }} 
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 leading-relaxed">
              <span className="font-bold block mb-1">
                {language === 'ta' ? '💡 AI முடிவு பரிசோதனை' : '💡 Decision Takeaway'}
              </span>
              {deltaScore >= 5 ? (
                <p>
                  {language === 'ta'
                    ? 'இந்த மாற்றங்களைச் செயல்படுத்துவது பண்ணை வளர்ச்சி திறனை கணிசமாக உயர்த்துகிறது.'
                    : 'The simulated intervention successfully relieves key farm stress vectors, lifting potential.'}
                </p>
              ) : deltaScore <= -5 ? (
                <p>
                  {language === 'ta'
                    ? 'எச்சரிக்கை: இந்த மாற்றங்கள் பயிருக்கு கூடுதல் அழுத்தத்தை ஏற்படுத்தி திறனைக் குறைக்கிறது.'
                    : 'Caution: The simulated shift triggers agronomic bottlenecks or heat/moisture stress.'}
                </p>
              ) : (
                <p>
                  {language === 'ta'
                    ? 'பரிசோதிக்கப்பட்ட அளவுகள் தற்போதைய சமநிலைக்கு நெருக்கமாக உள்ளன.'
                    : 'The simulated changes maintain near-identical parity with baseline conditions.'}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
