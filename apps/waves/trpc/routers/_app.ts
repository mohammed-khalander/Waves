import { z } from 'zod';
import { baseProcedure, createTRPCRouter } from '../init';
import { TRPCError } from '@trpc/server';
export const appRouter = createTRPCRouter({
  hello: baseProcedure
    .input(
      z.object({
        text: z.string(),
      }),
    )
    .query((opts) => {
      return {
        greeting: `hello ${opts.input.text}`,
      };
    }), // Testing Route
  getName:baseProcedure.input(z.object({name:z.string()})).query(({input})=>{  
    if(input.name==""){
      throw new TRPCError({code:"UNAUTHORIZED",message:"Name Can't be Empty"});
    } 
    return{
        yourName:`tRPC setUp is proper Mr/Ms ${input.name}, Now you can start calling RPC  `
    }
  })
});
// export type definition of API
export type AppRouter = typeof appRouter;