import { DottedGlowBackground } from '@/components/ui/dotted-glow-background'
import { HeroHeader } from '@/modules/home/UI/components/header'
import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return(
    <>
    <div className=''>
      <HeroHeader SignUpPage={true} />
    </div>
    <div className="h-full min-h-screen flex justify-center  ">
      <div className='flex items-center justify-center mt-10'>
        <SignUp />
      </div>
    </div>
      <DottedGlowBackground className='-z-10' />
    </>
  ) 
}