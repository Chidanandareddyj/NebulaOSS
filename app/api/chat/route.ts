import { openai } from '@ai-sdk/openai';
import { createOpenAI } from '@ai-sdk/openai';
import { google } from '@ai-sdk/google';
import { streamText, UIMessage, convertToModelMessages, generateText, CoreMessage, ModelMessage } from 'ai';
import { projectCompilationEventsSubscribe } from 'next/dist/build/swc/generated-native';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// export async function POST(req: Request) {
//   const { messages }: { messages: UIMessage[] } = await req.json();

//   const result = streamText({
//     model: openai('gpt-4o'),
//     messages: convertToModelMessages(messages),
//   });

//   return result.toUIMessageStreamResponse();
// }

// const { text } = await generateText({
//   model: google('gemini-2.5-flash'),
//   prompt: 'Write a description of Superstar Mahesh babu ',
// });

// console.log(text);


export async function POST(req: Request) {
  const { messages, provider, model }: { messages: ModelMessage[], provider: string, model: string } = await req.json();
  const systemPrompt = `You are a helpful assistant integrated into a Next.js application.
  Your goal is to provide accurate and concise answers based on the user's query.
  The current date is ${new Date().toLocaleDateString()}.`;

  const mesageswithcontext: ModelMessage[] = [
    {
      role: 'system',
      content: systemPrompt,
    },
    ...messages,
  ];

  let LLMprovider;
  if (provider === 'together') {
    LLMprovider = createOpenAI({
      apiKey: process.env.TOGETHER_API_KEY,
      baseURL: 'XXXXXXXXXXXXXXXXXXXXXXXXXXX',
    });
  }
  else if (provider === 'openrouter') {
    LLMprovider = createOpenAI({
      apiKey: process.env.OPENROUTER_API_KEY,
      baseURL: "https://openrouter.ai/api/v1",
    })
  }
  else {
    return new Response('Invalid provider', { status: 400 });
  }
  try {

    const result = streamText({
      model: LLMprovider(model),
      messages: mesageswithcontext,
    })
    console.log(result);
    return result.toTextStreamResponse();
  } catch (error) {
    console.log(error);
    return new Response('Error', { status: 500 });
  }
}