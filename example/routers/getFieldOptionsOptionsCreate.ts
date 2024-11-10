import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';

export const getFieldOptionsOptionsCreateRouter = router({
  mutationoptions: protectedProcedure
    .input(z.lazy(() => data.VehicleFilter))
    .mutation(async ({ input, ctx }) => {
      try {
        const response = await ctx.api.vehiclesData.mutationoptions({ ...input });
        return response;
      } catch (error) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Error in mutation 'mutationoptions': ${error instanceof Error ? error.message : 'Unknown error'}`,
          cause: error,
        });
      }
    })
});