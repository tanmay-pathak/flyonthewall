"use client";

import Flies from "@/components/Flies";
import Hero from "@/components/Hero";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { z } from "zod";
import { MeetingDetails } from "../components/MeetingDetails";
import Upload from "../components/Upload";
import { parseMeetingNotes } from "../server-actions/meetings";
import { menuSchema } from "../server-actions/schema";

export default function Home() {
  const [status, setStatus] = useState<
    "initial" | "uploading" | "parsing" | "created"
  >("initial");
  const [parsedResult, setParsedResult] =
    useState<z.infer<typeof menuSchema>>();
  const [previousMeetings, setPreviousMeetings] = useState<
    z.infer<typeof menuSchema>[]
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
      setParsedResult(result as z.infer<typeof menuSchema>);

      // Save to localStorage
      const newMeetings = [
        ...previousMeetings,
        result as z.infer<typeof menuSchema>,
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
            {previousMeetings.length > 0 && (
              <div className="flex-1 p-4">
                <h2 className="text-xl font-bold mb-4">Previous Meetings</h2>
                <div className="space-y-2">
                  {previousMeetings.map((meeting, index) => (
                    <div
                      key={index}
                      className="p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <h3 className="font-semibold">{meeting.title}</h3>
                      <p className="text-gray-600">{meeting.date}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
