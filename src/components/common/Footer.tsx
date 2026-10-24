import React from 'react';
import { useTranslation } from '../../context/LanguageContext';
import { CourseCategory } from '../../types';
import { Youtube, Instagram, Twitter, Linkedin, Mail, MapPin } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string, param?: string) => void;
  onSelectCategory: (category: CourseCategory) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onSelectCategory }) => {
  const { t, language } = useTranslation();

  return (
    <footer className="bg-[#03060d] border-t border-slate-900 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Column 1: Brand & Bio */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-display font-black text-white text-base">
                AS
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Abdala <span className="text-blue-500 font-medium">Silver</span>
              </span>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              {t.footer.about}
            </p>

            <div className="flex items-center gap-2 text-slate-400 text-[11px] pt-1">
              <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>{t.footer.somaliaHub}</span>
            </div>

            {/* Social media links */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://youtube.com/@abdalasilver"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-blue-500/50 transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com/abdalasilver"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-blue-500/50 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com/abdalasilver"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-blue-500/50 transition-colors"
                aria-label="Twitter / X"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-blue-500/50 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <p className="text-white font-semibold tracking-wider uppercase text-[11px]">
              {t.footer.quickLinks}
            </p>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-white transition-colors cursor-pointer">
                  {t.nav.home}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('courses')} className="hover:text-white transition-colors cursor-pointer">
                  {t.nav.courses}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('categories')} className="hover:text-white transition-colors cursor-pointer">
                  {t.nav.categories}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors cursor-pointer">
                  {t.nav.about}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('instructors')} className="hover:text-white transition-colors cursor-pointer">
                  {t.nav.instructors}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors cursor-pointer">
                  {t.nav.contact}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Learning Paths */}
          <div className="space-y-3">
            <p className="text-white font-semibold tracking-wider uppercase text-[11px]">
              {t.footer.learningPaths}
            </p>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onSelectCategory('video-editing')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Video Editing Masterclasses
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('graphic-design')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Graphic Design & Brand Systems
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('motion-graphics')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Motion Graphics & VFX
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('content-creation')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Solo Creator & YouTube Growth
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('artificial-intelligence')} className="hover:text-white transition-colors cursor-pointer text-left">
                  AI for Creatives & Synthesis
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Academy Office */}
          <div className="space-y-3">
            <p className="text-white font-semibold tracking-wider uppercase text-[11px]">
              {t.footer.contactUs}
            </p>
            <p className="text-slate-400 text-xs">
              Mogadishu Creative Hub, Somalia
            </p>
            <div className="flex items-center gap-1.5 text-blue-400">
              <Mail className="w-3.5 h-3.5" />
              <span>info@abdalasilver.com</span>
            </div>
            <p className="text-[11px] text-slate-500 pt-1">
              WhatsApp Support: +252 61 500 0000
            </p>
          </div>

        </div>

        {/* Bottom Copyright bar */}
        <div className="mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} Abdala Silver Academy. {t.footer.rights}</p>
          <div className="flex items-center gap-5">
            <button onClick={() => onNavigate('privacy')} className="hover:text-slate-400 transition-colors">
              {t.footer.privacy}
            </button>
            <button onClick={() => onNavigate('terms')} className="hover:text-slate-400 transition-colors">
              {t.footer.terms}
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
