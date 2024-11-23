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

export const MeetingDetails = ({
  data,
}: {
  data: z.infer<typeof menuSchema>;
}) => {
  return (
    <Accordion
      type={"multiple"}
      defaultValue={["summary"]}
      className="w-full flex flex-col gap-4"
    >
      <AccordionItem value="summary">
        <Card>
          <CardHeader>
            <AccordionTrigger>
              <CardTitle className="flex">{data.title}</CardTitle>
            </AccordionTrigger>
          </CardHeader>
          <AccordionContent>
            <CardContent>
              <CardDescription>Summary</CardDescription>
              <p className="mt-2 mb-4">{data.summary}</p>

              <CardDescription>Attendees</CardDescription>
              <ul className="list-disc pl-4 mt-2">
                {data.attendees.map((attendee, index) => (
                  <li key={index}>{attendee}</li>
                ))}
              </ul>
            </CardContent>
          </AccordionContent>
        </Card>
      </AccordionItem>

      <AccordionItem value="meeting-notes">
        <Card>
          <CardHeader>
            <AccordionTrigger>
              <CardTitle>Key Points & Highlights</CardTitle>
            </AccordionTrigger>
          </CardHeader>
          <AccordionContent>
            <CardContent>
              <ul className="list-disc pl-4">
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
              <CardTitle>Confirmed Action Items</CardTitle>
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
                        {new Date(item.dueDate).toLocaleDateString()}
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
              <CardTitle>Proposed Future Tasks</CardTitle>
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
                        {new Date(item.dueDate).toLocaleDateString()}
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
                <CardTitle>Team Retrospective</CardTitle>
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
