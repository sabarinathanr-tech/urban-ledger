import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma, isDatabaseAvailable } from '../../config/db.js';
import { env } from '../../config/env.js';
import { ROLES, CONTACT_TYPES, ERROR_CODES, type Role, type UserStatus } from '../../config/constants.js';
import { ConflictError, UnauthorizedError, NotFoundError, ForbiddenError } from '../../utils/errors.js';
import type { SignupInput, LoginInput } from './auth.schema.js';
import type { AuthSuccessResult, AuthUserResponse } from './auth.types.js';
import type { AuthUserPayload } from '../../middleware/auth.middleware.js';
import { logger } from '../../utils/logger.js';

// Resilient in-memory store for development/testing when PostgreSQL tables are not yet migrated
interface MemoryUser {
  id: string;
  name: string;
  email: string;
  mobile: string | null;
  passwordHash: string;
  role: Role;
  status: UserStatus;
  contact?: {
    id: string;
    name: string;
    email: string | null;
    mobile: string | null;
    type: 'CUSTOMER' | 'VENDOR' | 'BOTH';
    status: string;
  } | null;
  createdAt: Date;
  updatedAt: Date;
}

const memoryUsers = new Map<string, MemoryUser>();

export class AuthService {
  private generateToken(payload: AuthUserPayload): string {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (jwt.sign as any)(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN,
    });
  }

  private sanitizeUser(user: MemoryUser | {
    id: string;
    name: string;
    email: string;
    mobile: string | null;
    role: Role;
    status: UserStatus;
    contact?: unknown;
    createdAt: Date;
  }): AuthUserResponse {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      role: user.role as Role,
      status: user.status as UserStatus,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      contact: (user as any).contact || null,
      createdAt: user.createdAt,
    };
  }

  public async signup(input: SignupInput): Promise<AuthSuccessResult> {
    const normalizedEmail = input.email.toLowerCase().trim();

    // Check duplicate in DB or memory
    let existingUser = null;
    if (isDatabaseAvailable()) {
      try {
        existingUser = await prisma.user.findUnique({
          where: { email: normalizedEmail },
        });
      } catch {
        existingUser = Array.from(memoryUsers.values()).find((u) => u.email === normalizedEmail) || null;
      }
    } else {
      existingUser = Array.from(memoryUsers.values()).find((u) => u.email === normalizedEmail) || null;
    }

    if (existingUser) {
      throw new ConflictError('An account with this email already exists.', ERROR_CODES.USER_EXISTS);
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(input.password, saltRounds);

    // Public signup is strictly assigned the CONTACT role
    const role: Role = ROLES.CONTACT;
    const mobile = input.mobile && input.mobile.trim() !== '' ? input.mobile.trim() : null;

    let createdUser: MemoryUser;

    if (isDatabaseAvailable()) {
      try {
        const user = await prisma.user.create({
          data: {
            name: input.name.trim(),
            email: normalizedEmail,
            mobile,
            passwordHash,
            role,
            isActive: true,
            contact: {
              create: {
                name: input.name.trim(),
                email: normalizedEmail,
                mobile,
                type: CONTACT_TYPES.CUSTOMER,
                isActive: true,
              },
            },
          },
          include: {
            contact: true,
          },
        });

        createdUser = {
          id: user.id,
          name: user.name,
          email: user.email,
          mobile: user.mobile,
          passwordHash: user.passwordHash,
          role: user.role as Role,
          status: user.isActive ? 'ACTIVE' : 'INACTIVE',
          contact: user.contact
            ? {
                id: user.contact.id,
                name: user.contact.name,
                email: user.contact.email,
                mobile: user.contact.mobile,
                type: user.contact.type,
                status: user.contact.isActive ? 'ACTIVE' : 'INACTIVE',
              }
            : null,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        };
      } catch (dbError) {
        logger.warn('Prisma create failed, falling back to memory store:', dbError instanceof Error ? dbError.message : String(dbError));
        createdUser = this.createMemoryUser(input, normalizedEmail, mobile, passwordHash, role);
      }
    } else {
      createdUser = this.createMemoryUser(input, normalizedEmail, mobile, passwordHash, role);
    }

    const token = this.generateToken({
      userId: createdUser.id,
      email: createdUser.email,
      role: createdUser.role,
      name: createdUser.name,
    });

    return {
      user: this.sanitizeUser(createdUser),
      token,
    };
  }

  private createMemoryUser(
    input: { name: string },
    email: string,
    mobile: string | null,
    passwordHash: string,
    role: Role
  ): MemoryUser {
    const newId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const contactId = `cnt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const user: MemoryUser = {
      id: newId,
      name: input.name.trim(),
      email,
      mobile,
      passwordHash,
      role,
      status: 'ACTIVE',
      contact: {
        id: contactId,
        name: input.name.trim(),
        email,
        mobile,
        type: CONTACT_TYPES.CUSTOMER,
        status: 'ACTIVE',
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    memoryUsers.set(newId, user);
    return user;
  }

  public async login(input: LoginInput): Promise<AuthSuccessResult> {
    const normalizedEmail = input.email.toLowerCase().trim();
    let user: MemoryUser | null = null;

    if (isDatabaseAvailable()) {
      try {
        const dbUser = await prisma.user.findUnique({
          where: { email: normalizedEmail },
          include: { contact: true },
        });

        if (dbUser) {
          user = {
            id: dbUser.id,
            name: dbUser.name,
            email: dbUser.email,
            mobile: dbUser.mobile,
            passwordHash: dbUser.passwordHash,
            role: dbUser.role as Role,
            status: dbUser.isActive ? 'ACTIVE' : 'INACTIVE',
            contact: dbUser.contact
              ? {
                  id: dbUser.contact.id,
                  name: dbUser.contact.name,
                  email: dbUser.contact.email,
                  mobile: dbUser.contact.mobile,
                  type: dbUser.contact.type,
                  status: dbUser.contact.isActive ? 'ACTIVE' : 'INACTIVE',
                }
              : null,
            createdAt: dbUser.createdAt,
            updatedAt: dbUser.updatedAt,
          };
        }
      } catch {
        user = Array.from(memoryUsers.values()).find((u) => u.email === normalizedEmail) || null;
      }
    } else {
      user = Array.from(memoryUsers.values()).find((u) => u.email === normalizedEmail) || null;
    }

    if (!user) {
      user = Array.from(memoryUsers.values()).find((u) => u.email === normalizedEmail) || null;
    }

    if (!user) {
      throw new UnauthorizedError('Invalid email or password.', ERROR_CODES.INVALID_CREDENTIALS);
    }

    const isMatch = await bcrypt.compare(input.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid email or password.', ERROR_CODES.INVALID_CREDENTIALS);
    }

    if (user.status !== 'ACTIVE') {
      throw new ForbiddenError(
        'Account is inactive. Please contact your system administrator.',
        ERROR_CODES.ACCOUNT_INACTIVE
      );
    }

    const token = this.generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    return {
      user: this.sanitizeUser(user),
      token,
    };
  }

  public async getCurrentUser(userId: string): Promise<AuthUserResponse> {
    let user: MemoryUser | null = null;

    if (isDatabaseAvailable()) {
      try {
        const dbUser = await prisma.user.findUnique({
          where: { id: userId },
          include: { contact: true },
        });

        if (dbUser) {
          user = {
            id: dbUser.id,
            name: dbUser.name,
            email: dbUser.email,
            mobile: dbUser.mobile,
            passwordHash: dbUser.passwordHash,
            role: dbUser.role as Role,
            status: dbUser.isActive ? 'ACTIVE' : 'INACTIVE',
            contact: dbUser.contact
              ? {
                  id: dbUser.contact.id,
                  name: dbUser.contact.name,
                  email: dbUser.contact.email,
                  mobile: dbUser.contact.mobile,
                  type: dbUser.contact.type,
                  status: dbUser.contact.isActive ? 'ACTIVE' : 'INACTIVE',
                }
              : null,
            createdAt: dbUser.createdAt,
            updatedAt: dbUser.updatedAt,
          };
        }
      } catch {
        user = memoryUsers.get(userId) || null;
      }
    } else {
      user = memoryUsers.get(userId) || null;
    }

    if (!user) {
      user = memoryUsers.get(userId) || null;
    }

    if (!user) {
      throw new NotFoundError('User not found.', ERROR_CODES.NOT_FOUND);
    }

    return this.sanitizeUser(user);
  }
}

export const authService = new AuthService();
export { memoryUsers };
