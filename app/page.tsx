"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { z } from "zod";
import { menuSchema } from "./api/parseMenu/schema";
import { MeetingDetails } from "./MeetingDetails";
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

    const res = await fetch("/api/parseMenu", {
      method: "POST",
      body: JSON.stringify({
        text: text,
      }),
    });
    const json = await res.json();

    console.log({ json });

    setStatus("created");
    const validatedOutput = menuSchema.parse(json);
    setParsedResult(validatedOutput);
  };

  return (
    <div className="container px-4 py-8 bg-white max-w-screen-lg mx-auto">
      <div className="max-w-2xl text-center mx-auto mt-2">
        <h1 className="mb-6 text-balance text-6xl font-bold text-zinc-800">
          Meeting Summarizer
        </h1>
      </div>
      <div className="max-w-3xl text-center mx-auto">
        <p className="mb-8 text-lg text-gray-500 text-balance ">
          Copy and paste your meeting notes below to get a summary of the key
        </p>
      </div>
      <div className="flex">
        {status === "initial" && (
          <div className="flex-1 p-4">
            <Upload handleFileChange={handleFileChange} />
          </div>
        )}
        {(status === "uploading" || status === "parsing") && (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            <span className="ml-3 text-gray-500">
              {status === "uploading" ? "Uploading..." : "Analyzing notes..."}
            </span>
          </div>
        )}
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
