/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { AuthUser, LoginCredentials, SignupData, UserRole, ContactType } from '@/features/auth/types';

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthUser>;
  signup: (data: SignupData) => Promise<AuthUser>;
  logout: () => void;
  loginAsDemo: (roleType: 'ADMIN' | 'ACCOUNTANT' | 'CUSTOMER' | 'VENDOR') => Promise<AuthUser>;
  isAdmin: boolean;
  isAccountant: boolean;
  isContact: boolean;
}

const STORAGE_USER_KEY = 'urban_ledger_user';
const STORAGE_TOKEN_KEY = 'urban_ledger_token';

// Demo seed accounts for immediate review & hackathon demonstration
export const DEMO_ACCOUNTS: Record<string, { email: string; name: string; role: UserRole; contactType?: ContactType }> = {
  ADMIN: {
    email: 'admin@urbanledger.com',
    name: 'Rohith (Admin)',
    role: 'ADMIN',
  },
  ADMIN_ALT: {
    email: 'admin@urbanfurniture.com',
    name: 'Rohith Admin',
    role: 'ADMIN',
  },
  ACCOUNTANT: {
    email: 'accountant@urbanledger.com',
    name: 'Mohith (Lead Accountant)',
    role: 'ACCOUNTANT',
  },
  ACCOUNTANT_ALT: {
    email: 'accountant@urbanfurniture.com',
    name: 'Mohith Accountant',
    role: 'ACCOUNTANT',
  },
  CUSTOMER: {
    email: 'nimesh@gmail.com',
    name: 'Nimesh Pathak (Customer)',
    role: 'CONTACT',
    contactType: 'CUSTOMER',
  },
  CUSTOMER_ALT: {
    email: 'nimesh@pathak.com',
    name: 'Nimesh Pathak',
    role: 'CONTACT',
    contactType: 'CUSTOMER',
  },
  VENDOR: {
    email: 'azure@furniture.com',
    name: 'Azure Furniture (Vendor)',
    role: 'CONTACT',
    contactType: 'VENDOR',
  },
  VENDOR_ALT: {
    email: 'orders@azurefurniture.com',
    name: 'Azure Furniture',
    role: 'CONTACT',
    contactType: 'VENDOR',
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Restore session from localStorage on initial load
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(STORAGE_USER_KEY);
      const storedToken = localStorage.getItem(STORAGE_TOKEN_KEY);

      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      }
    } catch {
      localStorage.removeItem(STORAGE_USER_KEY);
      localStorage.removeItem(STORAGE_TOKEN_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveSession = (authenticatedUser: AuthUser, authToken: string) => {
    setUser(authenticatedUser);
    setToken(authToken);
    try {
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(authenticatedUser));
      localStorage.setItem(STORAGE_TOKEN_KEY, authToken);
    } catch (e) {
      console.warn('Failed to persist auth session to localStorage:', e);
    }
  };

  const login = useCallback(async (credentials: LoginCredentials): Promise<AuthUser> => {
    setIsLoading(true);
    const normalizedEmail = credentials.email.trim().toLowerCase();

    let backendReached = false;
    let backendError: string | null = null;

    // 1. Attempt connection to live backend API if reachable
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: normalizedEmail,
          password: credentials.password,
        }),
      });

      backendReached = true;
      const result = await response.json().catch(() => null);

      if (response.ok && result?.data?.user && result?.data?.token) {
        const apiUser: AuthUser = {
          id: result.data.user.id,
          fullName: result.data.user.name,
          email: result.data.user.email,
          role: result.data.user.role,
          contactType: result.data.user.contact?.type,
          isActive: result.data.user.status === 'ACTIVE' || result.data.user.isActive !== false,
          contact: result.data.user.contact || null,
        };
        saveSession(apiUser, result.data.token);
        setIsLoading(false);
        return apiUser;
      } else {
        // The backend actively responded with an error (e.g. 401, 403, 400)
        backendError = result?.message || result?.error?.message || `Authentication failed (${response.status})`;
      }
    } catch {
      // Backend not running or offline, proceed to seamless local fallback
      backendReached = false;
    }

    // Server-side authentication is authoritative when server is online
    if (backendReached) {
      setIsLoading(false);
      throw new Error(backendError || 'Invalid email or password.');
    }

    // 2. Offline fallback ONLY for evaluation demo accounts when backend service is offline
    const matchedDemoKey = Object.keys(DEMO_ACCOUNTS).find(
      (k) => DEMO_ACCOUNTS[k].email.toLowerCase() === normalizedEmail
    );

    if (matchedDemoKey) {
      // Verify valid demo password
      const validPasswords = ['Password@123', 'Admin@12345', 'Accountant@12345', 'Contact@12345'];
      if (!validPasswords.includes(credentials.password)) {
        setIsLoading(false);
        throw new Error('Invalid email or password.');
      }

      const demoConfig = DEMO_ACCOUNTS[matchedDemoKey];
      const demoUser: AuthUser = {
        id: `usr_demo_${matchedDemoKey.toLowerCase()}`,
        fullName: demoConfig.name,
        email: demoConfig.email,
        role: demoConfig.role,
        contactType: demoConfig.contactType,
        isActive: true,
      };
      saveSession(demoUser, `jwt_demo_token_${Date.now()}`);
      setIsLoading(false);
      return demoUser;
    }

    setIsLoading(false);
    throw new Error('Invalid email or password. Please verify your credentials or register an account.');
  }, []);

  const signup = useCallback(async (data: SignupData): Promise<AuthUser> => {
    setIsLoading(true);
    const normalizedEmail = data.email.trim().toLowerCase();

    let backendReached = false;
    let backendError: string | null = null;

    // 1. Attempt connection to live backend API
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: data.fullName,
          email: normalizedEmail,
          mobileNumber: data.mobileNumber,
          password: data.password,
          confirmPassword: data.confirmPassword,
        }),
      });

      backendReached = true;
      const result = await response.json().catch(() => null);

      if (response.ok && result?.data?.user && result?.data?.token) {
        const apiUser: AuthUser = {
          id: result.data.user.id,
          fullName: result.data.user.name,
          email: result.data.user.email,
          role: 'CONTACT',
          contactType: 'CUSTOMER',
          isActive: true,
        };
        saveSession(apiUser, result.data.token);
        setIsLoading(false);
        return apiUser;
      } else {
        backendError = result?.message || result?.error?.message || `Registration failed (${response.status})`;
      }
    } catch {
      backendReached = false;
    }

    if (backendReached) {
      setIsLoading(false);
      throw new Error(backendError || 'Registration failed.');
    }

    setIsLoading(false);
    throw new Error('Backend server is not reachable. Please start the backend service to register an account.');
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    try {
      localStorage.removeItem(STORAGE_USER_KEY);
      localStorage.removeItem(STORAGE_TOKEN_KEY);
    } catch {
      // ignore
    }
  }, []);

  const loginAsDemo = useCallback(async (roleType: 'ADMIN' | 'ACCOUNTANT' | 'CUSTOMER' | 'VENDOR'): Promise<AuthUser> => {
    const demo = DEMO_ACCOUNTS[roleType];
    return login({
      email: demo.email,
      password: 'Password@123',
    });
  }, [login]);

  const isAdmin = user?.role === 'ADMIN';
  const isAccountant = user?.role === 'ACCOUNTANT';
  const isContact = user?.role === 'CONTACT';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        loginAsDemo,
        isAdmin,
        isAccountant,
        isContact,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
