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
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { formatAsMarkdown } from "@/lib/formatters";
import { handleShareURL } from "@/lib/utils";
import cloneDeep from "lodash/cloneDeep";
import { ArrowLeft, Copy, Download, Share2 } from "lucide-react";
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

  const copyMarkdown = () => {
    const markdown = formatAsMarkdown(data);
    navigator.clipboard
      .writeText(markdown)
      .then(() => {
        toast({
          title: "Success",
          description: "Meeting notes copied to clipboard as markdown",
        });
      })
      .catch((err) => {
        console.error("Failed to copy to clipboard", err);
        toast({
          title: "Error",
          description: "Failed to copy to clipboard",
          variant: "destructive",
        });
      });
  };

  const exportMarkdown = () => {
    const markdown = formatAsMarkdown(data);
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${data.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_meeting_notes.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: "Success",
      description: "Meeting notes exported as markdown",
    });
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

  return (
    <>
      <div className="flex gap-2 mb-4 justify-between">
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
          <Button variant="ghost" onClick={copyMarkdown}>
            Copy
            <Copy className="h-4 w-4 ml-2" />
          </Button>
          <Button variant="ghost" onClick={exportMarkdown}>
            Export
            <Download className="h-4 w-4 ml-2" />
          </Button>
          <Button variant="ghost" onClick={() => handleShareURL(data)}>
            Share
            <Share2 className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
      <Accordion
        type={"multiple"}
        defaultValue={["summary"]}
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
                    <div>
                      <span className="text-sm font-medium text-gray-500 block mb-1">Length</span>
                      <p className="text-base text-gray-900">{data.length}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <span className="text-sm font-medium text-gray-500 block mb-2">Meeting Summary</span>
                    <p className="text-base text-gray-900 leading-relaxed whitespace-pre-wrap">{data.summary}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <p className="text-sm text-gray-500">Summary Details</p>
              </CardFooter>
            </AccordionContent>
          </Card>
        </AccordionItem>

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
              <CardFooter className="flex justify-between">
                <p className="text-sm text-gray-500">
                  Total Points: {data.meetingNotes.length}
                </p>
              </CardFooter>
            </AccordionContent>
          </Card>
        </AccordionItem>

        {data.actionItems && (
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
                <CardFooter className="flex justify-between">
                  <p className="text-sm text-gray-500">
                    Total Confirmed Tasks: {data.actionItems.length}
                  </p>
                </CardFooter>
              </AccordionContent>
            </Card>
          </AccordionItem>
        )}

        {data.potentialActionItems && (
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
                <CardFooter className="flex justify-between">
                  <p className="text-sm text-gray-500">
                    Total Proposed Tasks: {data.potentialActionItems.length}
                  </p>
                </CardFooter>
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
                      {data.retro?.participants.map(
                        (participant, participantIndex) => (
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
                        )
                      )}
                    </tbody>
                  </table>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <p className="text-sm text-gray-500">
                    Total Participants: {data.retro?.participants.length}
                  </p>
                </CardFooter>
              </AccordionContent>
            </Card>
          </AccordionItem>
        )}
      </Accordion>
    </>
  );
};
