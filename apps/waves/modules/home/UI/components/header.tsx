'use client'
import Link from 'next/link'
import { LogoIcon } from '@/components/logo'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import React, { RefObject } from 'react'
import { cn } from '@/lib/utils'
import { ModeToggle } from '@/components/mode-toggle'

import { SignInButton, SignUpButton, } from '@clerk/nextjs';
import { useUser } from '@clerk/nextjs'
import { UserControl } from '@/components/user-control'

interface HeaderProps{
    SignInPage?:boolean;
    SignUpPage?:boolean;
    featureScroll?:RefObject<HTMLDivElement | null>;
    projectScroll?:RefObject<HTMLDivElement | null>;
}


export const HeroHeader = ({ SignInPage=false,SignUpPage=false, featureScroll, projectScroll }:HeaderProps) => {
    const [menuState, setMenuState] = React.useState(false)
    const [isScrolled, setIsScrolled] = React.useState(false)

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])


    const { isSignedIn, isLoaded } = useUser();


    return (
        <header>
            <nav
                data-state={menuState && 'active'}
                className="fixed z-20 w-full px-2">
                <div className={cn('mx-auto mt-2 max-w-6xl px-6 transition-all duration-300 lg:px-12', isScrolled && 'bg-background/50 max-w-4xl rounded-2xl border backdrop-blur-lg lg:px-5')}>
                    <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
                        <div className="flex w-full justify-between lg:w-auto">
                            <Link
                                href="/"
                                aria-label="home"
                                className="flex items-center space-x-2">
                                <LogoIcon />
                                <span className='font-semi-bold text-xl' > Waves </span>
                            </Link>

                            <button
                                onClick={() => setMenuState(!menuState)}
                                aria-label={menuState == true ? 'Close Menu' : 'Open Menu'}
                                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden">
                                <Menu className="in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                                <X className="in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 in-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
                            </button>
                        </div>

                        <div className="absolute inset-0 m-auto hidden size-fit lg:block">
                            <ul className="flex gap-8 text-sm">
                                    <li className=" cursor-pointer text-muted-foreground hover:text-accent-foreground block duration-150 text-[16px] " onClick={()=>{ featureScroll?.current?.scrollIntoView({behavior:"smooth"}) }}   >
                                            Features
                                    </li>
                                    {
                                        isSignedIn &&
                                        <li className=" cursor-pointer text-muted-foreground hover:text-accent-foreground block duration-150 text-[16px] " onClick={()=>{ projectScroll?.current?.scrollIntoView({behavior:"smooth"}) }}   >
                                                My Waves
                                        </li>
                                    }
                                    <li className=" cursor-pointer text-muted-foreground hover:text-accent-foreground block duration-150 text-[16px] "  >
                                            Pricing
                                    </li>
                                    <li className=" cursor-pointer text-muted-foreground hover:text-accent-foreground block duration-150 text-[16px] "  >
                                            About
                                    </li>
                            </ul>
                        </div>

                        <div className="bg-background in-data-[state=active]:block lg:in-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
                            <div className="lg:hidden">
                                <ul className="space-y-6 text-base">
                                    <li className=" cursor-pointer text-muted-foreground hover:text-accent-foreground block duration-150" onClick={()=>{ featureScroll?.current?.scrollIntoView({behavior:"smooth"}) }}   >
                                            Features
                                    </li>
                                    {
                                        isSignedIn &&
                                        <li className=" cursor-pointer text-muted-foreground hover:text-accent-foreground block duration-150 text-[16px] " onClick={()=>{ projectScroll?.current?.scrollIntoView({behavior:"smooth"}) }}   >
                                                My Waves
                                        </li>
                                    }
                                    <li className=" cursor-pointer text-muted-foreground hover:text-accent-foreground block duration-150"  >
                                            Pricing
                                    </li>
                                    <li className=" cursor-pointer text-muted-foreground hover:text-accent-foreground block duration-150"  >
                                            About
                                    </li>
                                </ul>
                            </div>
                            <ModeToggle isSignedIn={isSignedIn} />
                            {
                                !isLoaded?
                                (
                                    <>
                                    <div className="flex space-x-2">
                                        <div className="h-3 w-3 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
                                        <div className="h-3 w-3 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
                                        <div className="h-3 w-3 animate-bounce rounded-full bg-primary" />
                                    </div>
                                    </>
                                ):
                                !isSignedIn?
                            <div className={`flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit ${(SignUpPage || SignInPage) ? "hidden" : ""}`}>
                                <SignInButton>
                                    <Button
                                        variant="outline"
                                        size="sm">
                                            Login
                                    </Button>
                                </SignInButton>
                                <SignUpButton>
                                    <Button
                                        size="sm">
                                            Sign Up
                                    </Button>
                                </SignUpButton>
                            </div>:
                            <div>
                                <UserControl showName={false} />
                            </div>
                        }

                        </div>
                    </div>
                </div>
            </nav>
        </header>
    )
}
