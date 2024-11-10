import { inferAsyncReturnType } from '@trpc/server';
import { CreateNextContextOptions } from '@trpc/server/adapters/next';
import { getSession } from 'next-auth/react';
import { Api } from '../generated/api';

export async function createContext({ req, res }: CreateNextContextOptions) {
  const session = await getSession({ req });
  
  return {
    req,
    res,
    session,
    api: new Api({
      baseUrl: process.env.API_BASE_URL!,
    }),
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;