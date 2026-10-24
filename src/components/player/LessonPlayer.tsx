import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from '../../context/LanguageContext';
import { Course, Lesson, StudentNote, Certificate } from '../../types';
import { store } from '../../services/store';
import { auth } from '../../services/auth';
import { CertificateModal } from '../common/CertificateModal';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  CheckCircle2, 
  Circle, 
  Download, 
  FileText, 
  ArrowLeft, 
  Maximize, 
  Volume2, 
  VolumeX, 
  Trash2, 
  Plus, 
  Award,
  Sparkles,
  ChevronRight,
  Radio,
  Tv
} from 'lucide-react';

interface LessonPlayerProps {
  course: Course;
  initialLessonId?: string;
  onBackToCourse: () => void;
}

export const LessonPlayer: React.FC<LessonPlayerProps> = ({
  course,
  initialLessonId,
  onBackToCourse
}) => {
  const { t, language } = useTranslation();
  const currentUser = auth.getCurrentUser();
  const videoRef = useRef<HTMLVideoElement>(null);

  // Flatten all lessons in order
  const allLessons = course.modules.flatMap(m => m.lessons);

  // Find initial lesson or default to first
  const [currentLesson, setCurrentLesson] = useState<Lesson>(() => {
    if (initialLessonId) {
      const found = allLessons.find(l => l.id === initialLessonId);
      if (found) return found;
    }
    return allLessons[0] || course.modules[0]?.lessons[0];
  });

  // Player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(() => currentLesson?.durationSeconds || 600);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'notes' | 'resources'>('overview');
  
  // Robust error prevention state
  const [videoHasError, setVideoHasError] = useState(false);
  const [useStudioMode, setUseStudioMode] = useState(false);

  // Progress & Notes
  const [progress, setProgress] = useState(currentUser ? store.getProgress(currentUser.id, course.id) : null);
  const [notes, setNotes] = useState<StudentNote[]>(
    currentUser ? store.getNotes(currentUser.id, course.id, currentLesson?.id) : []
  );
  const [newNoteText, setNewNoteText] = useState('');
  const [showingCertificate, setShowingCertificate] = useState(false);

  // When lesson changes, reset time and error state
  useEffect(() => {
    if (currentUser && currentLesson) {
      setProgress(store.getProgress(currentUser.id, course.id));
      setNotes(store.getNotes(currentUser.id, course.id, currentLesson.id));
      setCurrentTime(0);
      setIsPlaying(false);
      setVideoHasError(false);
      setDuration(currentLesson.durationSeconds || 600);
    }
  }, [currentLesson, currentUser, course.id]);

  // Simulated studio timeline clock when playing in studio mode or if video errors
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying && (videoHasError || useStudioMode)) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          const step = 0.25 * playbackRate;
          const target = duration || currentLesson?.durationSeconds || 600;
          if (prev + step >= target) {
            setIsPlaying(false);
            if (currentUser && currentLesson) {
              const updated = store.markLessonComplete(currentUser.id, course.id, currentLesson.id);
              setProgress(updated);
            }
            return target;
          }
          return prev + step;
        });
      }, 250);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, videoHasError, useStudioMode, playbackRate, duration, currentLesson, currentUser, course.id]);

  const handleTimeUpdate = () => {
    if (videoRef.current && !videoHasError && !useStudioMode) {
      setCurrentTime(videoRef.current.currentTime);
      if (videoRef.current.duration) {
        setDuration(videoRef.current.duration);
      }
    }
  };

  const handlePlayPause = () => {
    if (videoHasError || useStudioMode || !videoRef.current) {
      setIsPlaying(!isPlaying);
      return;
    }

    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch((err) => {
            // Gracefully fall back to studio simulator without logging unhandled error
            console.warn('Switching to interactive studio simulator playback:', err);
            setVideoHasError(true);
            setIsPlaying(true);
          });
      } else {
        setIsPlaying(true);
      }
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackRate(speed);
    if (videoRef.current && !videoHasError && !useStudioMode) {
      videoRef.current.playbackRate = speed;
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current && !videoHasError && !useStudioMode) {
      try {
        videoRef.current.currentTime = time;
      } catch {
        // ignore seek bounds error
      }
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleToggleComplete = () => {
    if (!currentUser || !currentLesson) return;
    const isCompleted = progress?.completedLessonIds.includes(currentLesson.id);
    let updated;
    if (isCompleted) {
      updated = store.unmarkLessonComplete(currentUser.id, course.id, currentLesson.id);
    } else {
      updated = store.markLessonComplete(currentUser.id, course.id, currentLesson.id);
    }
    setProgress(updated);
  };

  const handleNextLesson = () => {
    const currentIndex = allLessons.findIndex(l => l.id === currentLesson.id);
    if (currentIndex < allLessons.length - 1) {
      setCurrentLesson(allLessons[currentIndex + 1]);
      setIsPlaying(false);
    }
  };

  const handlePrevLesson = () => {
    const currentIndex = allLessons.findIndex(l => l.id === currentLesson.id);
    if (currentIndex > 0) {
      setCurrentLesson(allLessons[currentIndex - 1]);
      setIsPlaying(false);
    }
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !newNoteText.trim() || !currentLesson) return;
    const timestampStr = formatTime(currentTime);
    const saved = store.saveNote(
      currentUser.id,
      course.id,
      currentLesson.id,
      newNoteText.trim(),
      timestampStr
    );
    setNotes([saved, ...notes]);
    setNewNoteText('');
  };

  const handleDeleteNote = (noteId: string) => {
    store.deleteNote(noteId);
    setNotes(notes.filter(n => n.id !== noteId));
  };

  const isCurrentLessonComplete = progress?.completedLessonIds.includes(currentLesson?.id || '');
  const currentIndex = allLessons.findIndex(l => l.id === currentLesson?.id);

  // Get certificate if completed
  const earnedCertificate: Certificate | undefined = progress?.certificateId 
    ? store.getCertificateById(progress.certificateId) 
    : undefined;

  const title = language === 'so' && currentLesson?.titleSo ? currentLesson.titleSo : currentLesson?.title;
  const description = language === 'so' && currentLesson?.descriptionSo ? currentLesson.descriptionSo : currentLesson?.description;

  return (
    <div className="bg-[#050811] min-h-screen text-slate-100 flex flex-col">
      
      {/* Top Learning Bar */}
      <div className="bg-[#080d1a] border-b border-slate-800 px-4 py-3 flex items-center justify-between gap-4">
        <button
          onClick={onBackToCourse}
          className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.player.backToCourse}</span>
        </button>

        <div className="hidden md:flex items-center gap-2 text-xs text-slate-300 truncate max-w-xl">
          <span className="font-semibold text-white truncate">{course.title}</span>
          <span className="text-slate-600">/</span>
          <span className="text-blue-400 truncate">{title}</span>
        </div>

        {/* Course Progress Strip */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">{t.player.courseProgress}</span>
            <span className="text-xs font-mono font-bold text-blue-400 tabular-nums">
              {progress?.progressPercent || 0}%
            </span>
          </div>
          <div className="w-24 sm:w-32 h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${progress?.progressPercent || 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* 100% Completion Notification Banner */}
      {progress?.isCompleted && (
        <div className="bg-gradient-to-r from-blue-900/90 via-blue-800/90 to-indigo-900/90 border-b border-blue-500/40 px-4 py-3 flex items-center justify-between text-xs text-white">
          <div className="flex items-center gap-2 font-medium">
            <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
            <span>{t.player.certificateBanner}</span>
          </div>
          <button
            onClick={() => setShowingCertificate(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-slate-950 font-bold hover:bg-blue-50 transition-colors cursor-pointer shrink-0 shadow-lg"
          >
            <Award className="w-4 h-4 text-blue-600" />
            <span>{t.player.viewCertificate}</span>
          </button>
        </div>
      )}

      {/* Main Learning Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        
        {/* Left Column: Video Player Stage & Interactive Tabs (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col border-r border-slate-800/80 overflow-y-auto">
          
          {/* Video Player Container */}
          <div className="relative aspect-video w-full bg-black group overflow-hidden select-none">
            
            {/* Conditional Video / Studio Visualizer */}
            {!videoHasError && !useStudioMode ? (
              <video
                ref={videoRef}
                src={currentLesson?.videoUrl || course.previewVideoUrl}
                onTimeUpdate={handleTimeUpdate}
                onError={(e) => {
                  // Catch error silently without throwing unhandled console errors
                  e.stopPropagation();
                  setVideoHasError(true);
                }}
                onEnded={() => {
                  setIsPlaying(false);
                  if (currentUser && currentLesson) {
                    const updated = store.markLessonComplete(currentUser.id, course.id, currentLesson.id);
                    setProgress(updated);
                  }
                }}
                className="w-full h-full object-contain"
                playsInline
              />
            ) : (
              /* High-Fidelity Studio Interactive Visualizer */
              <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="absolute inset-0 w-full h-full object-cover filter brightness-[0.35] blur-[2px]"
                  referrerPolicy="no-referrer"
                />
                
                {/* Visualizer Grid overlay */}
                <div className="relative z-10 flex flex-col items-center text-center p-6 max-w-lg">
                  <div className="w-16 h-16 rounded-2xl bg-blue-600/30 border border-blue-500/50 flex items-center justify-center mb-4 text-blue-400 shadow-xl shadow-blue-600/20">
                    <Radio className={`w-8 h-8 ${isPlaying ? 'animate-pulse text-blue-300' : 'text-blue-400'}`} />
                  </div>

                  <span className="text-[11px] font-mono font-bold text-cyan-400 bg-cyan-950/70 border border-cyan-800/50 px-2.5 py-0.5 rounded uppercase tracking-wider mb-2">
                    Abdala Silver Studio Stream · 4K Master
                  </span>

                  <h3 className="text-base sm:text-lg font-bold text-white mb-2 line-clamp-1">
                    {title}
                  </h3>

                  <p className="text-xs text-slate-300 line-clamp-2 max-w-sm mb-4">
                    {description}
                  </p>

                  {/* Animated Equalizer Waveform Bars when playing */}
                  <div className="flex items-center gap-1.5 h-8">
                    {[16, 24, 32, 20, 28, 12, 30, 22, 18, 26, 32, 14, 20].map((h, i) => (
                      <div
                        key={i}
                        className={`w-1 bg-gradient-to-t from-blue-600 to-cyan-400 rounded-full transition-all duration-150 ${
                          isPlaying ? 'opacity-100' : 'opacity-30'
                        }`}
                        style={{
                          height: isPlaying ? `${Math.max(6, (h * ((currentTime * 3 + i * 2) % 10)) / 8)}px` : '6px',
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Custom Video Controls Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/95 via-black/60 to-transparent flex flex-col gap-2 z-20">
              
              {/* Progress Seek Bar */}
              <input
                type="range"
                min="0"
                max={duration || currentLesson?.durationSeconds || 600}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1.5 bg-slate-700 accent-blue-500 rounded-lg cursor-pointer"
              />

              <div className="flex items-center justify-between text-xs text-white pt-1">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handlePlayPause}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/25 transition-colors cursor-pointer"
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
                  </button>

                  <button
                    onClick={handlePrevLesson}
                    disabled={currentIndex === 0}
                    className="p-1.5 rounded-lg hover:bg-white/20 transition-colors disabled:opacity-30 cursor-pointer"
                    aria-label="Previous lesson"
                  >
                    <SkipBack className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleNextLesson}
                    disabled={currentIndex === allLessons.length - 1}
                    className="p-1.5 rounded-lg hover:bg-white/20 transition-colors disabled:opacity-30 cursor-pointer"
                    aria-label="Next lesson"
                  >
                    <SkipForward className="w-4 h-4" />
                  </button>

                  <span className="font-mono text-slate-300 tabular-nums text-[11px]">
                    {formatTime(currentTime)} / {currentLesson?.duration || formatTime(duration)}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {/* Stream Mode Switcher */}
                  <button
                    onClick={() => {
                      setUseStudioMode(!useStudioMode);
                      if (videoRef.current) {
                        videoRef.current.pause();
                        setIsPlaying(false);
                      }
                    }}
                    className={`hidden sm:flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold border transition-colors cursor-pointer ${
                      useStudioMode || videoHasError
                        ? 'bg-blue-900/60 border-blue-500 text-blue-300'
                        : 'bg-black/50 border-white/20 text-slate-300 hover:text-white'
                    }`}
                    title="Toggle between HTML5 Video Stream and Studio Interactive Visualizer"
                  >
                    <Tv className="w-3 h-3" />
                    <span>{useStudioMode || videoHasError ? 'Studio Mode' : 'Native Stream'}</span>
                  </button>

                  {/* Playback speed toggle */}
                  <div className="flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded border border-white/10 text-[11px] font-mono">
                    {[0.75, 1, 1.25, 1.5, 2].map(speed => (
                      <button
                        key={speed}
                        onClick={() => handleSpeedChange(speed)}
                        className={`px-1 py-0.5 rounded transition-colors cursor-pointer ${playbackRate === speed ? 'text-blue-400 font-bold bg-blue-950/60' : 'text-slate-400 hover:text-white'}`}
                      >
                        {speed}x
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      if (videoRef.current) {
                        videoRef.current.muted = !isMuted;
                      }
                      setIsMuted(!isMuted);
                    }}
                    className="p-1.5 rounded-lg hover:bg-white/20 transition-colors cursor-pointer"
                    aria-label={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => {
                      if (videoRef.current) {
                        if (document.fullscreenElement) {
                          document.exitFullscreen();
                        } else {
                          videoRef.current.requestFullscreen();
                        }
                      }
                    }}
                    className="p-1.5 rounded-lg hover:bg-white/20 transition-colors cursor-pointer"
                    aria-label="Fullscreen"
                  >
                    <Maximize className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* Lesson Action Header */}
          <div className="p-5 border-b border-slate-800 bg-[#080d1a] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs text-blue-400 font-medium mb-1">
                Lesson {currentIndex + 1} of {allLessons.length}
              </p>
              <h2 className="text-lg font-bold text-white">
                {title}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleComplete}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isCurrentLessonComplete
                    ? 'bg-emerald-950/60 border border-emerald-800/80 text-emerald-400 hover:bg-emerald-900/50'
                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30'
                }`}
              >
                {isCurrentLessonComplete ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>{t.player.completed}</span>
                  </>
                ) : (
                  <>
                    <Circle className="w-4 h-4" />
                    <span>{t.player.markComplete}</span>
                  </>
                )}
              </button>

              <button
                onClick={handleNextLesson}
                disabled={currentIndex === allLessons.length - 1}
                className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-700 text-slate-300 hover:text-white disabled:opacity-30 cursor-pointer"
              >
                <span>{t.player.nextLesson}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Tab Navigation (Overview / Notes / Resources) */}
          <div className="border-b border-slate-800 bg-[#070b16] px-5 flex items-center gap-6 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-3.5 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              {t.player.overviewTab}
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={`py-3.5 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'notes'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <span>{t.player.notesTab}</span>
              <span className="font-mono text-[10px] bg-slate-800 px-1.5 py-0.2 rounded text-slate-300">
                {notes.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('resources')}
              className={`py-3.5 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'resources'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <span>{t.player.resourcesTab}</span>
              <span className="font-mono text-[10px] bg-slate-800 px-1.5 py-0.2 rounded text-slate-300">
                {currentLesson?.resources?.length || 0}
              </span>
            </button>
          </div>

          {/* Tab Content Panes */}
          <div className="p-6 flex-1 bg-[#050811]">
            
            {/* 1. Overview */}
            {activeTab === 'overview' && (
              <div className="max-w-2xl space-y-4">
                <p className="text-sm text-slate-300 leading-relaxed">
                  {description}
                </p>
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 space-y-1">
                  <p className="font-semibold text-white">Instructor Tip by {course.instructorName}:</p>
                  <p>Practice trimming this cut at least 3 times before moving forward. Try watching the timeline without audio first to test the emotional pacing.</p>
                </div>
              </div>
            )}

            {/* 2. Interactive Notes taking */}
            {activeTab === 'notes' && (
              <div className="max-w-2xl space-y-6">
                <form onSubmit={handleAddNote} className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-medium text-white">Capture Lesson Note</span>
                    <span className="font-mono text-blue-400 tabular-nums">At {formatTime(currentTime)}</span>
                  </div>
                  <textarea
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    placeholder={t.player.addNotePlaceholder}
                    rows={3}
                    className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{t.player.saveNote}</span>
                  </button>
                </form>

                <div className="space-y-3 pt-4 border-t border-slate-800/80">
                  {notes.length > 0 ? (
                    notes.map((note) => (
                      <div
                        key={note.id}
                        className="p-3.5 rounded-xl bg-[#080d1a] border border-slate-800 flex items-start justify-between gap-4"
                      >
                        <div>
                          <span className="text-[10px] font-mono font-semibold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                            {note.timestamp}
                          </span>
                          <p className="text-xs text-slate-200 mt-2 leading-relaxed">
                            {note.content}
                          </p>
                          <span className="text-[10px] text-slate-500 mt-1 block">
                            Added {note.createdAt}
                          </span>
                        </div>
                        <button
                          onClick={() => handleDeleteNote(note.id)}
                          className="text-slate-500 hover:text-rose-400 p-1 cursor-pointer"
                          aria-label="Delete note"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-500 text-center py-6">
                      No notes taken for this lesson yet. Jot down hotkeys or ideas above!
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* 3. Downloadable Resources */}
            {activeTab === 'resources' && (
              <div className="max-w-2xl space-y-4">
                {currentLesson?.resources && currentLesson.resources.length > 0 ? (
                  currentLesson.resources.map((res) => (
                    <div
                      key={res.id}
                      className="p-4 rounded-xl bg-[#090f1e] border border-slate-800 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-lg bg-blue-950/60 text-blue-400 border border-blue-800/40">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm font-semibold text-white">
                            {res.title}
                          </p>
                          <p className="text-[11px] text-slate-400 font-mono uppercase">
                            {res.type} {res.fileSize && `· ${res.fileSize}`}
                          </p>
                        </div>
                      </div>

                      <a
                        href={res.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </a>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 py-6 text-center">
                    No downloadable assets required for this theory lesson. Practice files are linked in Lesson 1.
                  </p>
                )}
              </div>
            )}

          </div>

        </div>

        {/* Right Column: Course Curriculum Sidebar (4 Cols) */}
        <div className="lg:col-span-4 bg-[#070b16] flex flex-col h-full border-t lg:border-t-0 border-slate-800">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              {t.player.curriculum}
            </h3>
            <span className="text-xs font-mono text-slate-400 tabular-nums">
              {progress?.completedLessonIds.length || 0} / {allLessons.length} Done
            </span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/80">
            {course.modules.map((mod, modIdx) => (
              <div key={mod.id} className="py-2">
                <div className="px-4 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  <span>
                    Module {modIdx + 1}: {language === 'so' && mod.titleSo ? mod.titleSo : mod.title}
                  </span>
                </div>

                <div className="space-y-0.5">
                  {mod.lessons.map((lesson) => {
                    const isSelected = lesson.id === currentLesson?.id;
                    const isCompleted = progress?.completedLessonIds.includes(lesson.id);

                    return (
                      <button
                        key={lesson.id}
                        onClick={() => {
                          setCurrentLesson(lesson);
                          setIsPlaying(false);
                        }}
                        className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-blue-600/15 border-l-2 border-blue-500 text-white'
                            : 'hover:bg-slate-800/50 text-slate-300'
                        }`}
                      >
                        <div className="pt-0.5 shrink-0">
                          {isCompleted ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-600" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-medium leading-snug line-clamp-2 ${isSelected ? 'text-blue-400 font-semibold' : 'text-slate-200'}`}>
                            {language === 'so' && lesson.titleSo ? lesson.titleSo : lesson.title}
                          </p>
                          <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                            {lesson.duration}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Verifiable Certificate Modal */}
      {showingCertificate && earnedCertificate && (
        <CertificateModal
          certificate={earnedCertificate}
          onClose={() => setShowingCertificate(false)}
        />
      )}

    </div>
  );
};
