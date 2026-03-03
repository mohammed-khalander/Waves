import { Sandbox } from "@e2b/code-interpreter";
import { AgentResult, TextMessage } from "@inngest/agent-kit";

export async function getSandboxId(){
    const sandbox = await Sandbox.create("khalandermohammed734/waves-nextjs");
    return sandbox.sandboxId;
}

export async function getSandbox(sandboxId:string){
    return await Sandbox.connect(sandboxId);
}


// CHATGPT:- Explain what the hell is this doing, with syntax, and explain how does the o/p of each variable looks with i/p with example

export function lastAssistantTextMessageContent(result:AgentResult){
    const lastAssistantTextMessageIndex = result.output.findLastIndex( (message) => message.role === "assistant" );

    const message = result.output[lastAssistantTextMessageIndex] as | TextMessage | undefined;

    return message?.content ? typeof message.content === "string" ? message.content : message.content.map((c)=> c.text).join("") : undefined;

}