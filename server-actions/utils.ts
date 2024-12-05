import { z } from "zod";
import { meetingSchema } from "./schema";

export const TEMPERATURES = {
  TYPE_DETECTION: 0.1,
  BASIC_INFO: 0.3,
  ACTION_ITEMS: 0.7,
  DETAILED_INFO: 0.7,
  RETRO: 0.5,
  METRICS: 0.3,
} as const;

export const PROMPTS = {
  TYPE_DETECTION: `Analyze the conversation and determine its type. Focus on clear indicators and DO NOT make assumptions.
  If unsure, classify as "other" with lower confidence. Look for:
  - Formal meetings: Clear agenda, structured discussion
  - Casual: Informal chat, no clear structure
  - Standup: Daily updates, blockers, plans
  - Retro: Team feedback, reflection
  - Planning: Future work discussion
  Return type "other" if unclear.`,

  BASIC_INFO: `Extract basic meeting information:
  - Generate a clear, descriptive title that captures the main purpose or topic of the discussion
  - List all participants/attendees mentioned
  - Meeting date
  - Meeting length (if mentioned)
  
  IMPORTANT:
  - ALWAYS generate a meaningful title, even for casual conversations
  - For formal meetings: Use a professional title format (e.g., "Q4 Planning Meeting")
  - For casual chats: Use a descriptive topic (e.g., "Team Discussion: Project Updates")
  - If date is not explicitly mentioned, use current date
  - Only include length if explicitly mentioned`,

  DETAILED_INFO: `Extract meeting details from the conversation.
  IMPORTANT:
  - Look for any meaningful information, even in casual conversations
  - Extract key points even if they're not formally structured
  - Look for decisions or conclusions reached
  - Note any follow-ups or next steps mentioned
  - Capture questions or topics that need more discussion
  - Don't force structure where there isn't any
  - Focus on quality over quantity`,

  RETRO: `Extract retro-specific feedback. Only include clearly stated feedback in the loves/longed for/loathed/learned categories.`,

  ACTION_ITEMS: `Look for any tasks, action items, or things that need to be done.
  
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
  - Consider context and implications`,

  METRICS: `Analyze the meeting conversation and generate metrics including:
  1. Overall sentiment (positive/neutral/negative)
  2. Engagement level (1-10)
  3. Productiveness (1-10)
  4. Time breakdown of topics discussed
  
  IMPORTANT:
  - Base sentiment on language used, decisions made, and problem resolution
  - Judge engagement by participation levels and interaction quality
  - Assess productivity by concrete outcomes, decisions, and action items
  - For time breakdown, estimate topic durations based on conversation flow
  - If exact timing isn't clear, use conversation proportions to estimate percentages`,
} as const;

export type MeetingTypeResult = z.infer<typeof meetingSchema.shape.meetingType>;
