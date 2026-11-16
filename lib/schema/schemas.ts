import { z } from 'zod';

/** Hidden field real people leave empty; bots fill it. */
const honeypot = z.string().max(0).optional();

export const ContactFormSchema = z.object({
  name: z.string().trim().min(1, { message: 'Name is Required' }).max(80, { message: 'Name should be limited to 80 chars' }),
  email: z.string().trim().min(1, { message: 'Email is required' }).email('Invalid email'),
  message: z.string().trim().min(1, { message: 'Message is required' }).max(2000, { message: 'Keep message to 2000 chars' }),
  website: honeypot,
});

export const BOOKING_EVENT_TYPES = [
  'Stand-up set',
  'Corporate show',
  'Hosting / anchoring',
  'Brand collab',
  'Other',
] as const;

export const BookingFormSchema = z.object({
  name: z.string().trim().min(1, { message: 'Name is required' }).max(80, { message: 'Keep it under 80 chars' }),
  email: z.string().trim().min(1, { message: 'Email is required' }).email('Invalid email'),
  phone: z
    .string()
    .trim()
    .max(20, { message: 'Phone looks too long' })
    .regex(/^[+\d\s()-]*$/, { message: 'Digits only, please' })
    .optional(),
  eventType: z.enum(BOOKING_EVENT_TYPES, { message: 'Pick a show type' }),
  date: z.string().trim().max(20).optional(),
  city: z.string().trim().min(1, { message: 'City is required' }).max(60, { message: 'Keep it under 60 chars' }),
  details: z.string().trim().max(1000, { message: 'Keep it to 1000 chars' }).optional(),
  website: honeypot,
});

export type BookingInputs = z.infer<typeof BookingFormSchema>;

export const LoginFormSchema = z.object({
  email: z.string().min(1, { message: 'Email is required' }).email('Invalid email'),
  password: z.string().min(1, { message: 'Password is required' }).max(128, { message: 'Password is too long' }),
});
