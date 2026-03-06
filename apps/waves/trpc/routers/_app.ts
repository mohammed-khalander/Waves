import { z } from 'zod';
import { baseProcedure, createTRPCRouter } from '../init';
import { TRPCError } from '@trpc/server';
import { inngest } from '@/inngest/client';
import { messageRouter } from '@/modules/messages/server/route';
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
    }),
    
  // Testing tRPC Route
  getName:baseProcedure.input(z.object({name:z.string()})).query(({input})=>{  
    if(input.name==""){
      throw new TRPCError({code:"UNAUTHORIZED",message:"Name Can't be Empty"});
    } 
    return{
        yourName:`tRPC setUp is proper Mr/Ms ${input.name}, Now you can start calling RPC  `
    }
  }), 
  
  // Testing Inngest
  invokeInngest:baseProcedure.input(z.object({ video: z.string() })).mutation(async({input})=>{
    await inngest.send({
      name:"test/hello.world",
      data:{
        video:input.video
      }
    })
    return { message:"Inngest BG Job Triggered" }
  }), 
  
  // Testing Inngest Agent Kit
  generate:baseProcedure.input(z.object({userQuery:z.string()})).mutation(async({input})=>{

     await inngest.send({
      name:"waves/ai-generate",
      data:{
        userQuery:input.userQuery,
      }
     })

     return {message:"Inngest BG JOb Triggered, In a while the Component will be created"}

  }),

  // Our Main Routers

  message:messageRouter,
  


});
// export type definition of API
export type AppRouter = typeof appRouter;