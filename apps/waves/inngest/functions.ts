/** Refer
 * 
 *  https://agentkit.inngest.com/getting-started/quick-start 
 *  https://e2b.dev/docs
 * 
*/


import { openai, createAgent, createTool, createNetwork, type Tool, type Message, createState } from "@inngest/agent-kit";
import { Sandbox } from '@e2b/code-interpreter';
import { z } from "zod";


import { inngest } from "./client";
import { getSandbox, lastAssistantTextMessageContent } from "./utils";
import { SYSTEM_PROMPT } from "@/inngest/prompts";


import prisma from "@/lib/prisma";




interface AgentState{
    summary:string;
    files:{
        [path:string]:string
    }
}



export const aiJob = inngest.createFunction(
    {id:"ai-job"},
    {event:"waves/ai-generate"},
    async ({event,step})=>{

      const userPrompt = event.data.userPrompt;
      const projectId = event.data.projectId;
  
      if(!process.env.GROQ_API_KEY){
          return await prisma.message.create({
              data:{
                  content:"OpenAI API Key is not configured, Please ensure you have configured your API Key, and then continue!! Or else connect with the owner to continue",
                  role:"ASSISTANT",
                  type:"ERROR",
                  projectId:projectId
              }
          })
      }


      const sandboxId = await step.run("create-sandbox",async()=>{
        const sandbox = await Sandbox.create("khalandermohammed734/waves-nextjs");
        // await sandbox.setTimeout(3_600_000); // 1 hour (max for free users)  
        // await sandbox.setTimeout(3*10*60_000); // 30 Mins in milisec
        return sandbox.sandboxId;
      })


      const previousMessages = await step.run("get-previous-messages",async()=>{
        const formattedMessages: Message[] = [];
        const messages = await prisma.message.findMany({
            where:{
                projectId: projectId,
            },
            orderBy:{
                createdAt:"asc",
            }
        })

        for(const message of messages){
            formattedMessages.push({
                type:"text",
                role:message.role === "ASSISTANT" ? "assistant" : "user",
                content:message.content,
            })
        }

        return formattedMessages;

      })


      const state = createState<AgentState>({summary:"",files:{}},{messages:previousMessages});




      const executeCommand = createTool({
          name:"terminal-cmd",
          description:"Use the terminal to run commands in sandbox",
          parameters: z.object({
              command:z.string().describe("accepts the command to execute/run"),
          }),
          handler: async ({command},{step})=>{
              const result = await step?.run("terminal-cmd",async ()=>{
                  const buffers = {
                      stdout:"",
                      stderr:"",
                  }
                  try{
      
                      const sandbox = await getSandbox(sandboxId);
                      
                      const result = await sandbox.commands.run(command,{     
                          onStdout:(data:string)=>{
                              buffers.stdout += data; 
                          },
                          onStderr:(data:string)=>{
                              buffers.stderr += data;
                          }
                      });
      
                      return result.stdout;
                      
                  }catch(error){
                      console.log(`Command ${command} failed to execute in 'terminal-cmd' tool,\n Error ${error} \n\n stdout: ${buffers.stdout} \n\n stderror: ${buffers.stderr}`);
                      return `Command ${command} failed to execute in 'terminal-cmd' tool,\n Error ${error} \n\n stdout: ${buffers.stdout} \n\n stderror: ${buffers.stderr}`;
                  }
              })
      
              return result;
          }
      })
      
      
      const createOrUpdateFiles = createTool({
          name:"createOrUpdateFiles",
          description:"Create Or Update file in the sandbox",
          parameters:z.object({
              files:z.array(z.object({ path:z.string(), content:z.string() }))
          }),
          handler:async ({files},{step,network}:Tool.Options<AgentState> )=>{
              const newFiles = await step?.run("createOrUpdateFiles",async ()=>{
                  try{
                      const updatedFiles = network.state.data.files || { }; 
                      // Here choosing object instead of array is smarter move, because if the same file, comes again in the below loop, it'll just override with the new content, instead of agian having the previous content
                      const sandbox = await getSandbox(sandboxId);
      
                      for(const file of files){   
                          await sandbox.files.write(file.path,file.content);
                          updatedFiles[file.path] = file.content;
                      }
                      
                      return updatedFiles;
      
                  }catch(error){
                      return `Error in Creating/Updating the files ${error}`;
                  }
              })
      
              if(typeof newFiles === "object"){
                  network.state.data.files = newFiles; 
              }
              return newFiles;
          }
      })
      
      
      const readFiles = createTool({
          name:"ReadFiles",
          description:"Read Files from the sandbox",
          parameters:z.object({ files:z.array(z.string()) }), 
          handler: async({files},{step,network})=>{
              return await step?.run("Read Files",async ()=>{
                  try{
      
                      const sandbox = await getSandbox(sandboxId);
                      
                      const contents = [];
      
                      for(const file of files){
                          const content = await sandbox.files.read(file);
                          contents.push({path:file,content});
                      }
      
                      return JSON.stringify(contents);    // anyhow we won't be reading this result, this is just for AI Agent to read the content
      
                  }catch(error){
                      return `Error Occured in Reading the Files from sandbox ${error}`;
                  }
              })
          }
      })


      const finishTask = createTool({
        name:"finish_task",
        description:"Call this tool ONLY when the task is fully completed and all files are generated.",
        parameters:z.object({
            summary:z.string(),
        }),
        handler: async({summary},{network})=>{
            network.state.data.summary = summary;
            return "Task Complted";
        }
      })



         
      const model = openai({
       // model: "llama-3.3-70b-versatile",
        model: "moonshotai/kimi-k2-instruct-0905",
        // model: "qwen/qwen3-32b",
        // model: "openai/gpt-oss-120b",
        // model: "meta-llama/llama-4-scout-17b-16e-instruct",
        // model: "groq/compound",
        apiKey: process.env.GROQ_API_KEY,
        baseUrl: "https://api.groq.com/openai/v1/",
        defaultParameters:{
          temperature:0.1,
        },
      });
    
      const codingAgent = createAgent<AgentState>({
        model,
        name: 'NextJs Developer',
        description:"An Expert FullStack Developer with vast knowledge in UI/UX",
        system:SYSTEM_PROMPT,
        tools:[executeCommand,createOrUpdateFiles,readFiles],
        tool_choice:"auto",
        lifecycle:{  
          onResponse: async ({result,network})=>{
            const lastAssistantMessageText = lastAssistantTextMessageContent(result);
            if(lastAssistantMessageText && network){
              if(lastAssistantMessageText.includes("<task_summary>")){
                network.state.data.summary = lastAssistantMessageText;
              }
            }
            return result;
          }
        }
      });

      /**
       * Lifecycle here, like when will the above onResponse lifecycle will run and when will the below router runs ?, like based on the GPT/LLM Response
       * 
       * The above onResponse lifecycle will run after every single llm call(which might include multiple different tool calls within one single network call(1 iteration))
       * Multiple llm calls in the sense, llm might call 'createOrUpdate' tool, 'readFiles' tool and so on.
       * and for the below 'router' of 'network', for one single n/w call, multiple above onResponse lifecycle might be run,
       * 
       */
    
      const network = createNetwork<AgentState>({
        name:"NextJs Developer Network",
        agents:[codingAgent],
        maxIter:15,
        defaultState:state,
        router: async ({network})=>{
          const summary = network.state.data.summary;
          if(summary){
            return;
          }
          return codingAgent;
        }
      })
      // const result  = await codingAgent.run(` Generate a Simple NextJs component for  ${name}`);
      

      const result = await network.run(userPrompt,{state:state});

      const sandboxUrl = await step.run("get-sandbox-url",async()=>{
        const sandbox = await getSandbox(sandboxId);
        const host = sandbox.getHost(3000);
        const url = `https://${host}`;
        return  url;
      });



      await step.run("save-result",async()=>{    
          const isError = !result.state.data.summary || Object.keys(result.state.data.files ?? {}).length === 0;
          if(isError){
            return await prisma.message.create({
                data:{
                    content:"Agent Limit Exceeded while generating Response, Please Try Again After Some Time",
                    role:"ASSISTANT",
                    type:"ERROR",
                    projectId:projectId
                }
            })
          }
          return await prisma.message.create({
              data:{
                  content:result.state.data.summary,
                  role:"ASSISTANT",
                  type:"RESULT",
                  projectId:projectId,
                  
                  fragment:{
                      create:{
                          sandboxUrl:sandboxUrl,
                          title: "Fragment",
                          files:result.state.data.files
                        }
                    }
                    
                }
          })
            
    })

    

      return { sandboxId:sandboxId, sandboxUrl:sandboxUrl, files:result.state.data.files, summary:result.state.data.summary }
    }
)






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



// import { groq } from '@ai-sdk/groq';
// import { generateText,Output } from 'ai';
// import { z } from "zod"
// const result = await generateText({
//     model: groq('openai/gpt-oss-20b'),
//     messages:[{role:"system",content:SYSTEM_PROMPT},{role:"user",content:`Generate a Simple NextJs component for  ${name} `}],
//     output:Output.object({
//         schema:z.object({
//         files:z.array(z.object({
//             fileName:z.string().describe("This Should contain the Name of the file Creating (Only the file name)"),
//             code:z.string().describe("This should contian only the code(Pure Code)"),
//         }))
//         })
//     })
// });
