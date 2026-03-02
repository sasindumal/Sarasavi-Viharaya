// Firebase types & interfaces for the application

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string; // ISO string
  endDate?: string;
  duration: string;
  tags: string[];
  coverPhoto?: string;
  photos: string[];
  notifySubscribers: boolean;
  isPublished: boolean;
  scheduledFor?: string; // ISO string for scheduled posting
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  date: string;
  endDate?: string;
  duration: string;
  coverPhoto?: string;
  photos: string[];
  notifySubscribers: boolean;
  isPublished: boolean;
  scheduledFor?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface Tag {
  id: string;
  name: string;
  createdAt: string;
}

export interface AppUser {
  uid: string;
  email: string;
  displayName: string;
  role: 'super_admin' | 'admin' | 'moderator';
  createdAt: string;
  createdBy: string;
}

export interface Subscriber {
  id: string;
  email: string;
  name?: string;
  subscribedAt: string;
  isActive: boolean;
}

export interface BlessingMessage {
  id: string;
  personName: string;
  personTitle: string;
  personPhoto?: string;
  message: string;
  order: number;
}

export interface Acknowledgment {
  id: string;
  name: string;
  category: 'donor' | 'workforce' | 'special';
  description: string;
  photo?: string;
  order: number;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}
