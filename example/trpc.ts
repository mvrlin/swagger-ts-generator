import { initTRPC, TRPCError } from '@trpc/server';
  import superjson from 'superjson';
  import { Context } from './context';

  const t = initTRPC.context<Context>().create({
    transformer: superjson,
  });

  export const router = t.router;
  export const publicProcedure = t.procedure;

  const isAuthed = t.middleware(({ ctx, next }) => {
    if (!ctx.session?.user) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    return next({
      ctx: {
        ...ctx,
        // Infers that the `session` is non-nullable
        session: { ...ctx.session, user: ctx.session.user },
      },
    });
  });

  export const protectedProcedure = t.procedure.use(isAuthed);