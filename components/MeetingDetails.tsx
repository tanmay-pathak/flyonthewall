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
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { formatKeyHighlightsData, formatSummaryData } from "@/lib/formatters";
import { handleShareURL } from "@/lib/utils";
import { ArrowLeft, Copy, Share2 } from "lucide-react";
import React from "react";
import { z } from "zod";
import { meetingSchema } from "../server-actions/schema";

export const MeetingDetails = ({
  data,
}: {
  data: z.infer<typeof meetingSchema>;
}) => {
  const { toast } = useToast();

  const copySummary = (data: any) => {
    const humanReadableData = formatSummaryData(data);
    navigator.clipboard
      .writeText(humanReadableData)
      .then(() => {
        toast({
          title: "Success",
          description: "Summary copied to clipboard",
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

  const copyKeyHighlights = () => {
    const humanReadableData = formatKeyHighlightsData(data);
    navigator.clipboard
      .writeText(humanReadableData)
      .then(() => {
        toast({
          title: "Success",
          description: "Key Highlights copied to clipboard",
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
        <Button variant="ghost" onClick={() => handleShareURL(data)}>
          Share
          <Share2 className="h-4 w-4 mr-2" />
        </Button>
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
                <CardDescription className="mb-4">
                  <span className="font-bold text-black">Title: </span>
                  {data.title}
                </CardDescription>
                <CardDescription className="mb-4">
                  <span className="font-bold text-black">Date: </span>
                  {data.date}
                </CardDescription>
                <CardDescription className="mb-4">
                  <span className="font-bold text-black">Length: </span>
                  {data.length}
                </CardDescription>
                <CardDescription className="mb-4">
                  <span className="font-bold text-black">Attendees: </span>
                </CardDescription>
                <ul className="list-slash pl-4 mt-2 mb-4">
                  {data.attendees.map((attendee, index) => (
                    <li key={index}>{attendee}</li>
                  ))}
                </ul>

                <CardDescription className="mb-2">
                  <span className="font-bold text-black">TL;DR: </span>
                </CardDescription>
                <p className="mt-2 mb-4">{data.summary}</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <p className="text-sm text-gray-500">Summary Details</p>
                <div className="flex gap-2">
                  <Button variant="ghost" onClick={() => copySummary(data)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
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
                <ul className="list-slash pl-4">
                  {data.meetingNotes.map((note, index) => (
                    <li key={index} className="mb-2">
                      {note}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="flex justify-between">
                <p className="text-sm text-gray-500">
                  Total Points: {data.meetingNotes.length}
                </p>
                <Button variant="ghost" onClick={copyKeyHighlights}>
                  <Copy className="h-4 w-4" />
                </Button>
              </CardFooter>
            </AccordionContent>
          </Card>
        </AccordionItem>

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
                <table className="w-full table-auto border-collapse border border-gray-200">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2">
                        Assignee
                      </th>
                      <th className="border border-gray-300 px-4 py-2">
                        Task Description
                      </th>
                      <th className="border border-gray-300 px-4 py-2">
                        Due Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.actionItems.map((item, index) => (
                      <tr key={index}>
                        <td className="border border-gray-300 px-4 py-2">
                          {item.assignee}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {item.actionItem}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {item.dueDate
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
                <Button
                  variant="ghost"
                  onClick={() =>
                    navigator.clipboard
                      .writeText(JSON.stringify(data.actionItems, null, 2))
                      .then(() => {
                        toast({
                          title: "Success",
                          description: "Action items copied to clipboard",
                        });
                      })
                      .catch((err) => {
                        console.error("Failed to copy to clipboard", err);
                        toast({
                          title: "Error",
                          description: "Failed to copy to clipboard",
                          variant: "destructive",
                        });
                      })
                  }
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </CardFooter>
            </AccordionContent>
          </Card>
        </AccordionItem>

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
                <table className="w-full table-auto border-collapse border border-gray-200">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2">
                        Suggested Assignee
                      </th>
                      <th className="border border-gray-300 px-4 py-2">
                        Proposed Task
                      </th>
                      <th className="border border-gray-300 px-4 py-2">
                        Target Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.potentialActionItems.map((item, index) => (
                      <tr key={index}>
                        <td className="border border-gray-300 px-4 py-2">
                          {item.assignee}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {item.actionItem}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {item.dueDate
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
                <Button
                  variant="ghost"
                  onClick={() => {
                    navigator.clipboard
                      .writeText(
                        JSON.stringify(data.potentialActionItems, null, 2)
                      )
                      .then(() => {
                        toast({
                          title: "Success",
                          description:
                            "Potential action items copied to clipboard",
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
                  }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </CardFooter>
            </AccordionContent>
          </Card>
        </AccordionItem>
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
                  <table className="w-full table-auto border-collapse border border-gray-200">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 px-4 py-2">
                          Participant
                        </th>
                        <th className="border border-gray-300 px-4 py-2">
                          Category
                        </th>
                        <th className="border border-gray-300 px-4 py-2">
                          Description
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.retro?.participants.map(
                        (participant, participantIndex) => (
                          <React.Fragment
                            key={`participant-${participantIndex}`}
                          >
                            {participant.items.map((item, itemIndex) => (
                              <tr key={`${participantIndex}-${itemIndex}`}>
                                <td
                                  className={`border border-gray-300 px-4 py-2 ${
                                    itemIndex === 0 ? "font-semibold" : ""
                                  }`}
                                >
                                  {itemIndex === 0 ? participant.name : ""}
                                </td>
                                <td className="border border-gray-300 px-4 py-2 capitalize">
                                  {item.category}
                                </td>
                                <td className="border border-gray-300 px-4 py-2">
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
                  <Button
                    variant="ghost"
                    onClick={() => {
                      navigator.clipboard
                        .writeText(JSON.stringify(data.retro, null, 2))
                        .then(() => {
                          toast({
                            title: "Success",
                            description: "Retro data copied to clipboard",
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
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </AccordionContent>
            </Card>
          </AccordionItem>
        )}
      </Accordion>
    </>
  );
};
