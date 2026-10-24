import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../context/LanguageContext';
import { Course, Certificate, User } from '../../types';
import { store } from '../../services/store';
import { auth } from '../../services/auth';
import { CourseCard } from '../common/CourseCard';
import { CertificateModal } from '../common/CertificateModal';
import { 
  Play, 
  Award, 
  BookOpen, 
  Bookmark, 
  Settings, 
  CheckCircle, 
  Clock, 
  User as UserIcon,
  Shield,
  Save
} from 'lucide-react';

interface StudentDashboardProps {
  onSelectCourse: (course: Course) => void;
  onResumeCourse: (course: Course) => void;
  onExploreCourses: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  onSelectCourse,
  onResumeCourse,
  onExploreCourses
}) => {
  const { t, language, setLanguage } = useTranslation();
  const [currentUser, setCurrentUser] = useState<User | null>(auth.getCurrentUser());
  const [activeTab, setActiveTab] = useState<'enrolled' | 'completed' | 'wishlist' | 'certificates' | 'settings'>('enrolled');
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);

  // Profile edit fields
  const [name, setName] = useState(currentUser?.name || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [profileSuccess, setProfileSuccess] = useState(false);

  useEffect(() => {
    const unsub = auth.subscribe(() => {
      const u = auth.getCurrentUser();
      setCurrentUser(u);
      if (u) {
        setName(u.name);
        setBio(u.bio || '');
      }
    });
    return unsub;
  }, []);

  if (!currentUser) {
    return (
      <div className="py-20 text-center text-slate-400">
        <p>Please sign in to access your student dashboard.</p>
      </div>
    );
  }

  const allCourses = store.getCourses();
  const enrolledCourses = allCourses.filter(c => currentUser.enrolledCourseIds.includes(c.id));
  const wishlistCourses = allCourses.filter(c => currentUser.wishlistCourseIds.includes(c.id));
  
  // Calculate completed courses
  const userProgressList = enrolledCourses.map(c => ({
    course: c,
    progress: store.getProgress(currentUser.id, c.id)
  }));
  const completedCourses = userProgressList.filter(item => item.progress.isCompleted).map(item => item.course);
  const certificates = store.getCertificatesByUser(currentUser.id);

  // Resume course: the most recently active enrolled course
  const mostRecentEnrolled = userProgressList.find(item => item.progress.progressPercent > 0 && item.progress.progressPercent < 100)?.course 
    || enrolledCourses[0];
  const mostRecentProgress = mostRecentEnrolled ? store.getProgress(currentUser.id, mostRecentEnrolled.id) : null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    auth.updateProfile({ name, bio });
    setProfileSuccess(true);
    setTimeout(() => setProfileSuccess(false), 2500);
  };

  return (
    <div className="py-10 bg-[#050811] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Welcome Header */}
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#090f20] via-[#080d1a] to-[#0b1226] border border-slate-800/80 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={currentUser.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80'}
              alt={currentUser.name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-blue-500/40"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold font-display text-white">
                  {t.dashboard.welcome}, {currentUser.name}!
                </h1>
                <span className="text-[10px] font-bold text-blue-400 uppercase bg-blue-950/80 border border-blue-800/50 px-2 py-0.5 rounded">
                  {currentUser.role}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-md">
                {currentUser.bio || 'Continuous learning in digital media, cinema cuts & AI production.'}
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-6 text-xs text-slate-400 pt-4 md:pt-0 border-t md:border-t-0 border-slate-800 font-mono tabular-nums">
            <div className="text-center">
              <span className="text-xl font-bold text-white block">{enrolledCourses.length}</span>
              <span className="text-[11px] text-slate-500">Enrolled</span>
            </div>
            <div className="text-center">
              <span className="text-xl font-bold text-emerald-400 block">{completedCourses.length}</span>
              <span className="text-[11px] text-slate-500">Completed</span>
            </div>
            <div className="text-center">
              <span className="text-xl font-bold text-blue-400 block">{certificates.length}</span>
              <span className="text-[11px] text-slate-500">Certificates</span>
            </div>
          </div>
        </div>

        {/* Continue Learning Spotlight Banner (if active) */}
        {mostRecentEnrolled && (
          <div className="mb-10 p-5 rounded-2xl bg-[#090f1e] border border-blue-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-12 rounded-lg bg-black overflow-hidden shrink-0">
                <img
                  src={mostRecentEnrolled.thumbnail}
                  alt={mostRecentEnrolled.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">
                  {t.dashboard.resumeLearning}
                </span>
                <p className="text-sm font-semibold text-white line-clamp-1">
                  {mostRecentEnrolled.title}
                </p>
                <div className="flex items-center gap-3 mt-1.5">
                  <div className="w-32 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${mostRecentProgress?.progressPercent || 0}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    {mostRecentProgress?.progressPercent || 0}% Completed
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onResumeCourse(mostRecentEnrolled)}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Resume Lesson</span>
            </button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-8 overflow-x-auto scrollbar-none text-xs font-semibold">
          <button
            onClick={() => setActiveTab('enrolled')}
            className={`px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'enrolled'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{t.dashboard.enrolledTab} ({enrolledCourses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('completed')}
            className={`px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'completed'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>{t.dashboard.completedTab} ({completedCourses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('wishlist')}
            className={`px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'wishlist'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>{t.dashboard.wishlistTab} ({wishlistCourses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('certificates')}
            className={`px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'certificates'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>{t.dashboard.certificatesTab} ({certificates.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'settings'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>{t.dashboard.settingsTab}</span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'enrolled' && (
          <div>
            {enrolledCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrolledCourses.map((c) => (
                  <CourseCard
                    key={c.id}
                    course={c}
                    onSelect={onSelectCourse}
                    isEnrolled={true}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 p-8 rounded-2xl bg-slate-900/40 border border-slate-800 max-w-md mx-auto">
                <BookOpen className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <h3 className="text-sm font-semibold text-white mb-1">{t.dashboard.noEnrolled}</h3>
                <p className="text-xs text-slate-400 mb-6">Start your creative learning journey with free or premium courses.</p>
                <button
                  onClick={onExploreCourses}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 cursor-pointer"
                >
                  {t.dashboard.exploreCatalog}
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'completed' && (
          <div>
            {completedCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {completedCourses.map((c) => (
                  <CourseCard
                    key={c.id}
                    course={c}
                    onSelect={onSelectCourse}
                    isEnrolled={true}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 p-8 rounded-2xl bg-slate-900/40 border border-slate-800 max-w-md mx-auto">
                <CheckCircle className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <h3 className="text-sm font-semibold text-white mb-1">No completed courses yet</h3>
                <p className="text-xs text-slate-400 mb-4">Complete all lessons in an enrolled course to unlock your certificate here.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'wishlist' && (
          <div>
            {wishlistCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlistCourses.map((c) => (
                  <CourseCard
                    key={c.id}
                    course={c}
                    onSelect={onSelectCourse}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 p-8 rounded-2xl bg-slate-900/40 border border-slate-800 max-w-md mx-auto">
                <Bookmark className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <h3 className="text-sm font-semibold text-white mb-1">Your saved list is empty</h3>
                <p className="text-xs text-slate-400 mb-4">Bookmark masterclasses you want to take later from the catalog.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'certificates' && (
          <div>
            {certificates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {certificates.map((cert) => (
                  <div
                    key={cert.id}
                    className="p-6 rounded-2xl bg-[#080d1a] border border-blue-500/30 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 text-blue-400">
                          <Award className="w-5 h-5" />
                          <span className="text-xs font-bold uppercase tracking-wider">Official Certificate</span>
                        </div>
                        <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                          {cert.credentialId}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-white mb-1">
                        {cert.courseTitle}
                      </h3>

                      <p className="text-xs text-slate-400 mb-4">
                        Issued to <span className="text-white font-medium">{cert.userName}</span> on {cert.issueDate}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                      <span className="text-xs text-slate-500">Instructor: {cert.instructorName}</span>
                      <button
                        onClick={() => setSelectedCertificate(cert)}
                        className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors cursor-pointer"
                      >
                        View & Print Credential
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 p-8 rounded-2xl bg-slate-900/40 border border-slate-800 max-w-md mx-auto">
                <Award className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <h3 className="text-sm font-semibold text-white mb-1">No certificates issued yet</h3>
                <p className="text-xs text-slate-400">Complete 100% of any enrolled masterclass to receive your verified digital certificate.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-xl p-6 rounded-2xl bg-[#080d1a] border border-slate-800">
            <h2 className="text-base font-bold text-white mb-4">Profile & Account Settings</h2>
            
            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Email Address</label>
                <input
                  type="email"
                  value={currentUser.email}
                  disabled
                  className="w-full px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Short Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Language Preference</label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setLanguage('en')}
                    className={`px-4 py-2 rounded-lg font-semibold cursor-pointer ${language === 'en' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-400'}`}
                  >
                    English
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguage('so')}
                    className={`px-4 py-2 rounded-lg font-semibold cursor-pointer ${language === 'so' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-400'}`}
                  >
                    Af-Soomaali
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
              </div>

              {profileSuccess && (
                <p className="text-emerald-400 text-xs font-medium mt-2">
                  Profile updated successfully!
                </p>
              )}
            </form>
          </div>
        )}

      </div>

      {/* Certificate Viewer Modal */}
      {selectedCertificate && (
        <CertificateModal
          certificate={selectedCertificate}
          onClose={() => setSelectedCertificate(null)}
        />
      )}

    </div>
  );
};
