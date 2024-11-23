import { z } from "zod";

export const menuSchema = z.object({
    meetingNotes: z.array(z.string()),
    summary: z.string(),
    actionItems: z.array(
        z.object({
            assignee: z.string(),
            dueDate: z.date(),
            actionItem: z.string(),
        })
    ),
    potentialActionItems: z.array(
        z.object({
            assignee: z.string(),
            dueDate: z.date(),
            actionItem: z.string(),
        })
    ),
  });
