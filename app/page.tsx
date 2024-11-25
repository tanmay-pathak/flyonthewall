"use client";

import Flies from "@/components/Flies";
import Hero from "@/components/Hero";
import { PreviousMeetingsList } from "@/components/PreviousMeetings";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
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
  const [inputText, setInputText] = useState("");

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
    await processText(text);
  };

  const handleTextSubmit = async () => {
    if (!inputText.trim()) return;
    setStatus("parsing");
    await processText(inputText);
    setInputText("");
  };

  const processText = async (text: string) => {
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
              <Upload handleFileChange={handleFileChange} />
              <div className="mt-4 space-y-2">
                <p className="text-sm text-muted-foreground">
                  Or copy-paste your meeting transcript:
                </p>
                <Textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Paste your meeting transcript here..."
                  className="min-h-[128px]"
                />
                <Button
                  onClick={handleTextSubmit}
                  disabled={!inputText.trim()}
                  className="w-full"
                >
                  Process Text
                </Button>
              </div>
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
              <MeetingDetails data={parsedResult} />
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  );
}
