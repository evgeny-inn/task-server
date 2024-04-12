import { StatusCodes } from 'http-status-codes';
import { Mock } from 'vitest';

import { contactRepository } from '../contactRepository';
import { contactService } from '../contactService';
import { contacts, mockContact1 } from './mock';

vi.mock('@/api/contacts/contactRepository');
vi.mock('@/server', () => ({
  ...vi.importActual('@/server'),
  logger: {
    error: vi.fn(),
  },
}));

describe('userService', () => {
  describe('findAll', () => {
    it('should return contacts', async () => {
      (contactRepository.findAll as Mock).mockReturnValueOnce(contacts);

      const result = await contactService.findAll();

      expect(result.responseObject).toEqual(contacts);
      expect(result.success).toBe(true);
      expect(result.statusCode).toEqual(StatusCodes.OK);
    });
  });

  describe('createOne', () => {
    it('should create one contact', async () => {
      (contactRepository.create as Mock).mockReturnValueOnce(mockContact1);
      (contactRepository.checkIfExistsByEmail as Mock).mockReturnValueOnce(false);

      const result = await contactService.createOne({
        email: mockContact1.email,
        firstname: mockContact1.firstname,
        lastname: mockContact1.firstname,
      });

      expect(result.responseObject).toEqual(mockContact1);
      expect(result.success).toBe(true);
      expect(result.statusCode).toEqual(StatusCodes.OK);
    });

    it('should fail because contact already exists', async () => {
      (contactRepository.checkIfExistsByEmail as Mock).mockReturnValueOnce(true);

      const result = await contactService.createOne({
        email: mockContact1.email,
        firstname: mockContact1.firstname,
        lastname: mockContact1.firstname,
      });

      expect(result.responseObject).toEqual(null);
      expect(result.success).toBe(false);
      expect(result.statusCode).toEqual(StatusCodes.CONFLICT);
    });
  });

  describe('updateById', () => {
    it('should return updated contact', async () => {
      (contactRepository.updateById as Mock).mockReturnValueOnce({ ...mockContact1, email: 'lalallal@llll.com' });

      const result = await contactService.updateById({ ...mockContact1, email: 'lalallal@llll.com' });

      expect(result.responseObject).toEqual({ ...mockContact1, email: 'lalallal@llll.com' });
      expect(result.success).toBe(true);
      expect(result.statusCode).toEqual(StatusCodes.OK);
    });

    it("should fail because contact does't exist", async () => {
      (contactRepository.updateById as Mock).mockReturnValueOnce(null);

      const result = await contactService.updateById({ ...mockContact1, email: 'lalallal@llll.com' });

      expect(result.responseObject).toEqual(null);
      expect(result.success).toBe(false);
      expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
    });
  });

  describe('deleteById', () => {
    it('should delete contact', async () => {
      (contactRepository.checkIfExistsById as Mock).mockReturnValueOnce(true);

      const result = await contactService.deleteById(mockContact1.id);

      expect(result.responseObject).toEqual(null);
      expect(result.success).toBe(true);
      expect(result.statusCode).toEqual(StatusCodes.OK);
    });

    it("should fail because contact does't exist", async () => {
      (contactRepository.checkIfExistsById as Mock).mockReturnValueOnce(false);

      const result = await contactService.deleteById(mockContact1.id);

      expect(result.responseObject).toEqual(null);
      expect(result.success).toBe(false);
      expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
    });
  });
});
