import React from 'react';
import { EvaluationResult, Language } from '../data/types';
import { translations } from '../data/translations';
import { 
  Lightbulb, 
  ArrowUpRight, 
  Target, 
  AlertCircle, 
  CheckCircle,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';

interface ActionPlanSectionProps {
  evaluation: EvaluationResult;
  language: Language;
}

export const ActionPlanSection: React.FC<ActionPlanSectionProps> = ({
  evaluation,
  language
}) => {
  const t = translations[language];
  const { actionPlan } = evaluation;

  return (
    <section id="action-plan" className="py-14 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
            <span>06</span>
            <span>·</span>
            <span>{t.actionTitle}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            {language === 'ta' ? 'அடுத்ததாக என்ன செய்யலாம்? (AI Action Plan)' : 'Prioritized Precision Farm Interventions'}
          </h2>
          <p className="text-sm text-stone-600 mt-1">
            {t.actionSubtitle}
          </p>
        </div>

        {/* Action Recommendations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {actionPlan.map((action, idx) => (
            <div
              key={idx}
              className="bg-stone-50/80 rounded-2xl border border-stone-200/90 p-6 flex flex-col justify-between shadow-xs hover:border-emerald-300 transition-all group"
            >
              <div>
                {/* Header: Priority & Category */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-800 text-white font-bold text-xs flex items-center justify-center">
                      {action.priority}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                      Priority {action.priority}
                    </span>
                  </div>

                  <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold font-mono bg-emerald-100/70 text-emerald-800">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    <span>+{action.estimatedImpactPoints} pts est.</span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-stone-900 mb-3 group-hover:text-emerald-800 transition-colors">
                  {language === 'ta' ? action.titleTa : action.title}
                </h3>

                {/* Sub-block 1: Current condition */}
                <div className="mb-3 p-3 bg-white rounded-xl border border-stone-200 text-xs">
                  <span className="text-stone-500 font-semibold block text-[11px] uppercase tracking-wider">
                    {t.actionCondition}
                  </span>
                  <p className="text-stone-800 mt-0.5 font-medium">
                    {language === 'ta' ? action.currentConditionTa : action.currentCondition}
                  </p>
                </div>

                {/* Sub-block 2: Why it matters */}
                <div className="mb-3 text-xs text-stone-600">
                  <span className="font-semibold text-stone-700 block mb-0.5">
                    {t.actionWhy}:
                  </span>
                  <p className="leading-relaxed">
                    {language === 'ta' ? action.whyItMattersTa : action.whyItMatters}
                  </p>
                </div>

                {/* Sub-block 3: Suggested improvement */}
                <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200/80 text-xs text-emerald-950">
                  <span className="font-bold text-emerald-900 block mb-0.5">
                    {t.actionSuggested}:
                  </span>
                  <p className="leading-relaxed">
                    {language === 'ta' ? action.suggestedImprovementTa : action.suggestedImprovement}
                  </p>
                </div>
              </div>

              {/* Responsible note */}
              <div className="mt-4 pt-3 border-t border-stone-200 text-[10px] text-stone-400 text-right">
                <span>{language === 'ta' ? 'மதிப்பிடப்பட்ட சாத்தியக்கூறு மட்டுமே' : 'Agronomic simulation estimate'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
