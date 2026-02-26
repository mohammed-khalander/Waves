import { ComponentExample } from "@/components/component-example";

import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { ErrorBoundary } from "react-error-boundary";
import { getQueryClient, trpc } from '@/trpc/server';
import { Suspense } from "react";

export default async function Page() {

    const queryClient = getQueryClient();

    void queryClient.prefetchQuery(trpc.getName.queryOptions({name:"Khalander"}));

    return(
        <HydrationBoundary state={dehydrate(queryClient)}>
            <ErrorBoundary fallback={<h1> Something Went Wong </h1>}>
                <Suspense fallback={<h1> Loading the Data..... </h1>}>
                    <ComponentExample />
                </Suspense>
            </ErrorBoundary>
        </HydrationBoundary>
    ) 
}