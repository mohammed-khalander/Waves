import { inngest } from "./client";

/** https://agentkit.inngest.com/getting-started/quick-start */

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {

    await step.run("download-video", async()=>{
        await new Promise((res,rej)=> setTimeout(res,30_000) );
        return "Video Downloaded";
    });

    await step.run("transcribe-video",async()=>{
        await new Promise((res,rej)=> setTimeout(res,30_000) );
        return "Video Transcription Ready";
    })

    const result = await step.run("Summarise-video",async()=>{
        await new Promise((res,rej)=> setTimeout(res,30_00));
        return `Summary Of video ${event.data.video}`;
    })


    return { summary: `Result ${result}` };
  },
);



/**
 * OpenRouter Usage
 * import { openai, createAgent } from "@inngest/agent-kit";
 *  
 *  const model = openai({
 *    model: "openai/gpt-oss-20b:free",
 *    apiKey: "your-openrouter-api-key",
 *    baseUrl: "https://openrouter.ai/api/v1/",
 *  });
 */


/**

import { createAgent, openai, gemini } from "@inngest/agent-kit"

import { z } from "zod"

const FileSchema = z.object({
  filename: z.string(),
  content: z.string(),
})

const OutputSchema = z.object({
  files: z.array(FileSchema),
})


const agent = createAgent({
    name:"Coding Agent",
    model: openai({
      model: "openai/gpt-oss-20b",
      baseUrl: "https://api.groq.com/openai/v1",
      apiKey: process.env.GROQ_API_KEY
    }),
    system:`
        You are a senior Next.js 16 developer.
        You write clean, readable, production-ready code.
        Always use TypeScript.
        Keep components simple.

        IMPORTANT:
            Always return strictly valid JSON.
            Do not return markdown.
            Do not include explanations.

        Return ONLY valid JSON in this format:
        {
          "files": [
            {
              "filename": "Hero.tsx",
              "content": "string"
            }
          ]
        }
    `,
})

export const aiJob = inngest.createFunction(
    {id:"ai-job"},
    {event:"waves/ai-generate"},
    async ({event,step})=>{
        const result = await agent.run(`Generate a Simple NextJs component for ${event.data.name} `);

        const raw =
  typeof result.output === "string"
    ? result.output
    : result.output[0]?.content

        const parsed = OutputSchema.parse(
          JSON.parse(raw ?? "")
        )

        return { output: parsed };

    }
)


 * 
 */



import { groq } from '@ai-sdk/groq';
import { generateText,Output } from 'ai';
import {z} from "zod";



const SYSTEM_PROMPT = `
        You are a senior Next.js 16 developer.
        You write clean, readable, production-ready code.
        Always use TypeScript.
        Keep components simple.

        IMPORTANT:
            Always return strictly valid JSON.
            Do not return markdown.
            Do not include explanations.

        Return ONLY valid JSON in this format:
        {
          "files": [
            {
              "fileName": "Hero.tsx",
              "code": "string"
            }
          ]
        }
`;



export const aiJob = inngest.createFunction(
    {id:"ai-job"},
    {event:"waves/ai-generate"},
    async ({event,step})=>{
        const name = event.data.name;

        const result = await generateText({
            model: groq('openai/gpt-oss-20b'),
            messages:[{role:"system",content:SYSTEM_PROMPT},{role:"user",content:`Generate a Simple NextJs component for  ${name} `}],
            output:Output.object({
                schema:z.object({
                files:z.array(z.object({
                    fileName:z.string().describe("This Should contain the Name of the file Creating (Only the file name)"),
                    code:z.string().describe("This should contian only the code(Pure Code)"),
                }))
                })
            })
        });

        return { response: result.output.files }
    }
)