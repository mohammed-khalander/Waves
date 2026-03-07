"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import Link from "next/link";


import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";


import { useRouter } from "next/navigation";


interface Props{
    projectID:string;
}

export const MessageContainer = ({projectID}:Props)=>{

    const trpc = useTRPC();
    const router = useRouter();

    const { data:messages, isPending } = useSuspenseQuery(trpc.message.getMany.queryOptions({projectId:projectID}));
    const { data:project } = useSuspenseQuery(trpc.project.getOne.queryOptions({projectId:projectID}));


    return(
        <div className="flex flex-col flex-1 ">
              <div className="flex flex-col h-full">
                    <header className="flex items-center justify-between px-4 py-2 border-b">
                      <h1 className="text-lg font-semibold capitalize">{project.name}</h1>
                      <Button variant="outline" size="sm" onClick={()=>router.push("/")} >
                        All Projects
                      </Button>
                    </header>
                    <main className="flex-1 overflow-y-auto p-4 space-y-4">
                      {
                       !isPending &&
                           messages.map((message)=>{
                               return(
                                <>
                                   {
                                    message.role==="ASSISTANT"?
                                    <div key={message.id}  className="flex flex-col gap-2" >
                                    <div className="flex items-start space-x-2">
                                      <Avatar>
                                        <AvatarImage src="/placeholder-user.jpg" alt="User Avatar" />
                                        <AvatarFallback>A</AvatarFallback>
                                      </Avatar>
                                      <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                                        <p className="text-sm">{message.content}</p>
                                      </div>
                                    </div>
                                    {
                                        message.fragment &&

                                    <div className="flex items-start space-x-2" key={message.id} >
                                      <Avatar>
                                        <AvatarImage src="/placeholder-user.jpg" alt="User Avatar" />
                                        <AvatarFallback>A</AvatarFallback>
                                      </Avatar>
                                      <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                                        <p className="text-sm"><Link href={message.fragment.sandboxUrl} className="text-red-500" > Website </Link></p>
                                      </div>
                                    </div>
                                    }
                                    </div>
                                    :
                                    <div className="flex items-end justify-end space-x-2" key={message.id} >
                                      <div className="p-2 rounded-lg bg-blue-500 text-white">
                                        <p className="text-sm">{message.content}</p>
                                      </div>
                                      <Avatar>
                                        <AvatarImage src="/placeholder-user.jpg" alt="User Avatar" />
                                        <AvatarFallback>U</AvatarFallback>
                                      </Avatar>
                                    </div>
                                }
                                </>
                               )
                           })
                       } 
                    </main>

                    <footer className="flex items-center space-x-2 p-2 border-t">
                      <Input className="flex-1" placeholder="Type a message" />
                      <Button variant="outline" size="sm">
                        Send
                      </Button>
                    </footer>

                </div>
        </div>
    )
}