import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';

export const categoriesListRouter = router({
  querycategories: publicProcedure
    .input(z.object({}))
    .query(async ({ input, ctx }) => {
      try {
        const response = await ctx.api.categories.querycategories({});
        return response;
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Error in query 'querycategories': ${error instanceof Error ? error.message : 'Unknown error'}`,
          cause: error,
        });
      }
    })
});