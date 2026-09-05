import type { Request, Response, NextFunction } from 'express';
import { contactService } from './contact.service.js';
import { sendSuccess } from '../../utils/response.js';
import { ForbiddenError } from '../../utils/errors.js';
import type { CreateContactInput, UpdateContactInput, ListContactsQuery } from './contact.schema.js';

export class ContactController {
  public async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await contactService.listContacts(req.query as unknown as ListContactsQuery);
      sendSuccess(res, 'Contacts retrieved successfully', result);
    } catch (err) {
      next(err);
    }
  }

  public async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const contact = await contactService.getContactById(req.params.id as string);
      if (req.user?.role === 'CONTACT') {
        const matchesUser =
          contact.id === req.user.userId ||
          (contact.email && contact.email.toLowerCase() === req.user.email.toLowerCase());
        if (!matchesUser) {
          throw new ForbiddenError('You are only authorized to access your own contact record');
        }
      }
      sendSuccess(res, 'Contact retrieved successfully', contact);
    } catch (err) {
      next(err);
    }
  }

  public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const contact = await contactService.createContact(req.body as CreateContactInput);
      sendSuccess(res, 'Contact created successfully', contact, 201);
    } catch (err) {
      next(err);
    }
  }

  public async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const contact = await contactService.updateContact(req.params.id as string, req.body as UpdateContactInput);
      sendSuccess(res, 'Contact updated successfully', contact);
    } catch (err) {
      next(err);
    }
  }

  public async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const contact = await contactService.deleteContact(req.params.id as string);
      sendSuccess(res, 'Contact deactivated successfully', contact);
    } catch (err) {
      next(err);
    }
  }
}

export const contactController = new ContactController();
