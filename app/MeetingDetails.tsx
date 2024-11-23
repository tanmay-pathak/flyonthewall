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
      <Accordion type={"multiple"} className="w-full flex flex-col gap-4">
        <AccordionItem value="summary">
          <Card>
            <CardHeader>
              <AccordionTrigger>
                <CardTitle className="flex">
                  MEETING TITLE
                </CardTitle>
              </AccordionTrigger>
            </CardHeader>
            <AccordionContent>
              <CardContent>
                Summary
                <p>{data.summary}</p>
                Attendees
                <ul className="list-disc">
                  {data.attendees.map((note, index) => (
                    <li key={index}>{note}</li>
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
                <CardTitle>Meeting Notes</CardTitle>
              </AccordionTrigger>
            </CardHeader>
            <AccordionContent>
              <CardContent>
                <ul className="list-disc">
                  {data.meetingNotes.map((note, index) => (
                    <li key={index}>{note}</li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <p>Total Notes: {data.meetingNotes.length}</p>
              </CardFooter>
            </AccordionContent>
          </Card>
        </AccordionItem>

        <AccordionItem value="action-items">
          <Card>
            <CardHeader>
              <AccordionTrigger>
                <CardTitle>Action Items</CardTitle>
              </AccordionTrigger>
            </CardHeader>
            <AccordionContent>
              <CardContent>
              <table className="table-auto border-collapse border border-gray-200">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-4 py-2">Assignee</th>
                  <th className="border border-gray-300 px-4 py-2">Action Item</th>
                  <th className="border border-gray-300 px-4 py-2">Due Date</th>
                </tr>
              </thead>
              <tbody>
                {data.actionItems.map((item, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 px-4 py-2">{item.assignee}</td>
                    <td className="border border-gray-300 px-4 py-2">{item.actionItem}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      {new Date(item.dueDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
              </CardContent>
              <CardFooter>
                <p>Total Action Items: {data.actionItems.length}</p>
              </CardFooter>
            </AccordionContent>
          </Card>
        </AccordionItem>

        <AccordionItem value="potential-action-items">
          <Card>
            <CardHeader>
              <AccordionTrigger>
                <CardTitle>Potential Action Items</CardTitle>
              </AccordionTrigger>
            </CardHeader>
            <AccordionContent>
              <CardContent>
                <table className="table-auto border-collapse border border-gray-200">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-4 py-2">Assignee</th>
                  <th className="border border-gray-300 px-4 py-2">Action Item</th>
                  <th className="border border-gray-300 px-4 py-2">Due Date</th>
                </tr>
              </thead>
              <tbody>
                {data.potentialActionItems.map((item, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 px-4 py-2">{item.assignee}</td>
                    <td className="border border-gray-300 px-4 py-2">{item.actionItem}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      {new Date(item.dueDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
              </CardContent>
              <CardFooter>
                <p>
                  Total Potential Action Items:{" "}
                  {data.potentialActionItems.length}
                </p>
              </CardFooter>
            </AccordionContent>
          </Card>
        </AccordionItem>
      </Accordion>
  );
};
