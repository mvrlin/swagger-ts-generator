import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';

export const loginVerifyCreateRouter = router({
  mutationverify: protectedProcedure
    .input(z.lazy(() => model.TwoFaEntity))
    .mutation(async ({ input, ctx }) => {
      try {
        const response = await ctx.api.auth.mutationverify({ ...input });
        return response;
      } catch (error) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Error in mutation 'mutationverify': ${error instanceof Error ? error.message : 'Unknown error'}`,
          cause: error,
        });
      }
    })
});