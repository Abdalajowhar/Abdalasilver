import React from 'react';
import { useTranslation } from '../../context/LanguageContext';
import { store } from '../../services/store';
import { Play, Sparkles, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface HeroProps {
  onExploreCourses: () => void;
  onStartFree: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreCourses, onStartFree }) => {
  const { t, language } = useTranslation();
  const stats = store.getPlatformStats();

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-slate-800/80">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-600/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main 2-Column Desktop Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Value Proposition & CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start">
            
            {/* Human Natural Editorial Kicker */}
            <div className="flex items-center gap-2 mb-4 text-xs font-semibold text-blue-400 tracking-wide uppercase">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>{t.hero.kicker}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-400">Somalia & Worldwide</span>
            </div>

            {/* Display Headline with text-wrap: balance */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-bold font-display text-white tracking-tight leading-[1.12] mb-5 [text-wrap:balance]">
              {t.hero.title}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-cyan-300">
                {t.hero.titleAccent}
              </span>
            </h1>

            {/* Supporting Paragraph */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mb-8">
              {t.hero.subtitle}
            </p>

            {/* Dual CTAs */}
            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto mb-8">
              <button
                onClick={onExploreCourses}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-sm text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{t.hero.ctaPrimary}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onStartFree}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-sm text-slate-200 bg-slate-900 border border-slate-700/80 hover:bg-slate-800 hover:text-white hover:border-slate-600 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4 text-blue-400 fill-blue-400" />
                <span>{t.hero.ctaSecondary}</span>
              </button>
            </div>

            {/* Trust highlights */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{language === 'so' ? 'Faylal Mashruuc 4K oo dhab ah' : 'Raw 4K Practice Project Files'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{language === 'so' ? 'Shahaado Caalami ah' : 'Verifiable Credentials'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{language === 'so' ? 'Af-Soomaali & English' : 'Somali & English Instruction'}</span>
              </div>
            </div>

          </div>

          {/* Right Column: Visual Stage with Abdala Silver in Studio */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900 group">
              <img
                src="/src/assets/images/abdala_hero_studio_1792842639594.jpg"
                alt="Abdala Silver in studio teaching video editing and digital media"
                className="w-full h-auto object-cover group-hover:scale-102 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-[#050811] via-transparent to-transparent opacity-90" />

              {/* In-Frame Creative Caption */}
              <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-xl bg-slate-950/80 backdrop-blur-md border border-slate-800/80 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white">Abdala Silver Masterclass</p>
                  <p className="text-[11px] text-blue-400 font-medium">DaVinci Resolve & Cinema Production</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono tabular-nums bg-emerald-950/60 px-2 py-1 rounded border border-emerald-800/40">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified Mentor</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* 4-Column KPI Strip in a full-width row below hero split */}
        <div className="mt-14 pt-8 border-t border-slate-800/60 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex flex-col">
            <span className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-white">
              {stats.totalCourses}+
            </span>
            <span className="text-xs text-slate-400 mt-1">{t.hero.statCourses}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-blue-400">
              {stats.totalEnrollments.toLocaleString()}+
            </span>
            <span className="text-xs text-slate-400 mt-1">{t.hero.statStudents}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-white">
              {stats.totalInstructors}
            </span>
            <span className="text-xs text-slate-400 mt-1">{t.hero.statInstructors}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-cyan-400">
              {stats.totalLessons}+
            </span>
            <span className="text-xs text-slate-400 mt-1">{t.hero.statLessons}</span>
          </div>
        </div>

      </div>
    </section>
  );
};
