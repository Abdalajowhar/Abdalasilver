export type Language = 'en' | 'so';

export type UserRole = 'student' | 'instructor' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  bio?: string;
  preferredLanguage: Language;
  joinedDate: string;
  enrolledCourseIds: string[];
  wishlistCourseIds: string[];
  completedCourseIds: string[];
}

export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type CourseCategory = 
  | 'video-editing'
  | 'graphic-design'
  | 'motion-graphics'
  | 'content-creation'
  | 'artificial-intelligence';

export interface LessonResource {
  id: string;
  title: string;
  type: 'pdf' | 'zip' | 'preset' | 'link';
  fileSize?: string;
  url: string;
}

export interface Lesson {
  id: string;
  title: string;
  titleSo?: string;
  duration: string; // e.g. "14:20"
  durationSeconds: number;
  videoUrl: string;
  isPreview: boolean;
  description: string;
  descriptionSo?: string;
  resources?: LessonResource[];
  order: number;
}

export interface CourseModule {
  id: string;
  title: string;
  titleSo?: string;
  order: number;
  lessons: Lesson[];
}

export interface CourseReview {
  id: string;
  courseId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number; // 1-5
  comment: string;
  date: string;
}

export interface Course {
  id: string;
  title: string;
  titleSo: string;
  slug: string;
  tagline: string;
  taglineSo: string;
  description: string;
  descriptionSo: string;
  category: CourseCategory;
  level: CourseLevel;
  instructorId: string;
  instructorName: string;
  instructorTitle: string;
  instructorAvatar?: string;
  thumbnail: string;
  previewVideoUrl: string;
  duration: string;
  totalLessons: number;
  price: number; // 0 = free
  currency: string;
  isPublished: boolean;
  isFeatured: boolean;
  language: 'Somali' | 'English' | 'Bilingual';
  enrollmentCount: number;
  rating: number;
  modules: CourseModule[];
  createdAt: string;
  updatedAt: string;
  prerequisites: string[];
  whatYouWillLearn: string[];
  whatYouWillLearnSo?: string[];
}

export interface StudentProgress {
  userId: string;
  courseId: string;
  completedLessonIds: string[];
  lastLessonId?: string;
  progressPercent: number;
  updatedAt: string;
  isCompleted: boolean;
  certificateIssuedAt?: string;
  certificateId?: string;
}

export interface StudentNote {
  id: string;
  userId: string;
  courseId: string;
  lessonId: string;
  timestamp: string;
  content: string;
  createdAt: string;
}

export interface Certificate {
  id: string;
  credentialId: string;
  userId: string;
  userName: string;
  courseId: string;
  courseTitle: string;
  instructorName: string;
  issueDate: string;
  verificationUrl: string;
  design?: Partial<CertificateDesign>;
}

export interface CertificateDesign {
  templateType: 'custom_upload' | 'platinum_silver' | 'electric_blue' | 'royal_gold' | 'minimal_dark';
  backgroundImageUrl?: string; // custom uploaded design background (base64 or URL)
  accentColor: string; // e.g. '#3b82f6'
  borderColor: string; // e.g. '#2563eb'
  sealTitle: string;
  sealSubtitle: string;
  signatoryName: string;
  signatoryTitle: string;
  signatorySignatureUrl?: string;
  showQrCode: boolean;
  headerTitle: string;
  headerSubtitle: string;
  watermarkText: string;
}

export interface DiscountCode {
  id: string;
  code: string;
  discountPercent: number;
  isActive: boolean;
  validUntil?: string;
}

export interface Announcement {
  id: string;
  title: string;
  titleSo?: string;
  message: string;
  messageSo?: string;
  date: string;
  type: 'info' | 'update' | 'event';
  active: boolean;
}
