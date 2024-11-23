"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { DocumentTextIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import Dropzone from "react-dropzone";
import { z } from "zod";
import { menuSchema } from "./api/parseMenu/schema";
import { MeetingDetails } from "./MeetingDetails";

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
    <div className="container text-center px-4 py-8 bg-white max-w-screen-xl mx-auto">
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
      <div className="flex h-96">
        <div className="flex-1 p-4">
          <Dropzone
            accept={{
              "text/plain": [".txt"],
            }}
            multiple={false}
            onDrop={(acceptedFiles) => handleFileChange(acceptedFiles[0])}
          >
            {({ getRootProps, getInputProps, isDragAccept }) => (
              <div
                className={`flex aspect-video cursor-pointer items-center justify-center rounded-lg border-2 border-dashed ${
                  isDragAccept ? "border-blue-500" : "border-gray-300"
                }`}
                {...getRootProps()}
              >
                <input {...getInputProps()} />
                <div className="text-center">
                  <DocumentTextIcon
                    className="mx-auto h-12 w-12 text-gray-300"
                    aria-hidden="true"
                  />
                  <div className="mt-4 flex text-sm leading-6 text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative rounded-md bg-white font-semibold text-gray-800 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 hover:text-gray-600"
                    >
                      <p className="text-xl">Upload your meeting transcript</p>
                      <p className="mt-1 font-normal text-gray-600">
                        Supports txt file
                      </p>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </Dropzone>
        </div>
        {parsedResult && (
          <>
            <div className="w-[2px] bg-gray-300"></div>
            <div className="flex-1">
              <ScrollArea className="h-full w-full rounded-md p-4 gap-2">
                <div className="flex flex-col gap-4">
                  <MeetingDetails data={parsedResult} />
                </div>
              </ScrollArea>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
