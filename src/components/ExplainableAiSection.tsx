import React, { useState } from 'react';
import { EvaluationResult, FactorContribution, Language } from '../data/types';
import { translations } from '../data/translations';
import { 
  HelpCircle, 
  TrendingUp, 
  TrendingDown, 
  ShieldCheck, 
  BookOpen, 
  CheckCircle2, 
  XCircle,
  Sparkles
} from 'lucide-react';

interface ExplainableAiSectionProps {
  evaluation: EvaluationResult;
  language: Language;
}

export const ExplainableAiSection: React.FC<ExplainableAiSectionProps> = ({
  evaluation,
  language
}) => {
  const t = translations[language];
  const { contributions, potentialScore } = evaluation;
  const [selectedFactor, setSelectedFactor] = useState<FactorContribution>(contributions[0]);

  // Sort contributions by absolute impact descending
  const sortedContributions = [...contributions].sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact));

  // Max absolute impact for proportional bar scaling
  const maxAbsImpact = Math.max(...contributions.map(c => Math.abs(c.impact)), 15);

  return (
    <section id="explainable" className="py-14 bg-stone-50 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
            <span>03</span>
            <span>·</span>
            <span>{t.xaiTitle}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            {t.xaiSubtitle}
          </h2>
          <p className="text-sm text-stone-600 mt-1">
            {t.xaiDesc}
          </p>
        </div>

        {/* Two-Column Layout: Contribution Chart on Left, Deep-Dive Explanation Card on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Feature Contribution Chart */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-stone-200 p-6 sm:p-7 shadow-xs">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-stone-100">
              <div>
                <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
                  {t.xaiHeader}
                </h3>
                <span className="text-xs text-stone-500">
                  {language === 'ta' ? 'விளக்கத்தை காண காரணியை கிளிக் செய்யவும்' : 'Click any factor to inspect its agronomic calculation'}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  + Boost
                </span>
                <span className="flex items-center gap-1.5 text-rose-700 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  - Penalty
                </span>
              </div>
            </div>

            {/* Contribution Bars */}
            <div className="space-y-4">
              {sortedContributions.map((factor) => {
                const isPositive = factor.impact >= 0;
                const isSelected = selectedFactor.name === factor.name;
                const widthPercent = Math.min(100, Math.max(8, (Math.abs(factor.impact) / maxAbsImpact) * 100));

                return (
                  <div
                    key={factor.name}
                    onClick={() => setSelectedFactor(factor)}
                    className={`p-3 rounded-xl cursor-pointer transition-all border ${
                      isSelected
                        ? 'bg-emerald-50/70 border-emerald-400 ring-2 ring-emerald-500/20 shadow-xs'
                        : 'bg-stone-50/50 hover:bg-stone-100/70 border-stone-200/80'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-bold text-stone-900 flex items-center gap-1.5">
                        {isPositive ? (
                          <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <TrendingDown className="w-3.5 h-3.5 text-rose-600" />
                        )}
                        <span>{factor.name}</span>
                      </span>

                      <div className="flex items-center gap-2">
                        <span className="text-stone-500 text-[11px] font-mono tabular-nums">
                          {factor.currentValue}
                        </span>
                        <span className={`font-mono font-bold text-xs tabular-nums ${
                          isPositive ? 'text-emerald-700' : 'text-rose-700'
                        }`}>
                          {isPositive ? `+${factor.impact}` : factor.impact} pts
                        </span>
                      </div>
                    </div>

                    {/* Proportional Bar */}
                    <div className="w-full h-2.5 bg-stone-200/70 rounded-full overflow-hidden flex">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isPositive ? 'bg-emerald-600' : 'bg-rose-500'
                        }`}
                        style={{ width: `${widthPercent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Deep Factor Detail Card */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-stone-200 p-6 sm:p-7 shadow-xs space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-stone-100">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                selectedFactor.impact >= 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}>
                {selectedFactor.impact >= 0 ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
                  {language === 'ta' ? 'காரணி ஆய்வு' : 'Factor Breakdown'}
                </span>
                <h4 className="text-base font-bold text-stone-900">
                  {selectedFactor.name}
                </h4>
              </div>
            </div>

            {/* Key Comparison Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-stone-500 block text-[11px] font-medium">
                  {t.currentValue}
                </span>
                <span className="text-base font-bold font-mono text-stone-900 mt-0.5 block tabular-nums">
                  {selectedFactor.currentValue}
                </span>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-stone-500 block text-[11px] font-medium">
                  {t.factorImpact}
                </span>
                <span className={`text-base font-bold font-mono mt-0.5 block tabular-nums ${
                  selectedFactor.impact >= 0 ? 'text-emerald-700' : 'text-rose-700'
                }`}>
                  {selectedFactor.impact >= 0 ? `+${selectedFactor.impact}` : selectedFactor.impact} pts
                </span>
              </div>
            </div>

            <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 text-xs">
              <span className="text-stone-500 block text-[11px] font-medium">
                {t.datasetNorm}
              </span>
              <span className="text-stone-900 font-semibold mt-0.5 block">
                {selectedFactor.referenceNorm}
              </span>
            </div>

            {/* Agronomic Why Explanation */}
            <div>
              <span className="text-xs font-bold text-stone-900 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
                <span>{language === 'ta' ? 'வேளாண் அறிவியல் காரணம்' : 'Agronomic Rationale'}</span>
              </span>
              <p className="text-xs text-stone-700 leading-relaxed bg-emerald-50/40 p-3 rounded-xl border border-emerald-100">
                {language === 'ta' ? selectedFactor.explanationTa : selectedFactor.explanation}
              </p>
            </div>

            {/* Mathematical Transparency callout */}
            <div className="text-[11px] text-stone-500 border-t border-stone-100 pt-3">
              <span>
                {language === 'ta'
                  ? 'மதிப்பீடு 1,600 உண்மை பதிவுகளின் புள்ளியியல் விநியோகங்களை அடிப்படையாகக் கொண்டது.'
                  : 'Derived mathematically against empirical variance curves in the uploaded 1,600 dataset.'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
