import React from 'react';
import { Language } from '../data/types';
import { translations } from '../data/translations';
import { Sprout, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  language: Language;
}

export const Footer: React.FC<FooterProps> = ({ language }) => {
  const t = translations[language];

  return (
    <footer className="bg-stone-900 text-stone-300 py-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-stone-800">
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <Sprout className="w-5 h-5 text-emerald-100" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                {t.brandName}
              </span>
            </div>

            <p className="text-xs text-stone-400 font-medium">
              “{t.tagline}”
            </p>

            <p className="text-xs text-stone-400 font-medium font-serif italic text-emerald-400">
              “தரவிலிருந்து சிறந்த விவசாய முடிவுகளுக்கு.”
            </p>

            <p className="text-xs text-stone-400 leading-relaxed max-w-sm pt-1">
              AI-Powered Crop Intelligence & Farm Decision Support Platform for modern agriculture and transparent agronomic analysis.
            </p>
          </div>

          {/* Responsible AI Disclaimer */}
          <div className="md:col-span-7 bg-stone-950/60 rounded-2xl border border-stone-800 p-5 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{language === 'ta' ? 'பொறுப்பான AI அறிவிப்பு' : 'Responsible AI & Scientific Integrity'}</span>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              {t.disclaimer}
            </p>
            <p className="text-[11px] text-stone-500 leading-relaxed border-t border-stone-800/80 pt-2">
              {language === 'ta'
                ? 'தரவுத்தொகுப்பில் உண்மையான மகசூல் அளவு இல்லை என்பதால், AgriLens AI போலி கணிப்புகளைத் தவிர்த்து, விவசாயக் குறிகாட்டிகளின் அடிப்படையிலான சாத்தியக்கூறு மதிப்பீட்டை மட்டுமே வழங்குகிறது.'
                : 'Because the dataset does not include labeled yield harvest ground-truth, AgriLens AI strictly generates an explainable potential score and scenario simulation without claiming actual yield prediction.'}
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-3">
          <p>© 2026 AgriLens AI · College Hackathon AgriTech Innovation Project</p>
          <div className="flex items-center gap-4">
            <span>Groundnut · Maize · Tomato · Cotton · Sugarcane · Wheat · Rice · Millet</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
