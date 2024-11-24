"use server";

import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { meetingSchema, sampleOutput } from "./schema";

export async function getSummaryData(text: string) {
  if (process.env.MOCK_API)
    return {
      title: sampleOutput.title,
      summary: sampleOutput.summary,
      date: sampleOutput.date,
      length: sampleOutput.length,
      attendees: sampleOutput.attendees,
    };

  const summarySchema = meetingSchema.pick({
    title: true,
    summary: true,
    date: true,
    length: true,
    attendees: true,
  });

  const { object } = await generateObject({
    messages: [
      {
        role: "system",
        content:
          "Extract the meeting summary details including title, summary, date, length and attendees.",
      },
      { role: "user", content: text },
    ],
    model: openai("gpt-4o-mini"),
    schema: summarySchema,
    temperature: 0.7,
  });

  return object;
}

export async function getKeyHighlightsData(text: string) {
  if (process.env.MOCK_API)
    return {
      meetingNotes: sampleOutput.meetingNotes,
    };
  const highlightsSchema = meetingSchema.pick({
    meetingNotes: true,
  });

  const { object } = await generateObject({
    messages: [
      {
        role: "system",
        content:
          "Extract the key highlights and discussion points from the meeting notes.",
      },
      { role: "user", content: text },
    ],
    model: openai("gpt-4o-mini"),
    schema: highlightsSchema,
    temperature: 0.7,
  });

  return object;
}

export async function getActionItemsData(text: string) {
  if (process.env.MOCK_API)
    return {
      actionItems: sampleOutput.actionItems,
    };
  const actionItemsSchema = meetingSchema.pick({
    actionItems: true,
  });

  const { object } = await generateObject({
    messages: [
      {
        role: "system",
        content:
          "Extract confirmed action items with assignees and due dates from the meeting notes.",
      },
      { role: "user", content: text },
    ],
    model: openai("gpt-4o-mini"),
    schema: actionItemsSchema,
    temperature: 0.7,
  });

  return object;
}

export async function getPotentialActionItemsData(text: string) {
  if (process.env.MOCK_API)
    return {
      potentialActionItems: sampleOutput.potentialActionItems,
    };
  const potentialItemsSchema = meetingSchema.pick({
    potentialActionItems: true,
  });

  const { object } = await generateObject({
    messages: [
      {
        role: "system",
        content:
          "Extract potential/discussed action items that were not firmly committed to.",
      },
      { role: "user", content: text },
    ],
    model: openai("gpt-4o-mini"),
    schema: potentialItemsSchema,
    temperature: 0.7,
  });

  return object;
}

export async function getRetroData(text: string) {
  // Check first few lines for retro keyword
  const firstFewLines = text.split("\n").slice(0, 3).join("\n").toLowerCase();
  if (!firstFewLines.includes("retro")) {
    return null;
  }

  if (process.env.MOCK_API)
    return {
      retro: sampleOutput.retro,
    };
  const retroSchema = meetingSchema.pick({
    retro: true,
  });

  const { object } = await generateObject({
    messages: [
      {
        role: "system",
        content:
          "Extract retro feedback from participants, categorized as loves/longed for/loathed/learned.",
      },
      { role: "user", content: text },
    ],
    model: openai("gpt-4o-mini"),
    schema: retroSchema,
    temperature: 0.7,
  });

  return object;
}
