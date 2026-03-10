"use client";

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function TooltipDemo() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Hover</Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Add to library</p>
      </TooltipContent>
    </Tooltip>
  )
}


interface HintProps{
    children:React.ReactNode;
    text:string;
    side?:"top"|"right"|"bottom"|"left";
    align?:"start"|"center"|"end";
}


export const Hint = ({children,text,side="top",align="center"}:HintProps)=>{
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {children}
      </TooltipTrigger>
      <TooltipContent side={side} align={align} >
        <p>{text}</p>
      </TooltipContent>
    </Tooltip>
  ) 
}