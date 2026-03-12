import { ComponentExample } from "@/components/component-example";

import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { ErrorBoundary } from "react-error-boundary";
import { getQueryClient, trpc } from '@/trpc/server';
import { Suspense } from "react";
import { TRPCErrorFallback } from "./Error-Boundary-Trpc";
import HeroSection from "@/modules/home/UI/views/hero-section";
import { DottedGlowBackground } from "@/components/ui/dotted-glow-background";

export default async function Page() {

    const queryClient = getQueryClient();

    void queryClient.prefetchQuery(trpc.project.getMany.queryOptions());

    return(
        <HydrationBoundary state={dehydrate(queryClient)}>
            {/* <ErrorBoundary fallback={<h1> Something Went Wong </h1>}> */}
            <ErrorBoundary FallbackComponent={TRPCErrorFallback}>
                <Suspense fallback={<h1> Loading the Projects..... </h1>}>
                    <div className="relative h-full">
                        <HeroSection />
                        <DottedGlowBackground className="-z-10" />
                    </div>
                </Suspense>
            </ErrorBoundary>
        </HydrationBoundary>
    ) 
}