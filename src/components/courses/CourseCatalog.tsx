import React, { useState, useMemo } from 'react';
import { useTranslation } from '../../context/LanguageContext';
import { Course, CourseCategory, CourseLevel } from '../../types';
import { CourseCard } from '../common/CourseCard';
import { store } from '../../services/store';
import { auth } from '../../services/auth';
import { Search, Filter, RotateCcw } from 'lucide-react';

interface CourseCatalogProps {
  initialCategory?: CourseCategory | null;
  onSelectCourse: (course: Course) => void;
}

export const CourseCatalog: React.FC<CourseCatalogProps> = ({ initialCategory = null, onSelectCourse }) => {
  const { t, language } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [priceFilter, setPriceFilter] = useState<'all' | 'free' | 'paid'>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'newest'>('popular');

  const allCourses = store.getCourses();
  const currentUser = auth.getCurrentUser();

  const filteredCourses = useMemo(() => {
    return allCourses
      .filter((course) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = course.title.toLowerCase().includes(q) || (course.titleSo && course.titleSo.toLowerCase().includes(q));
          const matchDesc = course.description.toLowerCase().includes(q) || (course.descriptionSo && course.descriptionSo.toLowerCase().includes(q));
          const matchInstructor = course.instructorName.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchInstructor) return false;
        }

        // Category filter
        if (selectedCategory !== 'all' && course.category !== selectedCategory) {
          return false;
        }

        // Level filter
        if (selectedLevel !== 'all' && course.level !== selectedLevel) {
          return false;
        }

        // Price filter
        if (priceFilter === 'free' && course.price !== 0) return false;
        if (priceFilter === 'paid' && course.price === 0) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        return b.enrollmentCount - a.enrollmentCount;
      });
  }, [allCourses, searchQuery, selectedCategory, selectedLevel, priceFilter, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedLevel('all');
    setPriceFilter('all');
    setSortBy('popular');
  };

  const categoriesList = [
    { id: 'all', label: language === 'so' ? 'Dhammaan' : 'All Categories' },
    { id: 'video-editing', label: t.categories.videoEditing },
    { id: 'graphic-design', label: t.categories.graphicDesign },
    { id: 'motion-graphics', label: t.categories.motionGraphics },
    { id: 'content-creation', label: t.categories.contentCreation },
    { id: 'artificial-intelligence', label: t.categories.artificialIntelligence },
  ];

  return (
    <div className="py-12 bg-[#050811] min-h-[85vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-white tracking-tight">
            {language === 'so' ? 'Koorsooyinka Hal-abuurka' : 'Creative Masterclasses'}
          </h1>
          <p className="text-sm text-slate-400 mt-2 max-w-2xl">
            {language === 'so'
              ? 'Ka dooro koorsooyinka ugu casrisan ee video editing, motion graphics, graphic design, iyo AI.'
              : 'Practical, project-based video masterclasses with project files, downloadable presets, and certified mentorship.'}
          </p>
        </div>

        {/* Filter Controls Deck */}
        <div className="p-5 rounded-2xl bg-[#080d1a] border border-slate-800/80 mb-10 space-y-4">
          
          {/* Search Row */}
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'so' ? 'Raadi koorso, macallin, ama xirfad...' : 'Search masterclasses, instructors, or software...'}
                className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
              <span className="text-xs text-slate-400 whitespace-nowrap">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Sort masterclasses"
                className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest Releases</option>
              </select>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none pt-2 border-t border-slate-800/60">
            {categoriesList.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                  selectedCategory === cat.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Secondary Sub-filters (Level & Price) */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-800/60 text-xs">
            <div className="flex flex-wrap items-center gap-4">
              {/* Level Filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 font-medium">Level:</span>
                {(['all', 'Beginner', 'Intermediate', 'Advanced'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setSelectedLevel(lvl)}
                    className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                      selectedLevel === lvl
                        ? 'text-white font-bold bg-slate-800 border border-blue-500/50'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {lvl === 'all' ? 'All' : lvl}
                  </button>
                ))}
              </div>

              {/* Price Filter */}
              <div className="flex items-center gap-1.5 border-l border-slate-800 pl-4">
                <span className="text-slate-400 font-medium">Pricing:</span>
                {(['all', 'free', 'paid'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPriceFilter(p)}
                    className={`px-2.5 py-1 rounded capitalize transition-colors cursor-pointer ${
                      priceFilter === p
                        ? 'text-white font-bold bg-slate-800 border border-blue-500/50'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Results count & reset */}
            <div className="flex items-center gap-3">
              <span className="text-slate-400 font-mono tabular-nums">
                {filteredCourses.length} {filteredCourses.length === 1 ? 'course' : 'courses'} found
              </span>
              {(selectedCategory !== 'all' || selectedLevel !== 'all' || priceFilter !== 'all' || searchQuery) && (
                <button
                  onClick={handleResetFilters}
                  className="flex items-center gap-1 text-blue-400 hover:text-blue-300 font-medium cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Courses Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => {
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
        ) : (
          /* Empty State */
          <div className="text-center py-20 p-8 rounded-2xl bg-slate-900/40 border border-slate-800 max-w-md mx-auto">
            <Filter className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-white mb-1">
              No matching masterclasses found
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Try adjusting your search terms or resetting the active category and price filters.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
