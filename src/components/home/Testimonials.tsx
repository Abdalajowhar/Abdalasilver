import React from 'react';
import { useTranslation } from '../../context/LanguageContext';
import { store } from '../../services/store';
import { Star, Quote } from 'lucide-react';

export const Testimonials: React.FC = () => {
  const { t } = useTranslation();
  // Fetch real submitted reviews from store
  const allReviews = store.getReviews('course-1').concat(store.getReviews('course-4')).concat(store.getReviews('course-3'));

  return (
    <section className="py-16 border-b border-slate-800/80 bg-[#060a14]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-white tracking-tight">
            {t.testimonials.title}
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            {t.testimonials.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {allReviews.slice(0, 3).map((review) => (
            <div
              key={review.id}
              className="relative p-6 rounded-xl bg-[#090f1d] border border-slate-800/80 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-5 h-5 text-slate-700" />
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6 italic">
                  "{review.comment}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-800/60">
                <div className="w-9 h-9 rounded-full bg-blue-600/20 text-blue-400 font-bold flex items-center justify-center text-xs">
                  {review.userName.charAt(0)}
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">{review.userName}</p>
                  <p className="text-[11px] text-slate-400 font-mono tabular-nums">{review.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
