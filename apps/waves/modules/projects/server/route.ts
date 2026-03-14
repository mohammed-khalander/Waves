import { generateSlug } from "random-word-slugs";
import { z } from "zod";



import { createTRPCRouter, baseProcedure, protectedProcedure } from "@/trpc/init";
import prisma from "@/lib/prisma";
import { inngest } from "@/inngest/client";
import { TRPCError } from "@trpc/server";


export const projectRouter = createTRPCRouter({
    create:protectedProcedure.input(z.object({userPrompt:z.string().min(1,{message:"Prompt is required"}).max(1000,{message:"Sorry, Prompt Can't excceed 1000 characters"})})).mutation(async ({ctx,input})=>{
        const createProject = await prisma.project.create({
            data:{
                name:generateSlug(2,{ format:"kebab" }),
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
    getMany:protectedProcedure.query(async ()=>{
        const projects = await prisma.project.findMany({
            include:{
                messages:true
            },
            orderBy:{
                createdAt:"desc"
            }
        })
        return projects;
    }),
    getOne:protectedProcedure.input(z.object({projectId:z.string().min(1,{message:"Project ID is Required"})})).query(async ({input})=>{
        const project = await prisma.project.findUnique({
            where:{
                id:input.projectId
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