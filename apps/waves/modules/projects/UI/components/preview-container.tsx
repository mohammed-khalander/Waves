"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";



interface Props{
    projectID:string;
}

export const PreviewContainer = ({projectID}:Props)=>{

    const trpc = useTRPC();

    const { data:messages } = useSuspenseQuery(trpc.message.getMany.queryOptions({projectId:projectID}));


    return(
        <div className="h-full">
            {
                messages.map((message)=>{
                    if(message.fragment?.sandboxUrl){
                        return(
                            <iframe src={message.fragment.sandboxUrl} className="h-full w-full">
                            {/* <iframe src={"https://aceternity.com"} className="h-full w-full"> */}
                                SandBox URL Dead
                            </iframe>
                        )
                    }
                })
            }
        </div>
    )
}