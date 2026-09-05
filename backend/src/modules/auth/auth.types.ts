import type { Role, UserStatus, ContactType } from '../../config/constants.js';

export interface UserContactInfo {
  id: string;
  name: string;
  email: string | null;
  mobile: string | null;
  type: ContactType;
  status: string;
}

export interface AuthUserResponse {
  id: string;
  name: string;
  email: string;
  mobile: string | null;
  role: Role;
  status: UserStatus;
  contact?: UserContactInfo | null;
  createdAt: Date;
}

export interface AuthSuccessResult {
  user: AuthUserResponse;
  token: string;
}
