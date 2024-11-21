"use client";

import { useS3Upload } from "next-s3-upload";
import { useState } from "react";
import Dropzone from "react-dropzone";
import { PhotoIcon, MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { Input } from "@/components/ui/input";
import { MenuGrid } from "@/components/menu-grid";
import Image from "next/image";

interface MenuItem {
  name: string;
  price: number;
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

  const filteredMenu = parsedMenu.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8 bg-white">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
        Upload Your Menu
      </h1>

      <div className="max-w-7xl mx-auto">
        {status === "initial" && (
          <Dropzone
            multiple={false}
            onDrop={(acceptedFiles) => handleFileChange(acceptedFiles[0])}
          >
            {({ getRootProps, getInputProps, isDragAccept }) => (
              <div
                className={`mt-2 flex aspect-video cursor-pointer items-center justify-center rounded-lg border-2 border-dashed ${
                  isDragAccept ? "border-blue-500" : "border-gray-300"
                }`}
                {...getRootProps()}
              >
                <input {...getInputProps()} />
                <div className="text-center">
                  <PhotoIcon
                    className="mx-auto h-12 w-12 text-gray-300"
                    aria-hidden="true"
                  />
                  <div className="mt-4 flex text-sm leading-6 text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative rounded-md bg-white font-semibold text-gray-800 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 hover:text-gray-600"
                    >
                      <p className="text-xl">Upload your menu</p>
                      <p className="mt-1 font-normal text-gray-600">
                        or drag and drop
                      </p>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </Dropzone>
        )}

        {menuUrl && (
          <div className="my-10 mx-auto flex  flex-col items-center">
            <h2 className="text-2xl font-bold mb-5">Uploaded menu</h2>
            <Image
              width={1024}
              height={768}
              src={menuUrl}
              alt="Menu"
              className="w-80 rounded-lg shadow-md"
            />
          </div>
        )}

        {parsedMenu.length > 0 && (
          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-5">
              Menu – {parsedMenu.length} dishes detected
            </h2>
            <div className="relative mb-6">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search menu items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <MenuGrid items={filteredMenu} />
          </div>
        )}
      </div>
    </div>
  );
}
