"use client";

import Flies from "@/components/Flies";
import Hero from "@/components/Hero";
import { PreviousMeetingsList } from "@/components/PreviousMeetings";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUmami } from "next-umami";
import { useEffect, useState } from "react";
import { z } from "zod";
import { MeetingDetails } from "../components/MeetingDetails";
import Upload from "../components/Upload";
import { parseMeetingNotes } from "../server-actions/meetings";
import { meetingSchema } from "../server-actions/schema";

export const maxDuration = 60;

export default function Home() {
  const [status, setStatus] = useState<
    "initial" | "uploading" | "parsing" | "created"
  >("initial");
  const [parsedResult, setParsedResult] =
    useState<z.infer<typeof meetingSchema>>();
  const [previousMeetings, setPreviousMeetings] = useState<
    z.infer<typeof meetingSchema>[]
  >([]);
  const umami = useUmami();

  useEffect(() => {
    // Load previous meetings from localStorage on component mount
    const stored = localStorage.getItem("meetings");
    if (stored) {
      setPreviousMeetings(JSON.parse(stored));
    }

    // Check URL hash for shared meeting data
    const hash = window.location.hash.slice(1);
    if (hash) {
      try {
        const decodedData = JSON.parse(decodeURIComponent(hash));
        const parsedData = meetingSchema.parse(decodedData);
        setStatus("created");
        setParsedResult(parsedData);

        // Save decoded meeting to localStorage
        const newMeetings = stored
          ? [...JSON.parse(stored), parsedData]
          : [parsedData];
        localStorage.setItem("meetings", JSON.stringify(newMeetings));
        setPreviousMeetings(newMeetings);
      } catch (error) {
        console.error("Failed to parse shared meeting data:", error);
      }
    }
  }, []);

  const handleFileChange = async (file: File) => {
    setStatus("uploading");
    const text = await file.text();
    setStatus("parsing");

    const result = await parseMeetingNotes(text);
    if (result) {
      setStatus("created");
      setParsedResult(result as z.infer<typeof meetingSchema>);

      umami.event("newMeeting", {
        fileName: file.name,
      });

      // Save to localStorage
      const newMeetings = [
        ...previousMeetings,
        result as z.infer<typeof meetingSchema>,
      ];
      localStorage.setItem("meetings", JSON.stringify(newMeetings));
      setPreviousMeetings(newMeetings);
    }
  };

  const handleTextSubmit = async (text: string) => {
    setStatus("parsing");
    const result = await parseMeetingNotes(text);
    if (result) {
      setStatus("created");
      setParsedResult(result as z.infer<typeof meetingSchema>);

      umami.event("newMeeting", {
        type: "pasted",
      });

      // Save to localStorage
      const newMeetings = [
        ...previousMeetings,
        result as z.infer<typeof meetingSchema>,
      ];
      localStorage.setItem("meetings", JSON.stringify(newMeetings));
      setPreviousMeetings(newMeetings);
    }
  };

  const handleMeetingSelect = (meeting: z.infer<typeof meetingSchema>) => {
    setStatus("created");
    setParsedResult(meeting);
  };

  return (
    <div className="container px-4 py-8 bg-white max-w-screen-lg mx-auto">
      {status === "initial" && <Hero />}
      <div className="flex flex-col">
        {status === "initial" && (
          <>
            <div className="flex-1 p-4">
              <Upload
                handleFileChange={handleFileChange}
                handleTextSubmit={handleTextSubmit}
              />
            </div>
            <PreviousMeetingsList
              meetings={previousMeetings}
              onMeetingSelect={handleMeetingSelect}
              onMeetingDelete={(index) => {
                const newMeetings = previousMeetings.filter(
                  (_, i) => i !== index
                );
                localStorage.setItem("meetings", JSON.stringify(newMeetings));
                setPreviousMeetings(newMeetings);
              }}
            />
          </>
        )}
        {(status === "uploading" || status === "parsing") && <Flies />}
        {parsedResult && (
          <div className="flex-1">
            <ScrollArea className="h-full w-full rounded-md p-4 gap-2">
              <MeetingDetails
                data={parsedResult}
                onDataChange={(newData) => {
                  setParsedResult(newData);

                  // Update in previousMeetings as well
                  const newMeetings = previousMeetings.map((meeting) =>
                    meeting.title === newData.title ? newData : meeting
                  );
                  localStorage.setItem("meetings", JSON.stringify(newMeetings));
                  setPreviousMeetings(newMeetings);
                }}
              />
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  );
}
