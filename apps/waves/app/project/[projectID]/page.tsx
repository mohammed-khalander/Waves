

import { ProjectView, ProjectViewError, ProjectViewLoading } from "@/modules/projects/UI/views/project-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface Props{
    params:Promise<{projectID:string}>;
}


const Page = async({params}:Props)=>{

    const { projectID } = await params;
    
    const queryClient = getQueryClient();

    void queryClient.prefetchQuery(trpc.project.getOne.queryOptions({projectId:projectID}));
    void queryClient.prefetchQuery(trpc.message.getMany.queryOptions({projectId:projectID}));

    return(
            <HydrationBoundary state={ dehydrate(queryClient) } >
                <Suspense fallback={ <ProjectViewLoading/> } >
                <ErrorBoundary fallback={ <ProjectViewError/> } >
                    <ProjectView projectID={projectID} />
                </ErrorBoundary>
                </Suspense>
            </HydrationBoundary>
    )

}

export default Page