import mongoose from 'mongoose';
import { z } from 'zod';

export const CreateContactRequest = z.object({
  body: z.object({ email: z.string().email(), firstname: z.string(), lastname: z.string() }),
});

export const UpdateContactByIdRequest = z.object({
  body: z.object({ email: z.string().email(), firstname: z.string(), lastname: z.string() }),
  params: z.object({
    id: z.string().refine((val) => {
      return mongoose.Types.ObjectId.isValid(val);
    }),
  }),
});

export const DeleteContactByIdRequest = z.object({
  params: z.object({
    id: z.string().refine((val) => {
      return mongoose.Types.ObjectId.isValid(val);
    }),
  }),
});
