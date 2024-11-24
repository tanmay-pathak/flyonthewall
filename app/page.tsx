"use client";

import Flies from "@/components/Flies";
import Hero from "@/components/Hero";
import { PreviousMeetingsList } from "@/components/PreviousMeetings";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { z } from "zod";
import { MeetingDetails } from "../components/MeetingDetails";
import Upload from "../components/Upload";
import { parseMeetingNotes } from "../server-actions/meetings";
import { meetingSchema } from "../server-actions/schema";

export default function Home() {
  const [status, setStatus] = useState<
    "initial" | "uploading" | "parsing" | "created"
  >("initial");
  const [parsedResult, setParsedResult] =
    useState<z.infer<typeof meetingSchema>>();
  const [previousMeetings, setPreviousMeetings] = useState<
    z.infer<typeof meetingSchema>[]
  >([]);

  useEffect(() => {
    // Load previous meetings from localStorage on component mount
    const stored = localStorage.getItem("meetings");
    if (stored) {
      setPreviousMeetings(JSON.parse(stored));
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

      // Save to localStorage
      const newMeetings = [
        ...previousMeetings,
        result as z.infer<typeof meetingSchema>,
      ];
      localStorage.setItem("meetings", JSON.stringify(newMeetings));
      setPreviousMeetings(newMeetings);
    }
  };

  return (
    <div className="container px-4 py-8 bg-white max-w-screen-lg mx-auto">
      {status === "initial" && <Hero />}
      <div className="flex flex-col">
        {status === "initial" && (
          <>
            <div className="flex-1 p-4">
              <Upload handleFileChange={handleFileChange} />
            </div>
            <PreviousMeetingsList
              meetings={previousMeetings}
              onMeetingSelect={(meeting) => {
                setStatus("created");
                setParsedResult(meeting);
              }}
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
              <MeetingDetails data={parsedResult} />
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  );
}
