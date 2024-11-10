import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';

export const manufacturersListRouter = router({
  querymanufacturers: publicProcedure
    .input(z.object({}))
    .query(async ({ input, ctx }) => {
      try {
        const response = await ctx.api.manufacturers.querymanufacturers({});
        return response;
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Error in query 'querymanufacturers': ${error instanceof Error ? error.message : 'Unknown error'}`,
          cause: error,
        });
      }
    })
});