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
    <div className="">
      <Accordion type={"multiple"} className="w-full">
        <AccordionItem value="summary">
          <Card>
            <CardHeader>
              <AccordionTrigger>
                <CardTitle>
                  Summary
                  <p className="text-sm text-muted-foreground text-left">
                    A brief summary of the meeting
                  </p>
                </CardTitle>
              </AccordionTrigger>
            </CardHeader>
            <AccordionContent>
              <CardContent>
                <p>{data.summary}</p>
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
              <CardDescription>
                Highlights from the meeting notes
              </CardDescription>
              <CardContent>
                <ul>
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
              <CardDescription>Tasks to be completed</CardDescription>
              <CardContent>
                <ul>
                  {data.actionItems.map((item, index) => (
                    <li key={index}>
                      <strong>{item.assignee}</strong> - {item.actionItem} (Due:{" "}
                      {new Date(item.dueDate).toLocaleDateString()})
                    </li>
                  ))}
                </ul>
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
              <CardDescription>Ideas for future tasks</CardDescription>
              <CardContent>
                <ul>
                  {data.potentialActionItems.map((item, index) => (
                    <li key={index}>
                      <strong>{item.assignee}</strong> - {item.actionItem} (Due:{" "}
                      {new Date(item.dueDate).toLocaleDateString()})
                    </li>
                  ))}
                </ul>
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
    </div>
  );
};
