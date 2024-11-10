import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';

export const changeCreateRouter = router({
  mutationchange: protectedProcedure
    .input(z.lazy(() => handler.changeRequest))
    .mutation(async ({ input, ctx }) => {
      try {
        const response = await ctx.api.auth.mutationchange({ ...input });
        return response;
      } catch (error) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Error in mutation 'mutationchange': ${error instanceof Error ? error.message : 'Unknown error'}`,
          cause: error,
        });
      }
    })
});