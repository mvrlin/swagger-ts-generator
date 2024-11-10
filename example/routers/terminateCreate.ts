import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';

export const terminateCreateRouter = router({
  mutationterminate: protectedProcedure
    .input(z.array(z.number().int()))
    .mutation(async ({ input, ctx }) => {
      try {
        const response = await ctx.api.auth.mutationterminate({ ...input });
        return response;
      } catch (error) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Error in mutation 'mutationterminate': ${error instanceof Error ? error.message : 'Unknown error'}`,
          cause: error,
        });
      }
    })
});