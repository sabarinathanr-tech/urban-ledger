import type {
  LoginCredentials,
  SignupData,
  CreateUserData,
  AuthResponse,
} from './types';

/**
 * Urban Ledger Auth API Integration Boundary
 *
 * NOTE: Actual backend authentication endpoints are not implemented yet.
 * These typed functions provide the contract boundary for the backend developer
 * to integrate with (e.g., Axios instance or fetch client).
 */

const SIMULATED_LATENCY_MS = 600;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Sign in existing user.
 * Target Endpoint: POST /api/auth/login
 */
export async function loginUser(credentials: LoginCredentials): Promise<AuthResponse> {
  await delay(SIMULATED_LATENCY_MS);

  // Return API integration placeholder response
  return {
    success: true,
    message: 'Backend API connection pending: Authentication endpoint (POST /api/auth/login) is ready for integration.',
    user: {
      id: 'usr_preview',
      fullName: 'Demo User',
      email: credentials.email,
      role: 'ADMIN',
    },
  };
}

/**
 * Register a new user account (public registration).
 * Target Endpoint: POST /api/auth/signup
 */
export async function signupUser(data: SignupData): Promise<AuthResponse> {
  await delay(SIMULATED_LATENCY_MS);

  return {
    success: true,
    message: 'Backend API connection pending: Registration endpoint (POST /api/auth/signup) is ready for integration.',
    user: {
      id: 'usr_new',
      fullName: data.fullName,
      email: data.email,
      role: 'CONTACT',
    },
  };
}

/**
 * Create a new user account (internal admin action).
 * Target Endpoint: POST /api/users
 */
export async function createUser(data: CreateUserData): Promise<AuthResponse> {
  await delay(SIMULATED_LATENCY_MS);

  return {
    success: true,
    message: `Backend API connection pending: User creation endpoint (POST /api/users) ready. Role: ${data.role}${data.contactType ? ` (${data.contactType})` : ''}.`,
    user: {
      id: 'usr_created',
      fullName: data.fullName,
      email: data.email,
      role: data.role,
      contactType: data.contactType,
      isActive: data.isActive,
    },
  };
}

/**
 * Log out the current user session.
 * Target Endpoint: POST /api/auth/logout
 */
export async function logoutUser(): Promise<void> {
  await delay(SIMULATED_LATENCY_MS);
}
