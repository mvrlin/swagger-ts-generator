import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';

export const loginCreateRouter = router({
  mutationlogin: protectedProcedure
    .input(z.lazy(() => handler.loginRequest))
    .mutation(async ({ input, ctx }) => {
      try {
        const response = await ctx.api.auth.mutationlogin({ ...input });
        return response;
      } catch (error) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Error in mutation 'mutationlogin': ${error instanceof Error ? error.message : 'Unknown error'}`,
          cause: error,
        });
      }
    })
});