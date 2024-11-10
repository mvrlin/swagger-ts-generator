import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';

// Schema Definitions
export const vehicleRouter = router({
  createCreate: protectedProcedure
      .input(z.object({}))
      .mutation(async ({ input, ctx }) => {
        try {
          const response = await ctx.api.vehicles.createCreate(input);
          return response;
        } catch (error) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: `Error in mutation 'createCreate': ${error instanceof Error ? error.message : 'Unknown error'}`,
            cause: error,
          });
        }
      }),
});
