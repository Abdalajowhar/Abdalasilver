import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../context/LanguageContext';
import { auth } from '../../services/auth';
import { User } from '../../types';
import { 
  Globe, 
  User as UserIcon, 
  Menu, 
  X, 
  ChevronDown, 
  BookOpen, 
  ShieldCheck, 
  Video, 
  LogOut,
  Sparkles
} from 'lucide-react';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, param?: string) => void;
  onOpenAuth: (initialMode?: 'login' | 'register') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, onOpenAuth }) => {
  const { t, language, toggleLanguage } = useTranslation();
  const [user, setUser] = useState<User | null>(auth.getCurrentUser());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [demoBarOpen, setDemoBarOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.subscribe(() => {
      setUser(auth.getCurrentUser());
    });
    return unsubscribe;
  }, []);

  const navLinks = [
    { id: 'home', label: t.nav.home },
    { id: 'courses', label: t.nav.courses },
    { id: 'categories', label: t.nav.categories },
    { id: 'about', label: t.nav.about },
    { id: 'instructors', label: t.nav.instructors },
    { id: 'contact', label: t.nav.contact },
  ];

  const handleNavClick = (viewId: string) => {
    onNavigate(viewId);
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  };

  const handleDemoSwitch = (role: 'student' | 'instructor' | 'admin') => {
    auth.switchDemoUser(role);
    setDemoBarOpen(false);
    setUserMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#050811]/90 backdrop-blur-md border-b border-slate-800/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
          
          {/* Zone 1: Single element brand wordmark */}
          <button 
            onClick={() => handleNavClick('home')} 
            className="flex items-center gap-2 group text-left cursor-pointer focus:outline-none"
            aria-label="Abdala Silver Home"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-blue-700 via-blue-600 to-cyan-400 flex items-center justify-center font-display font-black text-white text-lg tracking-wider shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              AS
            </div>
            <span className="text-xl font-bold tracking-tight text-white whitespace-nowrap shrink-0 group-hover:text-blue-400 transition-colors">
              Abdala <span className="text-blue-500 font-medium">Silver</span>
            </span>
          </button>

          {/* Zone 2: 4-6 concise single-line nav links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-300">
            {navLinks.map((link) => {
              const isActive = currentView === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`cursor-pointer whitespace-nowrap shrink-0 transition-colors py-1 relative ${
                    isActive 
                      ? 'text-white font-semibold' 
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 primary action + Language toggle + User Controls */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-700/80 hover:bg-slate-800 hover:text-white hover:border-blue-500/50 transition-all cursor-pointer whitespace-nowrap shrink-0"
              title="Toggle Somali / English"
            >
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              <span>{language === 'en' ? 'SO' : 'EN'}</span>
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2.5 p-1.5 pr-3 rounded-lg bg-slate-900/90 border border-slate-700/80 hover:border-blue-500/50 transition-all cursor-pointer text-left focus:outline-none"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                    alt={user.name}
                    className="w-7 h-7 rounded-md object-cover ring-1 ring-blue-500/30"
                    referrerPolicy="no-referrer"
                  />
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-semibold text-white leading-tight truncate max-w-[110px]">
                      {user.name.split(' ')[0]}
                    </p>
                    <p className="text-[10px] text-blue-400 capitalize font-medium leading-none mt-0.5">
                      {user.role}
                    </p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userMenuOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-64 rounded-xl bg-[#090e1a] border border-slate-800 shadow-2xl py-2 z-50 text-sm"
                    onMouseLeave={() => setUserMenuOpen(false)}
                  >
                    <div className="px-4 py-2.5 border-b border-slate-800/80">
                      <p className="font-semibold text-white truncate">{user.name}</p>
                      <p className="text-xs text-slate-400 truncate mt-0.5">{user.email}</p>
                      <div className="mt-2 flex items-center justify-between text-xs">
                        <span className="text-slate-400">Current Role:</span>
                        <span className="text-blue-400 font-semibold uppercase text-[11px] bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/50">
                          {user.role}
                        </span>
                      </div>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => handleNavClick('dashboard')}
                        className="w-full px-4 py-2 text-left flex items-center gap-2.5 text-slate-300 hover:text-white hover:bg-slate-800/70 cursor-pointer"
                      >
                        <BookOpen className="w-4 h-4 text-blue-400" />
                        <span>{t.nav.myLearning} / {t.nav.dashboard}</span>
                      </button>

                      {(user.role === 'instructor' || user.role === 'admin') && (
                        <button
                          onClick={() => handleNavClick('instructor-dashboard')}
                          className="w-full px-4 py-2 text-left flex items-center gap-2.5 text-slate-300 hover:text-white hover:bg-slate-800/70 cursor-pointer"
                        >
                          <Video className="w-4 h-4 text-cyan-400" />
                          <span>{t.nav.instructorWorkspace}</span>
                        </button>
                      )}

                      {user.role === 'admin' && (
                        <button
                          onClick={() => handleNavClick('admin-dashboard')}
                          className="w-full px-4 py-2 text-left flex items-center gap-2.5 text-slate-300 hover:text-white hover:bg-slate-800/70 cursor-pointer"
                        >
                          <ShieldCheck className="w-4 h-4 text-indigo-400" />
                          <span>{t.nav.admin}</span>
                        </button>
                      )}
                    </div>

                    <div className="border-t border-slate-800/80 pt-1 mt-1">
                      <button
                        onClick={() => setDemoBarOpen(!demoBarOpen)}
                        className="w-full px-4 py-2 text-left flex items-center justify-between text-xs text-blue-400 hover:bg-slate-800/50 cursor-pointer"
                      >
                        <span className="flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5" />
                          Quick Switch Role Demo
                        </span>
                        <ChevronDown className="w-3 h-3" />
                      </button>

                      {demoBarOpen && (
                        <div className="px-4 py-1.5 space-y-1 bg-slate-900/60 text-[11px]">
                          <button
                            onClick={() => {
                              auth.login('cadkajwhr5@gmail.com');
                              setDemoBarOpen(false);
                              setUserMenuOpen(false);
                            }}
                            className={`w-full text-left px-2 py-1 rounded transition-colors ${user.email === 'cadkajwhr5@gmail.com' ? 'text-blue-400 font-bold bg-blue-900/30' : 'text-slate-400 hover:text-white'}`}
                          >
                            My Admin: cadkajwhr5
                          </button>
                          <button
                            onClick={() => handleDemoSwitch('student')}
                            className={`w-full text-left px-2 py-1 rounded transition-colors ${user.role === 'student' ? 'text-blue-400 font-bold bg-blue-900/30' : 'text-slate-400 hover:text-white'}`}
                          >
                            Student: Fatima
                          </button>
                          <button
                            onClick={() => handleDemoSwitch('instructor')}
                            className={`w-full text-left px-2 py-1 rounded transition-colors ${user.role === 'instructor' ? 'text-blue-400 font-bold bg-blue-900/30' : 'text-slate-400 hover:text-white'}`}
                          >
                            Instructor: Hamza
                          </button>
                        </div>
                      )}

                      <button
                        onClick={() => {
                          auth.logout();
                          setUserMenuOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left flex items-center gap-2.5 text-rose-400 hover:bg-rose-950/20 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>{t.nav.logout}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenAuth('login')}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  {t.nav.login}
                </button>
                <button
                  onClick={() => onOpenAuth('register')}
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-500 shadow-md shadow-blue-600/30 transition-all cursor-pointer whitespace-nowrap shrink-0"
                >
                  {t.nav.register}
                </button>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-800 bg-[#070b16] px-4 pt-3 pb-6 space-y-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  currentView === link.id
                    ? 'bg-blue-600/20 text-blue-400 font-semibold'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                {link.label}
              </button>
            ))}

            {user ? (
              <div className="pt-3 border-t border-slate-800 space-y-1">
                <button
                  onClick={() => handleNavClick('dashboard')}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-blue-400 font-semibold flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  {t.nav.myLearning}
                </button>
                {(user.role === 'instructor' || user.role === 'admin') && (
                  <button
                    onClick={() => handleNavClick('instructor-dashboard')}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-cyan-400 font-semibold flex items-center gap-2"
                  >
                    <Video className="w-4 h-4" />
                    {t.nav.instructorWorkspace}
                  </button>
                )}
                {user.role === 'admin' && (
                  <button
                    onClick={() => handleNavClick('admin-dashboard')}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-indigo-400 font-semibold flex items-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    {t.nav.admin}
                  </button>
                )}
                <button
                  onClick={() => {
                    auth.logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-rose-400 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  {t.nav.logout}
                </button>
              </div>
            ) : (
              <div className="pt-3 border-t border-slate-800 flex gap-2">
                <button
                  onClick={() => {
                    onOpenAuth('login');
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 py-2 text-center text-xs font-semibold text-slate-200 bg-slate-800 rounded-lg"
                >
                  {t.nav.login}
                </button>
                <button
                  onClick={() => {
                    onOpenAuth('register');
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 py-2 text-center text-xs font-semibold text-white bg-blue-600 rounded-lg"
                >
                  {t.nav.register}
                </button>
              </div>
            )}
          </div>
        )}
      </header>
    </>
  );
};
