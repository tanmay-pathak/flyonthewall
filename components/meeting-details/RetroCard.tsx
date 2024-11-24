import { useToast } from "@/hooks/use-toast";
import { getRetroData } from "@/server-actions/meetings";
import { Copy } from "lucide-react";
import React, { useEffect, useState } from "react";
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

type RetroItem = {
  category: string;
  description: string;
};

type RetroParticipant = {
  name: string;
  items: RetroItem[];
};

type RetroData = {
  retro: {
    participants: RetroParticipant[];
  } | null;
};

export const RetroCard = ({ meetingId }: { meetingId: string }) => {
  const { toast } = useToast();
  const [data, setData] = useState<RetroData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Try to get from localStorage first
        const storedData = localStorage.getItem(`retro-${meetingId}`);
        let retroData = storedData ? JSON.parse(storedData) : null;

        if (!retroData) {
          // Get meeting data from localStorage
          const meetings = localStorage.getItem("meetings");
          const meetingsData = meetings ? JSON.parse(meetings) : [];
          const meeting = meetingsData.find((m: any) => m.id === meetingId);

          if (!meeting) return;

          // If not in localStorage, fetch from server with fullText
          retroData = await getRetroData(meeting.fullText);

          // Store in localStorage for future use
          if (retroData) {
            localStorage.setItem(
              `retro-${meetingId}`,
              JSON.stringify(retroData)
            );
          }
        }

        setData(retroData);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [meetingId]);

  if (loading) {
    return <LoadingCard />;
  }

  if (!data || !data.retro) return null;

  const copyRetro = () => {
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
  };

  return (
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
                <th className="border border-gray-300 px-4 py-2">Category</th>
                <th className="border border-gray-300 px-4 py-2">
                  Description
                </th>
              </tr>
            </thead>
            <tbody>
              {data.retro.participants.map((participant, participantIndex) => (
                <React.Fragment key={`participant-${participantIndex}`}>
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
              ))}
            </tbody>
          </table>
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-sm text-gray-500">
            Total Participants: {data.retro.participants.length}
          </p>
          <Button variant="ghost" onClick={copyRetro}>
            <Copy className="h-4 w-4" />
          </Button>
        </CardFooter>
      </AccordionContent>
    </Card>
  );
};
