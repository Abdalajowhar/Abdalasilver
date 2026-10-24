import React, { useState } from 'react';

interface LegalPageProps {
  initialTab?: 'privacy' | 'terms';
}

export const LegalPage: React.FC<LegalPageProps> = ({ initialTab = 'terms' }) => {
  const [tab, setTab] = useState<'privacy' | 'terms'>(initialTab);

  return (
    <div className="py-14 bg-[#050811] min-h-screen text-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Toggle */}
        <div className="flex items-center justify-center gap-2 mb-10">
          <button
            onClick={() => setTab('terms')}
            className={`px-5 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
              tab === 'terms' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-400'
            }`}
          >
            Terms of Service
          </button>
          <button
            onClick={() => setTab('privacy')}
            className={`px-5 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
              tab === 'privacy' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-400'
            }`}
          >
            Privacy Policy
          </button>
        </div>

        <div className="p-8 rounded-2xl bg-[#080d1a] border border-slate-800 text-xs text-slate-300 space-y-6 leading-relaxed">
          {tab === 'terms' ? (
            <>
              <h1 className="text-xl font-bold font-display text-white mb-4">Terms of Service</h1>
              <p>
                Welcome to Abdala Silver Creative Academy. By accessing our platform, enrolling in courses, downloading project files, or earning certificates, you agree to comply with and be bound by the following terms.
              </p>
              
              <h2 className="text-sm font-bold text-white pt-2">1. Intellectual Property & Course Materials</h2>
              <p>
                All video lessons, raw 4K practice clips, project files, LUTs, After Effects presets, and design templates supplied within Abdala Silver courses are protected by international copyright laws. Enrolled students are granted a non-exclusive, non-transferable license to use these assets for individual learning and portfolio construction. Redistribution or reselling of raw project assets is strictly prohibited.
              </p>

              <h2 className="text-sm font-bold text-white pt-2">2. Certificates of Mastery</h2>
              <p>
                Certificates awarded upon 100% curriculum completion are cryptographically identifiable and tied to the registered student's verified name. Misrepresentation or fraudulent issuance of credentials results in immediate account revocation.
              </p>

              <h2 className="text-sm font-bold text-white pt-2">3. Payments and Access</h2>
              <p>
                Paid masterclasses provide perpetual access to the course content and all future curriculum updates under the registered account.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-xl font-bold font-display text-white mb-4">Privacy Policy</h1>
              <p>
                Abdala Silver is committed to safeguarding the privacy and personal information of our students and instructors.
              </p>

              <h2 className="text-sm font-bold text-white pt-2">1. Information We Collect</h2>
              <p>
                We collect your name, email address, course progress markers, timestamped lesson notes, and review submissions to deliver and personalize your learning experience.
              </p>

              <h2 className="text-sm font-bold text-white pt-2">2. Data Security & Storage</h2>
              <p>
                We do not sell, rent, or trade your personal information to third parties. All authentication credentials and learning records are securely stored and encrypted.
              </p>
            </>
          )}
        </div>

      </div>
    </div>
  );
};
