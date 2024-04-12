import express from 'express';
import { StatusCodes } from 'http-status-codes';
import request from 'supertest';
import { Mock } from 'vitest';

import { ResponseStatus, ServiceResponse } from '@/common/models/serviceResponse';
import { launch } from '@/server';

import { contactService } from '../contactService';
import { contacts, mockContact1 } from './mock';

vi.mock('@/common/db/db', () => ({ default: { connect: vi.fn() } }));
vi.mock('@/api/contacts/contactService');

describe('Contacts API', () => {
  let app: express.Express;

  beforeAll(async () => {
    app = await launch();
  });

  describe('GET /contacts', () => {
    it('should return contacts', async () => {
      const serviceResponse = new ServiceResponse(ResponseStatus.Success, 'Contacts found', contacts, StatusCodes.OK);

      (contactService.findAll as Mock).mockReturnValueOnce(serviceResponse);

      const response = await request(app).get('/contacts');

      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.body).toEqual(serviceResponse);
    });
  });

  describe('POST /contacts', () => {
    it('should create contact', async () => {
      const serviceResponse = new ServiceResponse(
        ResponseStatus.Success,
        'Contact created',
        mockContact1,
        StatusCodes.OK
      );

      (contactService.createOne as Mock).mockReturnValueOnce(serviceResponse);

      const response = await request(app)
        .post('/contacts')
        .send({ ...mockContact1 })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json');

      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.body).toEqual(serviceResponse);
    });

    it('should not pass validation (payload required)', async () => {
      const response = await request(app)
        .post('/contacts')
        .send({})
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json');

      expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    });
  });

  describe('PUT /contacts/:id', () => {
    it('should update contact', async () => {
      const serviceResponse = new ServiceResponse(
        ResponseStatus.Success,
        'Contact updated',
        mockContact1,
        StatusCodes.OK
      );

      (contactService.updateById as Mock).mockReturnValueOnce(serviceResponse);

      const response = await request(app)
        .put(`/contacts/${mockContact1.id}`)
        .send({ ...mockContact1 })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json');

      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.body).toEqual(serviceResponse);
    });

    it('should not pass validation (id is not oid)', async () => {
      const response = await request(app)
        .put(`/contacts/${888}`)
        .send({ ...mockContact1 })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json');

      expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    });
  });

  describe('DELETE /contacts/:id', () => {
    it('should delete contact', async () => {
      const serviceResponse = new ServiceResponse(ResponseStatus.Success, 'Contact deleted', null, StatusCodes.OK);

      (contactService.deleteById as Mock).mockReturnValueOnce(serviceResponse);

      const response = await request(app).delete(`/contacts/${mockContact1.id}`);

      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.body).toEqual(serviceResponse);
    });

    it('should not pass validation (id is not oid)', async () => {
      const response = await request(app).put(`/contacts/${888}`);

      expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    });
  });
});
