import { z } from "zod";

export const decisionSchema = z.object({
  decision: z.string().describe("The decision that was made"),
  context: z.string().describe("Context or reasoning behind the decision"),
  stakeholders: z.array(z.string()).describe("People involved in making this decision")
});

export const followupMeetingSchema = z.object({
  topic: z.string().describe("Topic of the follow-up meeting"),
  proposedDate: z.string().nullable().describe("Proposed date if mentioned"),
  requiredAttendees: z.array(z.string()).describe("People who need to attend"),
  priority: z.enum(["high", "medium", "low"]).describe("Priority level of the follow-up")
});

export const meetingMetricsSchema = z.object({
  sentiment: z.object({
    overall: z.enum(["positive", "neutral", "negative"]).describe("Overall meeting tone"),
    engagement: z.number().min(1).max(10).describe("Participant engagement level 1-10"),
    productiveness: z.number().min(1).max(10).describe("Meeting productivity score 1-10")
  }),
  timeBreakdown: z.array(z.object({
    topic: z.string().describe("Discussion topic"),
    duration: z.string().describe("Approximate time spent"),
    percentage: z.number().describe("Percentage of total meeting time")
  }))
});

// Define possible meeting types
export const meetingTypeSchema = z.object({
  type: z.enum([
    "formal",
    "casual",
    "standup",
    "retro",
    "planning",
    "other"
  ]).describe("The type of meeting detected"),
  confidence: z.number().min(0).max(1).describe("Confidence score of the meeting type detection"),
  details: z.string().describe("Brief explanation of why this type was detected")
});

export const meetingSchema = z.object({
  // Required fields - every meeting should have these
  meetingType: meetingTypeSchema.describe("Type of meeting detected"),
  title: z.string().describe("A brief title for the meeting"),
  summary: z.string().describe("A brief overview of the discussion"),
  attendees: z.array(z.string()).min(1).describe("List of attendees"),
  date: z.string().describe("Date this meeting took place"),
  
  // Optional fields - may not apply to all meeting types
  length: z.string().optional().describe("Length of the meeting"),
  meetingNotes: z.array(z.string()).default([]).describe("Key points from the discussion"),
  actionItems: z.array(z.object({
    assignee: z.string(),
    dueDate: z.string().nullable().optional(),
    actionItem: z.string()
  })).default([]).describe("Confirmed tasks that need to be completed"),
  potentialActionItems: z.array(z.object({
    assignee: z.string(),
    dueDate: z.string().nullable().optional(),
    actionItem: z.string()
  })).default([]).describe("Possible future tasks discussed"),
  keyDecisions: z.array(decisionSchema).default([])
    .describe("Important decisions made during the meeting"),
  followupMeetings: z.array(followupMeetingSchema).default([])
    .describe("Follow-up meetings discussed or planned"),
  unresolvedQuestions: z.array(z.string()).default([])
    .describe("Questions or topics that need further discussion"),
  metrics: meetingMetricsSchema
    .describe("Meeting analytics and metrics"),
  retro: z.object({
    participants: z.array(z.object({
      name: z.string(),
      items: z.array(z.object({
        category: z.enum(["loves", "longedFor", "loathed", "learned"]),
        description: z.string()
      }))
    }))
  }).nullable().optional().describe("Retro-specific feedback and notes")
});
