import { Fragment } from "@/prisma/prisma/client";
import { MessageRole, MessageType } from "@/prisma/prisma/enums";

interface MessageCardProps{
    content:string;
    role:MessageRole;
    fragment: Fragment | null;
    createdAt:Date;
    isActiveFragment:boolean;
    onFragmentClick:(fragment:Fragment)=>void;
    type:MessageType;
}

export const MessageCard = ({content,role,fragment,createdAt,isActiveFragment,onFragmentClick,type}:MessageCardProps)=>{

    if(role==="ASSISTANT"){
        return (
            <AssistantMessage content={content} fragment={fragment} createdAt={createdAt} isActiveFragment={isActiveFragment} onFragmentClick={onFragmentClick} type={type} />
        )
    }
    return(
        <UserMessage content={content} />
    )
    
} 



import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface UserMessageProps{
    content:string;
}

const UserMessage = ({content}:UserMessageProps)=>{
    return(
        <div className="flex justify-end pb-4 pr-2 pl-10">
            <Card className="rounded-lg bg-muted p-3 shadow-none border-none max-w-[80%] wrap-break-word">
                { content }
            </Card>
        </div>
    )
}





import { format } from "date-fns";
import Image from "next/image";
import { ChevronRightIcon, Code2Icon } from "lucide-react";

interface AssistantMessageProps{
    content:string;
    fragment: Fragment | null;
    createdAt:Date;
    isActiveFragment:boolean;
    onFragmentClick:(fragment:Fragment)=>void;
    type:MessageType;
}


const AssistantMessage = ({content,fragment,createdAt,isActiveFragment,onFragmentClick,type}:AssistantMessageProps)=>{
    return(
        <div className={cn("flex flex-col group px-2 pb-4",type==="ERROR" && "text-red-700 dark:text-red-500" )}>
            <div className="flex items-center gap-2 pl-2 mb-2">
                <Image src="/logo.svg" alt="Waves" width={18} height={18} className="shrink-0" />
                <span className="text-sm font-medium"> Waves </span>
                <span className="text-xs text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 ">
                    {format(createdAt,"HH:mm 'on' MMM dd, yyyy")}
                </span>
            </div>
            <div className="pl-8.5 flex flex-col gap-y-4">
                <span> {content} </span>
                { fragment && type=="RESULT" && (
                        <FragmentCard fragment={fragment} isActiveFragment={isActiveFragment} onFragmentClick={onFragmentClick} />
                    )
                }

            </div>
        </div>
    )
}



/**
 * 'group' classname tailwind (Check for 00_Points.md (Waves-Docs))
 * 'date-fns' 
 *  o/p of 'createdAt' (2026-03-08T14:37:12.582Z) 
 *  o/p of 'Date.now()' [milliseconds since Jan 1, 1970 UTC (Unix epoch)] (o/p:- 1741448005123) (This is equvivalent to new Date().getTime())
 *  o/p of 'new Date()' (2026-03-08T15:02:12.351Z)
 * 'transition-opacity' tailwind class,  'group-hover' tailwind class
 * shrink-0
 * 'transition-colors' tailwind class
 * line-clamp-1  (This limits text to 1 line and truncates overflow.)
 */



interface FragmentCardProps{
    fragment: Fragment | null;
    isActiveFragment:boolean;
    onFragmentClick:(fragment:Fragment)=>void;
}

const FragmentCard = ({fragment,isActiveFragment,onFragmentClick}:FragmentCardProps)=>{
    return(
        <button className={cn("flex items-start text-start gap-2 border rounded-lg bg-muted w-fit p-3 hover:bg-secondary transition-colors", isActiveFragment && "bg-primary text-primary-foreground border-primary hover:bg-primary" )} onClick={()=>{ fragment && onFragmentClick(fragment) }} >            <Code2Icon className="size-4 mt-0.5" /> 
            <div className="flex flex-col flex-1">
                <span className="text-sm font-medium line-clamp-1">
                    {fragment?.title}
                </span>
                <span className="text-sm"> Preview </span>
            </div>
            <div className="flex items-center justify-center mt-0.5">
                <ChevronRightIcon className="size-4"/>
            </div>
        </button>
    )
}