import { useToast } from "@/hooks/use-toast";
import { formatSummaryData } from "@/lib/formatters";
import { getSummaryData } from "@/server-actions/meetings";
import { Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { AccordionContent, AccordionTrigger } from "../ui/accordion";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import LoadingCard from "./LoadingCard";

type SummaryData = {
  title: string;
  date: string;
  length: string;
  attendees: string[];
  summary: string;
};

export const SummaryCard = ({ meetingId }: { meetingId: string }) => {
  const { toast } = useToast();
  const [data, setData] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Try to get from localStorage first
        const storedData = localStorage.getItem(`summary-${meetingId}`);
        let summaryData = storedData ? JSON.parse(storedData) : null;

        if (!summaryData) {
          // Get meeting data from localStorage
          const meetings = localStorage.getItem("meetings");
          const meetingsData = meetings ? JSON.parse(meetings) : [];
          const meeting = meetingsData.find((m: any) => m.id === meetingId);

          if (!meeting) return;

          // If not in localStorage, fetch from server with fullText
          summaryData = await getSummaryData(meeting.fullText);

          // Store in localStorage for future use
          if (summaryData) {
            localStorage.setItem(
              `summary-${meetingId}`,
              JSON.stringify(summaryData)
            );
          }
        }

        setData(summaryData);
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

  const copySummary = () => {
    const humanReadableData = formatSummaryData(data as SummaryData);
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

  return (
    <Card>
      <CardHeader>
        <AccordionTrigger>
          <CardTitle className="flex text-xl font-normal">/ Summary</CardTitle>
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
            {data.attendees.map((attendee: string, index: number) => (
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
            <Button variant="ghost" onClick={copySummary}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </AccordionContent>
    </Card>
  );
};
