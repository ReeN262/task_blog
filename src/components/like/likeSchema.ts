import * as z from 'zod';

export const like = z.object({
  entityId: z.string().min(1, 'invalid entityId'),
  entityType: z.string().min(1, 'invalid entityType'),
});

export const allLikes = z.object({
  entityId: z.string().min(1, 'invalid entityId'),
  entityType: z.string().min(1, 'invalid entityType'),
  skip: z.string().default('0'),
  offset: z.string().default('30'),
});


