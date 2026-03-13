"use client";


import { Suspense, useEffect, useRef } from "react";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";


import { MessageCard } from "./message-card";
import { MessageForm } from "./message-form";
import { Fragment } from "@/prisma/prisma/client";
import { MessageLoading } from "./message-loading";
import { ProjectHeader } from "./project-header";
import { ArrowDownIcon } from "lucide-react";

interface Props{
    projectID:string;
    activeFragment:Fragment | null;
    setActiveFragment:(fragment: Fragment|null)=>void;
}

export const MessageContainer = ({projectID,activeFragment,setActiveFragment}:Props)=>{

    const scroll = useRef<HTMLDivElement|null>(null);

    const lastAssistantMessageIDRef = useRef<string | null>(null);
    const trpc = useTRPC();

    // const { data:messages, isPending } = useSuspenseQuery(trpc.message.getMany.queryOptions({projectId:projectID}));
    const { data:messages } = useSuspenseQuery(trpc.message.getMany.queryOptions({projectId:projectID},{refetchInterval:5000}));
    // It fetches messages for every 5 seconds
    // TODO: This is just temporary, standardize it later



    // const { data:project } = useSuspenseQuery(trpc.project.getOne.queryOptions({projectId:projectID}));

    useEffect(()=>{ 
      const lastAssistantMessage = messages.findLast((message)=>{
        return message.role == "ASSISTANT" && !!message.fragment;
      })

      if(lastAssistantMessage && lastAssistantMessage.id!==lastAssistantMessageIDRef.current){
        setActiveFragment(lastAssistantMessage.fragment);
        lastAssistantMessageIDRef.current = lastAssistantMessage.id;
      }

    },[messages,setActiveFragment]);

    useEffect(()=>{
      scroll.current?.scrollIntoView({behavior:"smooth"});
    },[])


    const lastMessage = messages[messages.length-1];
    const isLastMessageUser = lastMessage?.role == "USER";


    return(
        <div className="flex flex-col flex-1 h-full">
          {/* <header className="bg-orange-500 p-4">
            Project
          </header> */}
          <Suspense>
            <ProjectHeader projectId={projectID} />
          </Suspense>
           <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar">
              <div className="pt-2 pr-1">
                {
                  messages.map((message)=>{
                    return(
                      <MessageCard key={message.id} content={message.content} role={message.role} fragment={message.fragment} createdAt={message.createdAt} isActiveFragment={activeFragment?.id==message.fragment?.id} onFragmentClick={()=>{ setActiveFragment(message.fragment) }} type={message.type} />
                    )
                  })
                }
              </div>
              { isLastMessageUser && <MessageLoading/> }
           <div ref={scroll}> </div>
           </div>
           <div className="relative p-3 pt-1">
                <div className="absolute bg-linear-to-b from transparent to-background/70 h-6 -top-6 left-0 right-0 flex justify-end pr-5 pb-5">
                    <ArrowDownIcon className="z-10 font-extralight opacity-70 text-sm cursor-pointer" onClick={()=>{ scroll.current?.scrollIntoView({behavior:"smooth"}) }} />
                </div> 
                <MessageForm projectId={projectID} />
           </div>
        </div>
    )
}