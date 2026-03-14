"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

import { Card, CardContent,  CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";

import {format} from "date-fns";
import { useRouter } from "next/navigation";
import { LoadingScreen } from "@/components/loading";
import { ErrorState } from "@/components/error-state";
import { SetStateAction, Dispatch } from "react";


interface Props{
    setOpenBuildButton:Dispatch<SetStateAction<boolean>>;
}

export const ProjectCards = ({setOpenBuildButton}:Props)=>{

    const trpc = useTRPC();
    const router = useRouter();

    // TODO: Handle Errors by destructuring the {isError,error} from below query, not here, but in other places
    
    const {data:projects, isPending,isError,error} = useQuery(trpc.project.getMany.queryOptions());


    if(isPending){
        return <LoadingScreen message="Loading Projects..." />
    }

    if(isError){
        return <ErrorState title="Error While Loading Projects" description={error.message} />
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
            {
                projects.length == 0 &&
                <Button onClick={()=>setOpenBuildButton(true)}>
                   <span>    Create Your First Wave </span> <ArrowRightIcon/> 
                </Button>
            }
            </div>

    )
}