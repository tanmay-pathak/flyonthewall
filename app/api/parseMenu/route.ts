import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { menuSchema, sampleOutput } from "./schema";

export async function POST(request: Request) {
  const { text } = await request.json();

  if (!text) {
    return Response.json({ error: "No text provided" }, { status: 400 });
  }

  // Return sample output in non-production environments
  if (process.env.MOCK_API === "true") {
    return Response.json(sampleOutput);
  }

  const systemPrompt = `You are an expert meeting notes taker and professional meeting facilitator.

Your task is to analyze meeting transcripts and extract key information in a structured format. Please include:

- A clear, concise title that captures the meeting's purpose
- A comprehensive summary of the main discussion points
- Key meeting notes highlighting important decisions and topics covered
- Confirmed action items with assignees and due dates (when specified)
- Potential action items that were discussed but not firmly committed to
- List of all meeting attendees
- Meeting date and length
- For retro meetings only: Participant feedback categorized as loves/longed for/loathed/learned

Focus on being specific and actionable in your notes. Capture both explicit assignments and implicit tasks that emerged from the discussion.

IMPORTANT: Return only valid JSON that exactly matches the provided schema format. Do not include any explanatory text or markdown formatting.`;

  try {
    const { object } = await generateObject({
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        { role: "user", content: text },
      ],
      model: openai("gpt-4o"),
      schema: menuSchema,
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
