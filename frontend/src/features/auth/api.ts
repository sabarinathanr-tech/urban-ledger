import apiClient from '@/lib/axios';
import type {
  LoginCredentials,
  SignupData,
  CreateUserData,
  AuthResponse,
  UserRole,
  ContactType,
} from './types';

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  mobile: string | null;
  role: UserRole;
  status: 'ACTIVE' | 'INACTIVE';
  contact?: {
    id: string;
    name: string;
    type: ContactType;
    status: string;
  } | null;
  createdAt: string;
  updatedAt?: string;
}

/**
 * Sign in existing user.
 * POST /api/auth/login
 */
export async function loginUser(credentials: LoginCredentials): Promise<AuthResponse> {
  const res = await apiClient.post('/auth/login', credentials);
  const data = res.data.data;
  return {
    success: true,
    message: res.data.message || 'Login successful',
    token: data.token,
    user: {
      id: data.user.id,
      fullName: data.user.name,
      email: data.user.email,
      role: data.user.role,
      contactType: data.user.contact?.type,
      isActive: data.user.status === 'ACTIVE',
    },
  };
}

/**
 * Register a new user account (public registration).
 * POST /api/auth/signup
 */
export async function signupUser(data: SignupData): Promise<AuthResponse> {
  const res = await apiClient.post('/auth/signup', {
    fullName: data.fullName,
    email: data.email,
    mobileNumber: data.mobileNumber,
    password: data.password,
    confirmPassword: data.confirmPassword,
  });
  const resData = res.data.data;
  return {
    success: true,
    message: res.data.message || 'Signup successful',
    token: resData.token,
    user: {
      id: resData.user.id,
      fullName: resData.user.name,
      email: resData.user.email,
      role: resData.user.role,
      isActive: true,
    },
  };
}

/**
 * Create a new user account (internal admin action).
 * POST /api/users
 */
export async function createUser(data: CreateUserData): Promise<AuthResponse> {
  const res = await apiClient.post('/users', {
    name: data.fullName,
    email: data.email,
    mobile: data.mobileNumber,
    role: data.role,
    contactType: data.contactType,
    password: data.tempPassword,
    isActive: data.isActive,
  });
  const resData = res.data.data;
  return {
    success: true,
    message: res.data.message || 'User created successfully',
    user: {
      id: resData.user.id,
      fullName: resData.user.name,
      email: resData.user.email,
      role: resData.user.role,
      contactType: resData.user.contact?.type,
      isActive: resData.user.status === 'ACTIVE',
    },
  };
}

/**
 * List users (Admin only)
 * GET /api/users
 */
export async function listUsers(query?: { page?: number; limit?: number; search?: string; role?: string }): Promise<{ items: UserRecord[]; total: number }> {
  const res = await apiClient.get('/users', { params: query });
  return res.data.data;
}

/**
 * Toggle user active/inactive status (Admin only)
 * PATCH /api/users/:id/status
 */
export async function toggleUserStatus(id: string): Promise<UserRecord> {
  const res = await apiClient.patch(`/users/${id}/status`);
  return res.data.data.user;
}

/**
 * Initialize First Administrator (One-time bootstrap endpoint)
 * POST /api/auth/setup-admin
 */
export async function setupInitialAdmin(data: SignupData): Promise<AuthResponse> {
  const res = await apiClient.post('/auth/setup-admin', {
    fullName: data.fullName,
    email: data.email,
    mobileNumber: data.mobileNumber,
    password: data.password,
    confirmPassword: data.confirmPassword,
  });
  const resData = res.data.data;
  return {
    success: true,
    message: res.data.message || 'First administrator created successfully',
    token: resData.token,
    user: {
      id: resData.user.id,
      fullName: resData.user.name,
      email: resData.user.email,
      role: 'ADMIN',
      isActive: true,
    },
  };
}

/**
 * Log out the current user session.
 * POST /api/auth/logout
 */
export async function logoutUser(): Promise<void> {
  try {
    await apiClient.post('/auth/logout');
  } catch {
    // Ignore network error on logout
  }
}
