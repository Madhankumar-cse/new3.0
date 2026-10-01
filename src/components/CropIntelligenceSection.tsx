import React, { useState } from 'react';
import { Language } from '../data/types';
import { translations } from '../data/translations';
import { CROP_PROFILES } from '../data/dataset';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import { 
  Sprout, 
  ArrowLeftRight, 
  Droplets, 
  Sun, 
  Check, 
  Info 
} from 'lucide-react';

interface CropIntelligenceSectionProps {
  language: Language;
}

export const CropIntelligenceSection: React.FC<CropIntelligenceSectionProps> = ({ language }) => {
  const t = translations[language];
  const cropList = Object.keys(CROP_PROFILES);

  const [selectedCrop, setSelectedCrop] = useState<string>('Groundnut');
  const [compareCropA, setCompareCropA] = useState<string>('Rice');
  const [compareCropB, setCompareCropB] = useState<string>('Wheat');
  const [viewMode, setViewMode] = useState<'profile' | 'compare'>('profile');

  const activeProfile = CROP_PROFILES[selectedCrop];
  const profileA = CROP_PROFILES[compareCropA];
  const profileB = CROP_PROFILES[compareCropB];

  // Comparison metrics data for Recharts
  const comparisonData = [
    {
      metric: 'Rainfall (x10 mm)',
      [compareCropA]: Math.round(profileA.avgRainfall / 10),
      [compareCropB]: Math.round(profileB.avgRainfall / 10),
    },
    {
      metric: 'Temp (°C)',
      [compareCropA]: Math.round(profileA.avgTemperature),
      [compareCropB]: Math.round(profileB.avgTemperature),
    },
    {
      metric: 'Nitrogen (kg/ac)',
      [compareCropA]: Math.round(profileA.avgNitrogen),
      [compareCropB]: Math.round(profileB.avgNitrogen),
    },
    {
      metric: 'Potassium (kg/ac)',
      [compareCropA]: Math.round(profileA.avgPotassium),
      [compareCropB]: Math.round(profileB.avgPotassium),
    },
    {
      metric: 'Irrigation (%)',
      [compareCropA]: Math.round(profileA.avgIrrigation),
      [compareCropB]: Math.round(profileB.avgIrrigation),
    },
  ];

  return (
    <section id="crops" className="py-14 bg-stone-50 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
              <span>07</span>
              <span>·</span>
              <span>{t.cropIntelTitle}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              {language === 'ta' ? 'பயிர் நுண்ணறிவு விவரங்கள்' : 'Dataset Crop Archetypes & Comparative Norms'}
            </h2>
            <p className="text-sm text-stone-600 mt-1 max-w-2xl">
              {t.cropIntelSubtitle}
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center p-1 bg-white rounded-xl border border-stone-200 self-start md:self-auto text-xs">
            <button
              onClick={() => setViewMode('profile')}
              className={`px-3 py-1.5 font-semibold rounded-lg transition-colors ${
                viewMode === 'profile'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {language === 'ta' ? 'பயிர் விவரம்' : 'Crop Profiles'}
            </button>
            <button
              onClick={() => setViewMode('compare')}
              className={`px-3 py-1.5 font-semibold rounded-lg transition-colors flex items-center gap-1 ${
                viewMode === 'compare'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span>{t.compareCrops}</span>
            </button>
          </div>
        </div>

        {viewMode === 'profile' ? (
          <div>
            {/* Crop Selector Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
              {cropList.map(crop => (
                <button
                  key={crop}
                  onClick={() => setSelectedCrop(crop)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                    selectedCrop === crop
                      ? 'bg-emerald-800 text-white border-emerald-900 shadow-sm'
                      : 'bg-white text-stone-700 hover:bg-stone-100 border-stone-200'
                  }`}
                >
                  {crop}
                </button>
              ))}
            </div>

            {/* Selected Crop Profile Card */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-100 gap-4">
                <div>
                  <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider block">
                    {language === 'ta' ? 'ஆய்வு செய்யப்பட்ட மாதிரி' : 'Statistical Profile'}
                  </span>
                  <h3 className="text-2xl font-extrabold text-stone-900 mt-0.5">
                    {activeProfile.crop_type}
                  </h3>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <div className="px-3 py-1.5 rounded-xl bg-stone-100 border border-stone-200">
                    <span className="text-stone-500 block text-[10px]">Dataset Samples</span>
                    <strong className="text-stone-900 font-mono tabular-nums">{activeProfile.count} records</strong>
                  </div>
                  <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200">
                    <span className="text-emerald-700 block text-[10px]">Optimal pH</span>
                    <strong className="text-emerald-900 font-mono tabular-nums">{activeProfile.optimalPhRange[0]} - {activeProfile.optimalPhRange[1]}</strong>
                  </div>
                </div>
              </div>

              {/* 8 Feature Metric Boxes */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="text-stone-500 text-xs font-medium block">Avg Rainfall</span>
                  <span className="text-lg font-bold font-mono text-stone-900 mt-1 block tabular-nums">
                    {Math.round(activeProfile.avgRainfall)} mm
                  </span>
                  <span className="text-[10px] text-stone-400 block mt-0.5">
                    {Math.round(activeProfile.minRainfall)} - {Math.round(activeProfile.maxRainfall)} mm range
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="text-stone-500 text-xs font-medium block">Avg Temperature</span>
                  <span className="text-lg font-bold font-mono text-stone-900 mt-1 block tabular-nums">
                    {activeProfile.avgTemperature.toFixed(1)}°C
                  </span>
                  <span className="text-[10px] text-stone-400 block mt-0.5">
                    Comfort: {activeProfile.optimalTempRange[0]}°C - {activeProfile.optimalTempRange[1]}°C
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="text-stone-500 text-xs font-medium block">Average Soil pH</span>
                  <span className="text-lg font-bold font-mono text-stone-900 mt-1 block tabular-nums">
                    {activeProfile.avgSoilPh.toFixed(2)}
                  </span>
                  <span className="text-[10px] text-stone-400 block mt-0.5">
                    Target: {activeProfile.optimalPhRange[0]} - {activeProfile.optimalPhRange[1]}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="text-stone-500 text-xs font-medium block">Organic Matter</span>
                  <span className="text-lg font-bold font-mono text-stone-900 mt-1 block tabular-nums">
                    {activeProfile.avgOrganicMatter.toFixed(1)}%
                  </span>
                  <span className="text-[10px] text-stone-400 block mt-0.5">
                    Baseline benchmark &gt; 3.0%
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="text-stone-500 text-xs font-medium block">Avg Nitrogen</span>
                  <span className="text-lg font-bold font-mono text-stone-900 mt-1 block tabular-nums">
                    {Math.round(activeProfile.avgNitrogen)} kg/ac
                  </span>
                  <span className="text-[10px] text-stone-400 block mt-0.5">Macronutrient</span>
                </div>

                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="text-stone-500 text-xs font-medium block">Avg Phosphorus</span>
                  <span className="text-lg font-bold font-mono text-stone-900 mt-1 block tabular-nums">
                    {Math.round(activeProfile.avgPhosphorus)} kg/ac
                  </span>
                  <span className="text-[10px] text-stone-400 block mt-0.5">Rooting agent</span>
                </div>

                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="text-stone-500 text-xs font-medium block">Avg Potassium</span>
                  <span className="text-lg font-bold font-mono text-stone-900 mt-1 block tabular-nums">
                    {Math.round(activeProfile.avgPotassium)} kg/ac
                  </span>
                  <span className="text-[10px] text-stone-400 block mt-0.5">Stress resistance</span>
                </div>

                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="text-stone-500 text-xs font-medium block">Avg Irrigation</span>
                  <span className="text-lg font-bold font-mono text-stone-900 mt-1 block tabular-nums">
                    {Math.round(activeProfile.avgIrrigation)}%
                  </span>
                  <span className="text-[10px] text-stone-400 block mt-0.5">Coverage metric</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Compare Crops View */
          <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-stone-100">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="w-1/2 sm:w-44">
                  <label className="block text-[11px] font-bold text-stone-500 uppercase mb-1">
                    {t.cropA}
                  </label>
                  <select
                    value={compareCropA}
                    onChange={(e) => setCompareCropA(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs font-bold text-stone-900 focus:outline-none"
                  >
                    {cropList.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <span className="text-stone-400 font-bold text-xs pt-4">vs</span>

                <div className="w-1/2 sm:w-44">
                  <label className="block text-[11px] font-bold text-stone-500 uppercase mb-1">
                    {t.cropB}
                  </label>
                  <select
                    value={compareCropB}
                    onChange={(e) => setCompareCropB(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs font-bold text-stone-900 focus:outline-none"
                  >
                    {cropList.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-500 flex items-center gap-2">
                <Info className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>
                  {language === 'ta'
                    ? 'ஒப்பீடு தேவைகளை மட்டுமே விளக்குகிறது; உண்மையான மகசூல் உயர்வு கூறப்படவில்லை.'
                    : 'Comparison highlights environmental requirements only, without claiming actual yield superiority.'}
                </span>
              </div>
            </div>

            {/* Recharts Bar Chart */}
            <div className="w-full h-80 pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData}>
                  <XAxis dataKey="metric" tick={{ fill: '#4b5563', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#9ca3af', fontSize: 10 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', color: '#fff', borderRadius: '8px', fontSize: '11px', border: 'none' }} 
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Bar dataKey={compareCropA} fill="#15803d" radius={[4, 4, 0, 0]} />
                  <Bar dataKey={compareCropB} fill="#0d9488" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
