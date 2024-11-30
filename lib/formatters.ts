export const formatAsMarkdown = (data: any): string => {
  const formatDate = (dateStr: string) => {
    if (!dateStr || dateStr === "null") return "";
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  // Ensure required fields exist with defaults
  const title = data.title || 'Untitled Meeting';
  const date = data.date || new Date().toISOString();
  const length = data.length || 'Duration not specified';
  const attendees = Array.isArray(data.attendees) ? data.attendees : [];
  const summary = data.summary || 'No summary provided';
  const meetingNotes = Array.isArray(data.meetingNotes) ? data.meetingNotes : [];

  let markdown = `# ${title}\n\n`;
  
  // Meeting Details Section
  markdown += `## 📅 Meeting Details\n\n`;
  markdown += `**Date:** ${formatDate(date)}\n`;
  markdown += `**Duration:** ${length}\n`;
  markdown += `**Participants:** ${attendees.length}\n\n`;

  // Attendees Section
  if (attendees.length > 0) {
    markdown += `## 👥 Attendees\n\n`;
    attendees.forEach((attendee: string) => {
      markdown += `- ${attendee}\n`;
    });
    markdown += "\n";
  }

  // Summary Section
  markdown += `## 📝 Summary\n\n`;
  markdown += `${summary}\n\n`;

  // Key Highlights Section
  if (meetingNotes.length > 0) {
    markdown += `## 🔑 Key Highlights\n\n`;
    meetingNotes.forEach((note: string, index: number) => {
      markdown += `${index + 1}. ${note}\n`;
    });
    markdown += "\n";
  }

  // Action Items Section
  if (Array.isArray(data.actionItems) && data.actionItems.length > 0) {
    markdown += `## ✅ Action Items\n\n`;
    markdown += `| Assignee | Task | Due Date |\n`;
    markdown += `|----------|------|----------|\n`;
    data.actionItems.forEach((item: any) => {
      const dueDate = formatDate(item?.dueDate);
      const assignee = item?.assignee || 'Unassigned';
      const actionItem = item?.actionItem || 'No task specified';
      markdown += `| ${assignee} | ${actionItem} | ${dueDate || '-'} |\n`;
    });
    markdown += "\n";
  }

  // Potential Action Items Section
  if (Array.isArray(data.potentialActionItems) && data.potentialActionItems.length > 0) {
    markdown += `## 📋 Potential Action Items\n\n`;
    markdown += `| Suggested Assignee | Proposed Task | Target Date |\n`;
    markdown += `|-------------------|---------------|-------------|\n`;
    data.potentialActionItems.forEach((item: any) => {
      const targetDate = formatDate(item?.dueDate);
      const assignee = item?.assignee || 'Unassigned';
      const actionItem = item?.actionItem || 'No task specified';
      markdown += `| ${assignee} | ${actionItem} | ${targetDate || '-'} |\n`;
    });
    markdown += "\n";
  }

  // Retrospective Section
  if (data.retro && Array.isArray(data.retro.participants) && data.retro.participants.length > 0) {
    markdown += `## 🔄 Team Retrospective\n\n`;
    data.retro.participants.forEach((participant: any) => {
      if (!participant) return;
      
      const name = participant.name || 'Anonymous Participant';
      markdown += `### ${name}\n\n`;
      
      if (Array.isArray(participant.items) && participant.items.length > 0) {
        // Group items by category
        const categorizedItems = participant.items.reduce((acc: any, item: any) => {
          if (!item) return acc;
          const category = item.category || 'uncategorized';
          if (!acc[category]) {
            acc[category] = [];
          }
          if (item.description) {
            acc[category].push(item.description);
          }
          return acc;
        }, {});

        // Output items by category
        Object.entries(categorizedItems).forEach(([category, items]: [string, any]) => {
          if (items.length > 0) {
            markdown += `#### ${category.charAt(0).toUpperCase() + category.slice(1)}\n`;
            items.forEach((description: string) => {
              markdown += `- ${description}\n`;
            });
            markdown += "\n";
          }
        });
      }
    });
  }

  // Footer
  markdown += `---\n`;
  markdown += `Generated on ${new Date().toLocaleString('en-US', { 
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })}\n`;

  return markdown;
};
