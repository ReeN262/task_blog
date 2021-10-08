import * as z from 'zod';

export const postSchema = z.object({
  title: z.string().min(1, 'minimum 1 length').max(200, 'maximum 200 length'),
  description: z.string().min(1, 'minimum 1 length').max(2000, 'maximum 2000 length'),
});

