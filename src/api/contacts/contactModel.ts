import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import mongoose from 'mongoose';
import { z } from 'zod';

extendZodWithOpenApi(z);

export type Contact = z.infer<typeof ContactSchema>;
export const ContactSchema = z.object({
  id: z.string(),
  firstname: z.string(),
  lastname: z.string(),
  email: z.string().email(),
});

export const ContactCollectionSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  email: String,
});

export const ContactEntity = mongoose.model('contact', ContactCollectionSchema);
