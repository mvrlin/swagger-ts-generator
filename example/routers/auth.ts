import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';

// Schema Definitions
export const authRouter = router({
  terminateAllCreate: protectedProcedure
      .input(z.object({}))
      .mutation(async ({ input, ctx }) => {
        try {
          const response = await ctx.api.auth.terminateAllCreate(input);
          return response;
        } catch (error) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: `Error in mutation 'terminateAllCreate': ${error instanceof Error ? error.message : 'Unknown error'}`,
            cause: error,
          });
        }
      }),
});
