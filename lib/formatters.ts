export const formatAsMarkdown = (data: any): string => {
  const formatDate = (dateStr: string | null | undefined) => {
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

  const safeArray = <T>(arr: T[] | null | undefined): T[] => {
    return Array.isArray(arr) ? arr : [];
  };

  const safeString = (str: string | null | undefined, defaultValue: string = ''): string => {
    return str || defaultValue;
  };

  const safeNumber = (num: number | null | undefined, defaultValue: number = 0): number => {
    return typeof num === 'number' ? num : defaultValue;
  };

  // Ensure required fields exist with defaults
  const title = safeString(data?.title, 'Untitled Meeting');
  const date = safeString(data?.date, new Date().toISOString());
  const length = safeString(data?.length, 'Duration not specified');
  const attendees = safeArray(data?.attendees);
  const summary = safeString(data?.summary, 'No summary provided');
  const meetingNotes = safeArray(data?.meetingNotes);
  const meetingType = data?.meetingType?.type ? {
    type: data.meetingType.type,
    confidence: safeNumber(data.meetingType.confidence, 0),
    details: safeString(data.meetingType.details, '')
  } : null;

  let markdown = `# ${title}\n\n`;
  
  // Meeting Details Section
  markdown += `## 📅 Meeting Details\n\n`;
  markdown += `**Date:** ${formatDate(date)}\n`;
  markdown += `**Duration:** ${length}\n`;
  markdown += `**Type:** ${meetingType?.type || 'Not specified'}\n`;
  markdown += `**Participants:** ${attendees.length}\n\n`;

  // Attendees Section
  if (attendees.length > 0) {
    markdown += `## 👥 Attendees\n\n`;
    attendees.forEach((attendee: string) => {
      markdown += `- ${safeString(attendee, 'Unknown Attendee')}\n`;
    });
    markdown += "\n";
  }

  // Summary Section
  markdown += `## 📝 Summary\n\n`;
  markdown += `${summary}\n\n`;

  // Key Highlights Section
  if (meetingNotes.length > 0) {
    markdown += `## 🔑 Key Highlights\n\n`;
    meetingNotes.forEach((note: unknown, index: number) => {
      markdown += `${index + 1}. ${safeString(note as string, 'Note content missing')}\n`;
    });
    markdown += "\n";
  }

  // Key Decisions Section
  const decisions = safeArray(data?.keyDecisions);
  if (decisions.length > 0) {
    markdown += `## 🎯 Key Decisions\n\n`;
    decisions.forEach((decision: any, index: number) => {
      if (!decision) return;
      markdown += `### Decision ${index + 1}: ${safeString(decision.decision, 'Decision details missing')}\n`;
      markdown += `**Context:** ${safeString(decision.context, 'No context provided')}\n`;
      const stakeholders = safeArray(decision.stakeholders);
      markdown += `**Stakeholders:** ${stakeholders.length > 0 ? stakeholders.join(', ') : 'None specified'}\n\n`;
    });
  }

  // Action Items Section
  const actionItems = safeArray(data?.actionItems);
  if (actionItems.length > 0) {
    markdown += `## ✅ Action Items\n\n`;
    markdown += `| Assignee | Task | Due Date |\n`;
    markdown += `|----------|------|----------|\n`;
    actionItems.forEach((item: any) => {
      if (!item) return;
      const dueDate = formatDate(item?.dueDate);
      const assignee = safeString(item?.assignee, 'Unassigned');
      const actionItem = safeString(item?.actionItem, 'No task specified');
      markdown += `| ${assignee} | ${actionItem} | ${dueDate || '-'} |\n`;
    });
    markdown += "\n";
  }

  // Potential Action Items Section
  const potentialItems = safeArray(data?.potentialActionItems);
  if (potentialItems.length > 0) {
    markdown += `## 📋 Potential Action Items\n\n`;
    markdown += `| Suggested Assignee | Proposed Task | Target Date |\n`;
    markdown += `|-------------------|---------------|-------------|\n`;
    potentialItems.forEach((item: any) => {
      if (!item) return;
      const targetDate = formatDate(item?.dueDate);
      const assignee = safeString(item?.assignee, 'Unassigned');
      const actionItem = safeString(item?.actionItem, 'No task specified');
      markdown += `| ${assignee} | ${actionItem} | ${targetDate || '-'} |\n`;
    });
    markdown += "\n";
  }

  // Follow-up Meetings Section
  const followups = safeArray(data?.followupMeetings);
  if (followups.length > 0) {
    markdown += `## 📅 Follow-up Meetings\n\n`;
    followups.forEach((meeting: any) => {
      if (!meeting) return;
      markdown += `### ${safeString(meeting.topic, 'Untitled Meeting')}\n`;
      markdown += `**Priority:** ${safeString(meeting.priority, 'Not specified').toUpperCase()}\n`;
      if (meeting.proposedDate) {
        markdown += `**Proposed Date:** ${formatDate(meeting.proposedDate)}\n`;
      }
      const requiredAttendees = safeArray(meeting.requiredAttendees);
      markdown += `**Required Attendees:** ${requiredAttendees.length > 0 ? requiredAttendees.join(', ') : 'None specified'}\n\n`;
    });
  }

  // Open Questions Section
  const questions = safeArray(data?.unresolvedQuestions);
  if (questions.length > 0) {
    markdown += `## ❓ Open Questions\n\n`;
    questions.forEach((question: string, index: number) => {
      markdown += `${index + 1}. ${safeString(question, 'Question details missing')}\n`;
    });
    markdown += "\n";
  }

  // Meeting Analytics Section
  const metrics = data?.metrics;
  if (metrics) {
    markdown += `## 📊 Meeting Analytics\n\n`;
    
    if (metrics.sentiment) {
      markdown += `### Sentiment Analysis\n`;
      markdown += `- Overall Tone: ${safeString(metrics.sentiment.overall, 'Not specified')}\n`;
      markdown += `- Engagement Level: ${safeNumber(metrics.sentiment.engagement, 0)}/10\n`;
      markdown += `- Productivity Score: ${safeNumber(metrics.sentiment.productiveness, 0)}/10\n\n`;
    }

    const timeBreakdown = safeArray(metrics.timeBreakdown);
    if (timeBreakdown.length > 0) {
      markdown += `### Time Breakdown\n\n`;
      markdown += `| Topic | Duration | Percentage |\n`;
      markdown += `|-------|----------|------------|\n`;
      timeBreakdown.forEach((item: any) => {
        if (!item) return;
        const topic = safeString(item.topic, 'Untitled Topic');
        const duration = safeString(item.duration, 'Unknown');
        const percentage = safeNumber(item.percentage, 0);
        markdown += `| ${topic} | ${duration} | ${percentage}% |\n`;
      });
      markdown += "\n";
    }
  }

  // Retrospective Section
  const retro = data?.retro;
  if (retro && Array.isArray(retro.participants) && retro.participants.length > 0) {
    markdown += `## 🔄 Team Retrospective\n\n`;
    retro.participants.forEach((participant: any) => {
      if (!participant) return;
      
      const name = safeString(participant.name, 'Anonymous Participant');
      markdown += `### ${name}\n\n`;
      
      const items = safeArray(participant.items);
      if (items.length > 0) {
        // Group items by category with emojis
        const categoryEmojis: { [key: string]: string } = {
          loves: '💚',
          longedFor: '💭',
          loathed: '💔',
          learned: '💡'
        };

        // Group items by category
        const categorizedItems = items.reduce((acc: any, item: any) => {
          if (!item) return acc;
          const category = safeString(item.category, 'uncategorized');
          if (!acc[category]) {
            acc[category] = [];
          }
          const description = safeString(item.description);
          if (description) {
            acc[category].push(description);
          }
          return acc;
        }, {});

        // Output items by category
        Object.entries(categorizedItems).forEach(([category, items]: [string, any]) => {
          if (Array.isArray(items) && items.length > 0) {
            const emoji = categoryEmojis[category] || '•';
            const formattedCategory = category.charAt(0).toUpperCase() + category.slice(1);
            markdown += `#### ${emoji} ${formattedCategory}\n`;
            items.forEach((description: string) => {
              markdown += `- ${description}\n`;
            });
            markdown += "\n";
          }
        });
      }
    });
  }

  // Footer with metadata
  markdown += `---\n`;
  markdown += `**Meeting Type:** ${meetingType?.type || 'Not specified'}\n`;
  markdown += `**Generated:** ${new Date().toLocaleString('en-US', { 
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })}\n`;

  return markdown;
};
