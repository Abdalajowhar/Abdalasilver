import React from 'react';
import { Course } from '../../types';
import { useTranslation } from '../../context/LanguageContext';
import { auth } from '../../services/auth';
import { Star, Clock, BookOpen, Users, Bookmark, ArrowUpRight } from 'lucide-react';

interface CourseCardProps {
  course: Course;
  onSelect: (course: Course) => void;
  isEnrolled?: boolean;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, onSelect, isEnrolled }) => {
  const { t, language } = useTranslation();
  const [inWishlist, setInWishlist] = React.useState(auth.isInWishlist(course.id));

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = auth.toggleWishlist(course.id);
    setInWishlist(updated);
  };

  const title = language === 'so' && course.titleSo ? course.titleSo : course.title;
  const tagline = language === 'so' && course.taglineSo ? course.taglineSo : course.tagline;

  const categoryNameMap: Record<string, string> = {
    'video-editing': language === 'so' ? 'Video Editing' : 'Video Editing',
    'graphic-design': language === 'so' ? 'Graphic Design' : 'Graphic Design',
    'motion-graphics': language === 'so' ? 'Motion Graphics' : 'Motion Graphics',
    'content-creation': language === 'so' ? 'Content Creation' : 'Content Creation',
    'artificial-intelligence': language === 'so' ? 'AI Learning' : 'AI Learning',
  };

  return (
    <div 
      onClick={() => onSelect(course)}
      className="group relative flex flex-col bg-[#0b101e] rounded-xl border border-slate-800/80 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-200 cursor-pointer overflow-hidden"
    >
      {/* 4:3 Aspect Ratio Thumbnail Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900">
        <img
          src={course.thumbnail}
          alt={title}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
          referrerPolicy="no-referrer"
          onError={(e) => {
            // High-grade fallback
            (e.target as HTMLImageElement).src = '/src/assets/images/course_video_edit_1792842654103.jpg';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b101e] via-transparent to-transparent opacity-80" />
        
        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className="absolute top-3 right-3 p-2 rounded-lg bg-black/60 backdrop-blur-md text-slate-300 hover:text-white hover:bg-black/80 transition-colors"
          aria-label="Save to Wishlist"
        >
          <Bookmark className={`w-4 h-4 ${inWishlist ? 'fill-blue-500 text-blue-500' : ''}`} />
        </button>

        {/* Price Tag in Bottom Left of image */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          {course.price === 0 ? (
            <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-emerald-500/90 text-white shadow-sm">
              {t.courseCard.free}
            </span>
          ) : (
            <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-blue-600/90 text-white shadow-sm">
              ${course.price} USD
            </span>
          )}
          <span className="text-[11px] font-medium text-slate-300 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded">
            {course.language}
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="flex flex-col flex-1 p-5">
        
        {/* Zero-Pill Unboxed Metadata with Typographic Separator */}
        <div className="flex items-center gap-2 text-xs text-blue-400 font-medium mb-2.5">
          <span>{categoryNameMap[course.category] || course.category}</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="text-slate-400">{course.level}</span>
        </div>

        {/* Course Title with balanced line wrap */}
        <h3 className="text-base font-semibold text-white group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug mb-2">
          {title}
        </h3>

        {/* Tagline snippet */}
        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4 flex-1">
          {tagline}
        </p>

        {/* Instructor */}
        <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-800/60">
          <img
            src={course.instructorAvatar || '/src/assets/images/abdala_hero_studio_1792842639594.jpg'}
            alt={course.instructorName}
            className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-700"
            referrerPolicy="no-referrer"
          />
          <span className="text-xs font-medium text-slate-300 truncate">
            {course.instructorName}
          </span>
        </div>

        {/* Bottom Metrics Bar */}
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 font-mono tabular-nums">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              {course.duration}
            </span>
            <span className="flex items-center gap-1 font-mono tabular-nums">
              <BookOpen className="w-3.5 h-3.5 text-slate-500" />
              {course.totalLessons} {t.courseCard.lessons}
            </span>
          </div>

          <div className="flex items-center gap-1 text-amber-400 font-semibold font-mono tabular-nums">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{course.rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Call to action bar */}
        <div className="mt-4 pt-3 border-t border-slate-800/50 flex items-center justify-between">
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-mono tabular-nums">{course.enrollmentCount}</span> {t.courseCard.enrolled}
          </span>

          <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-400 group-hover:text-blue-300 group-hover:translate-x-0.5 transition-all">
            {isEnrolled ? t.courseCard.continue : t.courseCard.enrollNow}
            <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </div>
  );
};
