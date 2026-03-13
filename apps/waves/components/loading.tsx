import { Skeleton } from "@/components/ui/skeleton"

interface LoadingScreenProps {
  message?: string
}

export function LoadingScreen({ message = "Loading..." }: LoadingScreenProps) {
  return (
    <div className="z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm my-4 max-sm:my-2 h-full w-full ">
      <div className="flex flex-col items-center justify-center space-y-8">
        <div className="space-y-2">
          <Skeleton className="h-8 w-62.5 bg-muted/50" />
          <Skeleton className="h-8 w-62.5 bg-muted/50" />
        </div>

        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="flex space-x-2">
            <div className="h-4 w-4 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
            <div className="h-4 w-4 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
            <div className="h-4 w-4 animate-bounce rounded-full bg-primary" />
          </div>
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
      </div>
    </div>
  )
}
