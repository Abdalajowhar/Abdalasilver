import React, { useState } from 'react';
import { useTranslation } from '../../context/LanguageContext';
import { Course, CourseReview } from '../../types';
import { store } from '../../services/store';
import { auth } from '../../services/auth';
import { 
  Play, 
  CheckCircle2, 
  Clock, 
  BookOpen, 
  Users, 
  Star, 
  Globe, 
  Download, 
  Tag, 
  ArrowLeft,
  ChevronDown,
  Lock,
  Send
} from 'lucide-react';

interface CourseDetailProps {
  course: Course;
  onBack: () => void;
  onStartLearning: (course: Course, lessonId?: string) => void;
  onOpenAuth: () => void;
}

export const CourseDetail: React.FC<CourseDetailProps> = ({
  course,
  onBack,
  onStartLearning,
  onOpenAuth
}) => {
  const { t, language } = useTranslation();
  const [currentUser, setCurrentUser] = useState(auth.getCurrentUser());
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; percent: number } | null>(null);
  const [discountError, setDiscountError] = useState('');
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({
    [course.modules[0]?.id || '']: true
  });
  const [reviews, setReviews] = useState<CourseReview[]>(store.getReviews(course.id));
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewText, setNewReviewText] = useState('');

  const isEnrolled = currentUser ? currentUser.enrolledCourseIds.includes(course.id) : false;

  const toggleModule = (modId: string) => {
    setExpandedModules(prev => ({ ...prev, [modId]: !prev[modId] }));
  };

  const handleApplyDiscount = (e: React.FormEvent) => {
    e.preventDefault();
    setDiscountError('');
    const valid = store.validateDiscount(discountCode);
    if (valid) {
      setAppliedDiscount({ code: valid.code, percent: valid.discountPercent });
    } else {
      setDiscountError('Invalid or expired coupon code. Try "SILVER50"');
    }
  };

  const calculateFinalPrice = () => {
    if (course.price === 0) return 0;
    if (!appliedDiscount) return course.price;
    const discounted = course.price * (1 - appliedDiscount.percent / 100);
    return Math.max(0, Math.round(discounted * 100) / 100);
  };

  const handleEnroll = () => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    auth.enrollInCourse(course.id);
    setCurrentUser(auth.getCurrentUser());
    // Directly launch into the first lesson!
    const firstLessonId = course.modules[0]?.lessons[0]?.id;
    onStartLearning(course, firstLessonId);
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    if (!newReviewText.trim()) return;

    const newRev = store.addReview(
      course.id,
      currentUser.id,
      currentUser.name,
      newReviewRating,
      newReviewText.trim(),
      currentUser.avatar
    );
    setReviews([newRev, ...reviews]);
    setNewReviewText('');
  };

  const title = language === 'so' && course.titleSo ? course.titleSo : course.title;
  const description = language === 'so' && course.descriptionSo ? course.descriptionSo : course.description;
  const whatYouWillLearn = (language === 'so' && course.whatYouWillLearnSo) ? course.whatYouWillLearnSo : course.whatYouWillLearn;

  return (
    <div className="py-10 bg-[#050811] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back navigation */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Masterclasses</span>
        </button>

        {/* 2-Column Hero & Enrollment Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-14">
          
          {/* Main Info Column */}
          <div className="lg:col-span-8">
            
            {/* Zero-pill metadata */}
            <div className="flex items-center gap-2 text-xs text-blue-400 font-medium mb-3">
              <span className="capitalize">{course.category.replace('-', ' ')}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-400">{course.level} Level</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-400">{course.language}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display text-white tracking-tight mb-4 [text-wrap:balance]">
              {title}
            </h1>

            <p className="text-base text-slate-300 leading-relaxed mb-6">
              {description}
            </p>

            {/* Metrics */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-300 py-3 border-y border-slate-800/80 mb-6 font-mono tabular-nums">
              <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{course.rating.toFixed(1)} Rating</span>
                <span className="text-slate-500 font-normal">({reviews.length} reviews)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-slate-500" />
                <span>{course.enrollmentCount.toLocaleString()} Students Enrolled</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-500" />
                <span>{course.duration} Content</span>
              </div>
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-slate-500" />
                <span>{course.totalLessons} Lessons</span>
              </div>
            </div>

            {/* Instructor Card */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-[#080d1a] border border-slate-800/80 mb-8">
              <img
                src={course.instructorAvatar || '/src/assets/images/abdala_hero_studio_1792842639594.jpg'}
                alt={course.instructorName}
                className="w-12 h-12 rounded-xl object-cover ring-1 ring-blue-500/30"
                referrerPolicy="no-referrer"
              />
              <div>
                <p className="text-xs text-blue-400 font-medium">Instructor</p>
                <p className="text-sm font-bold text-white">{course.instructorName}</p>
                <p className="text-xs text-slate-400">{course.instructorTitle}</p>
              </div>
            </div>

            {/* What you will learn */}
            {whatYouWillLearn && whatYouWillLearn.length > 0 && (
              <div className="p-6 rounded-2xl bg-[#090f1d] border border-slate-800/80 mb-8">
                <h2 className="text-lg font-bold font-display text-white mb-4">
                  What You Will Master in This Course
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {whatYouWillLearn.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Curriculum Breakdown */}
            <div className="mb-10">
              <h2 className="text-xl font-bold font-display text-white mb-2">
                Course Curriculum & Syllabus
              </h2>
              <p className="text-xs text-slate-400 mb-6">
                {course.modules.length} Modules · {course.totalLessons} Total Lessons · All practice files included
              </p>

              <div className="space-y-4">
                {course.modules.map((mod, modIdx) => {
                  const isExpanded = expandedModules[mod.id] ?? false;
                  return (
                    <div
                      key={mod.id}
                      className="rounded-xl border border-slate-800 bg-[#090f1e] overflow-hidden"
                    >
                      <button
                        onClick={() => toggleModule(mod.id)}
                        className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-800/40 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs font-bold text-blue-500">
                            0{modIdx + 1}
                          </span>
                          <span className="text-sm font-semibold text-white">
                            {language === 'so' && mod.titleSo ? mod.titleSo : mod.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-400">
                          <span>{mod.lessons.length} lessons</span>
                          <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180 text-blue-400' : ''}`} />
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="divide-y divide-slate-800/60 bg-[#060a14]">
                          {mod.lessons.map((lesson) => (
                            <div
                              key={lesson.id}
                              className="p-4 flex items-center justify-between hover:bg-slate-900/60 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                {isEnrolled || lesson.isPreview ? (
                                  <button
                                    onClick={() => onStartLearning(course, lesson.id)}
                                    className="w-7 h-7 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors cursor-pointer"
                                  >
                                    <Play className="w-3.5 h-3.5 fill-current" />
                                  </button>
                                ) : (
                                  <div className="w-7 h-7 rounded-lg bg-slate-900 text-slate-600 flex items-center justify-center">
                                    <Lock className="w-3.5 h-3.5" />
                                  </div>
                                )}
                                <div>
                                  <p className="text-xs sm:text-sm font-medium text-slate-200">
                                    {language === 'so' && lesson.titleSo ? lesson.titleSo : lesson.title}
                                  </p>
                                  <p className="text-[11px] text-slate-400 line-clamp-1">
                                    {language === 'so' && lesson.descriptionSo ? lesson.descriptionSo : lesson.description}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-3 text-xs font-mono text-slate-400 tabular-nums shrink-0">
                                {lesson.isPreview && (
                                  <span className="text-[10px] font-semibold text-cyan-400 bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-800/40">
                                    Preview
                                  </span>
                                )}
                                <span>{lesson.duration}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Student Reviews & Ratings */}
            <div className="p-6 rounded-2xl bg-[#090f1d] border border-slate-800/80">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold font-display text-white">
                    Verified Student Reviews
                  </h2>
                  <p className="text-xs text-slate-400">
                    Real feedback from creators who finished this masterclass.
                  </p>
                </div>
                <div className="flex items-center gap-1 text-amber-400 font-bold font-mono">
                  <Star className="w-5 h-5 fill-amber-400" />
                  <span className="text-lg">{course.rating.toFixed(1)}</span>
                </div>
              </div>

              {/* Add review form */}
              {isEnrolled && (
                <form onSubmit={handleAddReview} className="mb-6 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                  <p className="text-xs font-semibold text-white mb-2">Leave Your Feedback</p>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs text-slate-400">Your Rating:</span>
                    <div className="flex items-center gap-1 text-amber-400">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setNewReviewRating(star)}
                          className="cursor-pointer"
                        >
                          <Star className={`w-4 h-4 ${star <= newReviewRating ? 'fill-amber-400' : 'text-slate-600'}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newReviewText}
                      onChange={(e) => setNewReviewText(e.target.value)}
                      placeholder="Share your practical experience with this course..."
                      className="flex-1 px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 flex items-center gap-1.5 cursor-pointer shrink-0"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Post</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Reviews list */}
              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/60">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-blue-600/30 text-blue-400 text-xs font-bold flex items-center justify-center">
                          {rev.userName.charAt(0)}
                        </div>
                        <span className="text-xs font-semibold text-white">{rev.userName}</span>
                      </div>
                      <div className="flex items-center gap-1 text-amber-400 text-xs">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span className="font-mono">{rev.rating}</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{rev.comment}</p>
                    <p className="text-[10px] text-slate-500 mt-2 font-mono tabular-nums">{rev.date}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Sticky Enrollment Box */}
          <div className="lg:col-span-4 sticky top-24">
            <div className="rounded-2xl border border-slate-800 bg-[#090f1e] overflow-hidden shadow-2xl">
              
              {/* Media Preview Player / Image */}
              <div className="relative aspect-[16/9] w-full bg-black overflow-hidden group">
                <img
                  src={course.thumbnail}
                  alt={title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <button
                  onClick={() => onStartLearning(course, course.modules[0]?.lessons[0]?.id)}
                  className="absolute inset-0 bg-black/50 hover:bg-black/40 flex flex-col items-center justify-center gap-2 text-white transition-all cursor-pointer"
                >
                  <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/40 group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 fill-white ml-1" />
                  </div>
                  <span className="text-xs font-semibold tracking-wide">
                    {isEnrolled ? 'Resume Masterclass' : 'Watch Free Preview'}
                  </span>
                </button>
              </div>

              {/* Price & Action Deck */}
              <div className="p-6">
                <div className="flex items-baseline justify-between mb-4">
                  <div>
                    {course.price === 0 ? (
                      <span className="text-3xl font-bold font-mono text-emerald-400">Free</span>
                    ) : (
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold font-mono text-white">
                          ${calculateFinalPrice()}
                        </span>
                        {appliedDiscount && (
                          <span className="text-sm line-through text-slate-500 font-mono">
                            ${course.price}
                          </span>
                        )}
                        <span className="text-xs text-slate-400">USD</span>
                      </div>
                    )}
                  </div>
                  {appliedDiscount && (
                    <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                      {appliedDiscount.percent}% OFF
                    </span>
                  )}
                </div>

                {/* Primary Action Button */}
                <button
                  onClick={isEnrolled ? () => onStartLearning(course) : handleEnroll}
                  className="w-full py-3.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer mb-4"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>
                    {isEnrolled 
                      ? 'Continue Learning Now' 
                      : course.price === 0 
                        ? 'Enroll in Masterclass (Free)' 
                        : 'Unlock Lifetime Access'}
                  </span>
                </button>

                {/* Discount Code Form (for paid courses) */}
                {course.price > 0 && !isEnrolled && (
                  <form onSubmit={handleApplyDiscount} className="mb-6 pt-3 border-t border-slate-800/80">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                          type="text"
                          value={discountCode}
                          onChange={(e) => setDiscountCode(e.target.value)}
                          placeholder="Coupon code (e.g. SILVER50)"
                          className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white uppercase placeholder:normal-case placeholder-slate-500 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <button
                        type="submit"
                        className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white cursor-pointer"
                      >
                        Apply
                      </button>
                    </div>
                    {discountError && (
                      <p className="text-[11px] text-rose-400 mt-1">{discountError}</p>
                    )}
                  </form>
                )}

                {/* Course Inclusions List */}
                <div className="space-y-2.5 text-xs text-slate-300 pt-4 border-t border-slate-800">
                  <p className="font-semibold text-white text-xs mb-2">This Masterclass Includes:</p>
                  <div className="flex items-center gap-2">
                    <Play className="w-3.5 h-3.5 text-blue-400" />
                    <span>{course.duration} on-demand video</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Download className="w-3.5 h-3.5 text-blue-400" />
                    <span>Downloadable raw 4K practice clips & project assets</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 text-blue-400" />
                    <span>Lifetime digital access on mobile and desktop</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                    <span>Verifiable Certificate of Completion</span>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
