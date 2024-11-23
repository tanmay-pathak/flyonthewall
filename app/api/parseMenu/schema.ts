import { z } from "zod";

export const menuSchema = z.object({
  meetingNotes: z
    .array(z.string())
    .describe("Key points and highlights from the meeting discussion"),
  summary: z.string().describe("A brief overview of the entire meeting"),
  title: z.string().describe("A brief title for the meeting"),
  actionItems: z
    .array(
      z.object({
        assignee: z.string().describe("Person responsible for the task"),
        dueDate: z.string().describe("Deadline for completing the task"),
        actionItem: z
          .string()
          .describe("Description of the task to be completed"),
      })
    )
    .describe("Confirmed tasks that need to be completed"),
  potentialActionItems: z
    .array(
      z.object({
        assignee: z.string().describe("Suggested person to handle the task"),
        dueDate: z.string().describe("Proposed deadline for the task"),
        actionItem: z.string().describe("Description of the potential task"),
      })
    )
    .describe(
      "Possible future tasks that were discussed but not yet confirmed"
    ),
});

export const sampleOutput = {
  meetingNotes: [
    "Discussed Q4 targets in detail, focusing on the anticipated growth metrics, departmental objectives, and key performance indicators that need to be achieved to stay aligned with annual goals.",
    "Reviewed the comprehensive marketing strategy, placing a strong emphasis on increasing digital advertising efficiency, optimizing content for higher engagement, and analyzing historical ROI metrics to guide future campaigns.",
    "Engaged in a thorough analysis of team capacity and workload distribution for the upcoming projects, identifying potential bottlenecks and proposing reallocations to ensure all deadlines are met without overburdening any specific team members.",
    "Explored potential challenges within supply chain logistics, such as vendor reliability and international shipping timelines, and brainstormed contingency plans to mitigate risks during peak periods.",
    "Outlined priorities for the next phase of product development, with a specific focus on testing cycles, addressing known quality assurance issues, and improving time-to-market for new features and updates.",
  ],
  summary: "Comprehensive Q4 Planning and Strategy Session",
  actionItems: [
    {
      assignee: "John Smith",
      dueDate: "2024-01-15T00:00:00.000Z",
      actionItem:
        "Prepare a detailed Q4 budget proposal, including justifications for projected expenditures and an analysis of potential areas for cost savings. Ensure the document is reviewed with finance before final submission.",
    },
    {
      assignee: "Sarah Jones",
      dueDate: "2024-01-10T00:00:00.000Z",
      actionItem:
        "Coordinate with all relevant stakeholders to schedule key Q4 meetings, ensuring that proposed dates align with project timelines and that each meeting has a defined agenda and objectives.",
    },
    {
      assignee: "Emily Davis",
      dueDate: "2024-01-05T00:00:00.000Z",
      actionItem:
        "Compile a summary of all team capacity insights discussed during the meeting and distribute it to department heads, highlighting areas that require immediate attention and resources.",
    },
  ],
  potentialActionItems: [
    {
      assignee: "Mike Johnson",
      dueDate: "2024-01-20T00:00:00.000Z",
      actionItem:
        "Conduct in-depth research into potential new market opportunities, focusing on emerging trends, competitor analysis, and geographic regions with high growth potential. Present findings in the Q4 market insights meeting.",
    },
    {
      assignee: "Lisa Chen",
      dueDate: "2024-01-25T00:00:00.000Z",
      actionItem:
        "Draft a comprehensive competitive analysis report, detailing key industry players, recent innovations, and strategic gaps that our company could leverage for an advantage in upcoming campaigns.",
    },
    {
      assignee: "Mark Thompson",
      dueDate: "2024-01-30T00:00:00.000Z",
      actionItem:
        "Develop a framework for improving cross-team collaboration during Q4, outlining specific tools, workflows, and communication strategies that can help reduce inefficiencies and improve project alignment.",
    },
  ],
};
