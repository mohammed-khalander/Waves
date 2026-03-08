"use client";


import { useEffect, useRef } from "react";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";


import { useRouter } from "next/navigation";
import { MessageCard } from "./message-card";
import { MessageForm } from "./message-form";

interface Props{
    projectID:string;
}

export const MessageContainer = ({projectID}:Props)=>{

    const scroll = useRef<HTMLDivElement|null>(null);

    const trpc = useTRPC();
    const router = useRouter();

    const { data:messages, isPending } = useSuspenseQuery(trpc.message.getMany.queryOptions({projectId:projectID}));
    const { data:project } = useSuspenseQuery(trpc.project.getOne.queryOptions({projectId:projectID}));


    useEffect(()=>{
      console.log(scroll.current);
      scroll.current?.scrollIntoView({behavior:"smooth"});
    },[messages])


    return(
        <div className="flex flex-col flex-1 h-full">
          {/* <header className="bg-orange-500 p-4">
            Project
          </header> */}
           <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar">
              <div className="pt-2 pr-1">
                {
                  messages.map((message)=>{
                    return(
                      <MessageCard key={message.id} content={message.content} role={message.role} fragment={message.fragment} createdAt={message.createdAt} isActiveFragment={false} onFragmentClick={()=>{  }} type={message.type} />
                    )
                  })
                }
              </div>
           <div ref={scroll}> </div>
           </div>
           <div className="relative p-3 pt-1">
                <div className="absolute bg-linear-to-b from transparent to-background/70 h-6 -top-6 left-0 right-0 "/> 
                <MessageForm projectId={projectID} />
           </div>
        </div>
    )
}