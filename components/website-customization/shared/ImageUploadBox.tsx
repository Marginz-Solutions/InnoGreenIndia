import { Upload } from 'lucide-react';

interface Props {
label?: string;
small?: boolean;
}

export const ImageUploadBox = ({
label = 'Upload Image',
small = false,
}: Props) => (

  <div
    className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed border-[#c5ddc8] rounded-xl bg-[#f7fcf8] cursor-pointer hover:border-[#1f7a36] hover:bg-[#edf8ee] transition-colors ${
      small
        ? 'h-20 w-20'
        : 'h-32 w-full'
    }`}
  >
    <Upload
      size={small ? 16 : 22}
      className="text-[#61756a]"
    />

{!small && (
  <span className="text-xs text-[#61756a] font-medium">
    {label}
  </span>
)}

  </div>
);
