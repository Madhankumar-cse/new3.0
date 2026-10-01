import React, { useState } from 'react';
import { Language } from '../data/types';
import { translations } from '../data/translations';
import { Sprout, Menu, X, Award, Play } from 'lucide-react';

interface NavbarProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  onOpenJudgeMode: () => void;
  onTriggerDemo: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  onLanguageChange,
  activeTab,
  onSelectTab,
  onOpenJudgeMode,
  onTriggerDemo
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = translations[language];

  const navItems = [
    { id: 'home', label: t.navHome },
    { id: 'intelligence', label: t.navIntelligence },
    { id: 'analyzer', label: t.navAnalyzer },
    { id: 'explainable', label: t.navExplainable },
    { id: 'whatif', label: t.navWhatIf },
    { id: 'risk', label: t.navRisk },
    { id: 'crops', label: t.navCrops },
    { id: 'data', label: t.navData },
    { id: 'engine', label: t.navEngine }
  ];

  const handleNavClick = (id: string) => {
    onSelectTab(id);
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Single text element Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-700 flex items-center justify-center text-white shadow-sm shadow-emerald-900/10 group-hover:bg-emerald-800 transition-colors">
                <Sprout className="w-5 h-5 text-emerald-100" />
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-stone-900 block leading-none">
                  {t.brandName}
                </span>
                <span className="text-[11px] font-medium text-emerald-800 block mt-0.5">
                  {language === 'ta' ? 'தரவிலிருந்து விவசாய முடிவுகளுக்கு' : 'From Data to Decision'}
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden xl:flex items-center gap-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-xs font-semibold tracking-wide whitespace-nowrap transition-colors relative py-1 ${
                  activeTab === item.id
                    ? 'text-emerald-700'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {item.label}
                {activeTab === item.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-full" />
                )}
              </button>
            ))}
          </nav>

          {/* Zone 3: Actions */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Language Switcher */}
            <div className="flex items-center p-0.5 bg-stone-100 rounded-lg border border-stone-200 text-xs">
              <button
                onClick={() => onLanguageChange('en')}
                className={`px-2.5 py-1 font-semibold rounded-md transition-all ${
                  language === 'en'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => onLanguageChange('ta')}
                className={`px-2.5 py-1 font-semibold rounded-md transition-all ${
                  language === 'ta'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                தமிழ்
              </button>
            </div>

            {/* Quick Demo Trigger */}
            <button
              onClick={onTriggerDemo}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors whitespace-nowrap"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>AI Demo</span>
            </button>

            {/* Hackathon Judge Mode Button */}
            <button
              onClick={onOpenJudgeMode}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-stone-900 hover:bg-emerald-950 rounded-lg shadow-sm transition-all whitespace-nowrap"
            >
              <Award className="w-3.5 h-3.5 text-amber-300" />
              <span>{t.btnJudgeMode}</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-1.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-stone-200 px-4 pt-2 pb-6 space-y-1 shadow-lg">
          <div className="grid grid-cols-2 gap-1 mb-3 pt-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-3 py-2 text-left text-xs font-medium rounded-lg transition-colors ${
                  activeTab === item.id
                    ? 'bg-emerald-50 text-emerald-800 font-semibold'
                    : 'text-stone-700 hover:bg-stone-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
            <button
              onClick={() => {
                onTriggerDemo();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 rounded-lg border border-emerald-200"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{t.btnDemo}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
