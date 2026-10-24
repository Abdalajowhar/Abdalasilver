import { 
  Course, 
  CourseReview, 
  StudentProgress, 
  StudentNote, 
  Certificate, 
  CertificateDesign,
  DiscountCode, 
  Announcement,
  Lesson,
  CourseModule
} from '../types';
import { 
  INITIAL_COURSES, 
  INITIAL_REVIEWS, 
  INITIAL_DISCOUNTS, 
  INITIAL_ANNOUNCEMENTS 
} from './initialData';

export const DEFAULT_CERTIFICATE_DESIGN: CertificateDesign = {
  templateType: 'electric_blue',
  backgroundImageUrl: '',
  accentColor: '#3b82f6',
  borderColor: '#2563eb',
  sealTitle: 'ABDALA SILVER ACADEMY',
  sealSubtitle: 'OFFICIAL SEAL · VERIFIED',
  signatoryName: 'Abdala Silver',
  signatoryTitle: 'Head of Academy & Creative Director',
  signatorySignatureUrl: '',
  showQrCode: true,
  headerTitle: 'Certificate of Mastery & Creative Excellence',
  headerSubtitle: 'For Practical Achievement in Digital Creative Disciplines',
  watermarkText: 'ABDALA SILVER ACADEMY',
};

interface StoreState {
  courses: Course[];
  progress: Record<string, StudentProgress>; // key: `${userId}_${courseId}`
  notes: StudentNote[];
  reviews: CourseReview[];
  certificates: Certificate[];
  discounts: DiscountCode[];
  announcements: Announcement[];
  certificateDesign: CertificateDesign;
}

const STORAGE_KEY = 'abdala_silver_platform_data_v1';

