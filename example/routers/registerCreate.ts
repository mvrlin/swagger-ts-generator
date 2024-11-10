import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';

export const registerCreateRouter = router({
  mutationregister: protectedProcedure
    .input(z.lazy(() => handler.registerRequest))
    .mutation(async ({ input, ctx }) => {
      try {
        const response = await ctx.api.auth.mutationregister({ ...input });
        return response;
      } catch (error) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Error in mutation 'mutationregister': ${error instanceof Error ? error.message : 'Unknown error'}`,
          cause: error,
        });
      }
    })
});