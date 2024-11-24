import { getPotentialActionItemsData } from "@/server-actions/meetings";
import { AccordionContent, AccordionTrigger } from "../ui/accordion";
import { Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import LoadingCard from "./LoadingCard";
import { ActionItem } from "./ActionsCard";

type PotentialActionItemsData = {
  potentialActionItems: ActionItem[];
};

export const PotentialActionItemsCard = ({
  meetingId,
}: {
  meetingId: string;
}) => {
  const [data, setData] = useState<PotentialActionItemsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Try to get from localStorage first
        const storedData = localStorage.getItem(
          `potential-action-items-${meetingId}`
        );
        let potentialActionItemsData = storedData
          ? JSON.parse(storedData)
          : null;

        if (!potentialActionItemsData) {
          // Get meeting data from localStorage
          const meetings = localStorage.getItem("meetings");
          const meetingsData = meetings ? JSON.parse(meetings) : [];
          const meeting = meetingsData.find((m: any) => m.id === meetingId);

          if (!meeting) return;

          // If not in localStorage, fetch from server with fullText
          potentialActionItemsData = await getPotentialActionItemsData(
            meeting.fullText
          );

          // Store in localStorage for future use
          if (potentialActionItemsData) {
            localStorage.setItem(
              `potential-action-items-${meetingId}`,
              JSON.stringify(potentialActionItemsData)
            );
          }
        }

        setData(potentialActionItemsData);
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
              {data.potentialActionItems.map(
                (item: ActionItem, index: number) => (
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
                )
              )}
            </tbody>
          </table>
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-sm text-gray-500">
            Total Proposed Tasks: {data.potentialActionItems.length}
          </p>
          <Button
            variant="ghost"
            onClick={() =>
              navigator.clipboard.writeText(
                JSON.stringify(data.potentialActionItems, null, 2)
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