class Store {
  private state: StoreState;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.state = this.loadState();
  }

  private loadState(): StoreState {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          courses: parsed.courses || INITIAL_COURSES,
          progress: parsed.progress || this.defaultInitialProgress(),
          notes: parsed.notes || [],
          reviews: parsed.reviews || INITIAL_REVIEWS,
          certificates: parsed.certificates || this.defaultInitialCertificates(),
          discounts: parsed.discounts || INITIAL_DISCOUNTS,
          announcements: parsed.announcements || INITIAL_ANNOUNCEMENTS,
          certificateDesign: parsed.certificateDesign || DEFAULT_CERTIFICATE_DESIGN,
        };
      }
    } catch {
      // Fallback
    }

    return {
      courses: INITIAL_COURSES,
      progress: this.defaultInitialProgress(),
      notes: [],
      reviews: INITIAL_REVIEWS,
      certificates: this.defaultInitialCertificates(),
      discounts: INITIAL_DISCOUNTS,
      announcements: INITIAL_ANNOUNCEMENTS,
      certificateDesign: DEFAULT_CERTIFICATE_DESIGN,
    };
  }

  private defaultInitialProgress(): Record<string, StudentProgress> {
    return {
      'user-student_course-6': {
        userId: 'user-student',
        courseId: 'course-6',
        completedLessonIds: ['les-6-1', 'les-6-2'],
        lastLessonId: 'les-6-2',
        progressPercent: 100,
        updatedAt: '2024-09-10',
        isCompleted: true,
        certificateIssuedAt: '2024-09-10',
        certificateId: 'cert-silver-001'
      },
      'user-student_course-1': {
        userId: 'user-student',
        courseId: 'course-1',
        completedLessonIds: ['les-1-1', 'les-1-2'],
        lastLessonId: 'les-1-2',
        progressPercent: 33,
        updatedAt: '2024-10-18',
        isCompleted: false
      }
    };
  }

  private defaultInitialCertificates(): Certificate[] {
    return [
      {
        id: 'cert-silver-001',
        credentialId: 'AS-2024-8849-CAP',
        userId: 'user-student',
        userName: 'Fatima Warsame',
        courseId: 'course-6',
        courseTitle: 'CapCut Masterclass: Fast Mobile & Desktop Edits for Viral Creators',
        instructorName: 'Abdala Silver',
        issueDate: '2024-09-10',
        verificationUrl: 'https://abdalasilver.com/verify/AS-2024-8849-CAP'
      }
    ];
  }

  private saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch {
      // quota or localstorage disabled
    }
    this.notify();
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach(fn => fn());
  }

  // --- COURSES ---
  public getCourses(includeUnpublished = false): Course[] {
    if (includeUnpublished) return [...this.state.courses];
    return this.state.courses.filter(c => c.isPublished);
  }

  public getCourseById(id: string): Course | undefined {
    return this.state.courses.find(c => c.id === id);
  }

  public getCourseBySlug(slug: string): Course | undefined {
    return this.state.courses.find(c => c.slug === slug || c.id === slug);
  }

  public createCourse(course: Omit<Course, 'id' | 'createdAt' | 'updatedAt' | 'enrollmentCount' | 'rating'> & { enrollmentCount?: number; rating?: number }): Course {
    const newCourse: Course = {
      enrollmentCount: 0,
      rating: 5.0,
      ...course,
      id: `course-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    this.state.courses.unshift(newCourse);
    this.saveState();
    return newCourse;
  }

  public updateCourse(id: string, updates: Partial<Course>): Course | undefined {
    const index = this.state.courses.findIndex(c => c.id === id);
    if (index === -1) return undefined;
    this.state.courses[index] = {
      ...this.state.courses[index],
      ...updates,
      updatedAt: new Date().toISOString().split('T')[0],
    };
    this.saveState();
    return this.state.courses[index];
  }

  public deleteCourse(id: string): boolean {
    const initialLen = this.state.courses.length;
    this.state.courses = this.state.courses.filter(c => c.id !== id);
    if (this.state.courses.length !== initialLen) {
      this.saveState();
      return true;
    }
    return false;
  }

  public togglePublish(id: string): boolean {
    const course = this.getCourseById(id);
    if (!course) return false;
    course.isPublished = !course.isPublished;
    this.saveState();
    return true;
  }

  // --- MODULES & LESSONS ---
  public addModule(courseId: string, title: string, titleSo?: string): CourseModule | undefined {
    const course = this.getCourseById(courseId);
    if (!course) return undefined;
    const newModule: CourseModule = {
      id: `mod-${Date.now()}`,
      title,
      titleSo: titleSo || title,
      order: course.modules.length + 1,
      lessons: []
    };
    course.modules.push(newModule);
    this.saveState();
    return newModule;
  }

  public addLesson(courseId: string, moduleId: string, lessonData: Omit<Lesson, 'id' | 'order'>): Lesson | undefined {
    const course = this.getCourseById(courseId);
    if (!course) return undefined;
    const module = course.modules.find(m => m.id === moduleId);
    if (!module) return undefined;

    const newLesson: Lesson = {
      ...lessonData,
      id: `les-${Date.now()}`,
      order: module.lessons.length + 1,
    };
    module.lessons.push(newLesson);
    course.totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
    this.saveState();
    return newLesson;
  }

  public updateLesson(courseId: string, moduleId: string, lessonId: string, updates: Partial<Lesson>): boolean {
    const course = this.getCourseById(courseId);
    if (!course) return false;
    const module = course.modules.find(m => m.id === moduleId);
    if (!module) return false;
    const lesson = module.lessons.find(l => l.id === lessonId);
    if (!lesson) return false;
    Object.assign(lesson, updates);
    this.saveState();
    return true;
  }

  public deleteLesson(courseId: string, moduleId: string, lessonId: string): boolean {
    const course = this.getCourseById(courseId);
    if (!course) return false;
    const module = course.modules.find(m => m.id === moduleId);
    if (!module) return false;
    module.lessons = module.lessons.filter(l => l.id !== lessonId);
    course.totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
    this.saveState();
    return true;
  }

  // --- PROGRESS & ENROLLMENT ---
  public getProgress(userId: string, courseId: string): StudentProgress {
    const key = `${userId}_${courseId}`;
    if (this.state.progress[key]) {
      return this.state.progress[key];
    }
    const emptyProgress: StudentProgress = {
      userId,
      courseId,
      completedLessonIds: [],
      progressPercent: 0,
      updatedAt: new Date().toISOString().split('T')[0],
      isCompleted: false,
    };
    return emptyProgress;
  }

  public markLessonComplete(userId: string, courseId: string, lessonId: string): StudentProgress {
    const key = `${userId}_${courseId}`;
    const course = this.getCourseById(courseId);
    const totalLessons = course ? course.modules.reduce((acc, m) => acc + m.lessons.length, 0) : 1;

    const current = this.getProgress(userId, courseId);
    const completedSet = new Set(current.completedLessonIds);
    completedSet.add(lessonId);

    const completedLessonIds = Array.from(completedSet);
    const progressPercent = Math.min(100, Math.round((completedLessonIds.length / Math.max(1, totalLessons)) * 100));
    const isCompleted = progressPercent >= 100;

    let certId = current.certificateId;
    let certIssued = current.certificateIssuedAt;

    if (isCompleted && !certId) {
      certId = `cert-${Date.now()}`;
      certIssued = new Date().toISOString().split('T')[0];
      // Generate certificate record automatically
      this.generateCertificate(userId, courseId, certId);
    }

    const updated: StudentProgress = {
      ...current,
      completedLessonIds,
      lastLessonId: lessonId,
      progressPercent,
      isCompleted,
      certificateId: certId,
      certificateIssuedAt: certIssued,
      updatedAt: new Date().toISOString().split('T')[0],
    };

    this.state.progress[key] = updated;
    this.saveState();
    return updated;
  }

  public unmarkLessonComplete(userId: string, courseId: string, lessonId: string): StudentProgress {
    const key = `${userId}_${courseId}`;
    const course = this.getCourseById(courseId);
    const totalLessons = course ? course.modules.reduce((acc, m) => acc + m.lessons.length, 0) : 1;

    const current = this.getProgress(userId, courseId);
    const completedLessonIds = current.completedLessonIds.filter(id => id !== lessonId);
    const progressPercent = Math.min(100, Math.round((completedLessonIds.length / Math.max(1, totalLessons)) * 100));

    const updated: StudentProgress = {
      ...current,
      completedLessonIds,
      progressPercent,
      isCompleted: progressPercent >= 100,
      updatedAt: new Date().toISOString().split('T')[0],
    };

    this.state.progress[key] = updated;
    this.saveState();
    return updated;
  }

  // --- CERTIFICATES ---
  public getCertificateDesign(): CertificateDesign {
    return this.state.certificateDesign || DEFAULT_CERTIFICATE_DESIGN;
  }

  public updateCertificateDesign(updates: Partial<CertificateDesign>): CertificateDesign {
    this.state.certificateDesign = {
      ...(this.state.certificateDesign || DEFAULT_CERTIFICATE_DESIGN),
      ...updates,
    };
    this.saveState();
    return this.state.certificateDesign;
  }

  public getAllCertificates(): Certificate[] {
    return [...this.state.certificates];
  }

  public deleteCertificate(id: string): boolean {
    const initLen = this.state.certificates.length;
    this.state.certificates = this.state.certificates.filter(c => c.id !== id);
    if (this.state.certificates.length !== initLen) {
      this.saveState();
      return true;
    }
    return false;
  }

  private generateCertificate(userId: string, courseId: string, certId: string): Certificate | undefined {
    const course = this.getCourseById(courseId);
    if (!course) return undefined;

    // Grab user name if possible
    let studentName = 'Creative Student';
    try {
      const savedUser = localStorage.getItem('abdala_silver_current_user');
      if (savedUser) {
        const u = JSON.parse(savedUser);
        if (u.name) studentName = u.name;
      }
    } catch {
      // fallback
    }

    const credentialId = `AS-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}-${course.category.slice(0, 3).toUpperCase()}`;
    const cert: Certificate = {
      id: certId,
      credentialId,
      userId,
      userName: studentName,
      courseId,
      courseTitle: course.title,
      instructorName: course.instructorName,
      issueDate: new Date().toISOString().split('T')[0],
      verificationUrl: `https://abdalasilver.com/verify/${credentialId}`,
      design: { ...this.getCertificateDesign() },
    };

    this.state.certificates.unshift(cert);
    this.saveState();
    return cert;
  }

  public adminIssueCertificate(userId: string, courseId: string, customStudentName?: string): Certificate | undefined {
    const course = this.getCourseById(courseId);
    if (!course) return undefined;

    const certId = `cert-${Date.now()}`;
    const credentialId = `AS-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}-${course.category.slice(0, 3).toUpperCase()}`;
    
    let studentName = customStudentName || 'Student';
    if (!customStudentName) {
      try {
        const usersStr = localStorage.getItem('abdala_silver_users_v1');
        if (usersStr) {
          const list = JSON.parse(usersStr);
          const found = list.find((u: any) => u.id === userId);
          if (found) studentName = found.name;
        }
      } catch {
        // fallback
      }
    }

    const cert: Certificate = {
      id: certId,
      credentialId,
      userId,
      userName: studentName,
      courseId,
      courseTitle: course.title,
      instructorName: course.instructorName,
      issueDate: new Date().toISOString().split('T')[0],
      verificationUrl: `https://abdalasilver.com/verify/${credentialId}`,
      design: { ...this.getCertificateDesign() },
    };

    // Update student progress to 100% completed
    const allLessonIds = course.modules.flatMap(m => m.lessons.map(l => l.id));
    const key = `${userId}_${courseId}`;
    this.state.progress[key] = {
      userId,
      courseId,
      completedLessonIds: allLessonIds,
      progressPercent: 100,
      isCompleted: true,
      certificateId: certId,
      certificateIssuedAt: cert.issueDate,
      updatedAt: cert.issueDate,
    };

    // Remove any previous cert for this course+user
    this.state.certificates = this.state.certificates.filter(c => !(c.userId === userId && c.courseId === courseId));
    this.state.certificates.unshift(cert);
    this.saveState();
    return cert;
  }

  public getCertificatesByUser(userId: string): Certificate[] {
    return this.state.certificates.filter(c => c.userId === userId);
  }

  public getCertificateById(id: string): Certificate | undefined {
    return this.state.certificates.find(c => c.id === id || c.credentialId === id);
  }

  // --- NOTES ---
  public getNotes(userId: string, courseId: string, lessonId?: string): StudentNote[] {
    return this.state.notes.filter(n => {
      const match = n.userId === userId && n.courseId === courseId;
      if (lessonId) return match && n.lessonId === lessonId;
      return match;
    });
  }

  public saveNote(userId: string, courseId: string, lessonId: string, content: string, timestamp: string): StudentNote {
    const note: StudentNote = {
      id: `note-${Date.now()}`,
      userId,
      courseId,
      lessonId,
      content,
      timestamp,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    this.state.notes.unshift(note);
    this.saveState();
    return note;
  }

  public deleteNote(noteId: string): boolean {
    const initLen = this.state.notes.length;
    this.state.notes = this.state.notes.filter(n => n.id !== noteId);
    if (this.state.notes.length !== initLen) {
      this.saveState();
      return true;
    }
    return false;
  }

  // --- REVIEWS ---
  public getReviews(courseId: string): CourseReview[] {
    return this.state.reviews.filter(r => r.courseId === courseId);
  }

  public addReview(courseId: string, userId: string, userName: string, rating: number, comment: string, avatar?: string): CourseReview {
    const review: CourseReview = {
      id: `rev-${Date.now()}`,
      courseId,
      userId,
      userName,
      userAvatar: avatar,
      rating,
      comment,
      date: new Date().toISOString().split('T')[0],
    };
    this.state.reviews.unshift(review);

    // Update course average rating
    const allCourseReviews = this.getReviews(courseId);
    const avg = allCourseReviews.reduce((sum, r) => sum + r.rating, 0) / allCourseReviews.length;
    const course = this.getCourseById(courseId);
    if (course) {
      course.rating = Math.round(avg * 10) / 10;
    }

    this.saveState();
    return review;
  }

  public deleteReview(reviewId: string): boolean {
    this.state.reviews = this.state.reviews.filter(r => r.id !== reviewId);
    this.saveState();
    return true;
  }

  // --- DISCOUNTS ---
  public getDiscounts(): DiscountCode[] {
    return [...this.state.discounts];
  }

  public addDiscount(code: string, discountPercent: number): DiscountCode {
    const discount: DiscountCode = {
      id: `disc-${Date.now()}`,
      code: code.toUpperCase().trim(),
      discountPercent,
      isActive: true,
      validUntil: '2027-12-31'
    };
    this.state.discounts.push(discount);
    this.saveState();
    return discount;
  }

  public toggleDiscount(id: string): void {
    const d = this.state.discounts.find(item => item.id === id);
    if (d) {
      d.isActive = !d.isActive;
      this.saveState();
    }
  }

  public validateDiscount(code: string): DiscountCode | null {
    const found = this.state.discounts.find(d => d.code.toUpperCase() === code.toUpperCase().trim() && d.isActive);
    return found || null;
  }

  // --- ANNOUNCEMENTS ---
  public getAnnouncements(): Announcement[] {
    return [...this.state.announcements];
  }

  public addAnnouncement(announcement: Omit<Announcement, 'id' | 'date'>): Announcement {
    const newAnn: Announcement = {
      ...announcement,
      id: `ann-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    };
    this.state.announcements.unshift(newAnn);
    this.saveState();
    return newAnn;
  }

  public deleteAnnouncement(id: string): void {
    this.state.announcements = this.state.announcements.filter(a => a.id !== id);
    this.saveState();
  }

  // --- PLATFORM STATS ---
  public getPlatformStats() {
    const courses = this.state.courses;
    const totalCourses = courses.length;
    const totalEnrollments = courses.reduce((sum, c) => sum + (c.enrollmentCount || 0), 0) + 128;
    const totalLessons = courses.reduce((sum, c) => sum + (c.totalLessons || 0), 0);
    const totalInstructors = new Set(courses.map(c => c.instructorName)).size;
    const completedProgresses = Object.values(this.state.progress).filter(p => p.isCompleted).length;

    return {
      totalCourses,
      totalEnrollments,
      totalLessons,
      totalInstructors: Math.max(3, totalInstructors),
      completedLessons: completedProgresses * 8 + 430,
      certificatesIssued: this.state.certificates.length + 184,
    };
  }
}

export const store = new Store();
