import { StatusCodes } from 'http-status-codes';

import { ResponseStatus, ServiceResponse } from '@/common/models/serviceResponse';
import { logger } from '@/server';

import { Contact } from './contactModel';
import { contactRepository } from './contactRepository';

export const contactService = {
  findAll: async (): Promise<ServiceResponse<Contact[] | null>> => {
    try {
      const contacts = await contactRepository.findAll();

      return new ServiceResponse<Contact[]>(ResponseStatus.Success, 'Contacts found', contacts, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error finding all contacts: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  async createOne(params: Omit<Contact, 'id'>): Promise<ServiceResponse<Contact | null>> {
    try {
      const doesContactExist = await contactRepository.checkIfExistsByEmail(params.email);

      if (doesContactExist) {
        return new ServiceResponse<null>(ResponseStatus.Failed, 'Contact already exists', null, StatusCodes.CONFLICT);
      }

      const contact = await contactRepository.create(params);

      return new ServiceResponse<Contact>(ResponseStatus.Success, 'Contact created', contact, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error creating contact: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  async updateById(params: Contact): Promise<ServiceResponse<Contact | null>> {
    try {
      const contact = await contactRepository.updateById(params);

      if (!contact) {
        return new ServiceResponse<null>(ResponseStatus.Failed, 'Contact not found', null, StatusCodes.NOT_FOUND);
      }

      return new ServiceResponse<Contact>(ResponseStatus.Success, 'Contact updated', contact, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error updating contact: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  async deleteById(id: string): Promise<ServiceResponse<null>> {
    try {
      const doesContactExist = await contactRepository.checkIfExistsById(id);

      if (!doesContactExist) {
        return new ServiceResponse<null>(ResponseStatus.Failed, 'Contact not found', null, StatusCodes.NOT_FOUND);
      }

      await contactRepository.deleteById(id);

      return new ServiceResponse<null>(ResponseStatus.Success, 'Contact deleted', null, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error deleting contact: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
};
