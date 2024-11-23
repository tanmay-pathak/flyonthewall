import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { z } from "zod";
import { menuSchema } from "./api/parseMenu/schema";

export const MeetingDetails = ({ data }: { data: z.infer<typeof menuSchema> }) => {
    return (
      <div className="flex flex-col gap-4">
        {/* Meeting Notes Card */}
        <Card>
          <CardHeader>
            <CardTitle>Meeting Notes</CardTitle>
            <CardDescription>Highlights from the meeting notes</CardDescription>
          </CardHeader>
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
        </Card>

        {/* Summary Card */}
        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
            <CardDescription>A brief summary of the meeting</CardDescription>
          </CardHeader>
          <CardContent>
            <p>{data.summary}</p>
          </CardContent>
          <CardFooter>
            <p>End of Summary</p>
          </CardFooter>
        </Card>

        {/* Action Items Card */}
        <Card>
          <CardHeader>
            <CardTitle>Action Items</CardTitle>
            <CardDescription>Tasks to be completed</CardDescription>
          </CardHeader>
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
        </Card>

        {/* Potential Action Items Card */}
        <Card>
          <CardHeader>
            <CardTitle>Potential Action Items</CardTitle>
            <CardDescription>Ideas for future tasks</CardDescription>
          </CardHeader>
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
              Total Potential Action Items: {data.potentialActionItems.length}
            </p>
          </CardFooter>
        </Card>
      </div>
    );
  };
