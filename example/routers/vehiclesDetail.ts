import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';

export const vehiclesDetailRouter = router({
  query_id_: publicProcedure
    .input(z.object({}))
    .query(async ({ input, ctx }) => {
      try {
        const response = await ctx.api.vehicles.query{Id}({});
        return response;
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Error in query 'query_id_': ${error instanceof Error ? error.message : 'Unknown error'}`,
          cause: error,
        });
      }
    })
});