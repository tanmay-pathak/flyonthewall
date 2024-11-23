/* eslint-disable @typescript-eslint/no-explicit-any */
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { menuSchema, sampleOutput } from "./schema";

export async function POST(request: Request) {
  const { text } = await request.json();

  if (!text) {
    return Response.json({ error: "No text provided" }, { status: 400 });
  }

  // Return sample output in non-production environments
  if (process.env.NODE_ENV !== "production") {
    return Response.json(sampleOutput);
  }

  const systemPrompt = `You are an expert meeting notes taker. 
  Your task is to extract summary, meeting notes, potential action items that a human could review, action items, and potential action items with assignee and due dates (if present). 
IMPORTANT: Only return valid JSON matching the above schema format.`;

  try {
    const { object } = await generateObject({
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        { role: "user", content: text },
      ],
      model: openai("gpt-4o-mini"),
      schema: menuSchema,
      maxTokens: 4096,
      temperature: 0.7,
    });

    return Response.json(object);
  } catch (error) {
    console.error("Error generating response:", error);
    return Response.json(
      { error: "Failed to process meeting notes" },
      { status: 500 }
    );
  }
}

export const maxDuration = 60;
