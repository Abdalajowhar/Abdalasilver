import React, { useState, useEffect } from 'react';
import { LanguageProvider, useTranslation } from './context/LanguageContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { Hero } from './components/home/Hero';
import { CategoryGrid } from './components/home/CategoryGrid';
import { FeaturedCourses } from './components/home/FeaturedCourses';
import { HowItWorks } from './components/home/HowItWorks';
import { InstructorSpotlight } from './components/home/InstructorSpotlight';
import { Testimonials } from './components/home/Testimonials';
import { FaqSection } from './components/home/FaqSection';
import { Newsletter } from './components/home/Newsletter';
import { CourseCatalog } from './components/courses/CourseCatalog';
import { CourseDetail } from './components/courses/CourseDetail';
import { LessonPlayer } from './components/player/LessonPlayer';
import { StudentDashboard } from './components/dashboard/StudentDashboard';
import { InstructorDashboard } from './components/dashboard/InstructorDashboard';
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { AboutPage } from './components/pages/AboutPage';
import { ContactPage } from './components/pages/ContactPage';
import { LegalPage } from './components/pages/LegalPage';
import { AuthModal } from './components/auth/AuthModal';
import { Course, CourseCategory } from './types';
import { store } from './services/store';
import { auth } from './services/auth';

function MainApp() {
  const { t } = useTranslation();
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [playerLessonId, setPlayerLessonId] = useState<string | undefined>(undefined);
  const [selectedCategory, setSelectedCategory] = useState<CourseCategory | null>(null);
  
  // Auth modal
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Listen to store updates
  useEffect(() => {
    const unsub = store.subscribe(() => {
      if (selectedCourse) {
        const fresh = store.getCourseById(selectedCourse.id);
        if (fresh) setSelectedCourse(fresh);
      }
    });
    return unsub;
  }, [selectedCourse]);

  const handleNavigate = (view: string, param?: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentView(view);
    if (param) {
      setSelectedCategory(param as CourseCategory);
    }
  };

  const handleSelectCourse = (course: Course) => {
    setSelectedCourse(course);
    setCurrentView('course-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartLearning = (course: Course, lessonId?: string) => {
    setSelectedCourse(course);
    setPlayerLessonId(lessonId);
    setCurrentView('player');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCategory = (cat: CourseCategory) => {
    setSelectedCategory(cat);
    setCurrentView('courses');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAuth = (mode: 'login' | 'register' = 'login') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#050811] text-slate-100 selection:bg-blue-600 selection:text-white">
      
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenAuth={handleOpenAuth}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'home' && (
          <>
            <Hero
              onExploreCourses={() => handleNavigate('courses')}
              onStartFree={() => {
                const freeCourse = store.getCourses().find(c => c.price === 0) || store.getCourses()[0];
                handleSelectCourse(freeCourse);
              }}
            />
            <CategoryGrid onSelectCategory={handleSelectCategory} />
            <FeaturedCourses
              onSelectCourse={handleSelectCourse}
              onViewAllCourses={() => handleNavigate('courses')}
            />
            <HowItWorks />
            <InstructorSpotlight
              onViewInstructorCourses={() => handleNavigate('courses')}
            />
            <Testimonials />
            <FaqSection />
            <Newsletter />
          </>
        )}

        {currentView === 'courses' && (
          <CourseCatalog
            initialCategory={selectedCategory}
            onSelectCourse={handleSelectCourse}
          />
        )}

        {currentView === 'categories' && (
          <div className="py-8 bg-[#050811]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
              <h1 className="text-3xl font-bold font-display text-white">All Learning Paths</h1>
              <p className="text-sm text-slate-400 mt-1">Explore specialized creative career tracks.</p>
            </div>
            <CategoryGrid onSelectCategory={handleSelectCategory} />
          </div>
        )}

        {currentView === 'course-detail' && selectedCourse && (
          <CourseDetail
            course={selectedCourse}
            onBack={() => handleNavigate('courses')}
            onStartLearning={handleStartLearning}
            onOpenAuth={() => handleOpenAuth('login')}
          />
        )}

        {currentView === 'player' && selectedCourse && (
          <LessonPlayer
            course={selectedCourse}
            initialLessonId={playerLessonId}
            onBackToCourse={() => handleSelectCourse(selectedCourse)}
          />
        )}

        {currentView === 'dashboard' && (
          <StudentDashboard
            onSelectCourse={handleSelectCourse}
            onResumeCourse={(c) => handleStartLearning(c)}
            onExploreCourses={() => handleNavigate('courses')}
          />
        )}

        {currentView === 'instructor-dashboard' && (
          <InstructorDashboard
            onSelectCourse={handleSelectCourse}
          />
        )}

        {currentView === 'admin-dashboard' && (
          <AdminDashboard />
        )}

        {currentView === 'about' && (
          <AboutPage />
        )}

        {currentView === 'instructors' && (
          <div className="py-12 bg-[#050811]">
            <InstructorSpotlight
              onViewInstructorCourses={() => handleNavigate('courses')}
            />
          </div>
        )}

        {currentView === 'contact' && (
          <ContactPage />
        )}

        {currentView === 'terms' && (
          <LegalPage initialTab="terms" />
        )}

        {currentView === 'privacy' && (
          <LegalPage initialTab="privacy" />
        )}
      </main>

      {/* Footer */}
      {currentView !== 'player' && (
        <Footer
          onNavigate={handleNavigate}
          onSelectCategory={handleSelectCategory}
        />
      )}

      {/* Authentication Modal */}
      {authModalOpen && (
        <AuthModal
          initialMode={authMode}
          onClose={() => setAuthModalOpen(false)}
          onSuccess={() => {
            // refresh
          }}
        />
      )}

    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <MainApp />
    </LanguageProvider>
  );
}
