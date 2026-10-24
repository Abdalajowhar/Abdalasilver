import React, { useState, useRef } from 'react';
import { useTranslation } from '../../context/LanguageContext';
import { Course, Lesson, User } from '../../types';
import { store } from '../../services/store';
import { auth } from '../../services/auth';
import { 
  Plus, 
  Video, 
  Users, 
  Star, 
  Clock, 
  BookOpen, 
  FileText, 
  CheckCircle2, 
  Trash2,
  Edit,
  ArrowRight,
  Upload,
  Play
} from 'lucide-react';

interface InstructorDashboardProps {
  onSelectCourse: (course: Course) => void;
}

export const InstructorDashboard: React.FC<InstructorDashboardProps> = ({ onSelectCourse }) => {
  const { t, language } = useTranslation();
  const currentUser = auth.getCurrentUser();
  const allCourses = store.getCourses(true);
  
  // Filter courses where current user is instructor or admin
  const instructorCourses = allCourses.filter(c => 
    currentUser?.role === 'admin' ? true : c.instructorId === currentUser?.id || c.instructorName.includes(currentUser?.name || '')
  );

  const [selectedCourse, setSelectedCourse] = useState<Course>(instructorCourses[0] || allCourses[0]);
  const [showAddLessonModal, setShowAddLessonModal] = useState(false);
  const [targetModuleId, setTargetModuleId] = useState(selectedCourse?.modules[0]?.id || '');
  
  // New lesson form fields
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonTitleSo, setLessonTitleSo] = useState('');
  const [lessonDuration, setLessonDuration] = useState('15:00');
  const [lessonVideoUrl, setLessonVideoUrl] = useState('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
  const [lessonDescription, setLessonDescription] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [videoNotice, setVideoNotice] = useState<string | null>(null);

  const lessonVideoInputRef = useRef<HTMLInputElement>(null);

  const handleLessonVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setLessonVideoUrl(url);
      setVideoNotice(`Video "${file.name}" loaded for lesson!`);
      setTimeout(() => setVideoNotice(null), 3000);
    }
  };

  const handleAddLessonSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonTitle.trim() || !targetModuleId) return;

    store.addLesson(selectedCourse.id, targetModuleId, {
      title: lessonTitle.trim(),
      titleSo: lessonTitleSo.trim() || lessonTitle.trim(),
      duration: lessonDuration,
      durationSeconds: 900,
      videoUrl: lessonVideoUrl,
      isPreview,
      description: lessonDescription.trim() || 'Comprehensive practical lesson.',
      resources: [
        {
          id: `res-${Date.now()}`,
          title: 'Lesson Practice Files (.zip)',
          type: 'zip',
          fileSize: '45 MB',
          url: 'https://abdalasilver.com/downloads/practice_files.zip'
        }
      ]
    });

    // Refresh selected course
    const updated = store.getCourseById(selectedCourse.id);
    if (updated) setSelectedCourse(updated);

    setShowAddLessonModal(false);
    setLessonTitle('');
    setLessonTitleSo('');
    setLessonDescription('');
  };

  const reviews = selectedCourse ? store.getReviews(selectedCourse.id) : [];

  return (
    <div className="py-10 bg-[#050811] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold font-display text-white">
                {t.instructorDashboard.title}
              </h1>
              <span className="text-[10px] font-bold text-cyan-400 uppercase bg-cyan-950/60 border border-cyan-800/40 px-2 py-0.5 rounded">
                Verified Instructor Workspace
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Curate masterclass curricula, upload raw project media, and monitor student engagement.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (selectedCourse?.modules[0]) {
                  setTargetModuleId(selectedCourse.modules[0].id);
                  setShowAddLessonModal(true);
                }
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/30 flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{t.instructorDashboard.addLesson}</span>
            </button>
          </div>
        </div>

        {/* Masterclass Selector */}
        <div className="mb-8">
          <label className="block text-xs font-semibold text-slate-400 mb-2">
            Select Course to Manage:
          </label>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {instructorCourses.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCourse(c)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                  selectedCourse.id === c.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {c.title}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Course KPI Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-xl bg-[#080d1a] border border-slate-800">
            <span className="text-xs text-slate-400 block mb-1">Enrolled Creators</span>
            <span className="text-xl font-bold font-mono text-white tabular-nums">
              {selectedCourse.enrollmentCount.toLocaleString()}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#080d1a] border border-slate-800">
            <span className="text-xs text-slate-400 block mb-1">Average Student Rating</span>
            <span className="text-xl font-bold font-mono text-amber-400 tabular-nums">
              ★ {selectedCourse.rating.toFixed(1)}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#080d1a] border border-slate-800">
            <span className="text-xs text-slate-400 block mb-1">Total Lessons</span>
            <span className="text-xl font-bold font-mono text-cyan-400 tabular-nums">
              {selectedCourse.totalLessons}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#080d1a] border border-slate-800">
            <span className="text-xs text-slate-400 block mb-1">Course Format</span>
            <span className="text-sm font-semibold text-emerald-400 block mt-1">
              {selectedCourse.price === 0 ? 'Free Starter' : `$${selectedCourse.price} Premium`}
            </span>
          </div>
        </div>

        {/* Curriculum Management Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white font-display">
                Curriculum Structure ({selectedCourse.modules.length} Modules)
              </h2>
            </div>

            <div className="space-y-4">
              {selectedCourse.modules.map((mod, modIdx) => (
                <div key={mod.id} className="rounded-xl border border-slate-800 bg-[#080d1a] p-5">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800/80">
                    <div>
                      <span className="text-xs font-mono text-blue-400 font-bold">Module 0{modIdx + 1}</span>
                      <h3 className="text-sm font-bold text-white">{mod.title}</h3>
                    </div>
                    <button
                      onClick={() => {
                        setTargetModuleId(mod.id);
                        setShowAddLessonModal(true);
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-400 bg-blue-950/60 border border-blue-800/40 hover:bg-blue-900/40 cursor-pointer flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Lesson</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {mod.lessons.map((lesson, lIdx) => (
                      <div
                        key={lesson.id}
                        className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/60 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-slate-500">{lIdx + 1}.</span>
                          <div>
                            <p className="font-medium text-white">{lesson.title}</p>
                            <p className="text-[11px] text-slate-400">{lesson.duration} · {lesson.videoUrl ? 'Video Connected' : 'No Video'}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {lesson.isPreview && (
                            <span className="text-[10px] text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                              Preview
                            </span>
                          )}
                          <button
                            onClick={() => {
                              store.deleteLesson(selectedCourse.id, mod.id, lesson.id);
                              const updated = store.getCourseById(selectedCourse.id);
                              if (updated) setSelectedCourse(updated);
                            }}
                            className="p-1.5 rounded text-slate-500 hover:text-rose-400 transition-colors"
                            aria-label="Delete lesson"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Recent Student Reviews for this course */}
          <div className="lg:col-span-4 p-5 rounded-2xl bg-[#080d1a] border border-slate-800">
            <h2 className="text-sm font-bold text-white mb-4">
              Student Reviews ({reviews.length})
            </h2>

            <div className="space-y-3">
              {reviews.length > 0 ? (
                reviews.map((rev) => (
                  <div key={rev.id} className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-white">{rev.userName}</span>
                      <span className="text-amber-400 font-bold font-mono">★ {rev.rating}</span>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed italic">
                      "{rev.comment}"
                    </p>
                    <span className="text-[10px] text-slate-500 font-mono mt-1 block">{rev.date}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 py-4 text-center">No reviews submitted yet.</p>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Add Lesson Modal */}
      {showAddLessonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-2xl bg-[#090f1e] border border-slate-700 p-6 shadow-2xl">
            <h2 className="text-base font-bold text-white mb-4">Add New Lesson to Syllabus</h2>
            
            <form onSubmit={handleAddLessonSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Lesson Title (English)</label>
                <input
                  type="text"
                  value={lessonTitle}
                  onChange={(e) => setLessonTitle(e.target.value)}
                  placeholder="e.g. Advanced Color Qualifiers & Power Windows"
                  required
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Lesson Title (Somali - optional)</label>
                <input
                  type="text"
                  value={lessonTitleSo}
                  onChange={(e) => setLessonTitleSo(e.target.value)}
                  placeholder="e.g. Habeynta Midabada Heerka Sare"
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Estimated Duration</label>
                  <input
                    type="text"
                    value={lessonDuration}
                    onChange={(e) => setLessonDuration(e.target.value)}
                    placeholder="15:30"
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Access Mode</label>
                  <label className="flex items-center gap-2 mt-2.5 text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isPreview}
                      onChange={(e) => setIsPreview(e.target.checked)}
                      className="accent-blue-600 rounded"
                    />
                    <span>Allow Free Preview</span>
                  </label>
                </div>
              </div>

              {/* Video upload & URL */}
              <div className="space-y-2 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="text-slate-300 font-semibold text-xs flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Lesson Media Video</span>
                  </label>
                  {videoNotice && (
                    <span className="text-[10px] text-emerald-400 font-medium">{videoNotice}</span>
                  )}
                </div>

                <input
                  type="file"
                  ref={lessonVideoInputRef}
                  accept="video/*"
                  onChange={handleLessonVideoUpload}
                  className="hidden"
                />

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => lessonVideoInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Video File</span>
                  </button>
                  <span className="text-[10px] text-slate-500">or enter MP4 URL below</span>
                </div>

                <div>
                  <input
                    type="text"
                    value={lessonVideoUrl}
                    onChange={(e) => setLessonVideoUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-blue-500 font-mono text-[11px]"
                  />
                </div>

                {lessonVideoUrl && (
                  <div className="mt-2">
                    <video
                      key={lessonVideoUrl}
                      controls
                      src={lessonVideoUrl}
                      className="w-full max-h-36 rounded-lg bg-black border border-slate-800"
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Lesson Objectives / Notes</label>
                <textarea
                  value={lessonDescription}
                  onChange={(e) => setLessonDescription(e.target.value)}
                  rows={3}
                  placeholder="What will the creator practice in this lesson?"
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddLessonModal(false)}
                  className="px-4 py-2 rounded-lg text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-500 cursor-pointer"
                >
                  Save Lesson
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
