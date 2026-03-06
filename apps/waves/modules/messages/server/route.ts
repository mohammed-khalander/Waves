import { z } from "zod";

import { createTRPCRouter, baseProcedure } from "@/trpc/init";
import prisma from "@/lib/prisma";
import { inngest } from "@/inngest/client";


export const messageRouter = createTRPCRouter({
    create:baseProcedure.input(z.object({userPrompt:z.string().min(1,{message:"Prompt is required"})})).mutation(async ({ctx,input})=>{
        const createMessage = await prisma.message.create({
            data:{
                content:input.userPrompt,
                role:"USER",
                type:"RESULT"
            }
        });
        await inngest.send({
            name:"waves/ai-generate",
            data:{
                userPrompt:input.userPrompt
            }
        })
        return createMessage;
    }),
    getMany:baseProcedure.query(async ()=>{
        const messages = await prisma.message.findMany({
            include:{
                fragment:false
            },
            orderBy:{
                createdAt:"desc"
            }
        })
        return messages;
    })
})