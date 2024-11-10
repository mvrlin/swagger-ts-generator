import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';

export const treatmentsDetailRouter = router({
  query_treatment_id_: publicProcedure
    .input(z.object({}))
    .query(async ({ input, ctx }) => {
      try {
        const response = await ctx.api.vehicles.query{Treatment_id}({});
        return response;
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Error in query 'query_treatment_id_': ${error instanceof Error ? error.message : 'Unknown error'}`,
          cause: error,
        });
      }
    })
});