"use client";

import { Suspense } from "react";


import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"

import { MessageContainer } from "../components/message-container";
import { PreviewContainer } from "../components/preview-container";





interface Props{
    projectID: string;
}





export const ProjectView = ({projectID}:Props)=>{
    
    return(
        <div className="h-screen w-full">

            <ResizablePanelGroup orientation="horizontal" >

              <ResizablePanel defaultSize={30} minSize={20} className="flex flex-col" > {/** TODO:- add min-h-0 */}
                <Suspense fallback={<h1> Loading Messages..... </h1>} >
                   <MessageContainer projectID={projectID} />  
                </Suspense>
              </ResizablePanel>

              <ResizableHandle withHandle />

              <ResizablePanel defaultSize={70} minSize={50}  >
                   <PreviewContainer projectID={projectID} />
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