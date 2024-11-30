export const formatAsMarkdown = (data: any): string => {
  let markdown = `# ${data.title}\n\n`;
  markdown += `## Meeting Details\n`;
  markdown += `- **Date:** ${data.date}\n`;
  markdown += `- **Duration:** ${data.length}\n\n`;

  markdown += `## Attendees\n`;
  data.attendees.forEach((attendee: string) => {
    markdown += `- ${attendee}\n`;
  });
  markdown += "\n";

  markdown += `## Summary\n${data.summary}\n\n`;

  markdown += `## Key Highlights\n`;
  data.meetingNotes.forEach((note: string) => {
    markdown += `- ${note}\n`;
  });
  markdown += "\n";

  if (data.actionItems && data.actionItems.length > 0) {
    markdown += `## Action Items\n`;
    data.actionItems.forEach((item: any) => {
      markdown += `- **${item.assignee}:** ${item.actionItem}${item.dueDate && item.dueDate !== "null" ? ` (Due: ${new Date(item.dueDate).toLocaleDateString()})` : ""}\n`;
    });
    markdown += "\n";
  }

  if (data.potentialActionItems && data.potentialActionItems.length > 0) {
    markdown += `## Potential Action Items\n`;
    data.potentialActionItems.forEach((item: any) => {
      markdown += `- **${item.assignee}:** ${item.actionItem}${item.dueDate && item.dueDate !== "null" ? ` (Target: ${new Date(item.dueDate).toLocaleDateString()})` : ""}\n`;
    });
    markdown += "\n";
  }

  if (data.retro) {
    markdown += `## Team Retrospective\n`;
    data.retro.participants.forEach((participant: any) => {
      markdown += `### ${participant.name}\n`;
      participant.items.forEach((item: any) => {
        markdown += `- **${item.category}:** ${item.description}\n`;
      });
      markdown += "\n";
    });
  }

  return markdown;
};
