"use client";

import Flies from "@/components/Flies";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { z } from "zod";
import { MeetingDetails } from "./MeetingDetails";
import { parseMeetingNotes } from "./server-actions/meetings";
import { menuSchema } from "./server-actions/schema";
import Upload from "./Upload";

export default function Home() {
  const [status, setStatus] = useState<
    "initial" | "uploading" | "parsing" | "created"
  >("initial");
  const [parsedResult, setParsedResult] =
    useState<z.infer<typeof menuSchema>>();

  const handleFileChange = async (file: File) => {
    setStatus("uploading");
    const text = await file.text();
    setStatus("parsing");

    const result = await parseMeetingNotes(text);
    if (result) {
      setStatus("created");
      setParsedResult(result as z.infer<typeof menuSchema>);
    }
  };

  return (
    <div className="container px-4 py-8 bg-white max-w-screen-lg mx-auto">
      {status === "initial" && (
        <>
          <div className="text-center mt-2">
            <h1 className="mb-8 text-balance text-6xl font-bold text-zinc-800">
              Meeting Notes Assistant
            </h1>
          </div>
          <div className="max-w-3xl text-center mx-auto">
            <p className="mb-12 text-lg text-gray-600 text-balance leading-relaxed">
              Upload your meeting transcript and get an AI-powered summary with
              action items, key points, and attendees.
              <br />
              <span className="mt-4 block text-sm text-gray-500 italic">
                To export your transcript from Google Docs as a .txt file, go to
                File → Download → Plain text.
              </span>
            </p>
          </div>
        </>
      )}
      <div className="flex">
        {status === "initial" && (
          <div className="flex-1 p-4">
            <Upload handleFileChange={handleFileChange} />
          </div>
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
