import React, { useState } from 'react';
import { CropRecord, EvaluationResult, Language } from '../data/types';
import { translations } from '../data/translations';
import { DEMO_PROFILES } from '../data/dataset';
import { 
  Sparkles, 
  RotateCcw, 
  Check, 
  Layers, 
  Cpu, 
  Loader2, 
  ArrowRight,
  Sliders,
  CheckCircle2
} from 'lucide-react';

interface AnalyzerSectionProps {
  currentRecord: CropRecord;
  evaluation: EvaluationResult;
  language: Language;
  onAnalyze: (newRecord: CropRecord) => void;
  onSelectDemoProfile: (demoId: string) => void;
  onNavigateToWhatIf: () => void;
}

export const AnalyzerSection: React.FC<AnalyzerSectionProps> = ({
  currentRecord,
  evaluation,
  language,
  onAnalyze,
  onSelectDemoProfile,
  onNavigateToWhatIf
}) => {
  const t = translations[language];
  const [formData, setFormData] = useState<CropRecord>(currentRecord);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStepIndex, setScanStepIndex] = useState(0);

  // Sync state if external demo profile was loaded
  React.useEffect(() => {
    setFormData(currentRecord);
  }, [currentRecord]);

  const scanSteps = [
    t.scanStep1, // Reading Data...
    t.scanStep2, // Analyzing Soil & pH...
    t.scanStep3, // Analyzing Climate Regimes...
    t.scanStep4, // Evaluating Crop Conditions...
    t.scanStep5, // Detecting Multi-Factor Risks...
    t.scanStep6  // Generating AI Insights...
  ];

  const handleInputChange = (field: keyof CropRecord, val: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === 'crop_type' ? val : Number(val)
    }));
  };

  const handleRunAnalysis = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsScanning(true);
    setScanStepIndex(0);

    const stepInterval = setInterval(() => {
      setScanStepIndex(prev => {
        if (prev < scanSteps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(stepInterval);
          setTimeout(() => {
            setIsScanning(false);
            onAnalyze(formData);
          }, 400);
          return prev;
        }
      });
    }, 450);
  };

  const crops = ["Groundnut", "Maize", "Tomato", "Cotton", "Sugarcane", "Wheat", "Rice", "Millet"];

  return (
    <section id="analyzer" className="py-14 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
            <span>02</span>
            <span>·</span>
            <span>{language === 'ta' ? 'பண்ணை ஆய்வு' : 'AI Farm Health Scanner'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            {t.scanTitle}
          </h2>
          <p className="text-sm text-stone-600 mt-1">
            {t.scanSubtitle}
          </p>
        </div>

        {/* 1-Click Instant Demo Profiles */}
        <div className="mb-8 p-4 rounded-2xl bg-stone-50 border border-stone-200/90">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              <span>{language === 'ta' ? 'உடனடி மாதிரி சூழல்கள் (1-Click Demo Profiles):' : 'Instant Demo Farm Profiles (1-Click Judge Preview):'}</span>
            </span>
            <span className="text-[11px] text-stone-500 hidden sm:inline">
              {language === 'ta' ? 'முன் அமைக்கப்பட்ட உண்மைத் தரவு' : 'Real dataset values ready for live evaluation'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {DEMO_PROFILES.map((p) => {
              const isActive = currentRecord.crop_type === p.data.crop_type && 
                               Math.abs(currentRecord.rainfall_mm - p.data.rainfall_mm) < 1;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    setFormData(p.data as CropRecord);
                    onSelectDemoProfile(p.id);
                  }}
                  className={`p-2.5 text-left rounded-xl text-xs transition-all border ${
                    isActive
                      ? 'bg-emerald-800 text-white border-emerald-900 shadow-sm'
                      : 'bg-white text-stone-800 hover:bg-emerald-50/60 border-stone-200 hover:border-emerald-300'
                  }`}
                >
                  <span className="font-semibold block truncate">
                    {language === 'ta' ? p.nameTa : p.name}
                  </span>
                  <span className={`text-[10px] block mt-0.5 truncate ${isActive ? 'text-emerald-200' : 'text-stone-500'}`}>
                    {p.data.crop_type} · {p.data.irrigation_coverage_percent}% Irr
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Interactive Form & Scanning Animation Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form Column */}
          <div className="lg:col-span-8 bg-stone-50/60 border border-stone-200 rounded-2xl p-6 sm:p-7 shadow-xs">
            <form onSubmit={handleRunAnalysis} className="space-y-6">
              {/* Group 1: Crop and Land Area */}
              <div>
                <span className="text-xs font-bold text-stone-900 uppercase tracking-wider block mb-3 text-emerald-800">
                  {language === 'ta' ? '1. பயிர் மற்றும் நிலப் பரப்பளவு' : '1. Crop Type & Cultivation Scale'}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      {t.fieldCrop}
                    </label>
                    <select
                      value={formData.crop_type}
                      onChange={(e) => handleInputChange('crop_type', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 text-xs font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                    >
                      {crops.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      {t.fieldArea}
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="0.5"
                      max="500"
                      value={formData.cultivated_area_acres}
                      onChange={(e) => handleInputChange('cultivated_area_acres', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 text-xs font-mono text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent tabular-nums"
                    />
                  </div>
                </div>
              </div>

              {/* Group 2: Weather & Hydrology */}
              <div>
                <span className="text-xs font-bold text-stone-900 uppercase tracking-wider block mb-3 text-emerald-800">
                  {language === 'ta' ? '2. வானிலை & பாசன வசதி' : '2. Climate & Irrigation Infrastructure'}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      {t.fieldRainfall}
                    </label>
                    <input
                      type="number"
                      step="1"
                      min="100"
                      max="2500"
                      value={Math.round(formData.rainfall_mm)}
                      onChange={(e) => handleInputChange('rainfall_mm', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 text-xs font-mono text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent tabular-nums"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      {t.fieldTemperature}
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="10"
                      max="48"
                      value={formData.temperature_c}
                      onChange={(e) => handleInputChange('temperature_c', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 text-xs font-mono text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent tabular-nums"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      {t.fieldIrrigation}
                    </label>
                    <input
                      type="number"
                      step="1"
                      min="0"
                      max="100"
                      value={Math.round(formData.irrigation_coverage_percent)}
                      onChange={(e) => handleInputChange('irrigation_coverage_percent', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 text-xs font-mono text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent tabular-nums"
                    />
                  </div>
                </div>
              </div>

              {/* Group 3: Soil Physico-Chemicals & Biology */}
              <div>
                <span className="text-xs font-bold text-stone-900 uppercase tracking-wider block mb-3 text-emerald-800">
                  {language === 'ta' ? '3. மண் வளம் & பூச்சி அழுத்தம்' : '3. Soil Physicochemical & Pest Indicators'}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      {t.fieldSoilPh}
                    </label>
                    <input
                      type="number"
                      step="0.05"
                      min="4.0"
                      max="9.5"
                      value={formData.soil_ph}
                      onChange={(e) => handleInputChange('soil_ph', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 text-xs font-mono text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent tabular-nums"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      {t.fieldOrganicMatter}
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      max="8.0"
                      value={formData.organic_matter_percent}
                      onChange={(e) => handleInputChange('organic_matter_percent', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 text-xs font-mono text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent tabular-nums"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      {t.fieldPestPressure}
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="1.0"
                      value={formData.pest_pressure_index}
                      onChange={(e) => handleInputChange('pest_pressure_index', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 text-xs font-mono text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent tabular-nums"
                    />
                  </div>
                </div>
              </div>

              {/* Group 4: N-P-K Macronutrients */}
              <div>
                <span className="text-xs font-bold text-stone-900 uppercase tracking-wider block mb-3 text-emerald-800">
                  {language === 'ta' ? '4. N-P-K முதன்மை ஊட்டச்சத்துக்கள்' : '4. Macronutrient Chemistry (N-P-K)'}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      {t.fieldNitrogen}
                    </label>
                    <input
                      type="number"
                      step="1"
                      min="10"
                      max="400"
                      value={Math.round(formData.nitrogen_kg_acre)}
                      onChange={(e) => handleInputChange('nitrogen_kg_acre', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 text-xs font-mono text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent tabular-nums"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      {t.fieldPhosphorus}
                    </label>
                    <input
                      type="number"
                      step="1"
                      min="5"
                      max="250"
                      value={Math.round(formData.phosphorus_kg_acre)}
                      onChange={(e) => handleInputChange('phosphorus_kg_acre', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 text-xs font-mono text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent tabular-nums"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      {t.fieldPotassium}
                    </label>
                    <input
                      type="number"
                      step="1"
                      min="5"
                      max="300"
                      value={Math.round(formData.potassium_kg_acre)}
                      onChange={(e) => handleInputChange('potassium_kg_acre', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 text-xs font-mono text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent tabular-nums"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  type="submit"
                  disabled={isScanning}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md shadow-emerald-900/10 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                >
                  {isScanning ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-emerald-200" />
                      <span>{scanSteps[scanStepIndex]}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-emerald-200" />
                      <span>{t.btnScan}</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setFormData(currentRecord)}
                  className="text-xs text-stone-500 hover:text-stone-800 inline-flex items-center gap-1 font-medium transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{language === 'ta' ? 'அளவுகளை மீட்டமை' : 'Reset Inputs'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Real-time Result Snapshot Column */}
          <div className="lg:col-span-4 space-y-4">
            {/* Elegant AI Scanning Animation Overlay if scanning */}
            {isScanning ? (
              <div className="bg-stone-900 text-white rounded-2xl p-7 border border-emerald-500/40 shadow-xl space-y-5 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Cpu className="w-5 h-5 animate-spin" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block">
                      {language === 'ta' ? 'AI பகுப்பாய்வு நடக்கிறது' : 'AI Inference in Progress'}
                    </span>
                    <span className="text-xs text-stone-400">Multi-Factor Aggregation</span>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  {scanSteps.map((step, idx) => {
                    const isPassed = idx < scanStepIndex;
                    const isCurrent = idx === scanStepIndex;
                    return (
                      <div key={idx} className="flex items-center gap-3 text-xs">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          isPassed 
                            ? 'bg-emerald-500 text-stone-950' 
                            : isCurrent 
                              ? 'bg-amber-400 text-stone-950 animate-bounce' 
                              : 'bg-stone-800 text-stone-500'
                        }`}>
                          {isPassed ? <Check className="w-3 h-3" /> : idx + 1}
                        </div>
                        <span className={isPassed ? 'text-stone-300' : isCurrent ? 'text-white font-bold' : 'text-stone-600'}>
                          {step}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-5">
                <div>
                  <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
                    {language === 'ta' ? 'கடைசி பகுப்பாய்வு முடிவு' : 'Latest Scan Output'}
                  </span>
                  <div className="flex items-baseline justify-between mt-2">
                    <h3 className="text-3xl font-extrabold font-mono text-stone-900 tabular-nums">
                      {evaluation.potentialScore} <span className="text-sm font-normal text-stone-500">/ 100</span>
                    </h3>
                    <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {language === 'ta' ? evaluation.scoreGradeTa : evaluation.scoreGrade}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-xs space-y-2">
                  <div className="flex justify-between text-stone-600">
                    <span>{language === 'ta' ? 'தேர்ந்தெடுத்த பயிர்:' : 'Crop:'}</span>
                    <strong className="text-stone-900">{currentRecord.crop_type}</strong>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>{language === 'ta' ? 'மழை & பாசனம்:' : 'Water Readiness:'}</span>
                    <strong className="text-stone-900">{evaluation.waterReadinessPercent}%</strong>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>{language === 'ta' ? 'மண் கார அமில நிலை:' : 'Soil pH Status:'}</span>
                    <strong className="text-stone-900">{currentRecord.soil_ph.toFixed(2)}</strong>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onNavigateToWhatIf}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold shadow-xs transition-colors"
                >
                  <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{language === 'ta' ? 'மாற்றிப்பார் கூடத்தில் சோதிக்க' : 'Test in What-If Lab'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
