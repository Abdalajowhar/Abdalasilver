import { User, UserRole } from '../types';
import { INITIAL_USERS } from './initialData';

const USERS_STORAGE_KEY = 'abdala_silver_users_v1';
const CURRENT_USER_KEY = 'abdala_silver_current_user';

class AuthService {
  private users: User[];
  private currentUser: User | null = null;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.users = this.loadUsers();
    this.currentUser = this.loadCurrentUser();
  }

  private loadUsers(): User[] {
    let loaded: User[] = [];
    try {
      const data = localStorage.getItem(USERS_STORAGE_KEY);
      if (data) {
        loaded = JSON.parse(data);
      }
    } catch {
      // fallback
    }

    if (!loaded || loaded.length === 0) {
      loaded = [...INITIAL_USERS];
    }

    // Ensure cadkajwhr5@gmail.com is always registered as super admin
    const adminUser = loaded.find(u => u.email.toLowerCase() === 'cadkajwhr5@gmail.com');
    if (!adminUser) {
      const cadkaAdmin: User = {
        id: 'user-admin-cadka',
        name: 'Abdala Silver (Admin)',
        email: 'cadkajwhr5@gmail.com',
        role: 'admin',
        avatar: '/src/assets/images/abdala_hero_studio_1792842639594.jpg',
        bio: 'Founder & Super Administrator of Abdala Silver Creative Academy.',
        preferredLanguage: 'so',
        joinedDate: '2024-01-01',
        enrolledCourseIds: ['course-1', 'course-2', 'course-3', 'course-4', 'course-5', 'course-6'],
        wishlistCourseIds: [],
        completedCourseIds: ['course-1', 'course-6'],
      };
      loaded.unshift(cadkaAdmin);
    } else {
      adminUser.role = 'admin';
    }

    return loaded;
  }

  private loadCurrentUser(): User | null {
    try {
      const data = localStorage.getItem(CURRENT_USER_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        const fresh = this.users.find(u => u.id === parsed.id || u.email.toLowerCase() === parsed.email?.toLowerCase());
        if (fresh) {
          if (fresh.email.toLowerCase() === 'cadkajwhr5@gmail.com') fresh.role = 'admin';
          return fresh;
        }
      }
    } catch {
      // fallback
    }
    // Default to the user's admin account cadkajwhr5@gmail.com so admin rights are active immediately!
    const myAdmin = this.users.find(u => u.email.toLowerCase() === 'cadkajwhr5@gmail.com');
    if (myAdmin) return myAdmin;

    return this.users.find(u => u.role === 'admin') || this.users[0] || null;
  }

  private saveUsers() {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(this.users));
    } catch {
      // quota or fallback
    }
  }

  private saveCurrentUser() {
    try {
      if (this.currentUser) {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(this.currentUser));
      } else {
        localStorage.removeItem(CURRENT_USER_KEY);
      }
    } catch {
      // fallback
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

  public getCurrentUser(): User | null {
    return this.currentUser;
  }

  public getAllUsers(): User[] {
    return [...this.users];
  }

  public async login(email: string, _password?: string): Promise<User> {
    const cleanEmail = email.toLowerCase().trim();
    const found = this.users.find(u => u.email.toLowerCase() === cleanEmail);

    if (!found) {
      throw new Error('No account found with this email. Please check your credentials or register.');
    }

    this.currentUser = found;
    this.saveCurrentUser();
    return found;
  }

  public async register(name: string, email: string, _password?: string, role: UserRole = 'student'): Promise<User> {
    const cleanEmail = email.toLowerCase().trim();
    const existing = this.users.find(u => u.email.toLowerCase() === cleanEmail);

    if (existing) {
      throw new Error('An account with this email already exists. Please sign in instead.');
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: cleanEmail,
      role: cleanEmail === 'cadkajwhr5@gmail.com' ? 'admin' : role,
      preferredLanguage: 'en',
      joinedDate: new Date().toISOString().split('T')[0],
      enrolledCourseIds: [],
      wishlistCourseIds: [],
      completedCourseIds: [],
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=0284c7`,
    };

    this.users.push(newUser);
    this.saveUsers();
    this.currentUser = newUser;
    this.saveCurrentUser();
    return newUser;
  }

  public logout(): void {
    this.currentUser = null;
    this.saveCurrentUser();
  }

  public switchDemoUser(role: UserRole): User {
    const found = this.users.find(u => u.role === role);
    if (found) {
      this.currentUser = found;
      this.saveCurrentUser();
      return found;
    }
    // Fallback to first
    this.currentUser = this.users[0];
    this.saveCurrentUser();
    return this.currentUser;
  }

  public enrollInCourse(courseId: string): boolean {
    if (!this.currentUser) return false;

    if (!this.currentUser.enrolledCourseIds.includes(courseId)) {
      this.currentUser.enrolledCourseIds.push(courseId);
      // Remove from wishlist if present
      this.currentUser.wishlistCourseIds = this.currentUser.wishlistCourseIds.filter(id => id !== courseId);

      // Update in users array
      const idx = this.users.findIndex(u => u.id === this.currentUser!.id);
      if (idx !== -1) {
        this.users[idx] = { ...this.currentUser };
        this.saveUsers();
      }
      this.saveCurrentUser();
      return true;
    }
    return false;
  }

  public toggleWishlist(courseId: string): boolean {
    if (!this.currentUser) return false;

    const inList = this.currentUser.wishlistCourseIds.includes(courseId);
    if (inList) {
      this.currentUser.wishlistCourseIds = this.currentUser.wishlistCourseIds.filter(id => id !== courseId);
    } else {
      this.currentUser.wishlistCourseIds.push(courseId);
    }

    const idx = this.users.findIndex(u => u.id === this.currentUser!.id);
    if (idx !== -1) {
      this.users[idx] = { ...this.currentUser };
      this.saveUsers();
    }
    this.saveCurrentUser();
    return !inList;
  }

  public isEnrolled(courseId: string): boolean {
    if (!this.currentUser) return false;
    return this.currentUser.enrolledCourseIds.includes(courseId);
  }

  public isInWishlist(courseId: string): boolean {
    if (!this.currentUser) return false;
    return this.currentUser.wishlistCourseIds.includes(courseId);
  }

  public updateProfile(updates: Partial<User>): User | null {
    if (!this.currentUser) return null;

    this.currentUser = {
      ...this.currentUser,
      ...updates,
    };

    const idx = this.users.findIndex(u => u.id === this.currentUser!.id);
    if (idx !== -1) {
      this.users[idx] = { ...this.currentUser };
      this.saveUsers();
    }

    this.saveCurrentUser();
    return this.currentUser;
  }

  public updateUserRole(userId: string, newRole: UserRole): boolean {
    const user = this.users.find(u => u.id === userId);
    if (!user) return false;

    user.role = newRole;
    if (this.currentUser && this.currentUser.id === userId) {
      this.currentUser.role = newRole;
      this.saveCurrentUser();
    }
    this.saveUsers();
    this.notify();
    return true;
  }

  public deleteUser(userId: string): boolean {
    if (this.currentUser?.id === userId) {
      throw new Error('Cannot delete currently active logged in user');
    }
    this.users = this.users.filter(u => u.id !== userId);
    this.saveUsers();
    this.notify();
    return true;
  }
}

export const auth = new AuthService();
