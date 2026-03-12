import { ComponentExample } from "@/components/component-example";

import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { ErrorBoundary } from "react-error-boundary";
import { getQueryClient, trpc } from '@/trpc/server';
import { Suspense } from "react";
import { TRPCErrorFallback } from "./Error-Boundary-Trpc";
import HeroSection from "@/modules/home/UI/views/hero-section";
import { Particles } from "@/components/Particles";

export default async function Page() {

    const queryClient = getQueryClient();

    void queryClient.prefetchQuery(trpc.getName.queryOptions({name:"Khalander"}));

    return(
        <HydrationBoundary state={dehydrate(queryClient)}>
            {/* <ErrorBoundary fallback={<h1> Something Went Wong </h1>}> */}
            <ErrorBoundary FallbackComponent={TRPCErrorFallback}>
                <Suspense fallback={<h1> Loading the Data..... </h1>}>
                    <HeroSection />
                </Suspense>
            </ErrorBoundary>
        </HydrationBoundary>
    ) 
}