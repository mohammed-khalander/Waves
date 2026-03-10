"use client";

import { Suspense, useState } from "react";


import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"

import { MessageContainer } from "../components/message-container";
import { FragmentWeb } from "../components/fragment-web";
import { Fragment } from "@/prisma/prisma/client";
// import { ProjectHeader } from "../components/project-header";





interface Props{
    projectID: string;
}





export const ProjectView = ({projectID}:Props)=>{

    const [activeFragment,setActiveFragment] = useState<Fragment | null>(null);
    
    return(
        <div className="h-screen w-full">

            <ResizablePanelGroup orientation="horizontal" >

              <ResizablePanel defaultSize={30} minSize={20} className="flex flex-col" > {/** TODO:- add min-h-0 */}
                {/* <ProjectHeader projectId={projectID} /> */}
                <Suspense fallback={<h1> Loading Messages..... </h1>} >
                   <MessageContainer projectID={projectID} activeFragment={activeFragment} setActiveFragment={setActiveFragment} />  
                </Suspense>
              </ResizablePanel>

              <ResizableHandle withHandle />

              <ResizablePanel defaultSize={70} minSize={50}  >
                   { !!activeFragment &&
                    <FragmentWeb projectID={projectID} data={activeFragment} />
                   }
              </ResizablePanel>

            </ResizablePanelGroup>

        </div>
    )
}


export const ProjectViewLoading = ()=>{
    return <h1>Project is Loading...</h1>
}

export const ProjectViewError = ()=>{
    return <h1>Error While Rendering Project</h1>
}