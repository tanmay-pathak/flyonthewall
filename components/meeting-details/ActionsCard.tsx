import { getActionItemsData } from "@/server-actions/meetings";
import { Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { AccordionContent, AccordionTrigger } from "../ui/accordion";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import LoadingCard from "./LoadingCard";

type ActionItemsData = {
  actionItems: ActionItem[];
};

export type ActionItem = {
  assignee: string;
  actionItem: string;
  dueDate: string | null;
};

export const ActionItemsCard = ({ meetingId }: { meetingId: string }) => {
  const [data, setData] = useState<ActionItemsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Try to get from localStorage first
        const storedData = localStorage.getItem(`action-items-${meetingId}`);
        let actionItemsData = storedData ? JSON.parse(storedData) : null;

        if (!actionItemsData) {
          // Get meeting data from localStorage
          const meetings = localStorage.getItem("meetings");
          const meetingsData = meetings ? JSON.parse(meetings) : [];
          const meeting = meetingsData.find((m: any) => m.id === meetingId);

          if (!meeting) return;

          // If not in localStorage, fetch from server with fullText
          actionItemsData = await getActionItemsData(meeting.fullText);

          // Store in localStorage for future use
          if (actionItemsData) {
            localStorage.setItem(
              `action-items-${meetingId}`,
              JSON.stringify(actionItemsData)
            );
          }
        }

        setData(actionItemsData);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [meetingId]);

  if (loading) {
    return <LoadingCard />;
  }

  if (!data) return null;

  return (
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
                <th className="border border-gray-300 px-4 py-2">Assignee</th>
                <th className="border border-gray-300 px-4 py-2">
                  Task Description
                </th>
                <th className="border border-gray-300 px-4 py-2">Due Date</th>
              </tr>
            </thead>
            <tbody>
              {data.actionItems.map((item: ActionItem, index: number) => (
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
              navigator.clipboard.writeText(
                JSON.stringify(data.actionItems, null, 2)
              )
            }
          >
            <Copy className="h-4 w-4" />
          </Button>
        </CardFooter>
      </AccordionContent>
    </Card>
  );
};
