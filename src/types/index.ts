export type FaultStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
export type ContentStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";
export type UserRole = "ADMIN" | "STAFF";
export interface Member {
  id: string;
  memberId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  matricNumber: string;
  level: string;
  gender: string | null;
  department: string | null;
  faculty: string | null;
  stateOfOrigin: string | null;
  academicSession: string | null;
  semester: string | null;
  passportUrl: string;
  admissionYear: number | null;
  isAlumni: boolean;
  alumniSince: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Staff {
  id: string;
  name: string;
  title: string;
  specialty: string | null;
  department: string | null;
  email: string | null;
  phone: string | null;
  image: string | null;
  bio: string | null;
  order: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  name: string | null;
  active: boolean;
  subscribedAt: string;
  unsubscribedAt: string | null;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiResponse<T = unknown> {
  data?: T;
  message?: string;
  error?: string;
  details?: string;
}
