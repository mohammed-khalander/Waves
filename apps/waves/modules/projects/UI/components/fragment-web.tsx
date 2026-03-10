"use client";

import { Fragment } from "@/prisma/prisma/client";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";


import { useState } from "react";
import { ExternalLinkIcon, RefreshCcwIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Hint } from "@/components/hint";
import { toast } from "sonner";


interface Props{
    projectID:string;
    data:Fragment;
}

export const FragmentWeb = ({projectID,data}:Props)=>{

    const [fragmentKey,setFragmentKey] = useState(0);
    const [copied,setCopied] = useState(false);

    const onRefresh = ()=>{
        setFragmentKey((prev)=> prev+1); 
    }

    const handleCopy = ()=>{
        navigator.clipboard.writeText(data.sandboxUrl).then(()=>{
            setCopied(true);
            setTimeout(()=>{
                setCopied(false);
                toast.success("URL Copied Successfully");
            },2000);
        }).catch((error)=>{
            toast.error(`Failed to copy ${error}`);
        });
    }
    
    


    return(
        <div className=" flex flex-col w-full h-full">
            <div className="p-2 border-b bg-sidebar flex items-center gap-x-2">
                <Hint text="Refresh" side="bottom" align="start">
                    <Button size="sm" variant="outline" onClick={()=>{ onRefresh() }} >
                        <RefreshCcwIcon/>
                    </Button>
                </Hint>
                <Hint text="Click to copy" side="bottom" >
                    <Button size="sm" variant="outline" onClick={()=>{ handleCopy() }} disabled={!data.sandboxUrl || copied}>
                        <span className="truncate"> {data.sandboxUrl} </span>
                    </Button>
                </Hint>
                <div className="flex-1"></div>
                <Hint text="Open in a new tab" side="bottom" align="start">
                    <Button size="sm" disabled={!data.sandboxUrl} onClick={()=>{ if(!data.sandboxUrl)return; window.open(data.sandboxUrl,"_blank"); }} >
                        <ExternalLinkIcon/>
                    </Button>
                </Hint>
            </div>
            <iframe key={fragmentKey} className="h-full w-full" sandbox="allow-forms allow-scripts allow-same-origin" loading="lazy" src={data.sandboxUrl} />                        

        </div>
    )
}
