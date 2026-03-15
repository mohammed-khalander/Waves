"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import {
  Field,
  FieldError,
  FieldGroup,
} from "@/components/ui/field"

import TextAreaAutosize from "react-textarea-autosize";

import { useEffect, useState } from "react";


import { LoaderIcon, SendIcon } from "lucide-react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client"
import { Usage } from "./usage"
import { useRouter } from "next/navigation"





interface Props{
    projectId:string;
}



const formSchema = z.object({
  prompt:z.string().min(1,{message:"Prompt is required"}).max(1000,"Sorry, Prompt can't exceed 1000 characters"),
});



export const MessageForm = ({projectId}:Props)=>{


    const trpc = useTRPC();
    const queryClient = useQueryClient();

    const router = useRouter();
    
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
          prompt:"",
        },
    })
    
    async function onSubmit(data: z.infer<typeof formSchema>) {
        await createMessage.mutateAsync({ userPrompt: data.prompt, projectId:projectId });  
    }
    
    
    const createMessage = useMutation(trpc.message.create.mutationOptions({
        onSuccess:(data)=>{
            toast.success(`Prompt Submitted :- ${data.content} `);
            form.reset();
            queryClient.invalidateQueries(trpc.message.getMany.queryOptions({ projectId }));
            queryClient.invalidateQueries(trpc.usage.status.queryOptions());
        },
        onError:(error)=>{
            if(error.data?.code==="TOO_MANY_REQUESTS"){
              toast.error(error.message);
              router.push("/pricing");
              return;
            }
            toast.error(`Something Went Wrong ${error.message}`);
        }
    }));
    
    const [isFocused,setIsFocused] = useState(false);
    // const [showUsage,setShowUsage] = useState(false);
    const isPending = createMessage.isPending;
    const isDisabled = isPending || !form.formState.isValid; 

    const { data:usage } = useQuery(trpc.usage.status.queryOptions());
    
    const showUsage = !!usage;

    
    return(
      <>
        {
          showUsage &&
          <Usage points={usage.remainingPoints} msBeforeNext={usage.msBeforeNext} />
        }
        <form id="waves-rhf" onSubmit={form.handleSubmit(onSubmit)} className={cn("relative border p-4 pt-1 rounded-xl bg-sidebar dark:bg-sidebar transition-all flex flex-col gap-4",isFocused && "shadow-xs", showUsage &&"rounded-t-none")}>
                <FieldGroup>
                  <Controller
                    name="prompt"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid} >
                        <TextAreaAutosize
                          {...field}
                          disabled={isPending}
                          id="waves-prompt"
                          aria-invalid={fieldState.invalid}
                          placeholder="Prompt to change design"
                          autoComplete="off"
                          onFocus={()=>setIsFocused(true)}
                          onBlur={()=>setIsFocused(false)}
                          minRows={2} maxRows={8}
                          className="pt-4 resize-none w-full outline-none bg-transparent"
                          onKeyDown={(e)=>{ 
                              if(e.key==="Enter" && (e.ctrlKey || e.metaKey)){
                                  e.preventDefault();
                                  form.handleSubmit(onSubmit)(e);
                                }
                              }}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </FieldGroup>
                <div className="flex gap-x-2 items-end justify-between pt-2">
                    <div className="text-[10px] text-muted-foreground font-mono">
                        <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium">
                            <span>ctrl</span> Enter
                        </kbd>
                        &nbsp;to Submit
                    </div>
                    <Button className={cn("size-8 rounded-full",isDisabled&&"bg-muted-foreground border")} disabled={isDisabled} >
                        {
                            isPending ? (
                              <LoaderIcon className="size-4 animate-spin" />
                            ):
                            <SendIcon/>
                        }
                    </Button>
                </div>
                  
                </form>
        </>
    )
}




