import React from 'react';
import { EvaluationResult, Language } from '../data/types';
import { translations } from '../data/translations';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer 
} from 'recharts';
import { AlertOctagon, ShieldAlert, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';

interface RiskRadarSectionProps {
  evaluation: EvaluationResult;
  language: Language;
  onExploreMitigationClick: () => void;
}

export const RiskRadarSection: React.FC<RiskRadarSectionProps> = ({
  evaluation,
  language,
  onExploreMitigationClick
}) => {
  const t = translations[language];
  const { risks, topRisk } = evaluation;

  // Prepare data for Recharts Radar
  const radarData = risks.map(r => ({
    subject: language === 'ta' ? r.categoryTa : r.category,
    value: r.score,
    fullMark: 100
  }));

  const getBadgeStyle = (level: string) => {
    switch (level) {
      case 'High':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Moderate':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      default:
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    }
  };

  const getDotColor = (level: string) => {
    switch (level) {
      case 'High':
        return 'bg-rose-500';
      case 'Moderate':
        return 'bg-amber-500';
      default:
        return 'bg-emerald-500';
    }
  };

  return (
    <section id="risk" className="py-14 bg-stone-50 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
            <span>05</span>
            <span>·</span>
            <span>{t.riskTitle}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            {language === 'ta' ? 'பண்ணை அபாயங்களை முன்கூட்டியே உணர்த்தும் ரேடார்' : '5-Axis Multi-Factor Farm Risk Radar'}
          </h2>
          <p className="text-sm text-stone-600 mt-1">
            {t.riskSubtitle}
          </p>
        </div>

        {/* Radar & Risk Table Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Radar Chart Visual */}
          <div className="lg:col-span-6 bg-white rounded-2xl border border-stone-200 p-6 sm:p-7 shadow-xs flex flex-col items-center">
            <div className="w-full flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                {language === 'ta' ? 'அபாய வரைபடம்' : 'Risk Polygon Geometry'}
              </span>
              <div className="flex items-center gap-3 text-[11px] font-medium">
                <span className="flex items-center gap-1 text-emerald-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> &lt;40 Low
                </span>
                <span className="flex items-center gap-1 text-amber-700">
                  <span className="w-2 h-2 rounded-full bg-amber-500" /> 40–68 Moderate
                </span>
                <span className="flex items-center gap-1 text-rose-700">
                  <span className="w-2 h-2 rounded-full bg-rose-500" /> &gt;68 High
                </span>
              </div>
            </div>

            <div className="w-full h-72 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e5e7eb" strokeDasharray="3 3" />
                  <PolarAngleAxis 
                    dataKey="subject" 
                    tick={{ fill: '#374151', fontSize: 11, fontWeight: 600 }} 
                  />
                  <PolarRadiusAxis 
                    angle={30} 
                    domain={[0, 100]} 
                    tick={{ fill: '#9ca3af', fontSize: 9 }} 
                  />
                  <Radar
                    name="Risk Level"
                    dataKey="value"
                    stroke="#15803d"
                    fill="#22c55e"
                    fillOpacity={0.35}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Right Column: Detailed 5 Risk Categories & Top Risk Highlight */}
          <div className="lg:col-span-6 space-y-4">
            {/* Top Risk Callout Banner */}
            <div className="p-5 rounded-2xl bg-stone-900 text-white border border-stone-800 shadow-md">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 block">
                      {t.topRiskTitle}
                    </span>
                    <h3 className="text-base font-bold text-white">
                      {language === 'ta' ? topRisk.categoryTa : topRisk.category}
                    </h3>
                  </div>
                </div>

                <span className="font-mono text-xl font-extrabold text-rose-400 tabular-nums">
                  {topRisk.score}/100
                </span>
              </div>

              <p className="text-xs text-stone-300 mt-3 leading-relaxed">
                {language === 'ta' ? topRisk.detailTa : topRisk.detail}
              </p>

              <div className="mt-4 pt-3 border-t border-stone-800 flex items-center justify-between">
                <span className="text-xs text-amber-300 font-medium">
                  {language === 'ta' ? topRisk.summaryTa : topRisk.summary}
                </span>
                <button
                  onClick={onExploreMitigationClick}
                  className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
                >
                  <span>{language === 'ta' ? 'தீர்வு காண' : 'Action Plan'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* List of All 5 Evaluated Risk Categories */}
            <div className="space-y-2">
              {risks.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-white border border-stone-200/90 flex items-center justify-between gap-4 text-xs shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${getDotColor(item.level)}`} />
                    <div>
                      <span className="font-bold text-stone-900 block">
                        {language === 'ta' ? item.categoryTa : item.category}
                      </span>
                      <span className="text-stone-500 text-[11px] block mt-0.5">
                        {language === 'ta' ? item.summaryTa : item.summary}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-mono font-semibold text-stone-700 tabular-nums">
                      {item.score}%
                    </span>
                    <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold border ${getBadgeStyle(item.level)}`}>
                      {language === 'ta' ? item.levelTa : item.level}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
