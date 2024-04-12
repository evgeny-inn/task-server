import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { Request, Response, Router } from 'express';
import { z } from 'zod';

import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { handleServiceResponse, validateRequest } from '@/common/utils/httpHandlers';

import { ContactSchema } from './contactModel';
import { contactService } from './contactService';
import { CreateContactRequest, DeleteContactByIdRequest, UpdateContactByIdRequest } from './inputs';

export const contactsRegistry = new OpenAPIRegistry();
contactsRegistry.register('Contacts', ContactSchema);

export const contactsRouter: Router = (() => {
  const router = express.Router();

  contactsRegistry.registerPath({
    method: 'get',
    path: '/contacts',
    tags: ['Contacts'],
    responses: createApiResponse(z.array(ContactSchema), 'Success'),
  });

  router.get('/', async (_req: Request, res: Response) => {
    const response = await contactService.findAll();

    handleServiceResponse(response, res);
  });

  contactsRegistry.registerPath({
    method: 'post',
    path: '/contacts',
    tags: ['Contacts'],
    request: { body: { content: { 'application/json': { schema: CreateContactRequest.shape.body } } } },
    responses: createApiResponse(ContactSchema, 'Success'),
  });

  router.post('/', validateRequest(CreateContactRequest), async (_req: Request, res: Response) => {
    const response = await contactService.createOne(_req.body);

    handleServiceResponse(response, res);
  });

  contactsRegistry.registerPath({
    method: 'put',
    path: '/contacts/{id}',
    tags: ['Contacts'],
    request: {
      params: UpdateContactByIdRequest.shape.params,
      body: { content: { 'application/json': { schema: UpdateContactByIdRequest.shape.body } } },
    },
    responses: createApiResponse(ContactSchema, 'Success'),
  });

  router.put('/:id', validateRequest(UpdateContactByIdRequest), async (_req: Request, res: Response) => {
    const response = await contactService.updateById({ ..._req.body, id: _req.params.id });

    handleServiceResponse(response, res);
  });

  contactsRegistry.registerPath({
    method: 'delete',
    path: '/contacts/{id}',
    tags: ['Contacts'],
    request: {
      params: UpdateContactByIdRequest.shape.params,
    },
    responses: {},
  });

  router.delete('/:id', validateRequest(DeleteContactByIdRequest), async (_req: Request, res: Response) => {
    const response = await contactService.deleteById(_req.params.id);

    handleServiceResponse(response, res);
  });

  return router;
})();
