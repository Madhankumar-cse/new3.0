import React, { useState } from 'react';
import { Language } from '../data/types';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Award, 
  Check, 
  Play, 
  Sparkles,
  ArrowRight,
  TrendingUp,
  Cpu
} from 'lucide-react';

interface JudgeModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onJumpToSection: (sectionId: string) => void;
}

export const JudgeModeModal: React.FC<JudgeModeModalProps> = ({
  isOpen,
  onClose,
  language,
  onJumpToSection
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const slides = [
    {
      step: 1,
      sectionId: 'home',
      badge: "The Agricultural Dilemma",
      badgeTa: "விவசாய சிக்கல்",
      title: "Problem: Farm decisions depend on multiple disconnected factors.",
      titleTa: "பிரச்சனை: விவசாய முடிவுகள் ஒன்றுக்கொன்று தொடர்பில்லாத பல காரணிகளைச் சார்ந்துள்ளன.",
      desc: "Farmers struggle with scattered data: rainfall variability, fluctuating temperatures, soil pH acidity, and hidden pest pressure. There is no unified, explainable intelligence layer.",
      descTa: "மழை, வெப்பநிலை, மண் கார அமில நிலை மற்றும் பூச்சி அழுத்தம் போன்ற காரணிகளை ஒரே இடத்தில் பகுப்பாய்வு செய்யும் வெளிப்படையான தொழில்நுட்பம் இல்லை.",
      highlight: "Disconnected Data = High Financial Risk for Smallholders",
      highlightTa: "தொடர்பற்ற தகவல்கள் = விவசாயிகளுக்கு பெருத்த நிதி இழப்பு"
    },
    {
      step: 2,
      sectionId: 'data',
      badge: "Empirical Foundation",
      badgeTa: "தரவு ஆதாரம்",
      title: "Data: AgriLens AI unifies soil, climate, crop & cultivation indicators.",
      titleTa: "தரவு: மண், வானிலை, பயிர் மற்றும் சாகுபடி குறியீடுகளை ஒருங்கிணைக்கிறது.",
      desc: "Backed by 1,600 verified multi-seasonal observations across 8 major food and cash crops. Rigorous quality scoring with 0% missing values and normalized agronomic bounds.",
      descTa: "8 முக்கிய பயிர்களில் 1,600 சரிபார்க்கப்பட்ட களப் பதிவுகளின் அடிப்படையில் உருவாக்கப்பட்டுள்ளது.",
      highlight: "1,600 Observations · 11 Agronomic Indicators · 0% Hallucination",
      highlightTa: "1,600 கள பதிவுகள் · 11 வேளாண் காரணிகள் · உண்மைத் தரவு"
    },
    {
      step: 3,
      sectionId: 'intelligence',
      badge: "Transparent Inference",
      badgeTa: "வெளிப்படையான AI",
      title: "AI: Converts inputs into a transparent Crop Potential Score.",
      titleTa: "AI: உள்ளீடுகளை வெளிப்படையான பயிர் வளர்ச்சி திறன் மதிப்பெண்ணாக மாற்றுகிறது.",
      desc: "Since the dataset does NOT contain harvest yield labels, AgriLens AI avoids fabricating fake yield numbers or ML metrics. Instead, it computes an authentic 0–100 Yield Potential Estimate.",
      descTa: "போலி மகசூல் கணிப்புகளை உருவாக்காமல், உண்மையான விவசாய காரணிகளின் அடிப்படையில் 0–100 வளர்ச்சித் திறன் மதிப்பெண் வழங்கப்படுகிறது.",
      highlight: "Responsible AI: Potential Estimate (0–100), Not Fabricated ML Accuracy",
      highlightTa: "பொறுப்பான AI: போலி மகசூல் இல்லாமல் உண்மையான மதிப்பீடு"
    },
    {
      step: 4,
      sectionId: 'explainable',
      badge: "Zero Black-Box",
      badgeTa: "விளக்கக்கூடிய AI",
      title: "Explainability: Instead of a black-box result, AgriLens explains WHY.",
      titleTa: "காரணம்: மறைமுக முடிவுகளுக்குப் பதிலாக, AI ஏன் இந்த முடிவை எடுத்தது என்று விளக்குகிறது.",
      desc: "Every point awarded or deducted is attributed to specific factors: Irrigation (+18 pts), Soil Organic Matter (+14 pts), Temperature (+11 pts), or Pest Pressure (-12 pts).",
      descTa: "பாசனம், மண் கரிம சத்து, வெப்பநிலை அல்லது பூச்சி அழுத்தத்தால் எவ்வளவு மதிப்பெண் கூடியது அல்லது குறைந்தது என்ற வெளிப்படையான கணக்கீடு.",
      highlight: "Feature Contribution Vectors with Mathematical Lineage",
      highlightTa: "துல்லியமான காரணிகளின் பங்களிப்பு விவரம்"
    },
    {
      step: 5,
      sectionId: 'whatif',
      badge: "Signature Innovation",
      badgeTa: "முக்கிய புத்தாக்கம்",
      title: "What-If Lab: Users simulate changes before making costly decisions.",
      titleTa: "மாற்றிப்பார்: பணத்தை முதலீடு செய்வதற்கு முன் திட்டங்களை பரிசோதிக்கலாம்.",
      desc: "Interactive sliders allow farmers and agronomists to simulate what happens if irrigation increases by 30% or if pest pressure drops. Instant real-time score delta.",
      descTa: "பாசனத்தை கூட்டினாலோ அல்லது பூச்சியை கட்டுப்படுத்தினாலோ விளைவு எப்படி மாறும் என்பதை ஸ்லைடர்கள் மூலம் உடனே அறியலாம்.",
      highlight: "Digital Twin for Farm Scenarios (+9 pts projected gain)",
      highlightTa: "பண்ணை சூழல்களை முன்கூட்டியே கணக்கிடும் முறை"
    },
    {
      step: 6,
      sectionId: 'risk',
      badge: "Early Warning",
      badgeTa: "முன்னெச்சரிக்கை",
      title: "Risk Radar: AI identifies multi-factor stress vectors.",
      titleTa: "ஆபத்து ரேடார்: 5 முக்கிய விவசாய அபாயங்களை முன்கூட்டியே உணர்த்துகிறது.",
      desc: "Projects vulnerabilities across Water, Climate, Soil, Nutrient, and Pest dimensions on an interactive polygonal radar, pinpointing the primary bottleneck before crop failure.",
      descTa: "நீர், வானிலை, மண், உரம், பூச்சி ஆகிய 5 துறைகளில் உள்ள ஆபத்துகளை முன்கூட்டியே அடையாளம் காண்கிறது.",
      highlight: "Automated Root-Cause Pinpointing & Severity Triage",
      highlightTa: "அபாய காரணிகளை உடனடியாக கண்டறிதல்"
    },
    {
      step: 7,
      sectionId: 'action-plan',
      badge: "Closed-Loop Action",
      badgeTa: "செயல் திட்டம்",
      title: "Action: Insights are converted into prioritized recommendations.",
      titleTa: "செயல்: நுண்ணறிவு முடிவுகள் முன்னுரிமை அடிப்படையிலான விவசாய தீர்வுகளாகின்றன.",
      desc: "No vague advice. AgriLens delivers prioritized intervention cards with Current Condition, Why it Matters, Suggested Fix, and Estimated Impact Points.",
      descTa: "வெறும் ஆலோசனை அல்ல; தற்போதைய நிலை, தீர்வு மற்றும் எதிர்பார்க்கப்படும் மதிப்பெண் உயர்வுடன் கூடிய தெளிவான பரிந்துரைகள்.",
      highlight: "From Data to Decision: Complete Agricultural Lifecycle",
      highlightTa: "தரவிலிருந்து சிறந்த விவசாய முடிவுகளுக்கு"
    }
  ];

  const current = slides[currentStep];

  const handleNext = () => {
    if (currentStep < slides.length - 1) {
      setCurrentStep(s => s + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(s => s - 1);
    }
  };

  const handleJump = () => {
    onJumpToSection(current.sectionId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-stone-900 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-white overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-800 relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                Hackathon Presentation Mode
              </span>
              <span className="text-[11px] text-stone-400">
                Step {current.step} of {slides.length}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Slide Content */}
        <div className="py-6 space-y-4 relative z-10 min-h-[260px] flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950 border border-emerald-700/60 text-emerald-300 text-xs font-semibold mb-3">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              <span>{language === 'ta' ? current.badgeTa : current.badge}</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-snug">
              {language === 'ta' ? current.titleTa : current.title}
            </h3>

            <p className="text-sm text-stone-300 mt-3 leading-relaxed">
              {language === 'ta' ? current.descTa : current.desc}
            </p>
          </div>

          {/* Highlight Callout */}
          <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-xs font-semibold text-emerald-300 flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{language === 'ta' ? current.highlightTa : current.highlight}</span>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="pt-4 border-t border-stone-800 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentStep(i)}
                className={`h-2 rounded-full transition-all ${
                  currentStep === i ? 'w-6 bg-emerald-400' : 'w-2 bg-stone-700 hover:bg-stone-500'
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleJump}
              className="text-xs text-stone-400 hover:text-white px-2.5 py-1.5 font-medium transition-colors"
            >
              {language === 'ta' ? 'பகுதிக்கு செல்' : 'Inspect UI'}
            </button>

            {currentStep > 0 && (
              <button
                onClick={handlePrev}
                className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-white text-xs font-semibold transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={handleNext}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs shadow-md transition-all"
            >
              <span>{currentStep === slides.length - 1 ? (language === 'ta' ? 'நிறைவு' : 'Finish') : (language === 'ta' ? 'அடுத்தது' : 'Next Step')}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
