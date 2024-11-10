import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';

export const categoriesCreateRouter = router({
  mutationcategories: protectedProcedure
    .input(z.lazy(() => model.Category))
    .mutation(async ({ input, ctx }) => {
      try {
        const response = await ctx.api.categories.mutationcategories({ ...input });
        return response;
      } catch (error) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Error in mutation 'mutationcategories': ${error instanceof Error ? error.message : 'Unknown error'}`,
          cause: error,
        });
      }
    })
});