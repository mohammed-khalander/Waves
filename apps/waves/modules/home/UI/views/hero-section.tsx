"use client";

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TextEffect } from '@/components/ui/text-effect'
import { AnimatedGroup } from '@/components/ui/animated-group'
import { HeroHeader } from '../components/header'
import { PromptDialogue } from '@/modules/home/UI/components/prompt-dialogue'

import { useTRPC } from '@/trpc/client'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Suspense } from 'react';
import { ProjectCards } from '../components/project-cards';
import Footer from '../components/footer';
import { LoadingScreen } from '@/components/loading';


const transitionVariants = {
    item: {
        hidden: {
            opacity: 0,
            filter: 'blur(12px)',
            y: 12,
        },
        visible: {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            transition: {
                type: 'spring',
                bounce: 0.3,
                duration: 1.5,
            } as const,
        },
    },
}


const exampleApplication = [
    {
        id:1,
        text:"Build Netflix Clone",
        prompt:"Build a minimal version of single page netflix clone, it should be as simple as possible, no complexities, and only one page code"
    },
    {
        id:2,
        text:"Build an Admin Dashboard",
        prompt:"Build a minimal version of admin dashboard,it should be as simple as possible, no complexities, and only one page code"
    },
    {
        id:3,
        text:"Build a kanban board",
        prompt:"Build a minimal version of kanban board,it should be as simple as possible, no complexities, and only one page code"
    },
    {
        id:4,
        text:"Build Youtube Clone",
        prompt:"Build a minimal version of single page youtube clone, it should be as simple as possible, no complexities, and only one page code"
    },
    {
        id:5,
        text:"Build a landing page, ",
        prompt:"Build a minimal landing page for BMS College, it should be as simple as possible, no complexities, and only one page code"
    },
    {
        id:6,
        text:"Build a todo app",
        prompt:"Build a minimalist todo application"
    },
]



export default function HeroSection() {

    
    const trpc = useTRPC();
    const router = useRouter();    

    const createProject = useMutation(trpc.project.create.mutationOptions({
        onSuccess:(data)=>{
            toast.success(`Project Started :- ${data.name} `);
            router.push(`/project/${data.id}`);
        },
        onError:(error)=>{
            toast.error(`Something Went Wrong ${error.message}`);
        }
    }));

    async function onSubmit(prompt:string){
        toast.loading("Prompt Submitting");
        await createProject.mutateAsync({ userPrompt: prompt });  
        toast.dismiss();
    }


    return (
        <>
            <HeroHeader />
            <main className="h-full">
                <section>
                    <div className="relative pt-24 md:pt-36">

                        <div className="mx-auto max-w-7xl px-6">
                            <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
                                <AnimatedGroup variants={transitionVariants}>
                                    <Link
                                        href="/"
                                        className="hover:bg-background dark:hover:border-t-border bg-muted group mx-auto flex w-fit items-center gap-4 rounded-full border p-1 pl-4 shadow-md shadow-zinc-950/5 transition-colors duration-300 dark:border-t-white/5 dark:shadow-zinc-950">
                                        <span className="text-foreground text-sm max-md:text-xs ">Introducing Waves : The Modern Website Builder</span>
                                        <span className="dark:border-background block h-4 w-0.5 border-l bg-white dark:bg-zinc-700 max-md:hidden "></span>

                                        <div className="bg-background group-hover:bg-muted size-6 overflow-hidden rounded-full duration-500">
                                            <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                                                <span className="flex size-6">
                                                    <ArrowRight className="m-auto size-3" />
                                                </span>
                                                <span className="flex size-6">
                                                    <ArrowRight className="m-auto size-3" />
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                </AnimatedGroup>

                                <TextEffect
                                    preset="fade-in-blur"
                                    speedSegment={0.3}
                                    as="h1"
                                    className="mx-auto mt-8 max-w-4xl text-balance text-5xl max-md:font-semibold md:text-7xl lg:mt-16 xl:text-[5.25rem]">
                                    Modern Web Solutions for Intital Startups
                                </TextEffect>
                                <TextEffect
                                    per="line"
                                    preset="fade-in-blur"
                                    speedSegment={0.3}
                                    delay={0.5}
                                    as="p"
                                    className="mx-auto mt-8 max-w-2xl text-balance text-lg">
                                    Waves lets you design, build, and launch stunning websites in minutes. Powerful components, smooth animations, and full control — all in one place.
                                </TextEffect>

                                <AnimatedGroup variants={transitionVariants} className='mt-5' >
                                    <div
                                        className="hover:bg-background dark:hover:border-t-border bg-muted/30 group flex justify-center items-center gap-4 rounded-md border w-fit mx-auto p-2 shadow-md shadow-zinc-950/5 transition-colors duration-300 dark:border-t-white/5 dark:shadow-zinc-950 flex-wrap ">
                                        {
                                            exampleApplication.map((app)=>{
                                                return(
                                                    <Button key={app.id} variant="outline" className="text-foreground text-sm max-md:text-xs " onClick={()=>{ onSubmit(app.prompt) }} disabled={createProject.isPending} >{app.text}</Button>
                                                )
                                            })
                                        }                                        
                                    </div>
                                </AnimatedGroup>

                                <AnimatedGroup
                                    variants={{
                                        container: {
                                            visible: {
                                                transition: {
                                                    staggerChildren: 0.05,
                                                    delayChildren: 0.75,
                                                },
                                            },
                                        },
                                        ...transitionVariants,
                                    }}
                                    className="mt-12 flex flex-col items-center justify-center gap-2 md:flex-row">
                                    <div
                                        key={1}
                                        className="rounded-[calc(var(--radius-xl)+0.125rem)] border-none p-0.5">
                                            <PromptDialogue showCloseButton={true} from="left" />
                                    </div>
                                    <Button
                                        key={2}
                                        asChild
                                        size="lg"
                                        variant="ghost"
                                        className="h-9 rounded-xl px-5 border-2 border-gray-400 ">
                                        <Link href="#">
                                            <span className="text-nowrap">Upgrade</span>
                                        </Link>
                                    </Button>
                                </AnimatedGroup>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        <div className="flex flex-col gap-y-10 w-full p-4 justify-center items-center mt-5">
            <h1 className="font-bold text-6xl" >
                Your Waves
            </h1>
            <Suspense fallback={<LoadingScreen message="Projects Are Loading..." />} >
                <ProjectCards/>
            </Suspense>
        </div>
            <Footer/>
        </>
    )
}
