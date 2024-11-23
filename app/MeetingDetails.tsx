import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { z } from "zod";
import { menuSchema } from "./api/parseMenu/schema";
import {Button} from "@/components/ui/button";

export const MeetingDetails = ({
  data,
}: {
  data: z.infer<typeof menuSchema>;
}) => {
  const formatSummaryData = (data: any): string => {
    let formattedString = `Title: ${data.title}\n`;
    formattedString += `Date: ${data.date}\n`;
    formattedString += `Length: ${data.length}\n`;
    formattedString += `Attendees:\n`;
    data.attendees.forEach((attendee: string) => {
      formattedString += `  - ${attendee}\n`;
    });
    formattedString += `Summary: ${data.summary}\n`;
    return formattedString;
  };

  const formatKeyHighlightsData = (data: any): string => {
    let formattedString = `Meeting Notes:\n`;
    data.meetingNotes.forEach((note: string) => {
      formattedString += `  - ${note}\n`;
    });
    return formattedString;
  }
  const copySummary = () => {
    const humanReadableData = formatSummaryData(data);
    navigator.clipboard.writeText(humanReadableData).then(() => {
      alert("Summary copied to clipboard");
    }).catch(err => {
      console.error("Failed to copy to clipboard", err);
    });
  }

  const copyKeyHighlights = () => {
    const humanReadableData = formatKeyHighlightsData(data);
    navigator.clipboard.writeText(humanReadableData).then(() => {
      alert("Key Highlights copied to clipboard");
    }).catch(err => {
      console.error("Failed to copy to clipboard", err);
    });
  }

  return (
    <Accordion
      type={"multiple"}
      defaultValue={["summary"]}
      className="w-full flex flex-col gap-4"
    >
      <AccordionItem value="summary">
        <Card>
          <CardHeader className="flex flex-row items-start">
            <AccordionTrigger>
              <CardTitle className="flex text-xl font-normal">/ Summary</CardTitle>
            </AccordionTrigger>
            <Button variant="ghost" onClick={copySummary}><img alt="" src="/copy.png"/></Button>
          </CardHeader>
          <AccordionContent>
            <CardContent>
              <CardDescription className="mb-4"><span className="font-bold text-black">Title: </span>{data.title}</CardDescription>
              <CardDescription className="mb-4"><span className="font-bold text-black">Date: </span>{data.date}</CardDescription>
              <CardDescription className="mb-4"><span className="font-bold text-black">Length: </span>{data.length}</CardDescription>
              <CardDescription className="mb-4"><span className="font-bold text-black">Attendees: </span></CardDescription>
              <ul className="list-slash pl-4 mt-2 mb-4">
              {data.attendees.map((attendee, index) => (
                <li key={index}>{attendee}</li>
              ))}
              </ul>

              <CardDescription className="mb-2"><span className="font-bold text-black">TL;DR: </span></CardDescription>
              <p className="mt-2 mb-4">{data.summary}</p>
            </CardContent>
          </AccordionContent>
        </Card>
      </AccordionItem>

      <AccordionItem value="meeting-notes">
        <Card>
          <CardHeader className="flex-row items-start">
            <AccordionTrigger>
              <CardTitle className="flex text-xl font-normal">/ Key Highlights</CardTitle>
            </AccordionTrigger>
            <Button variant="ghost" onClick={copyKeyHighlights}><img alt="" src="/copy.png"/></Button>
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
            <CardFooter>
              <p className="text-sm text-gray-500">
                Total Points: {data.meetingNotes.length}
              </p>
            </CardFooter>
          </AccordionContent>
        </Card>
      </AccordionItem>

      <AccordionItem value="action-items">
        <Card>
          <CardHeader>
            <AccordionTrigger>
              <CardTitle className="flex text-xl font-normal">/ Action Items</CardTitle>
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
            <CardFooter>
              <p className="text-sm text-gray-500">
                Total Confirmed Tasks: {data.actionItems.length}
              </p>
            </CardFooter>
          </AccordionContent>
        </Card>
      </AccordionItem>

      <AccordionItem value="potential-action-items">
        <Card>
          <CardHeader>
            <AccordionTrigger>
              <CardTitle className="flex text-xl font-normal">/ Potential Action Items</CardTitle>
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
            <CardFooter>
              <p className="text-sm text-gray-500">
                Total Proposed Tasks: {data.potentialActionItems.length}
              </p>
            </CardFooter>
          </AccordionContent>
        </Card>
      </AccordionItem>
      {data.retro && (
        <AccordionItem value="retro-section">
          <Card>
            <CardHeader>
              <AccordionTrigger>
                <CardTitle className="flex text-xl font-normal">/ Team Retrospective</CardTitle>
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
                        <>
                          {participant.items.map((item, itemIndex) => (
                            <tr key={itemIndex}>
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
                        </>
                      )
                    )}
                  </tbody>
                </table>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-gray-500">
                  Total Participants: {data.retro?.participants.length}
                </p>
              </CardFooter>
            </AccordionContent>
          </Card>
        </AccordionItem>
      )}
    </Accordion>
  );
};
