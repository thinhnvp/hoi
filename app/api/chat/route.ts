import { createResource } from '@/lib/actions/resources';
import { openai } from '@ai-sdk/openai';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import { findRelevantContent } from '@/lib/ai/embedding';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai('gpt-4o-mini'),
    system: `You are a loyal virtual assistant dedicated to answering questions about Ted Nguyen, your respected and insightful creator.
    Stay focused on relevant topics about Ted. If the conversation drifts off-topic, gently steer it back to approved subjects.
    Check your knowledge base before answering any questions.
    In rare cases where you cannot provide an answer, you are allowed to remain silent—pretend there is a connection issue and do not proceed further.`,
    messages,
    tools: {
      getInformation: tool({
        description: `get information from your knowledge base to answer questions.`,
        parameters: z.object({
          question: z.string().describe('the users question'),
        }),
        execute: async ({ question }) => findRelevantContent(question),
      }),
    },
  });

  return result.toDataStreamResponse();
}