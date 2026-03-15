import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"
import { useMutation } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client"
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";


const formSchema = z.object({
  prompt:z.string().min(1,{message:"Prompt is required"}).max(1000,"Sorry, Prompt can't exceed 1000 characters"),
});


export const usePromptForm = ()=>{

    const trpc = useTRPC();
    const router = useRouter();

    const { isSignedIn } = useUser();

    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
          prompt:"",
        },
    })

    const createMessage = useMutation(trpc.project.create.mutationOptions({
        onSuccess:(data)=>{
            toast.success(`Project Started :- ${data.name} `);
            router.push(`/project/${data.id}`);
            form.reset();
        },
        onError:(error)=>{
          console.log("Error in project creation ",error);
          if(error.data?.code==="TOO_MANY_REQUESTS"){
              toast.error(error.message);
              router.push("/pricing");
              return;
          }
          toast.error(`Something Went Wrong ${error.message}`);
        }
    }));

    async function onSubmit(data: z.infer<typeof formSchema>) {
      if(!isSignedIn){
        router.push('/sign-in');
        return;
      }
      await createMessage.mutateAsync({ userPrompt: data.prompt });  
    }

    return {
      form,
      onSubmit,
      isPending:createMessage.isPending
    }

}