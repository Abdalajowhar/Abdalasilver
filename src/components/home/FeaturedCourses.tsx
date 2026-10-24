import React, { useState } from 'react';
import { useTranslation } from '../../context/LanguageContext';
import { Course } from '../../types';
import { CourseCard } from '../common/CourseCard';
import { store } from '../../services/store';
import { auth } from '../../services/auth';
import { ArrowRight } from 'lucide-react';

interface FeaturedCoursesProps {
  onSelectCourse: (course: Course) => void;
  onViewAllCourses: () => void;
}

export const FeaturedCourses: React.FC<FeaturedCoursesProps> = ({ onSelectCourse, onViewAllCourses }) => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<'all' | 'free' | 'paid' | 'beginner'>('all');
  const courses = store.getCourses();
  const currentUser = auth.getCurrentUser();

  const filteredCourses = courses.filter((c) => {
    if (filter === 'free') return c.price === 0;
    if (filter === 'paid') return c.price > 0;
    if (filter === 'beginner') return c.level === 'Beginner';
    return true;
  });

  return (
    <section className="py-16 border-b border-slate-800/80 bg-[#050811]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-white tracking-tight">
              {t.featured.title}
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              {t.featured.subtitle}
            </p>
          </div>

          {/* Interactive filter segmented controls (functional buttons with click handlers) */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 rounded-lg border border-slate-800">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                filter === 'all'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.featured.allCourses}
            </button>
            <button
              onClick={() => setFilter('free')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                filter === 'free'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.featured.freeOnly}
            </button>
            <button
              onClick={() => setFilter('paid')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                filter === 'paid'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.featured.paidOnly}
            </button>
            <button
              onClick={() => setFilter('beginner')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                filter === 'beginner'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.featured.beginner}
            </button>
          </div>
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.slice(0, 6).map((course) => {
            const isEnrolled = currentUser ? currentUser.enrolledCourseIds.includes(course.id) : false;
            return (
              <CourseCard
                key={course.id}
                course={course}
                onSelect={onSelectCourse}
                isEnrolled={isEnrolled}
              />
            );
          })}
        </div>

        {/* Bottom CTA to full catalog */}
        <div className="mt-12 text-center">
          <button
            onClick={onViewAllCourses}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-slate-200 bg-slate-900 border border-slate-700 hover:bg-slate-800 hover:text-white hover:border-blue-500/50 transition-all cursor-pointer"
          >
            <span>{t.featured.allCourses}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
