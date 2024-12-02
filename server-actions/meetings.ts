"use server";

import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";
import { sampleOutput } from "./sample";
import { decisionSchema, followupMeetingSchema, meetingMetricsSchema, meetingSchema } from "./schema";

async function detectMeetingType(text: string) {
  const typePrompt = `Analyze the conversation and determine its type. Focus on clear indicators and DO NOT make assumptions.
If unsure, classify as "other" with lower confidence. Look for:
- Formal meetings: Clear agenda, structured discussion
- Casual: Informal chat, no clear structure
- Standup: Daily updates, blockers, plans
- Retro: Team feedback, reflection
- Planning: Future work discussion
Return type "other" if unclear.`;

  try {
    const { object } = await generateObject({
      messages: [
        { role: "system", content: typePrompt },
        { role: "user", content: text }
      ],
      model: openai("gpt-4o-mini"),
      schema: z.object({
        meetingType: meetingSchema.shape.meetingType
      }),
      temperature: 0.1
    });

    return object;
  } catch (error) {
    console.warn("Failed to detect meeting type:", error);
    return {
      meetingType: {
        type: "other" as const,
        confidence: 0.1,
        details: "Unable to determine meeting type"
      }
    };
  }
}

async function extractBasicInfo(text: string, meetingType: any) {
  const basicInfoPrompt = `Extract basic meeting information:
- Generate a clear, descriptive title that captures the main purpose or topic of the discussion
- List all participants/attendees mentioned
- Meeting date
- Meeting length (if mentioned)

IMPORTANT:
- ALWAYS generate a meaningful title, even for casual conversations
- For formal meetings: Use a professional title format (e.g., "Q4 Planning Meeting")
- For casual chats: Use a descriptive topic (e.g., "Team Discussion: Project Updates")
- If date is not explicitly mentioned, use current date
- Only include length if explicitly mentioned`;

  try {
    const { object } = await generateObject({
      messages: [
        { role: "system", content: basicInfoPrompt },
        { role: "user", content: text }
      ],
      model: openai("gpt-4o-mini"),
      schema: z.object({
        summary: z.string(),
        title: z.string(),
        attendees: z.array(z.string()).min(1),
        date: z.string(),
        length: z.string().optional()
      }),
      temperature: 0.3
    });

    return object;
  } catch (error) {
    console.error("Error extracting basic info:", error);
    const fallbackTitle = meetingType?.type === "casual" 
      ? "Team Discussion" 
      : "Team Meeting";
    
    return {
      title: fallbackTitle,
      summary: "Meeting discussion",
      attendees: ["Unknown"],
      date: new Date().toLocaleDateString(),
      length: undefined
    };
  }
}

async function extractActionItems(text: string, meetingType: any) {
  const actionItemPrompt = `Look for any tasks, action items, or things that need to be done.

CLASSIFICATION RULES:
1. CONFIRMED Action Items:
   - Clear owner/assignee
   - Clear task
   - Clear commitment ("will do", "agreed to", etc.)

2. POTENTIAL Action Items:
   - Any mentioned work or tasks
   - Things that "should" or "could" be done
   - Suggestions or ideas that need action
   - Follow-up items
   - Areas needing attention

3. Due Dates:
   - Include if mentioned
   - Convert relative dates to actual dates
   - Use null if no date specified

IMPORTANT: 
- Be generous in identifying potential tasks
- If unsure, add to potential items
- Look for implicit tasks in the discussion
- Consider context and implications`;

  try {
    const { object } = await generateObject({
      messages: [
        { role: "system", content: actionItemPrompt },
        { role: "user", content: text }
      ],
      model: openai("gpt-4o-mini"),
      schema: z.object({
        actionItems: z.array(z.object({
          assignee: z.string(),
          dueDate: z.string().nullable(),
          actionItem: z.string()
        })).default([]),
        potentialActionItems: z.array(z.object({
          assignee: z.string(),
          dueDate: z.string().nullable(),
          actionItem: z.string()
        })).default([])
      }),
      temperature: 0.7
    });

    const processedActionItems = object.actionItems.filter(item => 
      item.assignee && 
      item.assignee !== "Team" && 
      !item.actionItem.toLowerCase().includes("maybe") &&
      !item.actionItem.toLowerCase().includes("might") &&
      !item.actionItem.toLowerCase().includes("could")
    );

    const potentialItems = [
      ...object.potentialActionItems,
      ...object.actionItems.filter(item => 
        !item.assignee || 
        item.assignee === "Team" ||
        item.actionItem.toLowerCase().includes("maybe") ||
        item.actionItem.toLowerCase().includes("might") ||
        item.actionItem.toLowerCase().includes("could")
      )
    ];

    const uniquePotentialItems = potentialItems.reduce((acc: any[], item) => {
      if (!acc.some(x => x.actionItem === item.actionItem)) {
        acc.push(item);
      }
      return acc;
    }, []);

    return {
      actionItems: processedActionItems,
      potentialActionItems: uniquePotentialItems
    };
  } catch (error) {
    console.warn("Error extracting action items:", error);
    return {
      actionItems: [],
      potentialActionItems: []
    };
  }
}

