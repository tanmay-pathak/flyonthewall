/* eslint-disable @next/next/no-img-element */
"use client";

import { useS3Upload } from "next-s3-upload";
import { useState } from "react";
import Dropzone from "react-dropzone";
import { PhotoIcon } from "@heroicons/react/20/solid";

export default function Home() {
  interface MenuItem {
    name: string;
    price: number;
    description: string;
    menuImage: {
      b64_json: string;
    };
  }

  const { uploadToS3 } = useS3Upload();
  const [menuUrl, setMenuUrl] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<
    "initial" | "uploading" | "parsing" | "created"
  >("initial");
  const [parsedMenu, setParsedMenu] = useState<MenuItem[]>([]);

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

  return (
    <div className="flex flex-col items-center justify-center mt-20 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-20">Menu Visualizer</h1>

      <div className="flex flex-col p-8 md:w-1/2">
        <Dropzone
          multiple={false}
          // accept={{ "image/png": [".png", ".jpg", ".jpeg"] }}
          onDrop={(acceptedFiles) => handleFileChange(acceptedFiles[0])}
        >
          {({ getRootProps, getInputProps, isDragAccept }) => (
            <div
              className={`mt-2 flex aspect-video cursor-pointer items-center justify-center rounded-lg border border-dashed ${
                isDragAccept ? "border-blue-500" : "border-gray-900/25"
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
                    className="relative rounded-md bg-white font-semibold text-black focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-gray-700"
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

        {menuUrl && (
          <div className="my-10">
            <h2 className="text-2xl font-bold mb-5">Uploaded menu</h2>
            <img src={menuUrl} alt="Menu" />
          </div>
        )}

        {parsedMenu.length > 0 && (
          <div className="mt-10">
            <h2 className="text-2xl font-bold">
              Menu – {parsedMenu.length} dishes detected
            </h2>
            {parsedMenu.map((item) => (
              <div key={item.name}>
                <h3 className="text-xl font-bold">
                  {item.name} – {item.price}
                </h3>
                <p className="text-sm text-gray-500">{item.description}</p>
                <img
                  src={`data:image/png;base64,${item.menuImage.b64_json}`}
                  alt={item.name}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
