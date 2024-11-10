import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';

export const categoriesUpdateRouter = router({
  mutation_id_: protectedProcedure
    .input(z.lazy(() => model.Category))
    .mutation(async ({ input, ctx }) => {
      try {
        const response = await ctx.api.categories.mutation{Id}({ ...input });
        return response;
      } catch (error) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Error in mutation 'mutation_id_': ${error instanceof Error ? error.message : 'Unknown error'}`,
          cause: error,
        });
      }
    })
});