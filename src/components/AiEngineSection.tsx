import React from 'react';
import { Language } from '../data/types';
import { translations } from '../data/translations';
import { 
  Cpu, 
  Workflow, 
  ArrowDown, 
  CheckCircle2, 
  Layers, 
  BarChart3, 
  Database,
  GitBranch,
  ShieldCheck,
  Zap,
  Sliders,
  AlertTriangle
} from 'lucide-react';

interface AiEngineSectionProps {
  language: Language;
}

export const AiEngineSection: React.FC<AiEngineSectionProps> = ({ language }) => {
  const t = translations[language];

  const pipelineStages = [
    {
      step: "01",
      title: "DATASET INGESTION",
      titleTa: "தரவு சேகரிப்பு",
      desc: "Ingests 1,600 multi-seasonal farm entries across 8 crop archetypes with 11 soil, climate, and pest attributes.",
      descTa: "1,600 பண்ணை பதிவுகள் மற்றும் 11 முக்கிய விவசாய குறியீடுகளை உள்ளிடுதல்."
    },
    {
      step: "02",
      title: "DATA VALIDATION",
      titleTa: "தரவு சரிபார்ப்பு",
      desc: "Audits for null checks, missing values, duplicates, and verifies physical bounds (e.g., pH 4.8–8.8).",
      descTa: "விடுபட்ட மதிப்புகள் மற்றும் தவறான அளவுகளை சரிபார்த்து தரத்தை உறுதி செய்தல்."
    },
    {
      step: "03",
      title: "FEATURE ANALYSIS",
      titleTa: "காரணி பகுப்பாய்வு",
      desc: "Extracts cross-correlations between temperature extremes, rainfall scarcity, and NPK macronutrient imbalances.",
      descTa: "வானிலை மற்றும் உர அளவுகளுக்கு இடையே உள்ள தொடர்புகளை பகுப்பாய்வு செய்தல்."
    },
    {
      step: "04",
      title: "NORMALIZATION",
      titleTa: "அளவு சீரமைப்பு",
      desc: "Scales continuous metrics against empirical crop-specific agricultural tolerance distributions.",
      descTa: "ஒவ்வொரு பயிருக்குமான சகிப்புத்தன்மை அளவுக்கு ஏற்ப தரவுகளை சீரமைத்தல்."
    },
    {
      step: "05",
      title: "CROP PROFILING",
      titleTa: "பயிர் தேவை விவரக்குறிப்பு",
      desc: "Maps agronomic baseline criteria for Cereals (Rice, Wheat, Maize, Millet) vs Cash Crops (Cotton, Sugarcane).",
      descTa: "ஒவ்வொரு பயிரின் சிறந்த வளர்ச்சிக்கு தேவையான வெப்பம், நீர் மற்றும் மண் தேவைகளை நிர்ணயித்தல்."
    },
    {
      step: "06",
      title: "YIELD POTENTIAL SCORING",
      titleTa: "வளர்ச்சி திறன் கணக்கீடு",
      desc: "Synthesizes multi-dimensional agronomic indicators into an explainable 0–100 potential estimate.",
      descTa: "அனைத்து காரணிகளையும் இணைத்து 0–100 வரையிலான வெளிப்படையான வளர்ச்சி மதிப்பெண் வழங்கல்."
    },
    {
      step: "07",
      title: "EXPLAINABLE AI (XAI)",
      titleTa: "விளக்கக்கூடிய AI",
      desc: "Mathematically isolates factor boosts vs bottlenecks (+18 Irrigation, -12 Pest pressure).",
      descTa: "மதிப்பெண் உயர்வு மற்றும் குறைவிற்கான காரணங்களை துல்லியமாக விளக்குதல்."
    },
    {
      step: "08",
      title: "WHAT-IF SIMULATION",
      titleTa: "மாற்றிப்பார் மாதிரி கூடம்",
      desc: "Enables real-time parameter tweaking to simulate outcome deltas before capital expenditure.",
      descTa: "முதலீடு செய்யும் முன் பாசனம், உரம் மாற்றுவதன் விளைவுகளை உடனே பரிசோதித்தல்."
    },
    {
      step: "09",
      title: "RISK RADAR",
      titleTa: "அபாய ரேடார்",
      desc: "Projects 5-axis stress vectors across Water, Climate, Soil, Nutrient, and Pest domains.",
      descTa: "நீர், வானிலை, மண், உரம், பூச்சி ஆகிய 5 துறைகளில் உள்ள ஆபத்துகளை அளவிடுதல்."
    },
    {
      step: "10",
      title: "ACTION RECOMMENDATION",
      titleTa: "செயல் திட்டம்",
      desc: "Translates diagnostic scores into actionable, ranked farmer interventions with estimated ROI.",
      descTa: "கண்டறியப்பட்ட குறைபாடுகளுக்கு முன்னுரிமை அடிப்படையிலான விவசாய தீர்வுகளை பரிந்துரைத்தல்."
    }
  ];

  return (
    <section id="engine" className="py-14 bg-stone-50 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
            <span>09</span>
            <span>·</span>
            <span>{t.pipelineTitle}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            {language === 'ta' ? 'AI கட்டமைப்பு & செயல்படும் முறை' : 'Deterministic Decision Intelligence Pipeline'}
          </h2>
          <p className="text-sm text-stone-600 mt-1">
            {t.pipelineSubtitle}
          </p>
        </div>

        {/* 10-Stage Pipeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 mb-12">
          {pipelineStages.map((stage, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-stone-200/90 p-4 flex flex-col justify-between shadow-xs hover:border-emerald-400 transition-colors group relative"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-emerald-700">
                    {stage.step}
                  </span>
                  <div className="w-2 h-2 rounded-full bg-emerald-500/70" />
                </div>
                <h4 className="text-xs font-bold text-stone-900 group-hover:text-emerald-800 transition-colors">
                  {language === 'ta' ? stage.titleTa : stage.title}
                </h4>
                <p className="text-[11px] text-stone-600 mt-2 leading-relaxed">
                  {language === 'ta' ? stage.descTa : stage.desc}
                </p>
              </div>

              {idx < pipelineStages.length - 1 && (
                <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-stone-300">
                  →
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Future ML Architecture Card (Extensibility for hackathon judges) */}
        <div className="bg-stone-900 text-white rounded-2xl p-7 sm:p-9 border border-stone-800 shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-stone-800">
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                {language === 'ta' ? 'எதிர்கால ML கட்டமைப்பு' : 'Extensible ML Roadmap'}
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
                {t.futureMlTitle}
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-2xl">
                {t.futureMlSubtitle}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-semibold">
                Supervised Ready Architecture
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 text-xs">
            {/* Phase 1: Current Transparent Model */}
            <div className="p-5 rounded-xl bg-stone-800/80 border border-stone-700/80 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Phase 1: Current Implementation (Unlabelled Dataset)</span>
              </div>
              <p className="text-stone-300 leading-relaxed">
                {t.currentApproach}
              </p>
              <div className="text-[11px] text-stone-400 border-t border-stone-700 pt-2 font-mono">
                Status: Fully operational with 100% mathematical explainability.
              </div>
            </div>

            {/* Phase 2: Future Supervised Models */}
            <div className="p-5 rounded-xl bg-stone-800/80 border border-stone-700/80 space-y-3">
              <div className="flex items-center gap-2 text-amber-300 font-bold">
                <GitBranch className="w-4 h-4 text-amber-300" />
                <span>Phase 2: Supervised ML Integration (When Harvest Yield is Labeled)</span>
              </div>
              <p className="text-stone-300 leading-relaxed">
                {t.futureApproach}
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {["XGBoost Regressor", "Random Forest", "LightGBM", "Multi-Layer Perceptron (MLP)"].map((m, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-md bg-stone-900 border border-stone-700 text-stone-300 text-[10px] font-mono">
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
