import React from 'react';
import { useTranslation } from '../../context/LanguageContext';
import { ShieldCheck, Award, Globe, Sparkles, Heart } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { t, language } = useTranslation();

  return (
    <div className="py-14 bg-[#050811] min-h-screen text-slate-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-blue-400 uppercase tracking-widest block mb-2">
            The Abdala Silver Story
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-white tracking-tight mb-6">
            Empowering the Next Generation of Somali & Global Creators
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Founded by commercial filmmaker and educator Abdala Silver, this academy was built on a simple conviction: raw talent exists everywhere, but world-class digital production training has historically been out of reach. We are changing that.
          </p>
        </div>

        {/* Founder Studio Hero Portrait */}
        <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl mb-16">
          <img
            src="/src/assets/images/abdala_hero_studio_1792842639594.jpg"
            alt="Abdala Silver Academy Studio"
            className="w-full h-auto object-cover max-h-[480px]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050811] via-[#050811]/40 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 p-6 rounded-xl bg-slate-950/80 backdrop-blur-md border border-slate-800 max-w-xl">
            <p className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">Founder's Note</p>
            <p className="text-sm italic text-white leading-relaxed">
              "We don't teach abstract theories. Every lesson is grounded in real timelines, 4K RED raw camera clips, vector geometry, and client commercial briefs."
            </p>
          </div>
        </div>

        {/* 3 Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="p-6 rounded-xl bg-[#080d1a] border border-slate-800">
            <div className="w-10 h-10 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center mb-4">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Bilingual Excellence</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              We teach in both Somali and English so students grasp deep technical concepts naturally while adopting global industry workflows.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-[#080d1a] border border-slate-800">
            <div className="w-10 h-10 rounded-lg bg-cyan-600/20 text-cyan-400 flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Modern Toolchains</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              From DaVinci Resolve color nodes and After Effects kinetic typography to Midjourney generative synthesis, we focus on high-income software.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-[#080d1a] border border-slate-800">
            <div className="w-10 h-10 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center mb-4">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Verified Credentials</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Certificates awarded by Abdala Silver are backed by complete assignment reviews, giving employers proof of genuine practical capability.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
