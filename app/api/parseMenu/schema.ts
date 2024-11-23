import { z } from "zod";

export const menuSchema = z.object({
    meetingNotes: z.array(z.string()),
    summary: z.string(),
    actionItems: z.array(
        z.object({
            assignee: z.string(),
            dueDate: z.string(),
            actionItem: z.string(),
        })
    ),
    potentialActionItems: z.array(
        z.object({
            assignee: z.string(),
            dueDate: z.string(),
            actionItem: z.string(),
        })
    ),
  });

export const sampleOutput = {
    "meetingNotes": [
        "Discussed Q4 targets",
        "Reviewed marketing strategy",
        "Team capacity planning"
    ],
    "summary": "Q4 Planning Meeting",
    "actionItems": [
        {
            "assignee": "John Smith",
            "dueDate": "2024-01-15T00:00:00.000Z",
            "actionItem": "Create Q4 budget proposal"
        },
        {
            "assignee": "Sarah Jones",
            "dueDate": "2024-01-10T00:00:00.000Z",
            "actionItem": "Schedule stakeholder meetings"
        }
    ],
    "potentialActionItems": [
        {
            "assignee": "Mike Johnson",
            "dueDate": "2024-01-20T00:00:00.000Z",
            "actionItem": "Research new market opportunities"
        },
        {
            "assignee": "Lisa Chen",
            "dueDate": "2024-01-25T00:00:00.000Z",
            "actionItem": "Draft competitive analysis report"
        }
    ]
};
