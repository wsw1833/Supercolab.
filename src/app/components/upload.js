import { useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function InputFile() {
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setFileName(file ? file.name : null);
  };

  return (
    <div className="w-[15rem] h-[5rem] max-w-sm">
      <div
        className="relative aspect-square w-full cursor-pointer rounded-lg border-2 border-dashed border-p1 bg-white hover:bg-p2 transition-colors duration-200"
        onClick={handleButtonClick}
      >
        <Input
          id="file"
          type="file"
          className="sr-only"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
          <img src="/cloud.png" className="mb-4" />
          <p className="mb-2 text-b2 font-semibold">Click to upload</p>
          <p className="text-xs">Any Type of File</p>
          {fileName && (
            <p className="mt-2 text-[16px] font-medium text-blue-800">
              {fileName}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
