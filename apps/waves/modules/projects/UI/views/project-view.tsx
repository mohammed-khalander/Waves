"use client";

import { Suspense, useState } from "react";


import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"




import { MessageContainer } from "../components/message-container";
import { FragmentWeb } from "../components/fragment-web";
import { Fragment } from "@/prisma/prisma/client";
// import { ProjectHeader } from "../components/project-header";

import { CodeSquareIcon, CrownIcon, EyeIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileExplorer } from "@/components/code-view/file-explorer";
import { LoadingScreen } from "@/components/loading";
 



interface Props{
  projectID: string;
}





export const ProjectView = ({projectID}:Props)=>{

    const [activeFragment,setActiveFragment] = useState<Fragment | null>(null);

    const [tabState,setTabState] = useState<"preview"|"code">("preview");


    
    return(
        <div className="h-screen w-full">

            <ResizablePanelGroup orientation="horizontal" >

              <ResizablePanel defaultSize={30} minSize={20} className="flex flex-col" >
                {/* <ProjectHeader projectId={projectID} /> */}
                <Suspense fallback={<LoadingScreen message="Messages are Loading..." />} >
                   <MessageContainer projectID={projectID} activeFragment={activeFragment} setActiveFragment={setActiveFragment} />  
                </Suspense>
              </ResizablePanel>

              <ResizableHandle withHandle />

              <ResizablePanel defaultSize={70} minSize={50}  >
                <Tabs defaultValue="preview" value={tabState} onValueChange={(value)=>{ setTabState(value as "preview" | "code") }} className="h-full gap-y-0" >
                    <div className="w-full flex items-center p-2 border-b gap-x-2">
                        <TabsList className="h-8 p-0 border rounded-md">
                            <TabsTrigger value="preview" className="rounded-md">
                                <EyeIcon/> <span>Preview</span>
                            </TabsTrigger>
                            <TabsTrigger value="code" className="rounded-md">
                                <CodeSquareIcon/> <span>Code</span>
                            </TabsTrigger>
                        </TabsList>
                        <div className="ml-auto flex items-center gap-x-2">
                            <Button asChild size="sm" variant="default">
                                <Link href="/pricing" > <CrownIcon/> Upgrade </Link>
                            </Button>
                        </div>
                    </div>
                    <TabsContent value="code" className="overflow-y-scroll">
                      {
                        !!activeFragment?.files && (
                          <FileExplorer files={activeFragment.files as { [path:string]:string } } />
                        )
                      }
                    </TabsContent>
                    <TabsContent value="preview">
                        { !!activeFragment &&
                            <FragmentWeb projectID={projectID} data={activeFragment} />
                        }
                    </TabsContent>
                </Tabs>
                   
              </ResizablePanel>

            </ResizablePanelGroup>

        </div>
    )
}


export const ProjectViewLoading = ()=>{
    return <LoadingScreen message="Project is Loading..." />
}

export const ProjectViewError = ()=>{
    return <h1>Error While Rendering Project</h1>
}



