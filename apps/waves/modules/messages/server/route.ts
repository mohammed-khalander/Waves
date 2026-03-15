import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import prisma from "@/lib/prisma";
import { inngest } from "@/inngest/client";
import { TRPCError } from "@trpc/server";
import { consumeCredits } from "@/lib/usage";


export const messageRouter = createTRPCRouter({
    create:protectedProcedure.input(z.object({userPrompt:z.string().min(1,{message:"Prompt is required"}).max(1000,"Sorry, Prompt Can't exceed 1000 characters"),projectId:z.string().min(1,{message:"Project Id is Required"})})).mutation(async ({ctx,input})=>{

        const project = await prisma.project.findFirst({
            where:{
                id:input.projectId,
                userId:ctx.auth.userId,
            }
        });

        if(!project){
            throw new TRPCError({code:"NOT_FOUND",message:"Project Not Found"});
        }

        try{
            await consumeCredits();
        }catch(error){
            if(error instanceof Error){
                throw new TRPCError({code:"BAD_GATEWAY",message:"Something Went Wrong in TRPC Project Creation.. consumeCredits"});
            }
            throw new TRPCError({code:"TOO_MANY_REQUESTS",message:"You ran out of credits"});
        }

        const createMessage = await prisma.message.create({
            data:{
                content:input.userPrompt,
                role:"USER",
                type:"RESULT",
                projectId:input.projectId
            }
        });
        await inngest.send({
            name:"waves/ai-generate",
            data:{
                userPrompt:input.userPrompt,
                projectId:input.projectId,
            }
        })
        return createMessage;
    }),
    getMany:protectedProcedure.input(z.object({ projectId:z.string().min(1,{message:"Project ID is required"}) })).query(async ({input,ctx})=>{
        const messages = await prisma.message.findMany({
            where:{
                projectId:input.projectId,
                project:{
                    userId:ctx.auth.userId,
                }
            },
            include:{
                fragment:true,
                project:true,
            },
            orderBy:{
                createdAt:"asc"
            }
        })
        return messages;
    })
})