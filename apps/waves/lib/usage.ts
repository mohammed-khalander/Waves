/**
 * Refer Github Docs
 * 1.) https://github.com/animir/node-rate-limiter-flexible/wiki/Prisma
 * 2.) Waves-Docs\Concept-Notes\05-RateLimiterFlexible.md
 */



import { RateLimiterPrisma } from "rate-limiter-flexible";

import prisma from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";


const FREE_POINTS = 5;
const PRO_POINTS = 20;
const DURATION = 30*24*60*60; // 30 Days (It's in seconds)
const GENERATION_COST = 1;

export const getUsageTracker = async ()=>{

    const { has } = await auth();

    const hasProPlan = has({plan:"pro"});


    const usageTracker = new RateLimiterPrisma({
        storeClient: prisma,
        tableName:"Usage",
        points: hasProPlan ? PRO_POINTS : FREE_POINTS,
        duration:DURATION
    })
    return usageTracker;


    
}

export const consumeCredits = async ()=>{
    const { isAuthenticated, userId } = await auth();

    if(!isAuthenticated || !userId){
        throw new Error("User Not Authenticated");
    }

    // const user = await currentUser();

    const usageTracker = await getUsageTracker();
    // console.log("Usage Tracker ",usageTracker);
    const result = await usageTracker.consume(userId,GENERATION_COST);
    // console.log("Results ", result);
    return result;
}

export const getUsageStatus = async ()=>{
    const { isAuthenticated, userId } = await auth();
    
    if(!isAuthenticated || !userId){
        throw new Error("User Not Authenticated");
    }
    
    const usageTracker = await getUsageTracker();
    const result = await usageTracker.get(userId);
    // console.log("Results ", result);
    return result;
}