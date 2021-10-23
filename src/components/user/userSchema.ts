import * as z from 'zod';

export const userSignUpSchema = z.object({
  name: z.string().min(2, 'minimum 2 length').max(50, 'maximum 50 length'),
  email: z.string()
      .email('invalid email')
      .optional(),
  phone: z.string()
      .regex(/^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\\s./0-9]*$/g, 'invalid phone number')
      .min(7)
      .optional(),
  password: z.string()
      .min(6, 'minimum 6 length')
      .max(100)
      .regex(/(\d{1})([A-Za-zА-Яа-я]{5,})/g, 'at least 5 different letters and at least one number'),
});

export const userSignInSchema = z.object({
  login: z.string().nonempty('invalid login').max(50, 'maximum 50 length'),
  password: z.string().min(6, 'minimum 6 length').max(100),
});

