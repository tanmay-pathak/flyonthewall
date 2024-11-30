export const sampleOutput = {
    meetingType: {
      type: "formal",
      confidence: 0.95,
      details: "Structured team meeting with clear agenda, action items, and multiple stakeholders"
    },
    title: "Q4 Planning & Team Sync",
    summary: "Quarterly planning session covering project status, upcoming goals, and team alignment",
    attendees: ["John Smith", "Sarah Jones", "Mike Chen", "Lisa Park", "Alex Kumar"],
    date: "2024-01-23",
    length: "1 hour 30 minutes",
    
    meetingNotes: [
      "Reviewed Q3 achievements and lessons learned",
      "Discussed current project bottlenecks and proposed solutions",
      "Planned resource allocation for upcoming features",
      "Identified areas for process improvement",
      "Reviewed customer feedback and prioritized feature requests"
    ],
  
    actionItems: [
      {
        assignee: "John Smith",
        dueDate: "2024-02-01T00:00:00.000Z",
        actionItem: "Create detailed resource allocation plan for Q4"
      },
      {
        assignee: "Sarah Jones",
        dueDate: "2024-01-30T00:00:00.000Z",
        actionItem: "Schedule individual team member check-ins"
      },
      {
        assignee: "Mike Chen",
        dueDate: null,
        actionItem: "Update project documentation with new processes"
      }
    ],
  
    potentialActionItems: [
      {
        assignee: "Team",
        dueDate: null,
        actionItem: "Consider implementing weekly code review sessions"
      },
      {
        assignee: "Lisa Park",
        dueDate: "2024-02-15T00:00:00.000Z",
        actionItem: "Research potential automation tools for deployment"
      },
      {
        assignee: "Alex Kumar",
        dueDate: null,
        actionItem: "Look into team training opportunities for new technologies"
      }
    ],
  
    keyDecisions: [
      {
        decision: "Adopt new code review process",
        context: "To improve code quality and knowledge sharing, team will implement mandatory peer reviews",
        stakeholders: ["Mike Chen", "Alex Kumar", "Lisa Park"]
      },
      {
        decision: "Increase test coverage requirement to 80%",
        context: "Quality metrics showed need for more comprehensive testing",
        stakeholders: ["John Smith", "Mike Chen"]
      },
      {
        decision: "Move to bi-weekly sprint planning",
        context: "Weekly planning meetings were too frequent and disruptive",
        stakeholders: ["Sarah Jones", "Lisa Park", "Team"]
      }
    ],
  
    followupMeetings: [
      {
        topic: "Sprint Planning",
        proposedDate: "2024-01-30T10:00:00.000Z",
        requiredAttendees: ["John Smith", "Sarah Jones", "Team"],
        priority: "high"
      },
      {
        topic: "Code Review Process Workshop",
        proposedDate: "2024-02-05T15:00:00.000Z",
        requiredAttendees: ["Mike Chen", "Alex Kumar"],
        priority: "medium"
      },
      {
        topic: "Team Training Session",
        proposedDate: "2024-02-15T14:00:00.000Z",
        requiredAttendees: ["All Team Members"],
        priority: "low"
      }
    ],
  
    unresolvedQuestions: [
      "How will we handle legacy system migration?",
      "What's the best approach for onboarding new team members?",
      "Should we invest in additional testing tools?",
      "How can we better track technical debt?"
    ],
  
    metrics: {
      sentiment: {
        overall: "positive",
        engagement: 8,
        productiveness: 9
      },
      timeBreakdown: [
        {
          topic: "Q3 Review",
          duration: "20 minutes",
          percentage: 22
        },
        {
          topic: "Current Projects Status",
          duration: "25 minutes",
          percentage: 28
        },
        {
          topic: "Process Improvements",
          duration: "30 minutes",
          percentage: 33
        },
        {
          topic: "Q4 Planning",
          duration: "15 minutes",
          percentage: 17
        }
      ]
    },
  
    retro: {
      participants: [
        {
          name: "Mike Chen",
          items: [
            {
              category: "loves",
              description: "Team's willingness to help each other"
            },
            {
              category: "learned",
              description: "New testing strategies from recent projects"
            },
            {
              category: "longedFor",
              description: "More structured knowledge sharing sessions"
            }
          ]
        },
        {
          name: "Lisa Park",
          items: [
            {
              category: "loves",
              description: "Recent improvements in deployment process"
            },
            {
              category: "loathed",
              description: "Frequent context switching between projects"
            },
            {
              category: "learned",
              description: "Better ways to handle async operations"
            }
          ]
        },
        {
          name: "Alex Kumar",
          items: [
            {
              category: "loves",
              description: "New code review guidelines"
            },
            {
              category: "longedFor",
              description: "More time for technical debt cleanup"
            },
            {
              category: "learned",
              description: "Importance of documentation in team productivity"
            }
          ]
        }
      ]
    }
  };
  
  // Example of a casual meeting output
  export const casualMeetingOutput = {
    meetingType: {
      type: "casual",
      confidence: 0.8,
      details: "Informal team discussion without structured agenda"
    },
    title: "Quick Team Sync",
    summary: "Brief catch-up on current work and blockers",
    attendees: ["Mike Chen", "Lisa Park"],
    date: "2024-01-23",
    length: "30 minutes",
    meetingNotes: [
      "Discussed current project progress",
      "Shared updates on recent customer feedback",
      "Talked about potential process improvements"
    ],
    actionItems: [],
    potentialActionItems: [
      {
        assignee: "Mike Chen",
        dueDate: null,
        actionItem: "Look into reported performance issues"
      },
      {
        assignee: "Lisa Park",
        dueDate: null,
        actionItem: "Share findings from recent customer calls"
      }
    ],
    keyDecisions: [],
    followupMeetings: [],
    unresolvedQuestions: [
      "Should we prioritize performance optimization?",
      "How can we better collect customer feedback?"
    ],
    metrics: {
      sentiment: {
        overall: "positive",
        engagement: 7,
        productiveness: 6
      },
      timeBreakdown: [
        {
          topic: "Project Updates",
          duration: "15 minutes",
          percentage: 50
        },
        {
          topic: "General Discussion",
          duration: "15 minutes",
          percentage: 50
        }
      ]
    }
  };
  