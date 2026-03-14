
import { NextRequest, NextResponse } from "next/server"

import { clerkClient, auth } from "@clerk/nextjs/server"

export const GET = async (req:NextRequest)=>{
    try{

        // await auth.protect();

        const client = await clerkClient();

        const users = client.users;

        const usersList = await users.getUserList();


        return NextResponse.json({
            success:true,
            message:"Users Fetched Successfully",
            users:usersList,
        })


    }catch(error){
        console.log(`Failed to fetch Users ${error}`);
        return NextResponse.json({success:false,message:`Failed to fetch Users, ERROR:- ${error}`});
    }
}