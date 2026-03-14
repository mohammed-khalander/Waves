"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

import { Card, CardContent,  CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";

import {format} from "date-fns";
import { useRouter } from "next/navigation";
import { LoadingScreen } from "@/components/loading";


export const ProjectCards = ()=>{

    const trpc = useTRPC();
    const router = useRouter();

    // TODO: Handle Errors by destructuring the {isError,error} from below query
    // And build UI for Error state
    
    const {data:projects, isPending} = useQuery(trpc.project.getMany.queryOptions());


    if(isPending){
        return <LoadingScreen message="Loading Projects..." />
    }


    return(
            
            <div className="flex flex-wrap justify-center items-center gap-4 ">
            {
                (projects || []).map((project)=>{
                    return(
                        <Card key={project.id} className='group relative flex flex-col gap-2 overflow-hidden pt-0 min-w-72.5'>
                            <CardHeader className='flex-1 pt-4'>
                                <CardTitle className='text-xl font-semibold text-balance capitalize'>{project.name}</CardTitle>
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