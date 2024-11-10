import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';

export const bulkEditUpdateRouter = router({
  mutationbulk_edit: protectedProcedure
    .input(z.lazy(() => data.BulkEditRequest))
    .mutation(async ({ input, ctx }) => {
      try {
        const response = await ctx.api.vehicles.mutationbulk-Edit({ ...input });
        return response;
      } catch (error) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Error in mutation 'mutationbulk_edit': ${error instanceof Error ? error.message : 'Unknown error'}`,
          cause: error,
        });
      }
    })
});