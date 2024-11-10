import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';

// Schema Definitions
export const vehiclesRouter = router({
  vehiclesDelete: protectedProcedure
      .input(z.object({}))
      .mutation(async ({ input, ctx }) => {
        try {
          const response = await ctx.api.vehicles.vehiclesDelete(input);
          return response;
        } catch (error) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: `Error in mutation 'vehiclesDelete': ${error instanceof Error ? error.message : 'Unknown error'}`,
            cause: error,
          });
        }
      }),
});
