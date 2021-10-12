import * as z from 'zod';

export const commentCreate = z.object({
  post: z.string().nonempty('invalid value'),
  description: z.string().min(1, 'minimum 1 length').max(300, 'maximum 300 length'),
});

export const allPostComments = z.object({
  postId: z.string().nonempty('invalid value'),
  skip: z.string().default('0'),
  offset: z.string().default('30'),
});

export const updateComment = z.object({
  commentId: z.string().nonempty('invalid value'),
  description: z.string().min(1, 'minimum 1 length').max(300, 'maximum 300 length'),
});

export const commentId = z.object({
  id: z.string().nonempty('invalid postId'),
});


