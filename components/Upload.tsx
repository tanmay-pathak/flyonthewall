import { FileText } from "lucide-react";
import Dropzone from "react-dropzone";

type Props = {
  handleFileChange: (file: File) => Promise<void>;
};

const Upload = ({ handleFileChange }: Props) => {
  return (
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
  );
};

export default Upload;
