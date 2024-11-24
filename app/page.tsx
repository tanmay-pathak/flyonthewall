"use client";

import Flies from "@/components/Flies";
import Hero from "@/components/Hero";
import { PreviousMeetingsList } from "@/components/PreviousMeetings";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { MeetingDetails } from "../components/MeetingDetails";
import Upload from "../components/Upload";

export default function Home() {
  const [status, setStatus] = useState<
    "initial" | "uploading" | "parsing" | "created"
  >("initial");
  const [meetingId, setMeetingId] = useState<string>();
  const [previousMeetingIds, setPreviousMeetingIds] = useState<string[]>([]);

  useEffect(() => {
    // Load previous meeting IDs from localStorage on component mount
    const stored = localStorage.getItem("meetingIds");
    if (stored) {
      setPreviousMeetingIds(JSON.parse(stored));
    }
  }, []);

  const handleFileChange = async (file: File) => {
    setStatus("uploading");
    const text = await file.text();

    const id = crypto.randomUUID();
    const meeting = {
      id,
      fullText: text,
    };

    // Save meeting data
    const meetings = localStorage.getItem("meetings");
    const existingMeetings = meetings ? JSON.parse(meetings) : [];
    localStorage.setItem(
      "meetings",
      JSON.stringify([...existingMeetings, meeting])
    );

    // Save meeting ID
    const newMeetingIds = [...previousMeetingIds, id];
    localStorage.setItem("meetingIds", JSON.stringify(newMeetingIds));
    setPreviousMeetingIds(newMeetingIds);

    setStatus("created");
    setMeetingId(id);
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
              meetings={previousMeetingIds}
              onMeetingSelect={(id) => {
                setStatus("created");
                setMeetingId(id);
              }}
              onMeetingDelete={(index) => {
                const newMeetingIds = previousMeetingIds.filter(
                  (_, i) => i !== index
                );
                localStorage.setItem(
                  "meetingIds",
                  JSON.stringify(newMeetingIds)
                );
                setPreviousMeetingIds(newMeetingIds);
              }}
            />
          </>
        )}
        {(status === "uploading" || status === "parsing") && <Flies />}
        {meetingId && (
          <div className="flex-1">
            <ScrollArea className="h-full w-full rounded-md p-4 gap-2">
              <MeetingDetails meetingId={meetingId} />
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  );
}
