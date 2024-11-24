import { useToast } from "@/hooks/use-toast";
import { formatKeyHighlightsData } from "@/lib/formatters";
import { getKeyHighlightsData } from "@/server-actions/meetings";
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

type KeyHighlightsData = {
  meetingNotes: string[];
};

export const KeyHighlightsCard = ({ meetingId }: { meetingId: string }) => {
  const { toast } = useToast();
  const [data, setData] = useState<KeyHighlightsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Try to get from localStorage first
        const storedData = localStorage.getItem(`highlights-${meetingId}`);
        let highlightsData = storedData ? JSON.parse(storedData) : null;

        if (!highlightsData) {
          // Get meeting data from localStorage
          const meetings = localStorage.getItem("meetings");
          const meetingsData = meetings ? JSON.parse(meetings) : [];
          const meeting = meetingsData.find((m: any) => m.id === meetingId);

          if (!meeting) return;

          // If not in localStorage, fetch from server with fullText
          highlightsData = await getKeyHighlightsData(meeting.fullText);

          // Store in localStorage for future use
          if (highlightsData) {
            localStorage.setItem(
              `highlights-${meetingId}`,
              JSON.stringify(highlightsData)
            );
          }
        }

        setData(highlightsData);
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

  const copyKeyHighlights = () => {
    const humanReadableData = formatKeyHighlightsData(
      data as KeyHighlightsData
    );
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
            {data.meetingNotes.map((note: string, index: number) => (
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
  );
};
