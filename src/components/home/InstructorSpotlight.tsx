import React from 'react';
import { useTranslation } from '../../context/LanguageContext';
import { Award, Users, Globe, ArrowRight } from 'lucide-react';

interface InstructorSpotlightProps {
  onViewInstructorCourses: () => void;
}

export const InstructorSpotlight: React.FC<InstructorSpotlightProps> = ({ onViewInstructorCourses }) => {
  const { t } = useTranslation();

  return (
    <section className="py-20 border-b border-slate-800/80 bg-[#050811] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Visual Column */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl">
              <img
                src="/src/assets/images/abdala_hero_studio_1792842639594.jpg"
                alt="Abdala Silver Creative Academy Founder"
                className="w-full h-auto object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050811] via-transparent to-transparent opacity-85" />
              
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-slate-950/80 backdrop-blur-md border border-slate-800">
                <p className="text-sm font-bold text-white">Abdala Silver</p>
                <p className="text-xs text-blue-400">Founder & Lead Creative Director</p>
              </div>
            </div>
          </div>

          {/* Details Column */}
          <div className="lg:col-span-7 flex flex-col items-start">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">
              {t.instructor.badge}
            </span>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display text-white tracking-tight mb-2">
              {t.instructor.name}
            </h2>

            <p className="text-sm text-blue-400 font-medium mb-6">
              {t.instructor.title}
            </p>

            <blockquote className="p-4 rounded-xl bg-[#090f1d] border border-slate-800/80 text-sm italic text-slate-300 leading-relaxed mb-6">
              {t.instructor.quote}
            </blockquote>

            <p className="text-sm text-slate-300 leading-relaxed mb-8">
              {t.instructor.bio}
            </p>

            {/* Highlights */}
            <div className="space-y-3 mb-8 w-full">
              <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-200">
                <Award className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{t.instructor.highlight1}</span>
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-200">
                <Users className="w-4 h-4 text-blue-400 shrink-0" />
                <span>{t.instructor.highlight2}</span>
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-200">
                <Globe className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>{t.instructor.highlight3}</span>
              </div>
            </div>

            <button
              onClick={onViewInstructorCourses}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/20 transition-all cursor-pointer"
            >
              <span>Explore Masterclasses by Abdala Silver</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