async function generateMeetingMetrics(text: string) {
  const metricsPrompt = `Analyze the meeting conversation and generate metrics including:
1. Overall sentiment (positive/neutral/negative)
2. Engagement level (1-10)
3. Productiveness (1-10)
4. Time breakdown of topics discussed

IMPORTANT:
- Base sentiment on language used, decisions made, and problem resolution
- Judge engagement by participation levels and interaction quality
- Assess productivity by concrete outcomes, decisions, and action items
- For time breakdown, estimate topic durations based on conversation flow
- If exact timing isn't clear, use conversation proportions to estimate percentages`;

  try {
    const { object } = await generateObject({
      messages: [
        { role: "system", content: metricsPrompt },
        { role: "user", content: text }
      ],
      model: openai("gpt-4o-mini"),
      schema: meetingMetricsSchema,
      temperature: 0.3
    });

    return object;
  } catch (error) {
    console.warn("Error generating meeting metrics:", error);
    return {
      sentiment: {
        overall: "neutral",
        engagement: 5,
        productiveness: 5
      },
      timeBreakdown: [{
        topic: "General Discussion",
        duration: "entire meeting",
        percentage: 100
      }]
    };
  }
}

async function extractDetailedInfo(text: string, meetingType: any) {
  if (!meetingType || (meetingType.type === "casual" && meetingType.confidence > 0.9)) {
    return {
      meetingNotes: [],
      actionItems: [],
      potentialActionItems: [],
      keyDecisions: [],
      followupMeetings: [],
      unresolvedQuestions: [],
      metrics: await generateMeetingMetrics(text)
    };
  }

  const detailPrompt = `Extract meeting details from the conversation.
IMPORTANT:
- Look for any meaningful information, even in casual conversations
- Extract key points even if they're not formally structured
- Look for decisions or conclusions reached
- Note any follow-ups or next steps mentioned
- Capture questions or topics that need more discussion
- Don't force structure where there isn't any
- Focus on quality over quantity`;

  try {
    const { object } = await generateObject({
      messages: [
        { role: "system", content: detailPrompt },
        { role: "user", content: text }
      ],
      model: openai("gpt-4o-mini"),
      schema: z.object({
        meetingNotes: z.array(z.string()).default([]),
        keyDecisions: z.array(decisionSchema).default([]),
        followupMeetings: z.array(followupMeetingSchema).default([]),
        unresolvedQuestions: z.array(z.string()).default([])
      }).partial(),
      temperature: 0.7
    });

    const metrics = await generateMeetingMetrics(text);

    return {
      meetingNotes: object.meetingNotes || [],
      keyDecisions: object.keyDecisions || [],
      followupMeetings: object.followupMeetings || [],
      unresolvedQuestions: object.unresolvedQuestions || [],
      metrics
    };
  } catch (error) {
    console.warn("Error extracting detailed info:", error);
    return {
      meetingNotes: [],
      keyDecisions: [],
      followupMeetings: [],
      unresolvedQuestions: [],
      metrics: await generateMeetingMetrics(text)
    };
  }
}

async function extractRetroInfo(text: string, meetingType: any) {
  if (!meetingType || meetingType.type !== "retro" || meetingType.confidence < 0.7) {
    return { retro: null };
  }

  const retroPrompt = `Extract retro-specific feedback. Only include clearly stated feedback in the loves/longed for/loathed/learned categories.`;

  try {
    const { object } = await generateObject({
      messages: [
        { role: "system", content: retroPrompt },
        { role: "user", content: text }
      ],
      model: openai("gpt-4o-mini"),
      schema: z.object({
        retro: meetingSchema.shape.retro
      }),
      temperature: 0.5
    });

    return object;
  } catch (error) {
    console.warn("Error extracting retro info:", error);
    return { retro: null };
  }
}

export async function parseMeetingNotes(text: string) {
  if (!text) {
    throw new Error("No text provided");
  }

  if (process.env.MOCK_API === "true") {
    return sampleOutput;
  }

  try {
    const { meetingType } = await detectMeetingType(text);

    const [basicInfo, actionItemsInfo, detailedInfo, retroInfo, metrics] = await Promise.all([
      extractBasicInfo(text, meetingType),
      extractActionItems(text, meetingType),
      extractDetailedInfo(text, meetingType),
      extractRetroInfo(text, meetingType),
      generateMeetingMetrics(text)
    ]);

    return {
      meetingType,
      ...basicInfo,
      meetingNotes: detailedInfo.meetingNotes || [],
      actionItems: actionItemsInfo.actionItems,
      potentialActionItems: actionItemsInfo.potentialActionItems,
      keyDecisions: detailedInfo.keyDecisions || [],
      followupMeetings: detailedInfo.followupMeetings || [],
      unresolvedQuestions: detailedInfo.unresolvedQuestions || [],
      metrics,
      ...(retroInfo.retro ? { retro: retroInfo.retro } : { retro: null })
    };
  } catch (error) {
    console.error("Error processing meeting notes:", error);
    throw new Error("Failed to process meeting notes");
  }
}
