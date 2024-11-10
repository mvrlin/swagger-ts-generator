import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';

export const treatmentsCreateRouter = router({
  mutationtreatments: protectedProcedure
    .input(z.lazy(() => model.VehicleTreatment))
    .mutation(async ({ input, ctx }) => {
      try {
        const response = await ctx.api.vehicles.mutationtreatments({ ...input });
        return response;
      } catch (error) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Error in mutation 'mutationtreatments': ${error instanceof Error ? error.message : 'Unknown error'}`,
          cause: error,
        });
      }
    })
});