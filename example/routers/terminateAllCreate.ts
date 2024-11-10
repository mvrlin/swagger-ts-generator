import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';

export const terminateAllCreateRouter = router({
  mutationall: protectedProcedure
    .input(z.object({}))
    .mutation(async ({ input, ctx }) => {
      try {
        const response = await ctx.api.auth.mutationall({ ...input });
        return response;
      } catch (error) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Error in mutation 'mutationall': ${error instanceof Error ? error.message : 'Unknown error'}`,
          cause: error,
        });
      }
    })
});