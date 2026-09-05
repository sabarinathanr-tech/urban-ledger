import bcrypt from 'bcrypt';
import { prisma, isDatabaseAvailable } from '../../config/db.js';
import { ROLES, CONTACT_TYPES, ERROR_CODES, type Role, type UserStatus, type ContactType } from '../../config/constants.js';
import { ConflictError, NotFoundError, BadRequestError, AppError } from '../../utils/errors.js';
import type { CreateUserInput, ListUsersQuery } from './user.schema.js';
import type { UserResponse } from './user.types.js';
import { memoryUsers } from '../auth/auth.service.js';
import { getPaginationParams, createPaginatedResponse, type PaginatedResult } from '../../utils/pagination.js';
import { logger } from '../../utils/logger.js';

export class UserService {
  private sanitizeUser(user: {
    id: string;
    name: string;
    email: string;
    mobile: string | null;
    role: Role | string;
    isActive?: boolean;
    status?: UserStatus | string;
    contact?: unknown;
    createdAt: Date;
    updatedAt: Date;
  }): UserResponse {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const contactObj = (user as any).contact;
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      role: user.role as Role,
      status: (user.status as UserStatus) || (user.isActive !== false ? 'ACTIVE' : 'INACTIVE'),
      contact: contactObj
        ? {
            ...contactObj,
            status: contactObj.status || (contactObj.isActive !== false ? 'ACTIVE' : 'INACTIVE'),
          }
        : null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  public async createUser(input: CreateUserInput): Promise<UserResponse> {
    const normalizedEmail = input.email.toLowerCase().trim();

    // Check duplicate email
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

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(input.password, saltRounds);
    const mobile = input.mobile && input.mobile.trim() !== '' ? input.mobile.trim() : null;
    const role: Role = input.role || ROLES.CONTACT;
    const isContact = role === ROLES.CONTACT;
    const contactType: ContactType = input.contactType || CONTACT_TYPES.CUSTOMER;

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
            ...(isContact && {
              contact: {
                create: {
                  name: input.name.trim(),
                  email: normalizedEmail,
                  mobile,
                  type: contactType,
                  isActive: true,
                },
              },
            }),
          },
          include: {
            contact: true,
          },
        });

        return this.sanitizeUser(user);
      } catch (error) {
        logger.warn('Prisma createUser failed, falling back to memory store:', error instanceof Error ? error.message : String(error));
        return this.createMemoryUser(input, normalizedEmail, mobile, passwordHash, role, isContact, contactType);
      }
    }

    return this.createMemoryUser(input, normalizedEmail, mobile, passwordHash, role, isContact, contactType);
  }

  private createMemoryUser(
    input: { name: string },
    email: string,
    mobile: string | null,
    passwordHash: string,
    role: Role,
    isContact: boolean,
    contactType: ContactType
  ): UserResponse {
    const newId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const contactId = isContact ? `cnt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}` : undefined;

    const newUser = {
      id: newId,
      name: input.name.trim(),
      email,
      mobile,
      passwordHash,
      role,
      status: 'ACTIVE' as UserStatus,
      contact: isContact
        ? {
            id: contactId!,
            name: input.name.trim(),
            email,
            mobile,
            type: contactType,
            status: 'ACTIVE',
          }
        : null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    memoryUsers.set(newId, newUser);
    return this.sanitizeUser(newUser);
  }

  public async listUsers(query: ListUsersQuery): Promise<PaginatedResult<UserResponse>> {
    const params = getPaginationParams(query.page, query.limit);

    if (isDatabaseAvailable()) {
      try {
        const where: Record<string, unknown> = {};
        if (query.role) {
          where.role = query.role;
        }
        if (query.search) {
          where.OR = [
            { name: { contains: query.search, mode: 'insensitive' } },
            { email: { contains: query.search, mode: 'insensitive' } },
          ];
        }

        const [users, total] = await Promise.all([
          prisma.user.findMany({
            where,
            include: { contact: true },
            skip: params.skip,
            take: params.limit,
            orderBy: { createdAt: 'desc' },
          }),
          prisma.user.count({ where }),
        ]);

        return createPaginatedResponse(
          users.map((u) => this.sanitizeUser(u)),
          total,
          params
        );
      } catch {
        return this.listMemoryUsers(query, params);
      }
    }

    return this.listMemoryUsers(query, params);
  }

  private listMemoryUsers(query: ListUsersQuery, params: ReturnType<typeof getPaginationParams>): PaginatedResult<UserResponse> {
    let filtered = Array.from(memoryUsers.values());

    if (query.role) {
      filtered = filtered.filter((u) => u.role === query.role);
    }
    if (query.search) {
      const s = query.search.toLowerCase();
      filtered = filtered.filter((u) => u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s));
    }

    const total = filtered.length;
    const paginated = filtered.slice(params.skip, params.skip + params.limit);

    return createPaginatedResponse(
      paginated.map((u) => this.sanitizeUser(u)),
      total,
      params
    );
  }
  public async toggleUserStatus(id: string, currentUserId: string): Promise<UserResponse> {
    if (id === currentUserId) {
      throw new BadRequestError('Administrators cannot deactivate their own active account.');
    }

    if (isDatabaseAvailable()) {
      try {
        const user = await prisma.user.findUnique({ where: { id }, include: { contact: true } });
        if (!user) throw new NotFoundError('User not found.');
        const updated = await prisma.user.update({
          where: { id },
          data: { isActive: !user.isActive },
          include: { contact: true },
        });
        return this.sanitizeUser(updated);
      } catch (error) {
        if (error instanceof AppError) throw error;
      }
    }

    const memUser = memoryUsers.get(id);
    if (!memUser) throw new NotFoundError('User not found.');
    memUser.status = memUser.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    memUser.updatedAt = new Date();
    return this.sanitizeUser(memUser);
  }
}

export const userService = new UserService();
