import type { Role, UserStatus, ContactType } from '../../config/constants.js';

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  mobile: string | null;
  role: Role;
  status: UserStatus;
  contact?: {
    id: string;
    name: string;
    type: ContactType;
    status: string;
  } | null;
  createdAt: Date;
  updatedAt: Date;
}
