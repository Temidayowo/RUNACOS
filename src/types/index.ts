export type FaultStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
export type ContentStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";
export type UserRole = "ADMIN" | "STAFF";
export type MembershipStatus = "PENDING" | "VERIFIED" | "FAILED";

export interface Member {
  id: string;
  memberId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  matricNumber: string;
  level: string;
  passportUrl: string;
  paymentRef: string;
  paymentStatus: MembershipStatus;
  amountPaid: number;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
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
