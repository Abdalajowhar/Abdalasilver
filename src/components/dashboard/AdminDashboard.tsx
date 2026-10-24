import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from '../../context/LanguageContext';
import { 
  Course, 
  CourseCategory, 
  CourseLevel, 
  User, 
  DiscountCode, 
  Announcement,
  Certificate,
  CertificateDesign
} from '../../types';
import { store } from '../../services/store';
import { auth } from '../../services/auth';
import { CertificateModal } from '../common/CertificateModal';
import { 
  Plus, 
  Trash2, 
  Edit, 
  Eye, 
  EyeOff, 
  Users, 
  BookOpen, 
  Award, 
  ShieldCheck, 
  Tag, 
  Megaphone,
  Upload,
  Image as ImageIcon,
  Palette,
  FileCheck,
  CheckCircle2,
  Printer,
  Shield,
  QrCode,
  Save,
  RotateCcw,
  DollarSign,
  Video,
  Film,
  Camera,
  Play,
  Sparkles,
  Sliders
} from 'lucide-react';

const PRESET_COVERS = [
  { id: 've', name: 'Video Editing Masterclass', url: '/src/assets/images/course_video_edit_1792842654103.jpg' },
  { id: 'gd', name: 'Graphic Design & Identity', url: '/src/assets/images/course_graphic_design_1792842654199.jpg' },
  { id: 'mg', name: 'Motion Graphics & VFX', url: '/src/assets/images/course_motion_graphics_1792842654865.jpg' },
  { id: 'cc', name: 'Content Creation & YouTube', url: '/src/assets/images/course_content_creation_1792842667723.jpg' },
  { id: 'ai', name: 'AI Creative Suite Masterclass', url: '/src/assets/images/course_ai_learning_1792842667505.jpg' },
  { id: 'studio', name: 'Abdala Silver Main Studio', url: '/src/assets/images/abdala_hero_studio_1792842639594.jpg' },
];

