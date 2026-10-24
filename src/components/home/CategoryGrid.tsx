import React from 'react';
import { useTranslation } from '../../context/LanguageContext';
import { CourseCategory } from '../../types';
import { store } from '../../services/store';
import { Film, Palette, Clapperboard, Video, Cpu, ArrowRight } from 'lucide-react';

interface CategoryGridProps {
  onSelectCategory: (category: CourseCategory) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ onSelectCategory }) => {
  const { t } = useTranslation();
  const allCourses = store.getCourses();

  const categories: Array<{
    id: CourseCategory;
    title: string;
    description: string;
    icon: React.ElementType;
    image: string;
  }> = [
    {
      id: 'video-editing',
      title: t.categories.videoEditing,
      description: t.categories.videoEditingDesc,
      icon: Film,
      image: '/src/assets/images/course_video_edit_1792842654103.jpg',
    },
    {
      id: 'graphic-design',
      title: t.categories.graphicDesign,
      description: t.categories.graphicDesignDesc,
      icon: Palette,
      image: '/src/assets/images/course_graphic_design_1792842654199.jpg',
    },
    {
      id: 'motion-graphics',
      title: t.categories.motionGraphics,
      description: t.categories.motionGraphicsDesc,
      icon: Clapperboard,
      image: '/src/assets/images/course_motion_graphics_1792842654865.jpg',
    },
    {
      id: 'content-creation',
      title: t.categories.contentCreation,
      description: t.categories.contentCreationDesc,
      icon: Video,
      image: '/src/assets/images/course_content_creation_1792842667723.jpg',
    },
    {
      id: 'artificial-intelligence',
      title: t.categories.artificialIntelligence,
      description: t.categories.artificialIntelligenceDesc,
      icon: Cpu,
      image: '/src/assets/images/course_ai_learning_1792842667505.jpg',
    },
  ];

  return (
    <section className="py-16 border-b border-slate-800/80 bg-[#060a14]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="max-w-xl">
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-white tracking-tight">
              {t.categories.title}
            </h2>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
              {t.categories.subtitle}
            </p>
          </div>
        </div>

        {/* 5-Category Bento/Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, idx) => {
            const count = allCourses.filter(c => c.category === cat.id).length;
            const Icon = cat.icon;
            const isLarge = idx === 0 || idx === 4;

            return (
              <div
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`group relative rounded-xl border border-slate-800/80 bg-[#090f1d] overflow-hidden hover:border-blue-500/60 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                  isLarge ? 'md:col-span-2 lg:col-span-1' : ''
                }`}
              >
                {/* Background image preview with measured scrim */}
                <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#090f1d] via-[#090f1d]/50 to-transparent" />
                  
                  {/* Category Icon Badge */}
                  <div className="absolute top-4 left-4 p-2.5 rounded-lg bg-black/70 backdrop-blur-md border border-slate-700/80 text-blue-400 group-hover:text-blue-300 group-hover:border-blue-500/60 transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>

                  {/* Course count unboxed text */}
                  <div className="absolute top-4 right-4 text-xs font-mono tabular-nums text-slate-300 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded border border-slate-800">
                    {count} {t.categories.coursesCount}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                      {cat.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed line-clamp-2">
                      {cat.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs font-semibold text-blue-400 group-hover:text-blue-300">
                    <span>{t.categories.viewCategory}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
