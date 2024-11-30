import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { formatAsMarkdown } from "@/lib/formatters";
import { handleShareURL } from "@/lib/utils";
import cloneDeep from "lodash/cloneDeep";
import { ArrowLeft, Copy, Download, Loader2, Share2 } from "lucide-react";
import React from "react";
import { z } from "zod";
import { meetingSchema } from "../server-actions/schema";
import { AttendeeSelect } from "./AttendeeSelect";

export const MeetingDetails = ({
  data,
  onDataChange,
}: {
  data: z.infer<typeof meetingSchema>;
  onDataChange?: (newData: z.infer<typeof meetingSchema>) => void;
}) => {
  const { toast } = useToast();

  const [isCopying, setIsCopying] = React.useState(false);
  const [isExporting, setIsExporting] = React.useState(false);

  const allAccordionValues = [
    "summary",
    "action-items",
    "decisions",
    "meeting-notes",
    "followups",
    "potential-action-items",
    "unresolved",
    "retro-section",
    "metrics"
  ];

  const copyMarkdown = async () => {
    setIsCopying(true);
    try {
      const markdown = formatAsMarkdown(data);
      await navigator.clipboard.writeText(markdown);
      toast({
        title: "Copied!",
        description: "Meeting notes copied to clipboard as markdown",
      });
    } catch (err) {
      console.error("Failed to copy to clipboard", err);
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    } finally {
      setIsCopying(false);
    }
  };

  const exportMarkdown = () => {
    setIsExporting(true);
    try {
      const markdown = formatAsMarkdown(data);
      const blob = new Blob([markdown], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${data.title?.replace(/[^a-z0-9]/gi, "_").toLowerCase() || "meeting"}_notes.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast({
        title: "Success",
        description: "Meeting notes exported as markdown",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleAssigneeChange = (actionItemIndex: number, newAssignee: string) => {
    if (!onDataChange) return;
    
    const newData = cloneDeep(data);
    if (newData.actionItems) {
      newData.actionItems[actionItemIndex].assignee = newAssignee;
      onDataChange(newData);
    }
  };

  const handlePotentialAssigneeChange = (actionItemIndex: number, newAssignee: string) => {
    if (!onDataChange) return;
    
    const newData = cloneDeep(data);
    if (newData.potentialActionItems) {
      newData.potentialActionItems[actionItemIndex].assignee = newAssignee;
      onDataChange(newData);
    }
  };

  const handleRetroParticipantChange = (participantIndex: number, newName: string) => {
    if (!onDataChange) return;
    
    const newData = cloneDeep(data);
    if (newData.retro?.participants) {
      newData.retro.participants[participantIndex].name = newName;
      onDataChange(newData);
    }
  };

  const renderMetrics = () => {
    if (!data.metrics) return null;
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className={`p-4 rounded-lg transition-colors duration-200 ${
            data.metrics.sentiment.overall === 'positive' ? 'bg-green-50 hover:bg-green-100' :
            data.metrics.sentiment.overall === 'negative' ? 'bg-red-50 hover:bg-red-100' :
            'bg-gray-50 hover:bg-gray-100'
          }`}>
            <span className="text-sm font-medium text-gray-500 block">Overall Sentiment</span>
            <span className="text-lg capitalize">{data.metrics.sentiment.overall}</span>
          </div>
          <div className="p-4 rounded-lg bg-gray-50">
            <span className="text-sm font-medium text-gray-500 block">Engagement</span>
            <span className="text-lg">{data.metrics.sentiment.engagement}/10</span>
          </div>
          <div className="p-4 rounded-lg bg-gray-50">
            <span className="text-sm font-medium text-gray-500 block">Productivity</span>
            <span className="text-lg">{data.metrics.sentiment.productiveness}/10</span>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-3">Time Breakdown</h4>
          <div className="space-y-3">
            {data.metrics.timeBreakdown.map((item, index) => (
              <TooltipProvider key={index}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-4">
                      <div className="w-1/2">
                        <div className="text-sm text-gray-900">{item.topic}</div>
                        <div className="text-xs text-gray-500">{item.duration}</div>
                      </div>
                      <div className="w-1/2">
                        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full transition-all duration-500 ease-in-out"
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{item.percentage}%</div>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{item.topic}: {item.duration} ({item.percentage}%)</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-2 mb-4 justify-between">
        <Button
          variant="ghost"
          onClick={() => {
            window.location.hash = "";
            window.location.pathname = "/";
            window.location.reload();
          }}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" onClick={copyMarkdown} disabled={isCopying}>
                  {isCopying ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Copy className="h-4 w-4 mr-2" />
                  )}
                  {isCopying ? "Copying..." : "Copy"}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Copy meeting notes as markdown</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" onClick={exportMarkdown} disabled={isExporting}>
                  {isExporting ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4 mr-2" />
                  )}
                  {isExporting ? "Exporting..." : "Export"}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Download meeting notes as markdown file</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" onClick={() => handleShareURL(data)}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </TooltipTrigger>
              <TooltipContent>Share meeting notes via URL</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <Accordion
        type="multiple"
        defaultValue={allAccordionValues}
        className="w-full flex flex-col gap-4"
      >
        <AccordionItem value="summary">
          <Card>
            <CardHeader>
              <AccordionTrigger>
                <CardTitle className="flex text-xl font-normal">
                  / Summary
                </CardTitle>
              </AccordionTrigger>
            </CardHeader>
            <AccordionContent>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <span className="text-sm font-medium text-gray-500 block mb-1">Title</span>
                    <h3 className="text-xl font-semibold text-gray-900">{data.title}</h3>
                  </div>

                  <div>
                    <span className="text-sm font-medium text-gray-500 block mb-2">Attendees</span>
                    <div className="flex flex-wrap gap-1.5">
                      {data.attendees.map((attendee, index) => (
                        <span 
                          key={index} 
                          className="inline-flex items-center px-2.5 py-1 rounded-full text-sm bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors"
                        >
                          {attendee}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <span className="text-sm font-medium text-gray-500 block mb-1">Date</span>
                      <p className="text-base text-gray-900">{data.date}</p>
                    </div>
                    {data.length && (
                      <div>
                        <span className="text-sm font-medium text-gray-500 block mb-1">Length</span>
                        <p className="text-base text-gray-900">{data.length}</p>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <span className="text-sm font-medium text-gray-500 block mb-2">Meeting Summary</span>
                    <p className="text-base text-gray-900 leading-relaxed whitespace-pre-wrap">{data.summary}</p>
                  </div>
                </div>
              </CardContent>
            </AccordionContent>
          </Card>
        </AccordionItem>

        {data.actionItems?.length > 0 && (
          <AccordionItem value="action-items">
            <Card>
              <CardHeader>
                <AccordionTrigger>
                  <CardTitle className="flex text-xl font-normal">
                    / Action Items
                  </CardTitle>
                </AccordionTrigger>
              </CardHeader>
              <AccordionContent>
                <CardContent>
                  <table className="w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Assignee
                        </th>
                        <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Task Description
                        </th>
                        <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Due Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {data.actionItems.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                            <AttendeeSelect
                              attendees={data.attendees}
                              value={item.assignee}
                              onValueChange={(value) => handleAssigneeChange(index, value)}
                              className="min-w-[150px]"
                            />
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {item.actionItem}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            {item.dueDate && item.dueDate !== "null"
                              ? new Date(item.dueDate).toLocaleDateString()
                              : "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </AccordionContent>
            </Card>
          </AccordionItem>
        )}

        {data.keyDecisions?.length > 0 && (
          <AccordionItem value="decisions">
            <Card>
              <CardHeader>
                <AccordionTrigger>
                  <CardTitle className="flex text-xl font-normal">
                    / Key Decisions
                  </CardTitle>
                </AccordionTrigger>
              </CardHeader>
              <AccordionContent>
                <CardContent>
                  <div className="space-y-4">
                    {data.keyDecisions.map((decision, index) => (
                      <div key={index} className="border-l-2 border-blue-500 pl-4 py-2">
                        <h4 className="font-medium text-gray-900">{decision.decision}</h4>
                        <p className="text-sm text-gray-600 mt-1">{decision.context}</p>
                        <div className="flex gap-2 mt-2">
                          {decision.stakeholders.map((stakeholder, idx) => (
                            <span key={idx} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                              {stakeholder}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </AccordionContent>
            </Card>
          </AccordionItem>
        )}

        {data.meetingNotes?.length > 0 && (
          <AccordionItem value="meeting-notes">
            <Card>
              <CardHeader>
                <AccordionTrigger>
                  <CardTitle className="flex text-xl font-normal">
                    / Key Highlights
                  </CardTitle>
                </AccordionTrigger>
              </CardHeader>
              <AccordionContent>
                <CardContent>
                  <ul className="space-y-2">
                    {data.meetingNotes.map((note, index) => (
                      <li key={index} className="flex items-start pl-4 relative">
                        <span className="absolute left-0 text-gray-400">/</span>
                        <span className="text-gray-900">{note}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </AccordionContent>
            </Card>
          </AccordionItem>
        )}

        {data.followupMeetings?.length > 0 && (
          <AccordionItem value="followups">
            <Card>
              <CardHeader>
                <AccordionTrigger>
                  <CardTitle className="flex text-xl font-normal">
                    / Follow-up Meetings
                  </CardTitle>
                </AccordionTrigger>
              </CardHeader>
              <AccordionContent>
                <CardContent>
                  <div className="space-y-4">
                    {data.followupMeetings.map((meeting, index) => (
                      <div key={index} className={`p-4 rounded-lg ${
                        meeting.priority === 'high' ? 'bg-red-50' :
                        meeting.priority === 'medium' ? 'bg-yellow-50' :
                        'bg-green-50'
                      }`}>
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium text-gray-900">{meeting.topic}</h4>
                          <span className={`text-xs px-2 py-1 rounded capitalize ${
                            meeting.priority === 'high' ? 'bg-red-100 text-red-800' :
                            meeting.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {meeting.priority} priority
                          </span>
                        </div>
                        {meeting.proposedDate && (
                          <p className="text-sm text-gray-600 mt-2">
                            Proposed: {new Date(meeting.proposedDate).toLocaleDateString()}
                          </p>
                        )}
                        <div className="flex gap-2 mt-2">
                          {meeting.requiredAttendees.map((attendee, idx) => (
                            <span key={idx} className="text-xs bg-white text-gray-700 px-2 py-1 rounded">
                              {attendee}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </AccordionContent>
            </Card>
          </AccordionItem>
        )}

        {data.potentialActionItems?.length > 0 && (
          <AccordionItem value="potential-action-items">
            <Card>
              <CardHeader>
                <AccordionTrigger>
                  <CardTitle className="flex text-xl font-normal">
                    / Potential Action Items
                  </CardTitle>
                </AccordionTrigger>
              </CardHeader>
              <AccordionContent>
                <CardContent>
                  <table className="w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Suggested Assignee
                        </th>
                        <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Proposed Task
                        </th>
                        <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Target Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {data.potentialActionItems.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                            <AttendeeSelect
                              attendees={data.attendees}
                              value={item.assignee}
                              onValueChange={(value) => handlePotentialAssigneeChange(index, value)}
                              className="min-w-[150px]"
                            />
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {item.actionItem}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            {item.dueDate && item.dueDate !== "null"
                              ? new Date(item.dueDate).toLocaleDateString()
                              : "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </AccordionContent>
            </Card>
          </AccordionItem>
        )}

        {data.unresolvedQuestions?.length > 0 && (
          <AccordionItem value="unresolved">
            <Card>
              <CardHeader>
                <AccordionTrigger>
                  <CardTitle className="flex text-xl font-normal">
                    / Open Questions
                  </CardTitle>
                </AccordionTrigger>
              </CardHeader>
              <AccordionContent>
                <CardContent>
                  <ul className="space-y-2">
                    {data.unresolvedQuestions.map((question, index) => (
                      <li key={index} className="flex items-start pl-4 relative">
                        <span className="absolute left-0 text-gray-400">?</span>
                        <span className="text-gray-900">{question}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </AccordionContent>
            </Card>
          </AccordionItem>
        )}

        {data.retro && (
          <AccordionItem value="retro-section">
            <Card>
              <CardHeader>
                <AccordionTrigger>
                  <CardTitle className="flex text-xl font-normal">
                    / Team Retrospective
                  </CardTitle>
                </AccordionTrigger>
              </CardHeader>
              <AccordionContent>
                <CardContent>
                  <table className="w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Participant
                        </th>
                        <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Description
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {data.retro.participants.map((participant, participantIndex) => (
                        <React.Fragment key={`participant-${participantIndex}`}>
                          {participant.items.map((item, itemIndex) => (
                            <tr key={`${participantIndex}-${itemIndex}`} className="hover:bg-gray-50">
                              <td className={`px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 ${
                                itemIndex === 0 ? "font-semibold" : ""
                              }`}>
                                {itemIndex === 0 ? (
                                  <AttendeeSelect
                                    attendees={data.attendees}
                                    value={participant.name}
                                    onValueChange={(value) => handleRetroParticipantChange(participantIndex, value)}
                                    className="min-w-[150px]"
                                  />
                                ) : ""}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900 capitalize">
                                {item.category}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900">
                                {item.description}
                              </td>
                            </tr>
                          ))}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </AccordionContent>
            </Card>
          </AccordionItem>
        )}

        {data.metrics && (
          <AccordionItem value="metrics">
            <Card>
              <CardHeader>
                <AccordionTrigger>
                  <CardTitle className="flex text-xl font-normal">
                    / Meeting Analytics
                  </CardTitle>
                </AccordionTrigger>
              </CardHeader>
              <AccordionContent>
                <CardContent>
                  {renderMetrics()}
                </CardContent>
              </AccordionContent>
            </Card>
          </AccordionItem>
        )}
      </Accordion>
    </>
  );
};
