"use client";

import { DottedGlowBackground } from '@/components/ui/dotted-glow-background';
import { HeroHeader } from '@/modules/home/UI/components/header';
import { PricingTable } from '@clerk/nextjs'
import Image from 'next/image';

import { dark } from "@clerk/themes";

import { useTheme } from 'next-themes';


const Page = ()=>{

  const {theme} = useTheme();

  return (
    <>
        <div>
            <HeroHeader fix={true} />
        </div>

        <div className='w-full min-h-screen h-full flex justify-center items-center'>
            <div className="flex flex-col gap-y-5 items-center w-full">
                <Image src="/logo.svg" alt="Waves" height={70} width={70} />
                <h1 className="text-center text-4xl font-semibold lg:text-5xl">Pricing that Scales with You</h1>
                <div className="px-4 w-full max-w-6xl ">
                    <PricingTable
                        appearance={{
                            baseTheme:theme=="dark"?dark:undefined
                        }}
                    />
                </div>
            </div>
            <DottedGlowBackground className='-z-10' />
        </div>
    </>
  )
}

export default Page;