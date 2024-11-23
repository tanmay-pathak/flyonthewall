"use client";

import { useS3Upload } from "next-s3-upload";
import { useState } from "react";
import Dropzone from "react-dropzone";
import { PhotoIcon, MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { Input } from "@/components/ui/input";
import { MenuGrid } from "@/components/menu-grid";
import Image from "next/image";
import { italianMenuUrl, italianParsedMenu } from "@/lib/constants";
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"



export interface MenuItem {
  name: string;
  price: string;
  description: string;
  menuImage: {
    b64_json: string;
  };
}

export default function Home() {
  const { uploadToS3 } = useS3Upload();
  const [menuUrl, setMenuUrl] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<
    "initial" | "uploading" | "parsing" | "created"
  >("initial");
  const [parsedMenu, setParsedMenu] = useState<MenuItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const handleFileChange = async (file: File) => {
    const objectUrl = URL.createObjectURL(file);
    setStatus("uploading");
    setMenuUrl(objectUrl);
    const { url } = await uploadToS3(file);
    setMenuUrl(url);
    setStatus("parsing");

    const res = await fetch("/api/parseMenu", {
      method: "POST",
      body: JSON.stringify({
        menuUrl: url,
      }),
    });
    const json = await res.json();

    console.log({ json });

    setStatus("created");
    setParsedMenu(json.menu);
  };

  const handleSampleImage = async () => {
    setStatus("parsing");
    setMenuUrl(italianMenuUrl);
    await new Promise((resolve) => setTimeout(resolve, 3000));

    setStatus("created");
    setParsedMenu(italianParsedMenu);
  };

  const filteredMenu = parsedMenu.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const cardData = {
    meetingNotes: ["Discussed project milestones", "Reviewed budget"],
    summary: "Weekly team sync meeting",
    actionItems: [
      {
        assignee: "Alice",
        dueDate: new Date("2024-11-30"),
        actionItem: "Prepare presentation slides",
      },
    ],
    potentialActionItems: [
      {
        assignee: "Bob",
        dueDate: new Date("2024-12-05"),
        actionItem: "Research competitor analysis tools",
      },
    ],
  };

  const exampleData = {
    meetingNotes: ["Discussed project milestones", "Reviewed budget"],
    summary: "Weekly team sync meeting",
    actionItems: [
      {
        assignee: "Alice",
        dueDate: new Date("2024-11-30"),
        actionItem: "Prepare presentation slides",
      },
    ],
    potentialActionItems: [
      {
        assignee: "Bob",
        dueDate: new Date("2024-12-05"),
        actionItem: "Research competitor analysis tools",
      },
    ],
  };

  const MeetingDetails = ({ data }) => {
    return (
        <div className="flex flex-col gap-4">
          {/* Meeting Notes Card */}
          <Card>
            <CardHeader>
              <CardTitle>Meeting Notes</CardTitle>
              <CardDescription>Highlights from the meeting notes</CardDescription>
            </CardHeader>
            <CardContent>
              <ul>
                {data.meetingNotes.map((note, index) => (
                    <li key={index}>{note}</li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <p>Total Notes: {data.meetingNotes.length}</p>
            </CardFooter>
          </Card>

          {/* Summary Card */}
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
              <CardDescription>A brief summary of the meeting</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{data.summary}</p>
            </CardContent>
            <CardFooter>
              <p>End of Summary</p>
            </CardFooter>
          </Card>

          {/* Action Items Card */}
          <Card>
            <CardHeader>
              <CardTitle>Action Items</CardTitle>
              <CardDescription>Tasks to be completed</CardDescription>
            </CardHeader>
            <CardContent>
              <ul>
                {data.actionItems.map((item, index) => (
                    <li key={index}>
                      <strong>{item.assignee}</strong> - {item.actionItem} (Due:{" "}
                      {new Date(item.dueDate).toLocaleDateString()})
                    </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <p>Total Action Items: {data.actionItems.length}</p>
            </CardFooter>
          </Card>

          {/* Potential Action Items Card */}
          <Card>
            <CardHeader>
              <CardTitle>Potential Action Items</CardTitle>
              <CardDescription>Ideas for future tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <ul>
                {data.potentialActionItems.map((item, index) => (
                    <li key={index}>
                      <strong>{item.assignee}</strong> - {item.actionItem} (Due:{" "}
                      {new Date(item.dueDate).toLocaleDateString()})
                    </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <p>Total Potential Action Items: {data.potentialActionItems.length}</p>
            </CardFooter>
          </Card>
        </div>
    );
  };


  return (
    <div className="container text-center px-4 py-8 bg-white max-w-screen-xl mx-auto">
      <div className="max-w-2xl text-center mx-auto sm:mt-20 mt-2">
        <p className="mx-auto mb-5 w-fit rounded-2xl border px-4 py-1 text-sm text-slate-500">
          100% free and powered by{" "}
          <a
            href="https://dub.sh/together-ai"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-500 transition font-bold"
          >
            Together AI
          </a>
          !
        </p>
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
          Left Pane Content
        </div>
        <div className="w-[2px] bg-gray-300"></div>
        <div className="flex-1">
            <ScrollArea className="h-full w-full rounded-md p-4 gap-2">
              <div className="flex flex-col gap-4">
                <MeetingDetails data={exampleData} />
              </div>
            </ScrollArea>
        </div>
      </div>
    </div>
  );
}
