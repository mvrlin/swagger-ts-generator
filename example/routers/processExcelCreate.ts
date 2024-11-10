import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';

export const processExcelCreateRouter = router({
  mutationprocess_excel: protectedProcedure
    .input(z.object({}))
    .mutation(async ({ input, ctx }) => {
      try {
        const response = await ctx.api.exportExcel.mutationprocess-Excel({ ...input });
        return response;
      } catch (error) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Error in mutation 'mutationprocess_excel': ${error instanceof Error ? error.message : 'Unknown error'}`,
          cause: error,
        });
      }
    })
});