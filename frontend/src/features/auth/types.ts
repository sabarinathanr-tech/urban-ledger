export type UserRole = 'ADMIN' | 'ACCOUNTANT' | 'CONTACT';

export type ContactType = 'CUSTOMER' | 'VENDOR' | 'BOTH';

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupData {
  fullName: string;
  email: string;
  mobileNumber: string;
  password: string;
  confirmPassword: string;
  termsAccepted: boolean;
  role?: 'CONTACT';
}

export interface CreateUserData {
  fullName: string;
  email: string;
  mobileNumber: string;
  role: UserRole;
  contactType?: ContactType;
  tempPassword: string;
  confirmTempPassword: string;
  isActive: boolean;
}

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  contactType?: ContactType;
  isActive?: boolean;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: AuthUser;
  token?: string;
}

export interface ApiStatusState {
  type: 'idle' | 'loading' | 'success' | 'error' | 'notice';
  message: string;
  details?: string;
}
