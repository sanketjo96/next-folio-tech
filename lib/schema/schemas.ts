import { z } from 'zod';

export const ContactFormSchema = z.object({
  name: z.string().min(1, { message: 'Name is Required' }).max(10, { message: 'Name should be limited to 10 chars' }),
  email: z.string().min(1, { message: 'Email is required' }).email('Invalid email'),
  message: z.string().min(1, { message: 'Message is required' }).max(256, { message: 'Keep message to 256 chars' }),
});