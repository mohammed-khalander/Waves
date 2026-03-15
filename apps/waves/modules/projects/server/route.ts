import { generateSlug } from "random-word-slugs";
import { z } from "zod";



import { createTRPCRouter, baseProcedure, protectedProcedure } from "@/trpc/init";
import prisma from "@/lib/prisma";
import { inngest } from "@/inngest/client";
import { TRPCError } from "@trpc/server";
import { consumeCredits } from "@/lib/usage";


export const projectRouter = createTRPCRouter({
    create:protectedProcedure.input(z.object({userPrompt:z.string().min(1,{message:"Prompt is required"}).max(1000,{message:"Sorry, Prompt can't exceed 1000 characters"})})).mutation(async ({ctx,input})=>{   
        
        try{
            await consumeCredits();
        }catch(error){
            console.log("Error in project creation and in consuming credits ",error);
            if(error instanceof Error){
                throw new TRPCError({code:"BAD_GATEWAY",message:"Something Went Wrong in TRPC Project Creation.. consumeCredits"});
            }
            throw new TRPCError({code:"TOO_MANY_REQUESTS",message:"You ran out of credits"});
        }
        
        const createProject = await prisma.project.create({
            data:{
                name:generateSlug(2,{ format:"kebab" }),
                userId: ctx.auth.userId,
                messages:{
                    create:{
                        content:input.userPrompt,
                        role:"USER",
                        type:"RESULT",
                    }
                }    
            },
        });

        await inngest.send({
            name:"waves/ai-generate",
            data:{
                userPrompt:input.userPrompt,
                projectId:createProject.id,
            }
        })

        return createProject;
    }),
    getMany:protectedProcedure.query(async ({ctx})=>{
        const projects = await prisma.project.findMany({
            where:{
                userId:ctx.auth.userId,
            },
            include:{
                messages:true
            },
            orderBy:{
                createdAt:"desc"
            }
        })
        return projects;
    }),
    getOne:protectedProcedure.input(z.object({projectId:z.string().min(1,{message:"Project ID is Required"})})).query(async ({input,ctx})=>{
        const project = await prisma.project.findUnique({
            where:{
                id:input.projectId,
                userId:ctx.auth.userId,
            },
            include:{
                messages:{
                    include:{
                        fragment:true,
                    }
                },
            }
        })
        if(!project){
            throw new TRPCError({code:"NOT_FOUND",message:"Project Not Found"});
        }
        return project;
     })
})