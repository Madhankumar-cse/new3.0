import React from 'react';
import { Language } from '../data/types';
import { translations } from '../data/translations';
import { ArrowRight, Play, Droplets, Sun, Sparkles, ShieldAlert, Cpu, Activity } from 'lucide-react';

interface HeroProps {
  language: Language;
  onAnalyzeClick: () => void;
  onDemoClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ language, onAnalyzeClick, onDemoClick }) => {
  const t = translations[language];

  const steps = [
    { label: "DATA", labelTa: "தரவு", sub: "1600+ Points" },
    { label: "AI ANALYSIS", labelTa: "AI ஆய்வு", sub: "Multi-Factor" },
    { label: "POTENTIAL", labelTa: "வளர்ச்சி திறன்", sub: "0–100 Score" },
    { label: "EXPLAIN", labelTa: "காரணம்", sub: "Feature Impact" },
    { label: "WHAT-IF", labelTa: "மாற்றிப்பார்", sub: "Simulation" },
    { label: "RISK", labelTa: "ஆபத்து", sub: "5-Axis Radar" },
    { label: "ACTION", labelTa: "செயல் திட்டம்", sub: "AI Plan" },
  ];

  return (
    <section id="home" className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-stone-900 to-stone-950 text-white pt-12 pb-20 lg:pt-16 lg:pb-28">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Core Narrative */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Tagline kicker */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-900/60 border border-emerald-700/50 text-emerald-200 text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.tagline}</span>
              <span className="hidden sm:inline text-emerald-400">·</span>
              <span className="hidden sm:inline text-emerald-300 font-normal">AgriTech Decision Intelligence</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight lg:leading-tight">
              {t.heroTitle}
            </h1>

            <p className="text-base sm:text-lg text-stone-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              {t.heroSubtitle}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
              <button
                onClick={onAnalyzeClick}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>{t.btnAnalyze}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onDemoClick}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm border border-white/20 backdrop-blur-sm transition-all"
              >
                <Play className="w-4 h-4 fill-current text-emerald-400" />
                <span>{t.btnDemo}</span>
              </button>
            </div>

            {/* Quick trust metrics */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-stone-800 text-left">
              <div>
                <span className="block text-xl font-bold font-mono text-emerald-400 tabular-nums">1,600</span>
                <span className="text-xs text-stone-400 block mt-0.5">
                  {language === 'ta' ? 'உண்மை பண்ணை பதிவுகள்' : 'Dataset Observations'}
                </span>
              </div>
              <div>
                <span className="block text-xl font-bold font-mono text-emerald-400 tabular-nums">11</span>
                <span className="text-xs text-stone-400 block mt-0.5">
                  {language === 'ta' ? 'மண், வானிலை காரணிகள்' : 'Agronomic Indicators'}
                </span>
              </div>
              <div>
                <span className="block text-xl font-bold font-mono text-teal-400 tabular-nums">100%</span>
                <span className="text-xs text-stone-400 block mt-0.5">
                  {language === 'ta' ? 'வெளிப்படையான AI விளக்கம்' : 'Explainable Scoring'}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual with Real Generated Field & Floating Telemetry */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none rounded-2xl overflow-hidden border border-emerald-500/30 shadow-2xl shadow-emerald-950/60 bg-stone-900 group">
              {/* Actual High-Fidelity Agriculture Image */}
              <img
                src="/src/assets/images/hero_agrilens_farm_1790836819253.jpg"
                alt="AgriLens AI Farm Drone and Soil Intelligence"
                referrerPolicy="no-referrer"
                className="w-full h-80 sm:h-96 object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />

              {/* Scrim Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />

              {/* AI Scan Line Animation */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-80 animate-pulse pointer-events-none" />

              {/* Floating Badge 1: Potential Score Indicator */}
              <div className="absolute top-4 left-4 bg-stone-900/90 backdrop-blur-md border border-emerald-500/40 rounded-xl p-3 shadow-lg">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 block uppercase tracking-wider font-semibold">
                      {language === 'ta' ? 'கணக்கிடப்பட்ட வளர்ச்சி திறன்' : 'Potential Score'}
                    </span>
                    <span className="text-lg font-bold font-mono text-emerald-300 tabular-nums">84 / 100</span>
                  </div>
                </div>
              </div>

              {/* Floating Badge 2: Multi-Factor Sensor Reading */}
              <div className="absolute bottom-4 left-4 right-4 bg-stone-900/90 backdrop-blur-md border border-stone-700/60 rounded-xl p-3 text-xs">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-1 text-emerald-400 font-medium">
                      <Droplets className="w-3.5 h-3.5" />
                      <span className="font-mono tabular-nums">89%</span>
                    </div>
                    <span className="text-[10px] text-stone-400 mt-0.5">Irrigation</span>
                  </div>
                  <div className="flex flex-col items-center border-x border-stone-800">
                    <div className="flex items-center gap-1 text-amber-400 font-medium">
                      <Sun className="w-3.5 h-3.5" />
                      <span className="font-mono tabular-nums">6.8 pH</span>
                    </div>
                    <span className="text-[10px] text-stone-400 mt-0.5">Soil Quality</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-1 text-teal-400 font-medium">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span className="font-mono tabular-nums">0.12</span>
                    </div>
                    <span className="text-[10px] text-stone-400 mt-0.5">Low Pest</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Core Product Pipeline Ticker */}
        <div className="mt-14 pt-8 border-t border-stone-800">
          <div className="text-center mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400/90">
              {language === 'ta' ? 'முழுமையான விவசாய முடிவெடுக்கும் கட்டமைப்பு' : 'The AgriLens AI Decision Architecture'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="bg-stone-900/80 border border-stone-800 hover:border-emerald-500/40 rounded-xl p-3 text-center transition-all group"
              >
                <span className="text-[10px] font-mono text-emerald-400 block mb-1">
                  0{idx + 1}
                </span>
                <span className="text-xs font-bold text-white block group-hover:text-emerald-300 transition-colors">
                  {language === 'ta' ? step.labelTa : step.label}
                </span>
                <span className="text-[11px] text-stone-400 block mt-0.5">
                  {step.sub}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
