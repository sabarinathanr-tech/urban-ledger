import { prisma, isDatabaseAvailable } from '../../config/db.js';
import { seedContacts } from '../../../prisma/seed-data/contacts.js';
import { NotFoundError } from '../../utils/errors.js';
import type { CreateContactInput, UpdateContactInput, ListContactsQuery } from './contact.schema.js';

export interface ContactRecord {
  id: string;
  name: string;
  type: 'CUSTOMER' | 'VENDOR' | 'BOTH';
  email: string | null;
  mobile: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  profileImage: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const memoryContacts = new Map<string, ContactRecord>();

// Pre-populate memory store with seed contacts
seedContacts.forEach((c) => {
  memoryContacts.set(c.id, {
    id: c.id,
    name: c.name,
    type: c.type,
    email: c.email || null,
    mobile: c.mobile || null,
    city: c.city || null,
    state: c.state || null,
    pincode: c.pincode || null,
    profileImage: c.profileImage || null,
    isActive: true,
    createdAt: new Date('2026-09-01T00:00:00Z'),
    updatedAt: new Date('2026-09-01T00:00:00Z'),
  });
});

export class ContactService {
  public async listContacts(query: ListContactsQuery): Promise<{ items: ContactRecord[]; total: number }> {
    const { page, limit, search, type, isActive } = query;

    if (isDatabaseAvailable()) {
      try {
        const where: any = {};
        if (type) where.type = type;
        if (isActive !== undefined) where.isActive = isActive === 'true';
        if (search) {
          where.OR = [
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
            { mobile: { contains: search, mode: 'insensitive' } },
          ];
        }

        const [items, total] = await Promise.all([
          prisma.contact.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { name: 'asc' },
          }),
          prisma.contact.count({ where }),
        ]);

        return { items: items as unknown as ContactRecord[], total };
      } catch {
        // fall through to memory
      }
    }

    let all = Array.from(memoryContacts.values());
    if (type) all = all.filter((c) => c.type === type || c.type === 'BOTH');
    if (isActive !== undefined) {
      const activeBool = isActive === 'true';
      all = all.filter((c) => c.isActive === activeBool);
    }
    if (search) {
      const s = search.toLowerCase();
      all = all.filter(
        (c) =>
          c.name.toLowerCase().includes(s) ||
          (c.email && c.email.toLowerCase().includes(s)) ||
          (c.mobile && c.mobile.includes(s))
      );
    }

    const total = all.length;
    const start = (page - 1) * limit;
    const items = all.slice(start, start + limit);
    return { items, total };
  }

  public async getContactById(id: string): Promise<ContactRecord> {
    if (isDatabaseAvailable()) {
      try {
        const contact = await prisma.contact.findUnique({ where: { id } });
        if (contact) return contact as unknown as ContactRecord;
      } catch {
        // fall through to memory
      }
    }

    const contact = memoryContacts.get(id);
    if (!contact) {
      throw new NotFoundError('Contact not found');
    }
    return contact;
  }

  public async createContact(input: CreateContactInput): Promise<ContactRecord> {
    const id = `cnt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newContact: ContactRecord = {
      id,
      name: input.name.trim(),
      type: input.type,
      email: input.email ? input.email.trim().toLowerCase() : null,
      mobile: input.mobile ? input.mobile.trim() : null,
      city: input.city ? input.city.trim() : null,
      state: input.state ? input.state.trim() : null,
      pincode: input.pincode ? input.pincode.trim() : null,
      profileImage: input.profileImage || null,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (isDatabaseAvailable()) {
      try {
        const created = await prisma.contact.create({
          data: {
            name: newContact.name,
            type: newContact.type,
            email: newContact.email,
            mobile: newContact.mobile,
            city: newContact.city,
            state: newContact.state,
            pincode: newContact.pincode,
            profileImage: newContact.profileImage,
            isActive: true,
          },
        });
        memoryContacts.set(created.id, created as unknown as ContactRecord);
        return created as unknown as ContactRecord;
      } catch {
        // fall through to memory
      }
    }

    memoryContacts.set(id, newContact);
    return newContact;
  }

  public async updateContact(id: string, input: UpdateContactInput): Promise<ContactRecord> {
    const existing = await this.getContactById(id);

    if (isDatabaseAvailable()) {
      try {
        const updated = await prisma.contact.update({
          where: { id },
          data: {
            ...(input.name !== undefined && { name: input.name.trim() }),
            ...(input.type !== undefined && { type: input.type }),
            ...(input.email !== undefined && { email: input.email ? input.email.trim().toLowerCase() : null }),
            ...(input.mobile !== undefined && { mobile: input.mobile ? input.mobile.trim() : null }),
            ...(input.city !== undefined && { city: input.city ? input.city.trim() : null }),
            ...(input.state !== undefined && { state: input.state ? input.state.trim() : null }),
            ...(input.pincode !== undefined && { pincode: input.pincode ? input.pincode.trim() : null }),
            ...(input.isActive !== undefined && { isActive: input.isActive }),
          },
        });
        memoryContacts.set(id, updated as unknown as ContactRecord);
        return updated as unknown as ContactRecord;
      } catch {
        // fall through to memory
      }
    }

    const updated: ContactRecord = {
      ...existing,
      ...(input.name !== undefined && { name: input.name.trim() }),
      ...(input.type !== undefined && { type: input.type }),
      ...(input.email !== undefined && { email: input.email ? input.email.trim().toLowerCase() : null }),
      ...(input.mobile !== undefined && { mobile: input.mobile ? input.mobile.trim() : null }),
      ...(input.city !== undefined && { city: input.city ? input.city.trim() : null }),
      ...(input.state !== undefined && { state: input.state ? input.state.trim() : null }),
      ...(input.pincode !== undefined && { pincode: input.pincode ? input.pincode.trim() : null }),
      ...(input.isActive !== undefined && { isActive: input.isActive }),
      updatedAt: new Date(),
    };
    memoryContacts.set(id, updated);
    return updated;
  }

  public async deleteContact(id: string): Promise<ContactRecord> {
    return this.updateContact(id, { isActive: false });
  }
}

export const contactService = new ContactService();
export { memoryContacts };
