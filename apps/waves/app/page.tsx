import { ComponentExample } from "@/components/component-example";

import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { ErrorBoundary } from "react-error-boundary";
import { getQueryClient, trpc } from '@/trpc/server';
import { Suspense } from "react";
import HeroSection from "@/modules/home/UI/views/hero-section";
import { DottedGlowBackground } from "@/components/ui/dotted-glow-background";
import { LoadingScreen } from "@/components/loading";

export default async function Page() {

    const queryClient = getQueryClient();

    void queryClient.prefetchQuery(trpc.project.getMany.queryOptions());

    return(
        <HydrationBoundary state={dehydrate(queryClient)}>
            {/* <ErrorBoundary fallback={<h1> Something Went Wong </h1>}> */}
            <ErrorBoundary fallback={ <h1> Something Went Wrong. Please try after few seconds... </h1> } >
                <Suspense fallback={<LoadingScreen message="All Projects Loading..." />}>
                    <div className="relative h-full">
                        <HeroSection />
                        <DottedGlowBackground className="-z-10" />
                    </div>
                </Suspense>
            </ErrorBoundary>
        </HydrationBoundary>
    ) 
}