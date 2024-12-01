import { FileText } from "lucide-react";
import { useState } from "react";
import Dropzone from "react-dropzone";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Textarea } from "./ui/textarea";

type Props = {
  handleFileChange: (file: File) => Promise<void>;
  handleTextSubmit: (text: string) => Promise<void>;
};

const Upload = ({ handleFileChange, handleTextSubmit }: Props) => {
  const [pastedText, setPastedText] = useState("");

  return (
    <Tabs defaultValue="file" className="w-full">
      <TabsList className="grid w-full grid-cols-2 bg-gray-100">
        <TabsTrigger 
          value="file" 
          className="data-[state=active]:bg-zuPrimary data-[state=active]:text-white"
        >
          Upload File
        </TabsTrigger>
        <TabsTrigger 
          value="paste"
          className="data-[state=active]:bg-zuPrimary data-[state=active]:text-white"
        >
          Paste Text
        </TabsTrigger>
      </TabsList>

      <TabsContent value="file">
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
                isDragAccept ? "border-blue-500" : "border-zuPrimary"
              }`}
              {...getRootProps()}
            >
              <input {...getInputProps()} />
              <div className="text-center">
                <FileText className="mx-auto size-12 text-gray-300" />
                <div className="mt-4 flex text-sm leading-6 text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative rounded-md bg-white font-semibold text-gray-800 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 hover:text-gray-600"
                  >
                    <p className="text-xl">Drop your meeting transcript here</p>
                    <p className="mt-1 font-normal text-gray-600">
                      Drag and drop or click to upload a .txt file
                    </p>
                  </label>
                </div>
              </div>
            </div>
          )}
        </Dropzone>
      </TabsContent>

      <TabsContent value="paste">
        <div
          className="flex aspect-video flex-col items-center justify-center rounded-lg border-2 border-dashed border-zuPrimary p-4"
        >
          <FileText className="size-12 text-gray-300 mb-4" />
          <div className="w-full max-w-md space-y-4">
            <Textarea
              placeholder="Paste your meeting transcript here..."
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              className="min-h-[180px] resize-none border-gray-200"
            />
            <Button
              onClick={() => handleTextSubmit(pastedText)}
              disabled={!pastedText.trim()}
              className="w-full bg-white text-zuPrimary border-2 border-zuPrimary hover:bg-zuPrimary hover:text-white transition-colors"
            >
              Process Text
            </Button>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default Upload;
