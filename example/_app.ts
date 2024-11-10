import { router } from '../trpc';
  import { temp-apiRouter } from './temp-api';

  export const appRouter = router({
    temp-api: temp-apiRouter,
  });

  export type AppRouter = typeof appRouter;