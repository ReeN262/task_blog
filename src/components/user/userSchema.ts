import * as z from 'zod';

export const userSchema = z.object({
  name: z.string().min(2, 'minimum 2 length').max(50, 'maximum 50 length'),
  email: z.string().email('invalid email').optional(),
  phone: z.string().nonempty('invalid phone number').optional(),
  password: z.string().min(6, 'minimum 6 length').max(100),
});

