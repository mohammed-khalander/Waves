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