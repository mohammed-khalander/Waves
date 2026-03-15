import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

import { getUsageStatus } from "@/lib/usage";
import { TRPCError } from "@trpc/server";


export const UsageRouter = createTRPCRouter({
    status:protectedProcedure.query(async()=>{
        try{
            const result = await getUsageStatus();
            return result;
        }catch(error){
            throw new TRPCError({code:"INTERNAL_SERVER_ERROR",message:`Something Went Wrong:- ${error}`});
        }

    })
})

