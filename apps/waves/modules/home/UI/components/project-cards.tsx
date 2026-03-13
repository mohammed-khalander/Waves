"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";

import {format} from "date-fns";
import { useRouter } from "next/navigation";


export const ProjectCards = ()=>{

    const trpc = useTRPC();
    const router = useRouter();
    
    const {data:projects} = useSuspenseQuery(trpc.project.getMany.queryOptions());



    return(
            
            <div className="flex flex-wrap justify-center items-center gap-4 ">
            {
                projects.map((project)=>{
                    return(
                        <Card key={project.id} className='group relative flex flex-col gap-2 overflow-hidden pt-0 min-w-72.5'>
                            <CardHeader className='flex-1 pt-4'>
                                <CardTitle className='text-xl font-semibold text-balance'>{project.name}</CardTitle>
                            </CardHeader>
                            <CardContent className='flex-col items-start space-y-4 pt-4'>
                                <div className="w-full flex justify-end"> Created:    {format(new Date(project.createdAt),"dd MMM yyyy")} </div>
                                <Button variant="outline" className='hover:bg-primary hover:text-primary-foreground w-full cursor-pointer' onClick={()=>router.push(`/project/${project.id}`)} >
                                <span>View Project</span> <ArrowRightIcon/>
                                </Button>
                            </CardContent>
                        </Card>
                    )
                })
            }
            </div>

    )
}