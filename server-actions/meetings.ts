"use server";

import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";
import { sampleOutput } from "./sample";
import {
  decisionSchema,
  followupMeetingSchema,
  meetingMetricsSchema,
  meetingSchema,
} from "./schema";
import { MeetingTypeResult, PROMPTS, TEMPERATURES } from "./utils";

const DEFAULT_MEETING_INFO = {
  meetingNotes: [],
  keyDecisions: [],
  followupMeetings: [],
  unresolvedQuestions: [],
} as const;

const DEFAULT_BASIC_INFO = {
  title: "Team Discussion",
  summary: "Meeting discussion",
  attendees: ["Unknown"],
  date: new Date().toLocaleDateString(),
  length: undefined,
} as const;

const DEFAULT_ACTION_ITEMS = {
  actionItems: [],
  potentialActionItems: [],
} as const;

const DEFAULT_METRICS = {
  sentiment: {
    overall: "neutral" as const,
    engagement: 5,
    productiveness: 5,
  },
  timeBreakdown: [
    {
      topic: "General Discussion",
      duration: "entire meeting",
      percentage: 100,
    },
  ],
} as const;

async function detectMeetingType(
  text: string
): Promise<{ meetingType: MeetingTypeResult }> {
  try {
    const { object } = await generateObject({
      messages: [
        { role: "system", content: PROMPTS.TYPE_DETECTION },
        { role: "user", content: text },
      ],
      model: google("gemini-2.0-flash-exp"),
      schema: z.object({
        meetingType: meetingSchema.shape.meetingType,
      }),
      temperature: TEMPERATURES.TYPE_DETECTION,
    });

    return object;
  } catch (error) {
    console.warn("Failed to detect meeting type:", error);
    return {
      meetingType: {
        type: "other" as const,
        confidence: 0.1,
        details: "Unable to determine meeting type",
      },
    };
  }
}

async function extractBasicInfo(text: string, meetingType: MeetingTypeResult) {
  try {
    const { object } = await generateObject({
      messages: [
        { role: "system", content: PROMPTS.BASIC_INFO },
        { role: "user", content: text },
      ],
      model: google("gemini-2.0-flash-exp"),
      schema: z.object({
        summary: z.string(),
        title: z.string(),
        attendees: z.array(z.string()).min(1),
        date: z.string(),
        length: z.string().optional(),
      }),
      temperature: TEMPERATURES.BASIC_INFO,
    });

    return object;
  } catch (error) {
    console.error("Error extracting basic info:", error);
    return DEFAULT_BASIC_INFO;
  }
}

async function extractActionItems(
  text: string,
  meetingType: MeetingTypeResult
) {
  try {
    const { object } = await generateObject({
      messages: [
        { role: "system", content: PROMPTS.ACTION_ITEMS },
        { role: "user", content: text },
      ],
      model: google("gemini-2.0-flash-exp"),
      schema: z.object({
        actionItems: z
          .array(
            z.object({
              assignee: z.string(),
              dueDate: z.string().nullable(),
              actionItem: z.string(),
            })
          )
          .default([]),
        potentialActionItems: z
          .array(
            z.object({
              assignee: z.string(),
              dueDate: z.string().nullable(),
              actionItem: z.string(),
            })
          )
          .default([]),
      }),
      temperature: TEMPERATURES.ACTION_ITEMS,
    });

    const processedActionItems = object.actionItems.filter(
      (item) =>
        item.assignee &&
        item.assignee !== "Team" &&
        !item.actionItem.toLowerCase().includes("maybe") &&
        !item.actionItem.toLowerCase().includes("might") &&
        !item.actionItem.toLowerCase().includes("could")
    );

    const potentialItems = [
      ...object.potentialActionItems,
      ...object.actionItems.filter(
        (item) =>
          !item.assignee ||
          item.assignee === "Team" ||
          item.actionItem.toLowerCase().includes("maybe") ||
          item.actionItem.toLowerCase().includes("might") ||
          item.actionItem.toLowerCase().includes("could")
      ),
    ];

    const uniquePotentialItems = potentialItems.reduce((acc: any[], item) => {
      if (!acc.some((x) => x.actionItem === item.actionItem)) {
        acc.push(item);
      }
      return acc;
    }, []);

    return {
      actionItems: processedActionItems,
      potentialActionItems: uniquePotentialItems,
    };
  } catch (error) {
    console.warn("Error extracting action items:", error);
    return DEFAULT_ACTION_ITEMS;
  }
}

async function generateMeetingMetrics(text: string) {
  try {
    const { object } = await generateObject({
      messages: [
        { role: "system", content: PROMPTS.METRICS },
        { role: "user", content: text },
      ],
      model: google("gemini-2.0-flash-exp"),
      schema: meetingMetricsSchema,
      temperature: TEMPERATURES.METRICS,
    });

    return object;
  } catch (error) {
    console.warn("Error generating meeting metrics:", error);
    return DEFAULT_METRICS;
  }
}

async function extractDetailedInfo(
  text: string,
  meetingType: MeetingTypeResult
) {
  if (
    !meetingType ||
    (meetingType.type === "casual" && meetingType.confidence > 0.9)
  ) {
    return DEFAULT_MEETING_INFO;
  }

  try {
    const { object } = await generateObject({
      messages: [
        { role: "system", content: PROMPTS.DETAILED_INFO },
        { role: "user", content: text },
      ],
      model: google("gemini-2.0-flash-exp"),
      schema: z
        .object({
          meetingNotes: z.array(z.string()).default([]),
          keyDecisions: z.array(decisionSchema).default([]),
          followupMeetings: z.array(followupMeetingSchema).default([]),
          unresolvedQuestions: z.array(z.string()).default([]),
        })
        .partial(),
      temperature: TEMPERATURES.DETAILED_INFO,
    });

    return {
      meetingNotes: object.meetingNotes || [],
      keyDecisions: object.keyDecisions || [],
      followupMeetings: object.followupMeetings || [],
      unresolvedQuestions: object.unresolvedQuestions || [],
    };
  } catch (error) {
    console.warn("Error extracting detailed info:", error);
    return DEFAULT_MEETING_INFO;
  }
}

async function extractRetroInfo(text: string, meetingType: MeetingTypeResult) {
  if (
    !meetingType ||
    meetingType.type !== "retro" ||
    meetingType.confidence < 0.7
  ) {
    return { retro: null };
  }

  try {
    const { object } = await generateObject({
      messages: [
        { role: "system", content: PROMPTS.RETRO },
        { role: "user", content: text },
      ],
      model: google("gemini-2.0-flash-exp"),
      schema: z.object({
        retro: meetingSchema.shape.retro,
      }),
      temperature: TEMPERATURES.RETRO,
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

    const [basicInfo, actionItemsInfo, detailedInfo, retroInfo, metrics] =
      await Promise.all([
        extractBasicInfo(text, meetingType),
        extractActionItems(text, meetingType),
        extractDetailedInfo(text, meetingType),
        extractRetroInfo(text, meetingType),
        generateMeetingMetrics(text),
      ]);

    return {
      meetingType,
      ...basicInfo,
      ...detailedInfo,
      actionItems: actionItemsInfo.actionItems,
      potentialActionItems: actionItemsInfo.potentialActionItems,
      metrics,
      ...(retroInfo.retro ? { retro: retroInfo.retro } : {}),
    };
  } catch (error) {
    console.error("Error processing meeting notes:", error);
    throw error;
  }
}
