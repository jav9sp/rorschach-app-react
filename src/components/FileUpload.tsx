import type { ChangeEvent } from "react";

interface FileUploadProps {
  onFileSelected: (file: File) => void;
}

export default function FileUpload({ onFileSelected }: FileUploadProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelected(file);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2 my-10">
      <label
        htmlFor="file-upload"
        className="block text-2xl font-medium text-gray-700">
        Subir archivo Excel
      </label>
      <input
        id="file-upload"
        type="file"
        accept=".xlsx, .xls"
        onChange={handleChange}
        className="block text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 cursor-pointer"
      />
    </div>
  );
}
