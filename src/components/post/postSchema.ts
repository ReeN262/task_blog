import * as z from 'zod';

export const postCreate = z.object({
  title: z.string().min(1, 'minimum 1 length').max(200, 'maximum 200 length'),
  description: z.string().min(1, 'minimum 1 length').max(2000, 'maximum 2000 length'),
});

export const allUserPost = z.object({
  userId: z.string().nonempty('invalid userId'),
  skip: z.string().default('0'),
  offset: z.string().default('30'),
});

export const allPost = z.object({
  skip: z.string().default('0'),
  offset: z.string().default('30'),
});

export const update = z.object({
  title: z.string().min(1, 'minimum 1 length').max(200, 'maximum 200 length').optional(),
  description: z.string().min(1, 'minimum 1 length').max(2000, 'maximum 2000 length').optional(),
});

export const postId = z.object({
  id: z.string().nonempty('invalid postId'),
});