const PRESET_VIDEOS = [
  { name: 'Cinematic Teaser (MP4)', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' },
  { name: 'Creative Studio Showreel', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
  { name: 'Video Editing Walkthrough', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4' },
  { name: 'Visual Effects Breakdown', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4' },
];

export const AdminDashboard: React.FC = () => {
  const { t, language } = useTranslation();
  const currentUser = auth.getCurrentUser();

  const [activeTab, setActiveTab] = useState<'courses' | 'users' | 'certificates' | 'discounts' | 'announcements'>('courses');
  const [courses, setCourses] = useState<Course[]>(store.getCourses(true));
  const [users, setUsers] = useState<User[]>(auth.getAllUsers());
  const [discounts, setDiscounts] = useState<DiscountCode[]>(store.getDiscounts());
  const [announcements, setAnnouncements] = useState<Announcement[]>(store.getAnnouncements());
  const [certificates, setCertificates] = useState<Certificate[]>(store.getAllCertificates());
  
  // Modal for new/edit course
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);

  // Form fields for course
  const [title, setTitle] = useState('');
  const [titleSo, setTitleSo] = useState('');
  const [category, setCategory] = useState<CourseCategory>('video-editing');
  const [level, setLevel] = useState<CourseLevel>('Beginner');
  const [price, setPrice] = useState('49');
  const [isFree, setIsFree] = useState(false);
  const [duration, setDuration] = useState('10h 00m');
  const [instructorName, setInstructorName] = useState('Abdala Silver');
  const [instructorTitle, setInstructorTitle] = useState('Digital Media Director');
  const [thumbnail, setThumbnail] = useState('/src/assets/images/course_video_edit_1792842654103.jpg');
  const [previewVideoUrl, setPreviewVideoUrl] = useState('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
  const [description, setDescription] = useState('');
  const [descriptionSo, setDescriptionSo] = useState('');

  // Course Media Upload State & Notifications
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);
  const [quickImageTargetCourseId, setQuickImageTargetCourseId] = useState<string | null>(null);
  const [quickFeeTargetCourseId, setQuickFeeTargetCourseId] = useState<string | null>(null);

  // Input refs
  const courseImgInputRef = useRef<HTMLInputElement>(null);
  const courseVideoInputRef = useRef<HTMLInputElement>(null);
  const quickImgInputRef = useRef<HTMLInputElement>(null);

  // Discount form fields
  const [newDiscountCode, setNewDiscountCode] = useState('');
  const [newDiscountPercent, setNewDiscountPercent] = useState('25');

  // Announcement form fields
  const [newAnnTitle, setNewAnnTitle] = useState('');
  const [newAnnMessage, setNewAnnMessage] = useState('');

  // Certificate Studio state
  const [certificateDesign, setCertificateDesign] = useState<CertificateDesign>(store.getCertificateDesign());
  const [designSavedNotice, setDesignSavedNotice] = useState(false);
  const [previewModalCert, setPreviewModalCert] = useState<Certificate | null>(null);

  // Manual Certificate Generator state
  const [issueUserId, setIssueUserId] = useState<string>('');
  const [issueCourseId, setIssueCourseId] = useState<string>('');
  const [issueCustomName, setIssueCustomName] = useState('');
  const [issueSuccessNotice, setIssueSuccessNotice] = useState('');

  // Background upload ref
  const bgFileInputRef = useRef<HTMLInputElement>(null);
  const sigFileInputRef = useRef<HTMLInputElement>(null);

  // Platform stats
  const stats = store.getPlatformStats();

  const refreshData = () => {
    setCourses(store.getCourses(true));
    setUsers(auth.getAllUsers());
    setDiscounts(store.getDiscounts());
    setAnnouncements(store.getAnnouncements());
    setCertificates(store.getAllCertificates());
    setCertificateDesign(store.getCertificateDesign());
  };

  useEffect(() => {
    if (users.length > 0 && !issueUserId) setIssueUserId(users[0].id);
    if (courses.length > 0 && !issueCourseId) setIssueCourseId(courses[0].id);
  }, [users, courses, issueUserId, issueCourseId]);

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="py-24 text-center text-slate-400">
        <ShieldCheck className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-white mb-2">Access Restricted</h2>
        <p className="text-xs">Only authorized administrators may enter the Admin Command Center.</p>
      </div>
    );
  }

  const handleOpenNewCourse = () => {
    setEditingCourseId(null);
    setTitle('');
    setTitleSo('');
    setCategory('video-editing');
    setLevel('Beginner');
    setPrice('0');
    setIsFree(true);
    setDuration('8h 30m');
    setInstructorName('Abdala Silver');
    setInstructorTitle('Creative Director');
    setThumbnail('/src/assets/images/course_video_edit_1792842654103.jpg');
    setPreviewVideoUrl('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
    setDescription('');
    setDescriptionSo('');
    setUploadNotice(null);
    setShowCourseModal(true);
  };

  const handleOpenEditCourse = (c: Course) => {
    setEditingCourseId(c.id);
    setTitle(c.title);
    setTitleSo(c.titleSo);
    setCategory(c.category);
    setLevel(c.level);
    setPrice(c.price.toString());
    setIsFree(c.price === 0);
    setDuration(c.duration);
    setInstructorName(c.instructorName);
    setInstructorTitle(c.instructorTitle);
    setThumbnail(c.thumbnail);
    setPreviewVideoUrl(c.previewVideoUrl);
    setDescription(c.description);
    setDescriptionSo(c.descriptionSo);
    setUploadNotice(null);
    setShowCourseModal(true);
  };

  // Direct Course Image Upload Handler
  const handleCourseImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        setThumbnail(base64);
        setUploadNotice('Cover artwork loaded successfully!');
        setTimeout(() => setUploadNotice(null), 3000);
      };
      reader.readAsDataURL(file);
    }
  };

  // Direct Course Video Upload Handler
  const handleCourseVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create local object URL for instant, smooth playback
      const videoBlobUrl = URL.createObjectURL(file);
      setPreviewVideoUrl(videoBlobUrl);
      setUploadNotice(`Video file "${file.name}" attached successfully! Ready for live preview.`);
      setTimeout(() => setUploadNotice(null), 4000);
    }
  };

  // Quick Cover Image Changer on Course List Row
  const handleQuickImageSelect = (courseId: string) => {
    setQuickImageTargetCourseId(courseId);
    quickImgInputRef.current?.click();
  };

  const handleQuickImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && quickImageTargetCourseId) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        store.updateCourse(quickImageTargetCourseId, { thumbnail: base64 });
        refreshData();
        setUploadNotice('Course cover artwork updated instantly!');
        setTimeout(() => setUploadNotice(null), 3000);
      };
      reader.readAsDataURL(file);
    }
    setQuickImageTargetCourseId(null);
  };

  // Quick Fee Changer on Course List Row
  const handleQuickFeeUpdate = (courseId: string, newPrice: number) => {
    store.updateCourse(courseId, { price: newPrice });
    refreshData();
    setQuickFeeTargetCourseId(null);
  };

  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const finalPrice = isFree ? 0 : (parseFloat(price) || 0);

    if (editingCourseId) {
      store.updateCourse(editingCourseId, {
        title,
        titleSo: titleSo || title,
        category,
        level,
        price: finalPrice,
        duration,
        instructorName,
        instructorTitle,
        thumbnail,
        previewVideoUrl,
        description,
        descriptionSo: descriptionSo || description,
      });
    } else {
      store.createCourse({
        title,
        titleSo: titleSo || title,
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 50),
        tagline: 'Practical creative masterclass taught by industry leaders.',
        taglineSo: 'Koorso hal-abuur oo casri ah oo ay bixinayaan khubaro caalami ah.',
        description,
        descriptionSo: descriptionSo || description,
        category,
        level,
        instructorId: currentUser.id,
        instructorName,
        instructorTitle,
        instructorAvatar: currentUser.avatar,
        thumbnail,
        previewVideoUrl,
        duration,
        totalLessons: 4,
        price: finalPrice,
        currency: 'USD',
        isPublished: true,
        isFeatured: false,
        language: 'Bilingual',
        prerequisites: ['Computer or smartphone', 'Creative curiosity'],
        whatYouWillLearn: ['Mastering core tools and software workflows', 'Building real portfolio assets'],
        modules: [
          {
            id: `mod-${Date.now()}`,
            title: 'Module 1: Foundations & Setup',
            titleSo: 'Qeybta 1: Aasaaska & Diyaarinta',
            order: 1,
            lessons: [
              {
                id: `les-${Date.now()}-1`,
                title: 'Introduction & Project Overview',
                titleSo: 'Hordhac & Dulmar',
                duration: '10:00',
                durationSeconds: 600,
                videoUrl: previewVideoUrl,
                isPreview: true,
                description: 'Overview of the masterclass goals and assets.',
                order: 1
              }
            ]
          }
        ]
      });
    }

    refreshData();
    setShowCourseModal(false);
  };

  const handleDeleteCourse = (courseId: string) => {
    if (confirm('Are you sure you want to delete this course from the academy?')) {
      store.deleteCourse(courseId);
      refreshData();
    }
  };

  const handleTogglePublish = (courseId: string) => {
    store.togglePublish(courseId);
    refreshData();
  };

  const handleAddDiscount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDiscountCode.trim()) return;
    store.addDiscount(newDiscountCode, parseInt(newDiscountPercent) || 20);
    setNewDiscountCode('');
    refreshData();
  };

  const handleAddAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnTitle.trim() || !newAnnMessage.trim()) return;
    store.addAnnouncement({
      title: newAnnTitle.trim(),
      message: newAnnMessage.trim(),
      type: 'info',
      active: true,
    });
    setNewAnnTitle('');
    setNewAnnMessage('');
    refreshData();
  };

  // Upload Custom Certificate Background
  const handleBackgroundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        setCertificateDesign(prev => ({
          ...prev,
          backgroundImageUrl: base64,
          templateType: 'custom_upload'
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload Signatory Signature
  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        setCertificateDesign(prev => ({
          ...prev,
          signatorySignatureUrl: base64,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Save Certificate Design Template
  const handleSaveCertificateDesign = (e: React.FormEvent) => {
    e.preventDefault();
    store.updateCertificateDesign(certificateDesign);
    setDesignSavedNotice(true);
    setTimeout(() => setDesignSavedNotice(false), 3000);
    refreshData();
  };

  // Manual Certificate Issuance
  const handleIssueCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueUserId || !issueCourseId) return;

    const issued = store.adminIssueCertificate(issueUserId, issueCourseId, issueCustomName.trim() || undefined);
    if (issued) {
      const targetUser = users.find(u => u.id === issueUserId);
      const targetCourse = courses.find(c => c.id === issueCourseId);
      setIssueSuccessNotice(`Certificate ${issued.credentialId} successfully issued to ${issued.userName} for ${targetCourse?.title}!`);
      setTimeout(() => setIssueSuccessNotice(''), 4500);
      refreshData();
    }
  };

  // Mock certificate for live design preview
  const previewSampleCert: Certificate = {
    id: 'cert-preview-live',
    credentialId: 'AS-2026-PREVIEW-DEMO',
    userId: 'user-preview',
    userName: 'Fatima Warsame',
    courseId: courses[0]?.id || 'course-1',
    courseTitle: courses[0]?.title || 'DaVinci Resolve & Premiere Pro Cinematic Masterclass',
    instructorName: certificateDesign.signatoryName || 'Abdala Silver',
    issueDate: new Date().toISOString().split('T')[0],
    verificationUrl: 'https://abdalasilver.com/verify/AS-2026-PREVIEW-DEMO',
    design: certificateDesign
  };

  return (
    <div className="py-10 bg-[#050811] min-h-screen text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-800">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold font-display text-white">
                {t.admin.title}
              </h1>
              <span className="text-[10px] font-bold text-indigo-400 uppercase bg-indigo-950/70 border border-indigo-800/50 px-2.5 py-0.5 rounded">
                Super Admin
              </span>
            </div>
            
            {/* Logged in Admin Identity Confirmation */}
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="text-xs text-slate-400">Admin Account:</span>
              <span className="text-xs font-semibold text-white bg-slate-900 px-2.5 py-1 rounded-md border border-slate-700 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                <span className="font-mono text-cyan-300">{currentUser.email}</span>
                <span className="text-slate-400">({currentUser.name})</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/70 border border-emerald-800/40 px-2 py-0.5 rounded">
                Full Masterclass & Revenue Authority
              </span>
            </div>
          </div>

          <button
            onClick={handleOpenNewCourse}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/30 flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>{t.admin.addCourse}</span>
          </button>
        </div>

        {/* Global Toast / Action Notification */}
        {uploadNotice && (
          <div className="mb-6 p-3.5 rounded-xl bg-blue-950/80 border border-blue-500/50 text-blue-200 text-xs flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>{uploadNotice}</span>
            </div>
            <button
              onClick={() => setUploadNotice(null)}
              className="text-xs text-slate-400 hover:text-white cursor-pointer px-2"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Hidden File Input for 1-Click Row Image Updates */}
        <input
          type="file"
          ref={quickImgInputRef}
          accept="image/*"
          onChange={handleQuickImageFileChange}
          className="hidden"
        />

        {/* Global Platform Analytics Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-xl bg-[#080d1a] border border-slate-800">
            <span className="text-xs text-slate-400 block mb-1">Active Masterclasses</span>
            <span className="text-2xl font-bold font-mono text-white tabular-nums">
              {stats.totalCourses}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#080d1a] border border-slate-800">
            <span className="text-xs text-slate-400 block mb-1">Enrolled Learners</span>
            <span className="text-2xl font-bold font-mono text-blue-400 tabular-nums">
              {stats.totalEnrollments.toLocaleString()}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#080d1a] border border-slate-800">
            <span className="text-xs text-slate-400 block mb-1">Certificates Granted</span>
            <span className="text-2xl font-bold font-mono text-cyan-400 tabular-nums">
              {certificates.length + 184}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#080d1a] border border-slate-800">
            <span className="text-xs text-slate-400 block mb-1">Registered Accounts</span>
            <span className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
              {users.length}
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-8 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('courses')}
            className={`px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'courses' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>{t.admin.coursesTab} ({courses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'users' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>{t.admin.usersTab} ({users.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('certificates')}
            className={`px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'certificates' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Certificate Studio & Generator ({certificates.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('discounts')}
            className={`px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'discounts' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>{t.admin.discountsTab} ({discounts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('announcements')}
            className={`px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'announcements' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Megaphone className="w-4 h-4" />
            <span>{t.admin.announcementsTab} ({announcements.length})</span>
          </button>
        </div>

        {/* Tab 1: Courses Management */}
        {activeTab === 'courses' && (
          <div className="rounded-xl border border-slate-800 bg-[#080d1a] overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-bold text-white">{t.admin.courseListTitle}</h2>
                <p className="text-[11px] text-slate-400">
                  Manage pricing fees, upload videos & promotional artwork, or unpublish courses.
                </p>
              </div>
              <span className="text-xs text-slate-400 font-mono">{courses.length} total</span>
            </div>

            <div className="divide-y divide-slate-800/80">
              {courses.map((course) => (
                <div key={course.id} className="p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-slate-900/50 transition-colors">
                  
                  {/* Left: Interactive Cover Image & Title Details */}
                  <div className="flex items-start sm:items-center gap-3">
                    {/* Thumbnail with 1-click change cover trigger */}
                    <div className="relative group shrink-0">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-18 h-12 rounded-lg object-cover bg-black border border-slate-700"
                        referrerPolicy="no-referrer"
                      />
                      <button
                        type="button"
                        onClick={() => handleQuickImageSelect(course.id)}
                        className="absolute inset-0 bg-black/70 rounded-lg flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-[10px] text-white font-medium gap-0.5"
                        title="Upload/Change Cover Image"
                      >
                        <Camera className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Change</span>
                      </button>
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-xs sm:text-sm font-bold text-white line-clamp-1">{course.title}</h3>
                        {course.isPublished ? (
                          <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-800/40">
                            Live
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold text-amber-400 bg-amber-950/60 px-1.5 py-0.2 rounded border border-amber-800/40">
                            Draft
                          </span>
                        )}
                        {course.previewVideoUrl ? (
                          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/50 px-1.5 py-0.2 rounded border border-cyan-800/40 flex items-center gap-1">
                            <Film className="w-2.5 h-2.5" />
                            <span>Video OK</span>
                          </span>
                        ) : null}
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400 mt-1">
                        <span>{course.category}</span>
                        <span>·</span>
                        <span>{course.level}</span>
                        <span>·</span>
                        <span>{course.instructorName}</span>
                      </div>
                    </div>
                  </div>

                  {/* Middle / Right: Instant Fee Adjuster & Action Buttons */}
                  <div className="flex flex-wrap items-center gap-3">
                    
                    {/* Quick Fee Management Badge */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setQuickFeeTargetCourseId(quickFeeTargetCourseId === course.id ? null : course.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono flex items-center gap-1.5 cursor-pointer border transition-colors ${
                          course.price === 0 
                            ? 'bg-emerald-950/70 border-emerald-700/60 text-emerald-300 hover:bg-emerald-900/60'
                            : 'bg-blue-950/70 border-blue-700/60 text-blue-300 hover:bg-blue-900/60'
                        }`}
                        title="Click to adjust course fee"
                      >
                        <DollarSign className="w-3.5 h-3.5" />
                        <span>{course.price === 0 ? 'FREE' : `$${course.price}`}</span>
                        <Sliders className="w-3 h-3 text-slate-400 ml-0.5" />
                      </button>

                      {/* Quick Fee Dropdown Popover */}
                      {quickFeeTargetCourseId === course.id && (
                        <div className="absolute top-full right-0 mt-2 w-48 rounded-xl bg-slate-900 border border-slate-700 p-2 shadow-2xl z-30 space-y-1">
                          <p className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1">Set Course Fee</p>
                          <div className="grid grid-cols-2 gap-1">
                            {[0, 19, 29, 39, 49, 79, 99].map((feeAmount) => (
                              <button
                                key={feeAmount}
                                type="button"
                                onClick={() => handleQuickFeeUpdate(course.id, feeAmount)}
                                className={`px-2 py-1.5 rounded text-xs font-mono font-semibold transition-colors cursor-pointer text-left ${
                                  course.price === feeAmount 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                                }`}
                              >
                                {feeAmount === 0 ? 'Free' : `$${feeAmount}`}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Quick Image Upload Trigger */}
                    <button
                      type="button"
                      onClick={() => handleQuickImageSelect(course.id)}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-cyan-300 hover:bg-slate-700 text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                      title="Upload new image for this course"
                    >
                      <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="hidden sm:inline">Change Image</span>
                    </button>

                    {/* Publish/Unpublish */}
                    <button
                      onClick={() => handleTogglePublish(course.id)}
                      className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
                        course.isPublished ? 'bg-slate-800 text-slate-300 hover:text-white' : 'bg-emerald-950 text-emerald-400 hover:bg-emerald-900'
                      }`}
                      title={course.isPublished ? 'Unpublish' : 'Publish'}
                    >
                      {course.isPublished ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>

                    {/* Full Edit Modal */}
                    <button
                      onClick={() => handleOpenEditCourse(course)}
                      className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                      title="Full Course Editor (Fee, Video, Thumbnail, Modules)"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDeleteCourse(course.id)}
                      className="p-2 rounded-lg bg-rose-950/40 border border-rose-900/50 text-rose-400 hover:bg-rose-900/40 cursor-pointer"
                      title="Delete Course"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Users Accounts */}
        {activeTab === 'users' && (
          <div className="rounded-xl border border-slate-800 bg-[#080d1a] overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h2 className="text-sm font-bold text-white">Registered Users & Roles</h2>
              <span className="text-xs text-slate-400 font-mono">{users.length} registered</span>
            </div>

            <div className="divide-y divide-slate-800/80">
              {users.map((user) => (
                <div key={user.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={user.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&q=80'}
                      alt={user.name}
                      className="w-9 h-9 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-xs font-semibold text-white">{user.name}</p>
                      <p className="text-[11px] text-slate-400">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-slate-400">Enrolled: {user.enrolledCourseIds.length}</span>
                    <select
                      value={user.role}
                      onChange={(e) => {
                        auth.updateUserRole(user.id, e.target.value as any);
                        refreshData();
                      }}
                      className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none"
                    >
                      <option value="student">Student</option>
                      <option value="instructor">Instructor</option>
                      <option value="admin">Admin</option>
                    </select>

                    {user.id !== currentUser.id && (
                      <button
                        onClick={() => {
                          if (confirm(`Delete user ${user.name}?`)) {
                            auth.deleteUser(user.id);
                            refreshData();
                          }
                        }}
                        className="p-1.5 rounded text-slate-500 hover:text-rose-400 cursor-pointer"
                        title="Delete user"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: CERTIFICATES & DESIGN STUDIO */}
        {activeTab === 'certificates' && (
          <div className="space-y-8">
            
            {/* Header info */}
            <div className="p-6 rounded-2xl bg-[#080d1a] border border-blue-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Award className="w-5 h-5 text-blue-400" />
                  <h2 className="text-base font-bold text-white">Academy Certificate Design Studio</h2>
                </div>
                <p className="text-xs text-slate-300">
                  Upload your custom certificate background graphic, signatory signature, change color accents, or issue verifiable credentials directly to students.
                </p>
              </div>

              <button
                onClick={() => setPreviewModalCert(previewSampleCert)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-md flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Eye className="w-4 h-4" />
                <span>Test Live Modal & Print</span>
              </button>
            </div>

            {/* Design Studio 2-Column Split */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Design Customizer & Uploads (7 Cols) */}
              <div className="lg:col-span-7 space-y-6">
                <form onSubmit={handleSaveCertificateDesign} className="p-6 rounded-2xl bg-[#080d1a] border border-slate-800 space-y-5 text-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h3 className="font-bold text-white text-sm flex items-center gap-2">
                      <Palette className="w-4 h-4 text-blue-400" />
                      <span>Certificate Visual Customizer</span>
                    </h3>

                    {designSavedNotice && (
                      <span className="text-emerald-400 font-semibold flex items-center gap-1 text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Saved for all students!</span>
                      </span>
                    )}
                  </div>

                  {/* 1. Upload Custom Background Design */}
                  <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="font-semibold text-white block">
                          Upload Custom Certificate Background Design
                        </label>
                        <p className="text-[11px] text-slate-400">
                          Upload your high-res design layout (PNG / JPG / SVG). It will be rendered behind certificate text.
                        </p>
                      </div>

                      <input
                        type="file"
                        ref={bgFileInputRef}
                        accept="image/*"
                        onChange={handleBackgroundUpload}
                        className="hidden"
                      />

                      <button
                        type="button"
                        onClick={() => bgFileInputRef.current?.click()}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 flex items-center gap-1.5 cursor-pointer shrink-0"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload File</span>
                      </button>
                    </div>

                    {/* Preview of uploaded image if present */}
                    {certificateDesign.backgroundImageUrl ? (
                      <div className="flex items-center justify-between p-2 rounded-lg bg-black/60 border border-slate-700">
                        <div className="flex items-center gap-3">
                          <img
                            src={certificateDesign.backgroundImageUrl}
                            alt="Uploaded background preview"
                            className="w-16 h-10 object-cover rounded border border-slate-700"
                          />
                          <span className="text-xs text-emerald-400 font-medium">Custom background active</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setCertificateDesign(prev => ({ ...prev, backgroundImageUrl: '', templateType: 'electric_blue' }))}
                          className="text-xs text-rose-400 hover:underline cursor-pointer"
                        >
                          Remove Image
                        </button>
                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-500 italic">
                        No custom background uploaded yet. Using default Academy vector styling.
                      </p>
                    )}
                  </div>

                  {/* 2. Template Style Presets */}
                  <div>
                    <label className="font-semibold text-slate-300 block mb-2">Template Style Preset</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: 'electric_blue', label: 'Electric Blue', color: '#3b82f6' },
                        { id: 'platinum_silver', label: 'Platinum Silver', color: '#94a3b8' },
                        { id: 'royal_gold', label: 'Royal Gold', color: '#f59e0b' },
                        { id: 'minimal_dark', label: 'Minimal Dark', color: '#ffffff' },
                      ].map((tmpl) => (
                        <button
                          key={tmpl.id}
                          type="button"
                          onClick={() => setCertificateDesign(prev => ({
                            ...prev,
                            templateType: tmpl.id as any,
                            accentColor: tmpl.color,
                            borderColor: tmpl.color,
                          }))}
                          className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                            certificateDesign.templateType === tmpl.id
                              ? 'border-blue-500 bg-blue-950/40 text-white font-bold'
                              : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                          }`}
                        >
                          <div className="w-4 h-4 rounded-full mx-auto mb-1" style={{ backgroundColor: tmpl.color }} />
                          <span className="text-[11px]">{tmpl.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 3. Accent & Border Colors */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-400 font-medium mb-1">Accent & Highlight Color</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={certificateDesign.accentColor}
                          onChange={(e) => setCertificateDesign(prev => ({ ...prev, accentColor: e.target.value }))}
                          className="w-8 h-8 rounded border-0 bg-transparent cursor-pointer"
                        />
                        <input
                          type="text"
                          value={certificateDesign.accentColor}
                          onChange={(e) => setCertificateDesign(prev => ({ ...prev, accentColor: e.target.value }))}
                          className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 font-mono text-white text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-400 font-medium mb-1">Border Line Color</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={certificateDesign.borderColor}
                          onChange={(e) => setCertificateDesign(prev => ({ ...prev, borderColor: e.target.value }))}
                          className="w-8 h-8 rounded border-0 bg-transparent cursor-pointer"
                        />
                        <input
                          type="text"
                          value={certificateDesign.borderColor}
                          onChange={(e) => setCertificateDesign(prev => ({ ...prev, borderColor: e.target.value }))}
                          className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 font-mono text-white text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 4. Text Content Customization */}
                  <div>
                    <label className="block text-slate-400 font-medium mb-1">Certificate Header Title</label>
                    <input
                      type="text"
                      value={certificateDesign.headerTitle}
                      onChange={(e) => setCertificateDesign(prev => ({ ...prev, headerTitle: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 font-medium mb-1">Signatory Name</label>
                      <input
                        type="text"
                        value={certificateDesign.signatoryName}
                        onChange={(e) => setCertificateDesign(prev => ({ ...prev, signatoryName: e.target.value }))}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-medium mb-1">Signatory Title</label>
                      <input
                        type="text"
                        value={certificateDesign.signatoryTitle}
                        onChange={(e) => setCertificateDesign(prev => ({ ...prev, signatoryTitle: e.target.value }))}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* 5. Upload Signatory Signature */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <div>
                      <span className="font-semibold text-white block">Signatory Signature Image</span>
                      <span className="text-[11px] text-slate-400">Upload signature graphic (PNG transparent recommended)</span>
                    </div>

                    <input
                      type="file"
                      ref={sigFileInputRef}
                      accept="image/*"
                      onChange={handleSignatureUpload}
                      className="hidden"
                    />

                    <div className="flex items-center gap-2">
                      {certificateDesign.signatorySignatureUrl && (
                        <button
                          type="button"
                          onClick={() => setCertificateDesign(prev => ({ ...prev, signatorySignatureUrl: '' }))}
                          className="text-[11px] text-rose-400 hover:underline mr-1"
                        >
                          Clear
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => sigFileInputRef.current?.click()}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 flex items-center gap-1.5 cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>{certificateDesign.signatorySignatureUrl ? 'Change' : 'Upload'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={certificateDesign.showQrCode}
                        onChange={(e) => setCertificateDesign(prev => ({ ...prev, showQrCode: e.target.checked }))}
                        className="accent-blue-600 rounded"
                      />
                      <span>Show Verifiable QR Code & Seal</span>
                    </label>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl font-semibold text-xs text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/30 flex items-center gap-2 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Certificate Design for Academy</span>
                    </button>
                  </div>
                </form>

                {/* Manual Certificate Generator for Students */}
                <form onSubmit={handleIssueCertificate} className="p-6 rounded-2xl bg-[#080d1a] border border-slate-800 space-y-4 text-xs">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                    <Award className="w-4 h-4 text-emerald-400" />
                    <h3 className="font-bold text-white text-sm">Issue / Grant Certificate to Student</h3>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Manually grant a verified certificate to any registered student. This will mark their course progress at 100% and generate their credential ID.
                  </p>

                  {issueSuccessNotice && (
                    <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>{issueSuccessNotice}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 font-medium mb-1">Select Student</label>
                      <select
                        value={issueUserId}
                        onChange={(e) => {
                          setIssueUserId(e.target.value);
                          const u = users.find(user => user.id === e.target.value);
                          if (u) setIssueCustomName(u.name);
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none"
                      >
                        {users.map(u => (
                          <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-400 font-medium mb-1">Select Masterclass</label>
                      <select
                        value={issueCourseId}
                        onChange={(e) => setIssueCourseId(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none"
                      >
                        {courses.map(c => (
                          <option key={c.id} value={c.id}>{c.title}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 font-medium mb-1">Custom Student Name on Certificate (optional)</label>
                    <input
                      type="text"
                      value={issueCustomName}
                      onChange={(e) => setIssueCustomName(e.target.value)}
                      placeholder="Leave blank to use registered name"
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl font-semibold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-600/20 flex items-center gap-2 cursor-pointer"
                  >
                    <FileCheck className="w-4 h-4" />
                    <span>Generate & Issue Official Certificate</span>
                  </button>
                </form>

              </div>

              {/* Right Column: Live In-Dashboard Preview (5 Cols) */}
              <div className="lg:col-span-5 sticky top-24 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-blue-400" />
                    <span>Live Design Preview</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Real-time render</span>
                </div>

                {/* Scaled Certificate Card Preview */}
                <div 
                  style={{ borderColor: certificateDesign.borderColor }}
                  className="relative rounded-xl border-2 p-5 text-center overflow-hidden shadow-2xl bg-gradient-to-br from-[#0c1429] via-[#080d1d] to-[#040711]"
                >
                  {/* Uploaded Background Preview */}
                  {certificateDesign.backgroundImageUrl && (
                    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                      <img
                        src={certificateDesign.backgroundImageUrl}
                        alt="Uploaded preview"
                        className="w-full h-full object-cover opacity-20"
                      />
                    </div>
                  )}

                  <div className="relative z-10">
                    <div className="flex items-center justify-center gap-1.5 mb-1">
                      <div 
                        className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold text-white"
                        style={{ backgroundColor: certificateDesign.accentColor }}
                      >
                        AS
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider text-white">
                        Abdala <span style={{ color: certificateDesign.accentColor }}>Silver</span> Academy
                      </span>
                    </div>

                    <p 
                      className="text-[9px] uppercase tracking-widest font-bold mb-3"
                      style={{ color: certificateDesign.accentColor }}
                    >
                      {certificateDesign.headerTitle}
                    </p>

                    <p className="text-[9px] text-slate-400">Awarded to:</p>
                    <p className="text-sm font-bold text-white underline underline-offset-4 decoration-blue-500/50 mb-2 font-display">
                      {issueCustomName || 'Fatima Warsame'}
                    </p>

                    <p className="text-[9px] text-slate-400 mb-1">For successfully mastering:</p>
                    <p 
                      className="text-xs font-bold mb-4 line-clamp-1"
                      style={{ color: certificateDesign.accentColor }}
                    >
                      {courses.find(c => c.id === issueCourseId)?.title || 'DaVinci Resolve & Premiere Pro Masterclass'}
                    </p>

                    <div className="pt-3 border-t border-slate-800 flex items-end justify-between text-[8px] text-slate-400">
                      <div className="text-left">
                        <p className="font-semibold text-white">{certificateDesign.signatoryName}</p>
                        <p className="text-slate-500">{certificateDesign.signatoryTitle}</p>
                      </div>

                      <div className="flex flex-col items-center">
                        <div 
                          className="w-7 h-7 rounded-full border flex items-center justify-center text-blue-400"
                          style={{ borderColor: certificateDesign.accentColor }}
                        >
                          <Shield className="w-3.5 h-3.5" style={{ color: certificateDesign.accentColor }} />
                        </div>
                        <span className="text-[6px] font-bold mt-0.5">SEAL</span>
                      </div>

                      <div className="text-right">
                        <p className="font-mono text-white">AS-2026-LIVE</p>
                        <p className="text-slate-500">Verified</p>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 text-center leading-relaxed">
                  Students will receive this design upon completing 100% of their lessons, with high-resolution PDF download and printable layout.
                </p>
              </div>

            </div>

            {/* Table of all Issued Certificates */}
            <div className="rounded-xl border border-slate-800 bg-[#080d1a] overflow-hidden">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">All Issued Certificates ({certificates.length})</h3>
                  <p className="text-xs text-slate-400">Verified student credentials currently registered on the blockchain/database.</p>
                </div>
              </div>

              <div className="divide-y divide-slate-800/80">
                {certificates.map((cert) => (
                  <div key={cert.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-900/50 transition-colors text-xs">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                          {cert.credentialId}
                        </span>
                        <span className="font-semibold text-white">{cert.userName}</span>
                      </div>
                      <p className="text-slate-300 font-medium">{cert.courseTitle}</p>
                      <span className="text-[11px] text-slate-500 font-mono">Issued {cert.issueDate} · Instructor: {cert.instructorName}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPreviewModalCert(cert)}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View / Print</span>
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Revoke certificate ${cert.credentialId}?`)) {
                            store.deleteCertificate(cert.id);
                            refreshData();
                          }
                        }}
                        className="p-1.5 rounded text-slate-500 hover:text-rose-400 cursor-pointer"
                        title="Revoke certificate"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Tab 4: Discounts */}
        {activeTab === 'discounts' && (
          <div className="space-y-6">
            <form onSubmit={handleAddDiscount} className="p-5 rounded-xl bg-[#080d1a] border border-slate-800 flex flex-wrap items-end gap-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Coupon Code</label>
                <input
                  type="text"
                  value={newDiscountCode}
                  onChange={(e) => setNewDiscountCode(e.target.value)}
                  placeholder="e.g. MOGADISHU40"
                  required
                  className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white uppercase focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Discount Percent (%)</label>
                <input
                  type="number"
                  min="5"
                  max="100"
                  value={newDiscountPercent}
                  onChange={(e) => setNewDiscountPercent(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none w-24"
                />
              </div>

              <button
                type="submit"
                className="px-4 py-2 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-500 cursor-pointer"
              >
                Create Discount Code
              </button>
            </form>

            <div className="rounded-xl border border-slate-800 bg-[#080d1a] overflow-hidden divide-y divide-slate-800">
              {discounts.map((disc) => (
                <div key={disc.id} className="p-4 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-white text-sm">{disc.code}</span>
                    <span className="font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                      {disc.discountPercent}% OFF
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={disc.isActive ? 'text-emerald-400' : 'text-slate-500'}>
                      {disc.isActive ? 'Active' : 'Disabled'}
                    </span>
                    <button
                      onClick={() => {
                        store.toggleDiscount(disc.id);
                        refreshData();
                      }}
                      className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-slate-300 hover:text-white cursor-pointer"
                    >
                      {disc.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Announcements */}
        {activeTab === 'announcements' && (
          <div className="space-y-6">
            <form onSubmit={handleAddAnnouncement} className="p-5 rounded-xl bg-[#080d1a] border border-slate-800 space-y-3 text-xs">
              <h3 className="font-bold text-white text-sm">Post Platform Announcement</h3>
              <input
                type="text"
                value={newAnnTitle}
                onChange={(e) => setNewAnnTitle(e.target.value)}
                placeholder="Announcement Title"
                required
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none"
              />
              <textarea
                value={newAnnMessage}
                onChange={(e) => setNewAnnMessage(e.target.value)}
                placeholder="Broadcast message to students..."
                rows={2}
                required
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-500 cursor-pointer"
              >
                Broadcast Announcement
              </button>
            </form>

            <div className="rounded-xl border border-slate-800 bg-[#080d1a] overflow-hidden divide-y divide-slate-800">
              {announcements.map((ann) => (
                <div key={ann.id} className="p-4 flex items-start justify-between gap-4 text-xs">
                  <div>
                    <h4 className="font-bold text-white text-sm mb-1">{ann.title}</h4>
                    <p className="text-slate-300 leading-relaxed">{ann.message}</p>
                    <span className="text-[10px] text-slate-500 font-mono mt-1 block">{ann.date}</span>
                  </div>
                  <button
                    onClick={() => {
                      store.deleteAnnouncement(ann.id);
                      refreshData();
                    }}
                    className="p-1.5 rounded text-slate-500 hover:text-rose-400 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Course Create / Edit Modal */}
      {showCourseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-3xl rounded-2xl bg-[#090f1e] border border-slate-700 p-6 sm:p-8 shadow-2xl my-8 max-h-[92vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-400" />
                  <span>{editingCourseId ? 'Edit Course & Media Master' : 'Create New Academy Masterclass'}</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Set course fee, upload high-definition video previews, and customize cover artwork.
                </p>
              </div>

              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-2.5 py-1 rounded">
                Admin Studio
              </span>
            </div>

            <form onSubmit={handleSaveCourse} className="space-y-6 text-xs">
              
              {/* SECTION 1: COURSE BASICS */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
                <h3 className="font-bold text-white text-xs uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  <span>1. Course Information</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 font-medium mb-1">Course Title (English)</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. DaVinci Resolve 19 Advanced Grading"
                      required
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-medium mb-1">Course Title (Somali)</label>
                    <input
                      type="text"
                      value={titleSo}
                      onChange={(e) => setTitleSo(e.target.value)}
                      placeholder="e.g. Barashada DaVinci Resolve Heerka Sare"
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-400 font-medium mb-1">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="video-editing">Video Editing</option>
                      <option value="graphic-design">Graphic Design</option>
                      <option value="motion-graphics">Motion Graphics</option>
                      <option value="content-creation">Content Creation</option>
                      <option value="artificial-intelligence">AI Learning</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 font-medium mb-1">Target Skill Level</label>
                    <select
                      value={level}
                      onChange={(e) => setLevel(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 font-medium mb-1">Total Duration</label>
                    <input
                      type="text"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder="e.g. 12h 45m"
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 font-medium mb-1">Instructor Name</label>
                    <input
                      type="text"
                      value={instructorName}
                      onChange={(e) => setInstructorName(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-medium mb-1">Instructor Title</label>
                    <input
                      type="text"
                      value={instructorTitle}
                      onChange={(e) => setInstructorTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={2}
                    placeholder="Comprehensive overview of learning outcomes..."
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* SECTION 2: COURSE FEE & PRICING MANAGEMENT */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-xs uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                    <span>2. Course Fee & Pricing Management</span>
                  </h3>
                  <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-950/70 border border-emerald-800/40 px-2 py-0.5 rounded">
                    {isFree ? 'FREE ACCESS' : `$${price} USD PAID`}
                  </span>
                </div>

                {/* Free vs Paid Toggle */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsFree(true);
                      setPrice('0');
                    }}
                    className={`flex-1 py-2 rounded-xl font-semibold text-xs border transition-colors cursor-pointer flex items-center justify-center gap-2 ${
                      isFree
                        ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 shadow-md shadow-emerald-900/20'
                        : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>Free Course ($0)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsFree(false);
                      if (price === '0' || !price) setPrice('49');
                    }}
                    className={`flex-1 py-2 rounded-xl font-semibold text-xs border transition-colors cursor-pointer flex items-center justify-center gap-2 ${
                      !isFree
                        ? 'bg-blue-950/80 border-blue-500 text-blue-300 shadow-md shadow-blue-900/20'
                        : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>Paid Premium Access</span>
                  </button>
                </div>

                {/* Preset Fee Quick Selectors */}
                {!isFree && (
                  <div className="space-y-2">
                    <label className="block text-slate-400 text-[11px] font-medium">Quick Pricing Presets:</label>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {[
                        { val: '19', label: 'Starter' },
                        { val: '29', label: 'Standard' },
                        { val: '39', label: 'Core' },
                        { val: '49', label: 'Pro' },
                        { val: '79', label: 'Studio' },
                        { val: '99', label: 'Mastery' },
                      ].map((preset) => (
                        <button
                          key={preset.val}
                          type="button"
                          onClick={() => setPrice(preset.val)}
                          className={`p-2 rounded-lg border text-center transition-all cursor-pointer font-mono ${
                            price === preset.val
                              ? 'bg-blue-600 border-blue-400 text-white font-bold'
                              : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          <div className="text-xs">${preset.val}</div>
                          <div className="text-[10px] text-slate-400 font-sans">{preset.label}</div>
                        </button>
                      ))}
                    </div>

                    <div className="pt-2">
                      <label className="block text-slate-400 text-[11px] font-medium mb-1">Custom Fee Amount ($ USD)</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 font-mono text-sm">$</span>
                        <input
                          type="number"
                          min="1"
                          max="999"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          className="w-full pl-8 pr-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION 3: UPLOAD VIDEO AS ADMIN */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-xs uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5 text-cyan-400" />
                    <span>3. Upload & Manage Course Video</span>
                  </h3>
                  <span className="text-[10px] text-slate-400 font-mono">Live Video Player Included</span>
                </div>

                <p className="text-[11px] text-slate-400">
                  Upload video files directly from your computer (MP4, WebM, MOV) or choose from academy masterclass showreels.
                </p>

                {/* Direct Video File Upload Button */}
                <input
                  type="file"
                  ref={courseVideoInputRef}
                  accept="video/*"
                  onChange={handleCourseVideoUpload}
                  className="hidden"
                />

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => courseVideoInputRef.current?.click()}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/30 flex items-center gap-2 cursor-pointer"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload Video File from Computer</span>
                  </button>

                  <span className="text-xs text-slate-500">or choose studio preset reel:</span>
                </div>

                {/* Preset Video Selector */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {PRESET_VIDEOS.map((vid, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setPreviewVideoUrl(vid.url);
                        setUploadNotice(`Connected video reel: ${vid.name}`);
                        setTimeout(() => setUploadNotice(null), 3000);
                      }}
                      className={`p-2 rounded-lg border text-left transition-colors cursor-pointer ${
                        previewVideoUrl === vid.url
                          ? 'bg-cyan-950/70 border-cyan-500 text-cyan-300 font-semibold'
                          : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Film className="w-3.5 h-3.5 mb-1 text-cyan-400" />
                      <div className="text-[11px] line-clamp-1">{vid.name}</div>
                    </button>
                  ))}
                </div>

                {/* Manual Video URL input */}
                <div>
                  <label className="block text-slate-400 text-[11px] font-medium mb-1">Direct Video URL</label>
                  <input
                    type="text"
                    value={previewVideoUrl}
                    onChange={(e) => setPreviewVideoUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-[11px] focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {/* Live Video Player Preview */}
                {previewVideoUrl && (
                  <div className="p-3 rounded-xl bg-black/80 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="flex items-center gap-1 font-semibold text-white">
                        <Play className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Live Admin Video Preview</span>
                      </span>
                      <span className="font-mono text-[10px] text-cyan-400">Authorized Stream</span>
                    </div>

                    <video
                      key={previewVideoUrl}
                      controls
                      src={previewVideoUrl}
                      className="w-full max-h-48 rounded-lg bg-black object-contain border border-slate-800"
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}
              </div>

              {/* SECTION 4: CHANGE IMAGES / ARTWORK AS ADMIN */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-xs uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-purple-400" />
                    <span>4. Course Images & Cover Artwork</span>
                  </h3>
                  <span className="text-[10px] text-slate-400 font-mono">16:9 Cinema Aspect Ratio</span>
                </div>

                <p className="text-[11px] text-slate-400">
                  Upload custom promotional cover art or select from Abdala Silver Academy curated studio artwork.
                </p>

                {/* Direct Image File Upload Button */}
                <input
                  type="file"
                  ref={courseImgInputRef}
                  accept="image/*"
                  onChange={handleCourseImageUpload}
                  className="hidden"
                />

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => courseImgInputRef.current?.click()}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 shadow-md shadow-purple-600/30 flex items-center gap-2 cursor-pointer"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload Cover Image from Computer</span>
                  </button>

                  <span className="text-xs text-slate-500">or pick from Academy Gallery below:</span>
                </div>

                {/* Preset Studio Artworks Gallery */}
                <div>
                  <label className="block text-slate-400 text-[11px] font-medium mb-2">
                    Academy Studio Artwork Gallery (1-Click Apply):
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {PRESET_COVERS.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => {
                          setThumbnail(preset.url);
                          setUploadNotice(`Applied cover: ${preset.name}`);
                          setTimeout(() => setUploadNotice(null), 3000);
                        }}
                        className={`group relative rounded-xl overflow-hidden border text-left transition-all cursor-pointer ${
                          thumbnail === preset.url
                            ? 'ring-2 ring-blue-500 border-blue-400 shadow-lg shadow-blue-500/20'
                            : 'border-slate-800 hover:border-slate-600'
                        }`}
                      >
                        <img
                          src={preset.url}
                          alt={preset.name}
                          className="w-full h-20 object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="p-2 bg-slate-900/90 border-t border-slate-800">
                          <p className="text-[10px] font-semibold text-white line-clamp-1">{preset.name}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Image Path / URL input */}
                <div>
                  <label className="block text-slate-400 text-[11px] font-medium mb-1">Custom Image URL or Path</label>
                  <input
                    type="text"
                    value={thumbnail}
                    onChange={(e) => setThumbnail(e.target.value)}
                    placeholder="/src/assets/images/... or https://..."
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-[11px] focus:outline-none focus:border-purple-500"
                  />
                </div>

                {/* Live Banner Preview Card */}
                {thumbnail && (
                  <div className="p-3 rounded-xl bg-black/60 border border-slate-800 space-y-2">
                    <span className="text-[11px] font-semibold text-slate-300 block">
                      Live Cover Card Preview (What Students See):
                    </span>
                    <div className="relative rounded-xl overflow-hidden border border-slate-700 h-36 bg-black">
                      <img
                        src={thumbnail}
                        alt="Course cover preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent p-3 flex flex-col justify-end">
                        <span className="text-xs font-bold text-white line-clamp-1">{title || 'Course Title'}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] text-cyan-300 font-mono">{instructorName}</span>
                          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/40">
                            {isFree ? 'Free' : `$${price}`}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800 sticky bottom-0 bg-[#090f1e] py-2">
                <button
                  type="button"
                  onClick={() => setShowCourseModal(false)}
                  className="px-5 py-2.5 rounded-xl text-slate-400 hover:text-white cursor-pointer font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30 flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingCourseId ? 'Save & Update Masterclass' : 'Publish Masterclass to Academy'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Live Certificate Preview / Modal */}
      {previewModalCert && (
        <CertificateModal
          certificate={previewModalCert}
          customDesignPreview={certificateDesign}
          onClose={() => setPreviewModalCert(null)}
        />
      )}

    </div>
  );
};
